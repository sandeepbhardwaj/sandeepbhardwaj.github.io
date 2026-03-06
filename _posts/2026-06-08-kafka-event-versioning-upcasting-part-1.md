---
author_profile: true
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
