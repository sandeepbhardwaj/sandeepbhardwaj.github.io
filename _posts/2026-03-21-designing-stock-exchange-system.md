---
categories:
- Distributed Systems
- Architecture
- Backend
date: 2026-03-21
seo_title: Designing a Stock Exchange System - Matching Engine, Market Data, and Scale
seo_description: Step-by-step stock exchange system design covering problem
  statement, functional requirements, NFRs, high-level architecture, matching
  engine, market data, scalability, and low-latency design trade-offs.
tags:
- distributed-systems
- architecture
- backend
- low-latency
- trading
- matching-engine
- order-book
- scalability
title: Designing a Stock Exchange System
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Low-Latency Architecture and Market Integrity
---
Designing a stock exchange is one of the best system-design exercises because it forces you to care about correctness, scale, recovery, and latency at the same time.

This is not a CRUD system with a trading theme.
It is a fairness-critical system where one wrong design decision can break sequencing, replay, or market data under load.

In this article, I will walk through the design step by step as if we are learning system design from scratch:

1. what we are building
2. functional requirements
3. non-functional requirements
4. high-level architecture
5. detailed component design
6. how the system scales and handles huge traffic
7. why the system is so fast

To keep the discussion concrete, I will use Indian cash-equity examples like `RELIANCE`, `TCS`, `INFY`, and `HDFCBANK`.
Treat the examples as architectural illustrations, not as official NSE or BSE protocol documentation.

> [!NOTE] Scope of the examples
> The symbols and scenarios in this article are teaching devices to make sequencing, matching, and recovery easier to reason about.
> They should not be read as venue-specific protocol or regulatory guidance.

---

## Problem Statement

We want to design a stock exchange for cash equities.

The exchange should accept orders from member brokers, maintain live order books, match buy and sell orders using price-time priority, publish trade confirmations, and send market data to many brokers at the same time.

If you want to think about it in practical terms, imagine:

- thousands of listed stocks
- some symbols like `RELIANCE` or `INFY` becoming extremely hot at market open or on news
- heavy cancel and replace traffic during volatility
- brokers expecting live acknowledgments and tick-by-tick market data
- regulators expecting clean audit and replay

So the real problem is not just "place orders."
The real problem is:

- preserve one clear ordering of events
- match deterministically
- recover cleanly after failure
- distribute market data at scale
- do all of this with very low latency

---

## What Exactly Are We Building

Before drawing boxes, define the system boundary clearly.

We are building the exchange core, not the entire trading ecosystem.

The exchange is responsible for:

- accepting orders from brokers
- validating venue-owned rules
- sequencing orders
- maintaining the order book
- matching orders
- publishing execution reports
- publishing market data
- storing an auditable event trail

The broker is responsible for:

- client onboarding and KYC
- margin and portfolio checks
- user-facing app and APIs
- routing customer orders to the exchange

The clearing and settlement system is responsible for:

- post-trade processing
- obligations, netting, and settlement
- money and securities movement

This boundary matters because weak designs push broker logic or clearing logic into the exchange hot path.
That makes the system slower and harder to reason about.

---

## Functional Requirements

At high level, the exchange should support these behaviors:

1. Accept new, cancel, and replace orders from brokers.
2. Maintain a live order book for each stock.
3. Match orders using deterministic price-time priority.
4. Send order acknowledgments and execution reports back to brokers.
5. Publish tick-by-tick market data and depth updates.
6. Support snapshot plus incremental feed recovery for market-data consumers.
7. Support audit, replay, and operational recovery.

To keep the first version realistic, I would start with:

- cash equities only
- limit, market, cancel, and replace first
- no attempt to solve every asset class in version 1

> [!TIP] Version-1 design discipline
> A strong exchange design usually becomes clearer when version 1 is intentionally narrow.
> If we try to solve equities, derivatives, auctions, complex order types, and cross-venue routing all at once, the core invariants get blurry.

