---
categories:
- Java
- Backend
date: 2026-05-28
seo_title: Event-Driven Architecture with Kafka Java Guide
seo_description: Build event-driven Java systems with contract-first topics and scalable
  consumers.
tags:
- java
- kafka
- event-driven
- microservices
title: Event-Driven Architecture with Kafka and Java
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Asynchronous Contract-Driven Service Communication
---
Kafka enables scalable asynchronous integration, but reliability depends on contract and consumer design.
Treat topics as product interfaces, not internal implementation details.

---

## Topic Contract Basics

For each topic, define and version:

- event name and meaning (`OrderCreated` means order is persisted and visible)
- schema and compatibility policy
- key strategy and ordering guarantees
- retention and replay expectations

Without explicit contract ownership, event systems drift quickly.

---

## Partition Key Strategy

Choose key by business ordering requirement.

- key by `orderId` for per-order ordering
- key by `customerId` for per-customer ordering
- avoid random keys when ordering matters

Watch for hot partitions if key cardinality is low or skewed.

---

## Producer Reliability Pattern

```java
ProducerRecord<String, byte[]> record =
    new ProducerRecord<>("orders.events.v1", orderId, payloadBytes);

producer.send(record, (metadata, ex) -> {
    if (ex != null) {
        // persist failure signal, trigger retry pipeline or alert
    }
});
```

For critical flows, combine with outbox pattern to avoid dual-write inconsistency.

---

## Consumer Processing Pattern

- poll batch
- process each record idempotently
- commit offset only after durable side effect
- route poison records to DLQ with failure context

Consumer idempotency is required even with Kafka ordering.

```java
if (processedEventStore.exists(eventId)) {
    return; // duplicate replay
}
applyBusinessUpdate(event);
processedEventStore.markProcessed(eventId);
```

---

## Retry vs DLQ Policy

- transient dependency issue: bounded retries with backoff
- schema/payload violation: fail fast to DLQ
- repeated business-rule failure: DLQ + alert

Never infinite-retry poison messages on hot partitions.

---

## Dry Run: Order Pipeline Incident

Scenario: downstream inventory service becomes slow.

1. consumer lag starts rising on `orders.events.v1`.
2. transient errors trigger bounded retry policy.
3. retry budget exhausted for some records.
4. failed records are published to DLQ with correlation IDs.
5. main partition continues processing healthy records.
6. ops team replays DLQ after dependency recovers.

This avoids total pipeline stall during partial outage.

---

## Metrics That Matter

- consumer lag by topic/partition
- processing latency and retry count
- DLQ rate and top error classes
- producer error rate and publish latency
- rebalance frequency and processing interruption time

Throughput alone hides correctness failures.

---

## Key Takeaways

- Kafka architecture success depends on strong contracts and idempotent consumers.
- partition-key choice defines your ordering guarantees and scaling limits.
- explicit retry/DLQ/replay strategy is essential for production reliability.

---

        ## Problem 1: Model Event Flow Around Ownership and Recovery

        Problem description:
        Event-driven systems become noisy and fragile when events are published without clear ownership, schema contracts, or replay expectations.

        What we are solving actually:
        We are solving loose coupling without losing accountability. Kafka helps when events represent meaningful domain facts and when consumers know how to recover, replay, and version them safely.

        What we are doing actually:

        1. define the owner that is allowed to publish each event type
2. keep event payloads factual and stable instead of embedding mutable query views
3. design consumers to tolerate replay and delayed delivery
4. make dead-letter, schema evolution, and replay rules part of the architecture story

        ```mermaid
flowchart LR
    A[Order service] --> B[orders.events]
    B --> C[Billing consumer]
    B --> D[Inventory consumer]
    B --> E[Analytics consumer]
```

        This section is worth making concrete because architecture advice around event driven architecture kafka java often stays too abstract.
        In real services, the improvement only counts when the team can point to one measured risk that became easier to reason about after the change.

        ## Production Example

        ```java
        public record OrderPlaced(String orderId, String customerId, long totalMinor) {}

producer.send(new ProducerRecord<>("orders.events", orderId, event));
        ```

        The code above is intentionally small.
        The important part is not the syntax itself; it is the boundary it makes explicit so code review and incident review get easier.

        ## Failure Drill

        Replay one topic from the beginning into a staging environment. If consumers cannot tolerate duplicates or historical messages, the architecture is only pretending to be event-driven.

        ## Debug Steps

        Debug steps:

        - review whether events encode facts or command-like requests
- keep producer ownership explicit so multiple teams do not evolve the same stream ad hoc
- measure consumer lag and replay behavior before scaling the number of consumers
- document how consumers handle schema changes and poison records

        ## Review Checklist

        - One clear owner per event type.
- Facts over mutable read models.
- Replay-tolerant consumers.
