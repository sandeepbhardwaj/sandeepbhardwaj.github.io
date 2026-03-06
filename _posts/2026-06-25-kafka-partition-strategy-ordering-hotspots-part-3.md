---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-25
seo_title: Kafka Partition Strategy for Ordering and Hotspot Mitigation (Part 3)
seo_description: 'Hands-on guide: Kafka Partition Strategy for Ordering and Hotspot
  Mitigation. Operational migration runbook.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Kafka Partition Strategy for Ordering and Hotspot Mitigation (Part 3)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Operational migration runbook**.

---

## Real-World Scenario

A single high-volume tenant overloads one partition, creating lag spikes and delayed processing for that key.

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

1. Dual-write old/new key strategy.
2. Compare ordering/lag metrics.
3. Cut consumers to new topic.
4. Remove old topic after retention window.

---

## Runnable Code Block

~~~text
Metrics to gate cutover:
- max partition lag
- skew ratio (max/avg)
- ordering violation count
~~~

---

## Verify

~~~bash
# snapshot lag before cutover
kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe
~~~

---

## Failure Drill

Force producer restart during dual-write and verify no data gap in either topic.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
