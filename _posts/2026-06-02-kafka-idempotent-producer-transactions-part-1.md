---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-02
seo_title: "Idempotent Producers and Kafka Transactions in Practice (Part 1)"
seo_description: "Hands-on guide: Idempotent Producers and Kafka Transactions in Practice. Enable idempotent producer safely."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-idempotent-producer-transactions-part-1/"
title: "Idempotent Producers and Kafka Transactions in Practice (Part 1)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Idempotent Producers and Kafka Transactions in Practice (Part 1)

Part goal: **Enable idempotent producer safely**.

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

1. Configure idempotent producer.
2. Publish with simulated retries.
3. Verify no duplicate committed records.

---

## Runnable Code Block

~~~java
props.put("enable.idempotence", "true");
props.put("acks", "all");
props.put("retries", Integer.toString(Integer.MAX_VALUE));
props.put("max.in.flight.requests.per.connection", "5");
~~~

---

## Verify

~~~bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.out --from-beginning --property print.key=true
~~~

---

## Failure Drill

Introduce broker delay and force producer retries. Confirm single committed record per key.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
