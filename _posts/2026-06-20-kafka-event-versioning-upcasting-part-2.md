---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-20
seo_title: Event Versioning and Upcasting Strategy in Long Lived Domains (Part 2)
seo_description: 'Hands-on guide: Event Versioning and Upcasting Strategy in Long
  Lived Domains. Upcaster chain implementation.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Event Versioning and Upcasting Strategy in Long Lived Domains (Part 2)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Upcaster chain implementation**.

---

## Real-World Scenario

Historical events retained for replay require upcasters to transform old payloads into current domain shape.

---

## Run It Locally

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

---

## Lab Steps

1. Add v1->v2 upcaster.
2. Keep handlers accepting latest version only.
3. Replay from beginning.

---

## Runnable Code Block

~~~java
OrderCreatedV2 upcastV1(OrderCreatedV1 old) {
    return new OrderCreatedV2(old.orderId(), "STANDARD");
}
~~~

---

## Verify

~~~bash
# replay stream from earliest offset
~~~

---

## Failure Drill

Disable upcaster and confirm replay fails on legacy event.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook

---

        ## Problem 1: Keep Historical Events Reusable as the Domain Evolves

        Problem description:
        Long-lived event streams rarely stay on one schema forever, and naive versioning makes replay painful because old facts can no longer be read by current code. Harden the baseline against the edge cases that appear under load and replay.

        What we are solving actually:
        We are solving the second-order operational problems: mixed versions, crashes at awkward times, or contention that only appears when traffic is not clean.

        What we are doing actually:

        1. introduce the hardening mechanism one layer at a time
2. test with replay, restart, or mixed-version conditions rather than only steady-state traffic
3. measure what becomes safer and what becomes more complex
4. leave behind a rule the team can apply during future changes

        ```mermaid
flowchart LR
    A[Historical event v1] --> B[Upcaster chain]
    B --> C[Latest in-memory model]
    C --> D[Current handlers]
```

        Part 2 is where the pattern either becomes trustworthy or reveals itself as too magical for production.

        ## Runnable Deep-Dive Snippet

        ```java
        OrderCreatedV3 upcast(OrderCreatedV1 old) {
    return new OrderCreatedV3(old.orderId(), old.customerId(), "STANDARD", Map.of());
}
        ```

        The snippet is not meant to be a full application.
        Its job is to make the ownership boundary, failure boundary, or observability hook visible so the rest of the topology stays explainable.

        ## Verification Notes

        Replay a mixed stream from the earliest offset with only the latest business handlers enabled. That verifies whether the upcaster chain really shields the domain code from history.

        ## Failure Drill

        Disable one upcaster in the chain and replay historical data. The resulting failure is the most honest way to see how brittle version governance becomes without explicit compatibility rules.

        ## Debug Steps

        Debug steps:

        - keep version transitions one-way and testable
- store enough metadata to detect which version each event belongs to
- avoid turning upcasters into business-rule engines
- review retention strategy because very old events extend the support burden

---

## Operator Prompt

For event versioning and upcasting strategy in long lived domains (part 2), keep one rollout question in the runbook: what metric tells us the topology is healthy, and what metric tells us to stop or roll back? Kafka systems usually fail operationally before they fail conceptually.
