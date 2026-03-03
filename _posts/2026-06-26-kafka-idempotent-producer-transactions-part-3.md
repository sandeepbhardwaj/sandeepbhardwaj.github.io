---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-26
seo_title: "Idempotent Producers and Kafka Transactions in Practice (Part 3)"
seo_description: "Hands-on guide: Idempotent Producers and Kafka Transactions in Practice. Fencing and timeout operations."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-idempotent-producer-transactions-part-3/"
title: "Idempotent Producers and Kafka Transactions in Practice (Part 3)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Idempotent Producers and Kafka Transactions in Practice (Part 3)

Part goal: **Fencing and timeout operations**.

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

1. Configure stable `transactional.id`.
2. Handle fenced producer as fatal.
3. Tune transaction timeout by SLA.

---

## Runnable Code Block

~~~properties
transactional.id=orders-tx-producer-1
transaction.timeout.ms=60000
~~~

---

## Verify

~~~bash
# observe abort/commit metrics from producer app logs and monitoring
~~~

---

## Failure Drill

Start two instances with same transactional.id; verify older producer gets fenced.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
