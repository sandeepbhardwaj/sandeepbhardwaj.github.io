---
title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 2)
date: 2026-06-19
categories:
- Java
- Kafka
- Distributed Systems
permalink: /java/kafka/distributed-systems/kafka-exactly-once-practical-semantics-part-2/
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 2)
seo_description: 'Hands-on guide: Exactly Once Semantics Myths Versus Practical Guarantees.
  Implement idempotent sink.'
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part 1 established the uncomfortable but useful truth: Kafka exactly-once semantics stops at Kafka's boundary. Part 2 is what most real systems need next. If your processor writes to a database, cache, or external side-effect sink, you need an idempotent sink design that can absorb replay without corrupting state.

This is where the broader workflow becomes trustworthy. Not because Kafka suddenly expanded its guarantee, but because the external side is now designed to tolerate re-execution.

## The Pattern We Need Outside Kafka

The usual shape is simple:

1. identify the logical event with a stable event id
2. check whether that id has already been applied
3. apply the business side effect and mark the id as processed in the same local transaction

That final clause matters. The dedupe marker and the side effect need to move together, or the sink can still end up inconsistent.

~~~java
if (alreadyProcessed(eventId)) {
    return;
}

applyBusinessUpdate();
markProcessed(eventId);
~~~

The code is intentionally small, but the idea is strong: make replay cheap and safe.

## Why the Dedupe Write Belongs Beside the Side Effect

Suppose you process `PaymentSettled` into a relational database.

If the service:

- updates the payment row
- crashes before recording `eventId` as processed

then replay can apply the same state transition again. The dedupe marker must live in the same local atomic unit as the business update.

That is why a processed-event table is so common in sink designs.

## A More Honest Guarantee Statement

With this pattern in place, the system can say something more accurate:

- Kafka provides transactional visibility for Kafka-to-Kafka work
- the sink provides idempotent application of external side effects

That combination is what many teams actually mean when they say they want end-to-end correctness under replay.

It is still not magic. It is two explicit guarantees joined carefully.

## Local Baseline

### Prerequisites

- Docker Desktop
- Java 21
- Kafka CLI tools

### Local Stack

~~~yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.1
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.6.1
    depends_on: [zookeeper]
    ports: ["9092:9092"]
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
~~~

~~~bash
docker compose up -d
~~~

### Dedupe Table

~~~sql
create table processed_event (
  event_id varchar(64) primary key,
  processed_at timestamp not null default now()
);
~~~

This table is not bookkeeping overhead. It is the evidence that the sink knows what it has already accepted.

## The Right Failure Drill

Replay the same event batch twice and inspect final state, not just message counts.

~~~bash
psql -c "select count(*) from processed_event;"
~~~

A healthy result looks like:

- business state unchanged on the second replay
- no duplicate row effects
- one durable processed marker per logical event

That is a much better test than "we did not notice duplicates in the logs."

> [!important]
> Idempotent sinks protect outcomes, not only executions. The real question is whether the final business state stays stable under replay.

## Common Mistakes

### Using unstable event identity

If the dedupe key changes between retries or replays, the sink loses the whole point of the pattern.

### Recording the marker outside the business transaction

That reintroduces a crash window and weakens the guarantee.

### Assuming every sink can use the same approach

Databases, HTTP APIs, and object stores may each need a slightly different form of idempotency, even if the concept is shared.

## What This Part Should Leave You With

After Part 2, the team should understand:

1. why Kafka EOS still needs help once external side effects exist
2. how an idempotent sink closes that gap
3. why the dedupe marker and business side effect must be recorded together

That is the practical route from scoped Kafka guarantees to a workflow that can survive replay without losing integrity.
