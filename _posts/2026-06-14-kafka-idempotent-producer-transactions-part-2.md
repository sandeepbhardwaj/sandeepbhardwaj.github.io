---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-14
seo_title: "Idempotent Producers and Kafka Transactions in Practice (Part 2)"
seo_description: "Hands-on guide: Idempotent Producers and Kafka Transactions in Practice. Transactional consume-transform-produce."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-idempotent-producer-transactions-part-2/"
title: "Idempotent Producers and Kafka Transactions in Practice (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Idempotent Producers and Kafka Transactions in Practice (Part 2)

Part goal: **Transactional consume-transform-produce**.

---

## Real-World Scenario

Network retries during peak load can duplicate records unless producer semantics are configured correctly.

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

1. Consume input topic.
2. Start transaction.
3. Produce output + offsets atomically.
4. Commit transaction.

---

## Runnable Code Block

~~~java
producer.initTransactions();
producer.beginTransaction();
producer.send(new ProducerRecord<>("orders.out", key, transformed));
producer.sendOffsetsToTransaction(offsets, groupMeta);
producer.commitTransaction();
~~~

---

## Verify

~~~bash
# read committed only
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.out --from-beginning --isolation-level read_committed
~~~

---

## Failure Drill

Kill app before commitTransaction and verify no partial output visibility.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
