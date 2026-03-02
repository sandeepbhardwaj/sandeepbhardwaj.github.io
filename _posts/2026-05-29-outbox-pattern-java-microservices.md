---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-29
seo_title: "Outbox Pattern Java Microservices Guide"
seo_description: "Guarantee reliable event publication with transactional outbox architecture in Java."
tags: [java, outbox-pattern, microservices, kafka]
canonical_url: "https://sandeepbhardwaj.github.io/java/outbox-pattern-java-microservices/"
title: "Outbox Pattern in Java Microservices"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Reliable Event Publication with Transactional Boundaries"
---

# Outbox Pattern in Java Microservices

Outbox pattern solves a core reliability gap: writing business data and publishing events must succeed together semantically.

---

## The Problem

Without outbox:

1. DB commit succeeds
2. event publish fails
3. downstream systems never observe the change

This creates invisible data divergence.

---

## Outbox Flow

- in same DB transaction:
  - write business row
  - write outbox row
- async publisher reads pending outbox rows
- publish to broker
- mark outbox row as sent (or archive)

---

## Java Transaction Example

```java
@Transactional
public void createOrder(CreateOrder cmd) {
    Order order = orderRepo.save(Order.from(cmd));
    outboxRepo.save(OutboxEvent.orderCreated(order.getId(), order.getVersion()));
}
```

Publisher loop (conceptual):

```java
List<OutboxEvent> batch = outboxRepo.fetchPending(limit);
for (OutboxEvent ev : batch) {
    broker.publish(ev.topic(), ev.key(), ev.payload());
    outboxRepo.markSent(ev.id());
}
```

---

## Reliability Considerations

- publisher must be idempotent (at-least-once delivery expected)
- include event ID + aggregate version
- support retry with exponential backoff
- monitor pending outbox growth aggressively

---

## Key Takeaways

- outbox provides reliable change publication without distributed transactions.
- idempotent consumers are still required.
- operational visibility of backlog and publish failures is mandatory.