---

## Non-Functional Requirements

This is where the design really gets shaped.

The most important NFRs are:

### 1. Correctness

For one symbol, there must be one authoritative processing order.
If two components disagree about order, the design is broken.

### 2. Determinism

If we replay the same event stream, we must rebuild the same book and the same trades.

### 3. Low latency

The hot path must stay extremely short and avoid remote dependencies.

### 4. High throughput

The exchange must handle very large inbound order volume, especially during bursts.

### 5. Hot-symbol isolation

One extremely active stock should not degrade unrelated symbols.

### 6. Market-data fan-out

The system must deliver the same committed feed to many brokers without allowing slow consumers to block matching.

### 7. Recovery

Failover, replay, and session recovery must be explicit and reliable.

The key design lesson is this:
the exchange is not primarily a throughput system.
It is a correctness system under latency pressure.

---

## High-Level Design

At high level, the system needs four layers:

1. ingress and session management
2. deterministic matching core
3. market-data distribution
4. asynchronous downstream systems

Here is the high-level architecture:

```mermaid
flowchart LR
    subgraph Ingress["Ingress and Session Layer"]
        A[Member Brokers]
        B[Traffic Manager]
        C[L4 Load Balancer]
        D[FIX or OUCH Gateways]
        E[Session Manager]
    end

    subgraph Control["Reference and Venue Control Layer"]
        F[Reference Data Service]
        G[Local Reference Cache]
        H[Venue Controls]
    end

    subgraph Core["Deterministic Matching Core"]
        I[Partition Router]
        J[Sequencer]
        K[Matching Engine]
        L[In-Memory Order Book]
        M[Event Journal]
        N[Warm Standby]
    end

    subgraph Distribution["Execution and Market Data"]
        O[Execution Reports]
        P[Market Data Builder]
        Q[Snapshot Store]
        R[Market Data Gateways]
    end

    subgraph Async["Async Consumers"]
        S[Kafka or Internal Bus]
        T[Trade Ledger]
        U[Surveillance]
        V[Clearing Adapter]
        W[Reporting APIs]
    end

    A --> B --> C --> D --> E
    E --> H
    F --> G --> H
    H --> I --> J --> K --> L
    K --> M
    K --> O
    K --> P
    M --> N
    P --> Q --> R
    M --> S
    S --> T
    S --> U
    S --> V
    S --> W
```

This diagram already tells us a lot:

- gateways handle connectivity, not matching
- the sequencer establishes authoritative order
- the matching engine owns book mutation
- the journal defines the recovery boundary
- market-data distribution is isolated from the matcher
- Kafka and other async systems are downstream, not in the fairness-critical path

---

## Step-by-Step Order Flow

Now let us walk one order through the system.

Suppose a broker sends this order:

- symbol: `RELIANCE`
- side: buy
- price: `INR 2,845.10`
- quantity: `100`

The sequence looks like this:

```mermaid
sequenceDiagram
    participant Client as Investor App
    participant Broker as Member Broker
    participant Gateway as Exchange Gateway
    participant Control as Venue Controls
    participant Seq as Sequencer
    participant Match as Matching Engine
    participant Journal as Event Journal
    participant Feed as Market Data Builder

    Client->>Broker: Place order for RELIANCE
    Broker->>Gateway: New order
    Gateway->>Control: Basic validation and venue checks
    Control->>Seq: Route normalized order
    Seq->>Match: RELIANCE seq=91234012
    Match->>Match: Update book and generate trades if crossed
    Match->>Journal: Commit ordered event
    Match-->>Broker: Ack or execution report
    Match->>Feed: Book delta and trade tick
```

That is the full design in miniature.
Everything else in the article exists to make these steps safe and fast.

---

## Component Design in Detail

Now we can go deeper, component by component, in the same order in which an order flows.

### 1. Gateways and Session Manager

