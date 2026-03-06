---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-29
seo_title: Outbox Pattern Java Microservices Guide
seo_description: Guarantee reliable event publication with transactional outbox architecture
  in Java.
tags:
- java
- outbox-pattern
- microservices
- kafka
title: Outbox Pattern in Java Microservices
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Reliable Event Publication with Transactional Boundaries
---
Outbox pattern solves the dual-write problem: persisting business data and publishing an event reliably.
Instead of doing both in separate systems in one step, you persist publish intent in the same DB transaction.

---

## Core Problem (Without Outbox)

1. order row committed in DB
2. process crashes before publishing Kafka event
3. downstream services never see the order

Business state diverges across services.

---

## Outbox Transaction Boundary

In one DB transaction:

- write business entity
- write outbox event row

A separate relay process publishes pending outbox rows to broker and marks them delivered.

```java
@Transactional
public void createOrder(CreateOrderCommand cmd) {
    Order order = orderRepository.save(Order.from(cmd));

    OutboxEvent event = OutboxEvent.create(
        UUID.randomUUID().toString(),
        "orders.events.v1",
        order.getId().toString(),
        "OrderCreated",
        serialize(new OrderCreated(order.getId(), order.getVersion()))
    );

    outboxRepository.save(event);
}
```

---

## Recommended Outbox Schema

```sql
create table outbox_event (
  id varchar(64) primary key,
  aggregate_type varchar(64) not null,
  aggregate_id varchar(128) not null,
  event_type varchar(128) not null,
  topic varchar(128) not null,
  event_key varchar(128) not null,
  payload jsonb not null,
  status varchar(16) not null,
  created_at timestamp not null,
  published_at timestamp null
);

create index idx_outbox_pending_created
  on outbox_event(status, created_at);
```

Keep status transitions simple: `PENDING -> SENT` (or `FAILED` with retry metadata).

---

## Relay Worker Pattern

```java
List<OutboxEvent> batch = outboxRepository.fetchPending(limit);
for (OutboxEvent event : batch) {
    try {
        broker.publish(event.topic(), event.eventKey(), event.payload(), event.id());
        outboxRepository.markSent(event.id(), Instant.now());
    } catch (Exception ex) {
        outboxRepository.recordFailure(event.id(), ex.getMessage());
    }
}
```

Important:

- at-least-once publication is expected
- consumers must be idempotent by event ID
- retries should be bounded with backoff

---

## Ordering and Partitioning

If order is required per aggregate:

- set Kafka key to `aggregate_id`
- use one event stream per aggregate type where possible
- publish in outbox `created_at` order for pending batch

This preserves logical ordering across retries and relay restarts.

---

## Dry Run: Crash Between Publish and Mark-Sent

1. relay publishes event successfully.
2. relay crashes before `markSent` update.
3. on restart, same outbox row appears pending again.
4. event may be published second time.
5. consumer deduplicates by event ID and applies once.

This is normal outbox behavior; consumer idempotency is mandatory.

---

## Operations Checklist

- monitor pending outbox count
- monitor age of oldest pending event
- alert on repeated publish failures per topic
- archive/delete sent rows with retention policy
- isolate relay throughput limits from main request traffic

Outbox is both a data consistency pattern and an ops pattern.

---

## Key Takeaways

- outbox gives reliable publish intent without distributed transactions.
- relay is at-least-once by design; consumer idempotency completes correctness.
- observe backlog and failure metrics continuously to prevent silent drift.
