---
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-19
seo_title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 2)
seo_description: 'Hands-on guide: Exactly Once Semantics Myths Versus Practical Guarantees.
  Implement idempotent sink.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 2)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Implement idempotent sink**.

---

## Real-World Scenario

Kafka EOS alone does not prevent duplicate side effects in external systems such as databases or HTTP APIs.

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

1. Check processed_event by event_id before side effect.
2. Insert marker in same transaction as side effect.
3. No-op duplicates.

---

## Runnable Code Block

~~~java
if (alreadyProcessed(eventId)) return;
applyBusinessUpdate();
markProcessed(eventId);
~~~

---

## Verify

~~~bash
# verify duplicate count remains zero
psql -c "select count(*) from processed_event;"
~~~

---

## Failure Drill

Replay same event batch twice and verify stable final state.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook

---

        ## Problem 1: Exactly Once Is a Scoped Guarantee, Not a Marketing Phrase

        Problem description:
        Teams hear 'exactly once' and assume the whole workflow is protected, even when external databases, HTTP calls, or side effects still sit outside Kafka's atomic boundary. Harden the baseline against the edge cases that appear under load and replay.

        What we are solving actually:
        We are solving the second-order operational problems: mixed versions, crashes at awkward times, or contention that only appears when traffic is not clean.

        What we are doing actually:

        1. introduce the hardening mechanism one layer at a time
2. test with replay, restart, or mixed-version conditions rather than only steady-state traffic
3. measure what becomes safer and what becomes more complex
4. leave behind a rule the team can apply during future changes

        ```mermaid
flowchart LR
    A[Consume] --> B[Kafka transaction]
    B --> C[Produce output]
    C --> D[Send offsets]
    D --> E[Commit]
```

        Part 2 is where the pattern either becomes trustworthy or reveals itself as too magical for production.

        ## Runnable Deep-Dive Snippet

        ```java
        producer.beginTransaction();
for (ConsumerRecord<String, OrderEvent> record : records) {
    producer.send(transform(record));
}
producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
producer.commitTransaction();
        ```

        The snippet is not meant to be a full application.
        Its job is to make the ownership boundary, failure boundary, or observability hook visible so the rest of the topology stays explainable.

        ## Verification Notes

        Use `read_committed` consumers and crash the processor at different points so you can observe where Kafka guarantees stop and where the wider workflow still needs idempotency.

        ## Failure Drill

        Introduce an external side effect beside Kafka publication and replay the transaction. The mismatch is the exact reason teams still need compensation or idempotency around outside systems.

        ## Debug Steps

        Debug steps:

        - separate Kafka-only guarantees from end-to-end business guarantees in the docs
- test crashes before commit and after output send
- check transactional IDs are stable across restarts of the same processor identity
- review how external effects are de-duplicated because Kafka cannot do that part for you

---

## Operator Prompt

For exactly once semantics myths versus practical guarantees (part 2), keep one rollout question in the runbook: what metric tells us the topology is healthy, and what metric tells us to stop or roll back? Kafka systems usually fail operationally before they fail conceptually.