The gateway terminates exchange protocols like FIX or a lower-latency binary protocol.

Its job is to:

- keep long-lived sessions with member brokers
- validate protocol syntax
- normalize incoming messages
- detect duplicate client sequence numbers
- recover sessions after disconnects

What it should not do:

- call slow external services
- perform customer-level business workflows
- do heavy risk or portfolio logic

This is the first important rule of exchange design:
the gateway must be boring, fast, and predictable.

### 2. Reference Data Service and Local Cache

The system needs static or semi-static data like:

- stock metadata
- tick-size rules
- trading session state
- member permissions
- venue-level limits

That data should come from a source of truth, but hot-path components should use local in-memory caches.

Why:

- a network lookup per order destroys latency consistency
- reference data changes much more slowly than order traffic
- venue controls need local decisions

### 3. Venue Controls

Before an order reaches the sequencer, the exchange should apply venue-owned controls such as:

- price collars
- fat-finger checks
- throttles
- cancel-on-disconnect
- trading halts or auction mode

These checks belong to the exchange because they protect the market itself.
They must be local and deterministic.

### 4. Partition Router

The exchange cannot process all stocks through one giant matching thread.
It needs to partition work.

The partition router maps each stock to one active owner.

Example:

- `RELIANCE` and `TCS` may be on partition `P7`
- `INFY` and `HDFCBANK` may be on partition `P12`
- colder symbols may be grouped on lighter partitions

The important invariant is:
one symbol belongs to exactly one active partition at a time.

### 5. Sequencer

The sequencer is the heart of fairness.

Its job is simple but extremely important:

- accept normalized events
- assign monotonically increasing sequence numbers
- create one authoritative order of events for a partition

Without a sequencer, two gateways may disagree about which order arrived first.
With a sequencer, replay and failover become understandable.

> [!IMPORTANT] Sequencing is the fairness boundary
> Once the partition order is established, every downstream consumer should derive truth from that same order.
> Acknowledgments, replay, standby rebuild, and market data should all agree on it.

### 6. Matching Engine and In-Memory Order Book

The matching engine should be treated as a single-writer state machine.

For each sequenced event, it:

- checks current book state
- applies new, cancel, or replace logic
- matches against opposite-side liquidity if the order crosses
- updates the in-memory book
- emits execution results and market-data deltas

The order book usually needs:

- bids ordered by best price first
- asks ordered by best price first
- FIFO queue at each price level
- order-id index for fast cancel lookup

This is why the system can stay fast:
the book is memory-resident and mutated by one owner.
There is no database in the decision loop.

### 7. Event Journal

The journal is the committed truth boundary.

It answers these questions:

- what exactly was accepted
- what exact event order must a standby replay
- from which point can recovery resume

This should be an ordered committed log, not a vague debug trace.

### 8. Warm Standby

The standby is not another active writer.
It is a follower that replays the same committed events and stays ready for takeover.

Good standby design means:

- it consumes the same ordered journal
- it builds the same in-memory state
- it can take over only after ownership is explicitly transferred

This is how we avoid split brain.

### 9. Execution Reports

Once an event is committed, the exchange must send the right outcome back to the broker:

- accepted
- rejected
- partially filled
- fully filled
- canceled

These reports must come from the same committed engine output that feeds replay and market data.

### 10. Market Data Builder and Feed Gateways

The market-data builder consumes committed engine outputs and creates:

- trade ticks
- top-of-book updates
- depth updates
- snapshots for recovery

Then a separate feed-distribution tier fans this out to many brokers.

This separation is extremely important:
market-data distribution must not slow matching.

### 11. Async Downstream Systems

Once the exchange commits an event, many other systems may consume it:

- trade ledger
- surveillance and compliance
- reporting
- clearing adapter

This is where Kafka or another event bus can be very useful.
But this is downstream.
It is not where fairness is decided.

---

## How the Exchange Handles Thousands of Stocks

