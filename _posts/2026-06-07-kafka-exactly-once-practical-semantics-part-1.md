---
author_profile: true
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
