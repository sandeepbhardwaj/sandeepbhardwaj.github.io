---
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-08
seo_title: Event Versioning and Upcasting Strategy in Long Lived Domains (Part 1)
seo_description: 'Hands-on guide: Event Versioning and Upcasting Strategy in Long
  Lived Domains. Versioned event baseline.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Event Versioning and Upcasting Strategy in Long Lived Domains (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Versioned event baseline**.

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

1. Produce v1 events with version metadata.
2. Introduce v2 payload shape.
3. Keep both readable.

---

## Runnable Code Block

~~~json
{ "eventType": "OrderCreated", "version": 1, "payload": {"orderId": "o1"} }
~~~

---

## Verify

~~~bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.events --from-beginning
~~~

---

## Failure Drill

Process mixed v1/v2 stream and verify no consumer crash.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook

---

        ## Problem 1: Keep Historical Events Reusable as the Domain Evolves

        Problem description:
        Long-lived event streams rarely stay on one schema forever, and naive versioning makes replay painful because old facts can no longer be read by current code. Build the baseline and make the risky default behavior visible.

        What we are solving actually:
        We are establishing the baseline topology and naming the exact failure mode we want to control before we add tuning or governance.

        What we are doing actually:

        1. build the smallest working topology that demonstrates the problem clearly
2. capture one concrete correctness or latency metric before tuning
3. exercise the happy path and one controlled failure path
4. write down what a clean operator signal looks like before the system grows

        ```mermaid
flowchart LR
    A[Historical event v1] --> B[Upcaster chain]
    B --> C[Latest in-memory model]
    C --> D[Current handlers]
```

        This first stage is where teams decide whether the design is actually observable or only theoretically correct.

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

For event versioning and upcasting strategy in long lived domains (part 1), keep one rollout question in the runbook: what metric tells us the topology is healthy, and what metric tells us to stop or roll back? Kafka systems usually fail operationally before they fail conceptually.