This is a common confusion point in interviews and blog posts.

The exchange does not maintain one huge shared structure for all stocks.
It maintains many independent books with explicit ownership.

The model looks like this:

```mermaid
flowchart LR
    A[Symbol Master]
    B[Partition Directory]

    subgraph P7["Partition P7"]
        C[RELIANCE Book]
        D[TCS Book]
    end

    subgraph P12["Partition P12"]
        E[INFY Book]
        F[HDFCBANK Book]
    end

    subgraph P31["Partition P31"]
        G[Other Symbols]
    end

    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
```

The exchange uses a symbol master that contains:

- symbol code
- instrument type
- tick-size rule
- session state
- price bands
- partition ownership

That symbol master feeds local caches used by gateways, venue controls, and the router.

This is how we support many stocks while keeping deterministic ownership for each one.

---

## How Tick-by-Tick Market Data Is Maintained

When people say "how are so many stock ticks maintained," they usually mean:

1. how the system maintains live order books for many stocks
2. how the system publishes tick-by-tick market-data updates

These are related, but not identical.

### Tick-Size Rules

Each instrument may have a minimum price increment rule.
That rule belongs in reference data and should be enforced by the venue.

Architecturally:

- gateway and controls can reject obviously invalid prices early
- the matcher still enforces the final rule before commit

### Tick-by-Tick Feed

The engine does not scan every possible price for every stock on every event.
It updates only the book state that changed.

For a committed change in `RELIANCE`, the system may publish:

- best bid changed
- best ask changed
- last traded price changed
- traded volume changed
- depth changed

That is the key to scale:
the feed is incremental.
It is derived from committed state transitions, not by polling a database or recomputing the world.

---

## How the Same Feed Reaches Many Brokers

This is another place where many designs stay too shallow.

The exchange is not sending one update to one consumer.
It is sending the same committed market event to many brokers at once.

The right flow looks like this:

```mermaid
flowchart LR
    A[Matching Engine]
    B[Market Data Builder]
    C[Sequence Numbered Feed Stream]
    D[Snapshot Store]

    subgraph Fanout["Feed Distribution Tier"]
        E[Gateway 1]
        F[Gateway 2]
        G[Gateway 3]
    end

    subgraph Brokers["Brokers"]
        H[Broker A]
        I[Broker B]
        J[Broker C]
        K[Broker D]
    end

    A --> B --> C
    B --> D
    C --> E
    C --> F
    C --> G
    E --> H
    E --> I
    F --> J
    G --> K
    D --> H
    D --> I
    D --> J
    D --> K
```

Important design details:

- feed messages should be sequence numbered
- brokers should detect gaps
- missed data should be repaired by snapshot plus replay
- slow consumers should be isolated from fast ones

The most important rule is simple:
the matching engine must never wait for a slow broker feed.

> [!WARNING] Feed fan-out is a hidden failure path
> Many weak designs keep matching correct in isolation but accidentally let feed backpressure leak into the core.
> Recovery, replay, and slow-consumer handling should stay in the distribution tier, not in the matcher thread.

---

## Scalability: How the System Handles Huge Volume

Now let us address the most important scale question:
how does this system handle too much volume?

### 1. Partition by Symbol

The exchange scales horizontally by distributing symbols across partitions.

That means:

- each partition has its own sequencer and matcher
- symbols are processed independently
- one hot stock does not automatically block unrelated stocks

### 2. Keep One Active Owner Per Symbol

We do not scale one book using many active writers.
That creates coordination overhead and ambiguity.

For one symbol, single-writer ownership is usually the better trade-off.

### 3. Isolate Hot Symbols

Not all stocks are equally active.

At market open or during major events:

- `RELIANCE` may get heavy order flow
- `INFY` may see extreme cancel or replace volume
- smaller symbols may remain relatively quiet

So capacity planning should focus on:

- hot-symbol concentration
- cancel and replace ratio
- outbound market-data amplification

