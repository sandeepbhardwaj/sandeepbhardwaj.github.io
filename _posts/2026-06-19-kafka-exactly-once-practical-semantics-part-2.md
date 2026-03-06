---
author_profile: true
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
