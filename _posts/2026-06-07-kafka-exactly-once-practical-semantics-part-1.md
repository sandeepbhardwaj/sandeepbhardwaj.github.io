---
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-07
seo_title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 1)
seo_description: 'Hands-on guide: Exactly Once Semantics Myths Versus Practical Guarantees.
  Prove EOS scope.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Exactly Once Semantics Myths Versus Practical Guarantees (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Prove EOS scope**.

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

1. Enable transactional producer and read_committed consumer.
2. Add external DB side effect.
3. Crash between side effect and offset commit.

---

## Runnable Code Block

~~~sql
create table processed_event (
  event_id varchar(64) primary key,
  processed_at timestamp not null default now()
);
~~~

---

## Verify

~~~bash
psql -c "select event_id,count(*) from processed_event group by event_id having count(*)>1;"
~~~

---

## Failure Drill

Without dedupe table, duplicates appear after restart reprocessing.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook

---

        ## Problem 1: Exactly Once Is a Scoped Guarantee, Not a Marketing Phrase

        Problem description:
        Teams hear 'exactly once' and assume the whole workflow is protected, even when external databases, HTTP calls, or side effects still sit outside Kafka's atomic boundary. Build the baseline and make the risky default behavior visible.

        What we are solving actually:
        We are establishing the baseline topology and naming the exact failure mode we want to control before we add tuning or governance.

        What we are doing actually:

        1. build the smallest working topology that demonstrates the problem clearly
2. capture one concrete correctness or latency metric before tuning
3. exercise the happy path and one controlled failure path
4. write down what a clean operator signal looks like before the system grows

        ```mermaid
flowchart LR
    A[Consume] --> B[Kafka transaction]
    B --> C[Produce output]
    C --> D[Send offsets]
    D --> E[Commit]
```

        This first stage is where teams decide whether the design is actually observable or only theoretically correct.

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

For exactly once semantics myths versus practical guarantees (part 1), keep one rollout question in the runbook: what metric tells us the topology is healthy, and what metric tells us to stop or roll back? Kafka systems usually fail operationally before they fail conceptually.
