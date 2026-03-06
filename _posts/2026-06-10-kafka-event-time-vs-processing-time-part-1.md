---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-10
seo_title: Event Time Versus Processing Time Tradeoffs in Stream Pipelines (Part 1)
seo_description: 'Hands-on guide: Event Time Versus Processing Time Tradeoffs in Stream
  Pipelines. Compare baseline windows.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Event Time Versus Processing Time Tradeoffs in Stream Pipelines (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Compare baseline windows**.

---

## Real-World Scenario

Delayed and out-of-order events can distort business metrics when processing-time windows are used blindly.

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

1. Produce timestamped events with intentional delay.
2. Aggregate with processing-time windows.
3. Compare with event-time windows.

---

## Runnable Code Block

~~~java
Consumed<String, Event> consumed = Consumed.with(keySerde, eventSerde)
    .withTimestampExtractor((r, ts) -> r.value().eventTimeMillis());
~~~

---

## Verify

~~~bash
# compare output topics for processing-time and event-time pipelines
~~~

---

## Failure Drill

Delay events by 2 minutes and inspect bucket placement differences.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
