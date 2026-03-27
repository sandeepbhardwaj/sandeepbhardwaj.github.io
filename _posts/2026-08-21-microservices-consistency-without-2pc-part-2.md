---
title: Consistency patterns without distributed transactions (Part 2)
date: 2026-08-21
categories:
- Java
- Microservices
- Architecture
tags:
- java
- microservices
- distributed-systems
- architecture
- backend
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Consistency patterns without distributed transactions (Part 2) - Advanced
  Guide
seo_description: Advanced practical guide on consistency patterns without distributed
  transactions (part 2) with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Microservices Architecture and Reliability Patterns
---
Part 1 is where teams choose the basic consistency shape.
Part 2 is where that shape meets failure, retries, mixed versions, and real operational pressure.

That is the point where many "eventual consistency" designs stop being architecture diagrams and start becoming incident material.

## Quick Summary

| Pressure | Hardening question |
| --- | --- |
| retry storms | are handlers idempotent and duplication-safe? |
| partial failure | which side owns the next recovery step? |
| read-after-write lag | what user-facing behavior is acceptable during convergence? |
| mixed-version rollout | are contracts forward/backward compatible? |
| compensation flows | who decides retry vs compensate vs manual intervention? |

Distributed consistency without 2PC works only when ownership and recovery remain explicit after the happy path breaks.

## What Part 2 Is Really About

By this point, the baseline pattern may already exist:

- saga-style compensation
- outbox publication
- asynchronous projection
- idempotent consumer update

The real challenge now is not choosing the pattern name.
It is hardening the edges:

- duplicates
- timeouts
- reorderings
- stale reads
- compensations that fail too

That is where naive designs start leaking risk.

## Start With One Business Invariant

Write the invariant in plain language before adding more mechanism.

Examples:

- "an order is either paid once or visibly unpaid"
- "inventory cannot be oversold"
- "the ledger must never reflect money movement twice"

If that sentence is vague, the consistency design will drift.
You cannot harden what you have not defined.

## Failure Modes That Matter More Than Pattern Vocabulary

### Duplicate message delivery

If the consumer retries after a crash or timeout, can it safely process the same message again?
If not, the system is not operationally consistent even if the architecture diagram looks clean.

### Out-of-order arrival

Can a compensating event arrive before the normal success event?
Can an old update overwrite newer intent?

### Read-after-write lag

What will a caller see in the seconds between command acceptance and projection convergence?
If the answer is "sometimes confusing data," the UI and API contract must acknowledge that.

### Compensation failure

A failed payment reversal or failed shipment cancellation is not just a technical retry.
It is a business state that may need escalation.

## A Practical Order Flow Example

Suppose checkout does this:

1. create order
2. reserve inventory
3. charge payment
4. publish confirmation

Without 2PC, the design might rely on:

- local transactions per service
- events between services
- compensating actions on failure

That is fine as a baseline.
Part 2 is where we ask harder questions:

- if payment succeeds but inventory compensation fails, what state is visible?
- if confirmation is published twice, what downstream consumer breaks?
- if the inventory event arrives late, who keeps the user-facing truth coherent?

## Hardening Rule: Add One Safety Mechanism Per Failure Class

Teams often pile on patterns:

- retries
- circuit breakers
- dead-letter queues
- compensations
- dedupe tables
- version checks

all at once.

That makes review harder and ownership blurrier.

A better progression is:

1. pick the most likely failure mode
2. add one mechanism that directly addresses it
3. measure the new operational cost
4. document what still remains unsafe

This keeps the design explainable.

## A Small Example: Idempotent Order Event Handling

```java
public final class OrderProjectionHandler {
    private final ProcessedMessageStore processedMessages;
    private final OrderReadModelRepository readModelRepository;

    public void handle(OrderConfirmed event) {
        if (processedMessages.alreadyProcessed(event.eventId())) {
            return;
        }

        readModelRepository.markConfirmed(event.orderId(), event.confirmedAt());
        processedMessages.record(event.eventId());
    }
}
```

This does not solve every distributed-systems problem.
It solves one concrete one:
duplicate event handling for a projection update.

That is the right level of local hardening.

## Read Models Need a Product Decision Too

Eventually consistent read models are not just a backend concern.
They create user experience decisions.

You need an explicit rule for:

- what the caller sees immediately after write acceptance
- whether the API returns pending state
- whether the UI polls, subscribes, or tolerates lag

If the product expects instant global truth but the architecture only guarantees convergence, the bug is contractual before it is technical.

## Rollout Risks Most Teams Underestimate

### Schema drift between producer and consumer

If events evolve without compatibility discipline, consistency breaks during rollout, not only during outages.

### Dual writes hiding behind "temporary" migration code

Teams often keep old and new publication paths alive too long.
That creates duplication and ownership ambiguity.

### Retries widening the blast radius

Retries are not free safety.
They can amplify load and increase duplicate side effects unless bounded carefully.

## Operational Checklist

- one business invariant is written down precisely
- duplicate delivery behavior is explicit
- read-after-write lag is reflected in the API or UI contract
- compensation ownership is named
- producer/consumer compatibility rules are documented
- retries, dedupe, and replay are tested together

## Key Takeaways

- Part 2 is about hardening, not renaming the baseline pattern.
- Distributed consistency without 2PC succeeds only when failure ownership stays explicit.
- Idempotency, replay safety, and contract compatibility matter more than theoretical elegance.
- Add hardening mechanisms one failure mode at a time, or the design becomes harder to operate than the original inconsistency.