### 4. Scale the Feed Tier Separately

Inbound order traffic and outbound market-data traffic are different scaling problems.

The matching engine must stay small.
The fan-out tier can scale independently with more gateways, more replay capacity, and more snapshot infrastructure.

### 5. Keep Replay and Recovery Off the Matcher

After outages or disconnect storms, many brokers may reconnect at once.
That recovery load should hit the snapshot and replay tier, not the live matching thread.

---

## Why the System Is So Fast

The exchange is fast because it refuses to do expensive things in the hot path.

The main reasons are:

1. one active writer per book or partition
2. in-memory order books
3. local caches for reference data
4. no database round-trip to decide a match
5. no distributed transaction in the matching loop
6. market-data fan-out moved off the matcher
7. bounded, predictable handoff between stages

The hot path should look like this:

- gateway
- lightweight validation
- venue controls
- sequencer
- single-writer matcher
- commit boundary
- ack

That is why the system can stay fast even when overall platform complexity is large.

If we turned this into a chain like:

- order service
- risk service
- book service
- trade service

we would add network hops, serialization, retries, and latency variance right where determinism matters most.

Related reading:

- [Shared Memory vs Message Passing in Java Applications](/java/concurrency/shared-memory-vs-message-passing-java-applications/)
- [Contention Collapse Under Load in Java Services](/java/concurrency/contention-collapse-under-load-in-java-services/)
- [Bounded Queues and Backpressure in Java Systems](/java/concurrency/bounded-queues-and-backpressure-in-java-systems/)

---

## Failure and Recovery

A stock exchange design is incomplete without failure handling.

The most important scenarios are:

### 1. One Symbol Becomes Extremely Hot

If `INFY` suddenly becomes 20 times hotter than the average stock:

- only its owning partition should be stressed
- other symbols should keep moving normally
- venue controls should still be able to throttle or halt if required

### 2. A Broker Feed Falls Behind

If one broker cannot keep up with tick processing:

- that broker's feed path should lag or disconnect
- the matcher should continue normally
- recovery should happen through snapshot plus replay

### 3. Gateway Reconnect Storm

If many sessions reconnect after a network event:

- session recovery should be explicit
- reconnect handling should be rate limited
- cancel-on-disconnect rules should be deterministic

### 4. Primary Matcher Failure

If the active owner of `RELIANCE` fails:

- the standby should know the last committed sequence
- partition ownership should move explicitly
- the new primary should continue from the next safe sequence number

The critical recovery rule is:
there must be one unambiguous owner of the next event.

> [!CAUTION] Active-active sounds safer than it is
> For one order book, multi-writer ownership usually increases coordination cost, ambiguity, and split-brain risk.
> In low-latency exchange systems, single-writer ownership is often the simpler and safer default.

That is also why active-active multi-writer ownership for one book is usually the wrong trade-off in a low-latency exchange.

---

## Final Design Summary

If I had to explain the design in one short flow, I would say this:

1. brokers connect through gateways
2. the exchange applies local venue controls
3. orders are routed by symbol to one active partition
4. the sequencer defines authoritative order
5. the matching engine updates the in-memory book
6. the journal records committed truth
7. execution reports go back to brokers
8. market-data builders and feed gateways distribute the committed feed
9. downstream systems consume the same truth asynchronously

That is the clean mental model a learner should keep.

If that model is clear, the detailed implementation choices become much easier to understand.

---

## Key Takeaways

- A stock exchange is a deterministic sequencing problem under latency pressure.
- The design should begin with requirements and invariants, not with random infrastructure boxes.
- One active owner per symbol or partition is the simplest scalable model.
- Matching should stay memory-resident, single-writer, and isolated from slow dependencies.
- Tick-by-tick market data should be derived incrementally from committed events.
- The system scales by partitioning symbols, isolating hot books, and scaling market-data fan-out separately.
