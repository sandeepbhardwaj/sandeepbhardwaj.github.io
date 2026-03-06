---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-28
seo_title: Consumer Group Rebalance Internals and Zero Downtime Tuning (Part 3)
seo_description: 'Hands-on guide: Consumer Group Rebalance Internals and Zero Downtime
  Tuning. Deployment runbook and guardrails.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Consumer Group Rebalance Internals and Zero Downtime Tuning (Part 3)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Deployment runbook and guardrails**.

---

## Real-World Scenario

Rolling deploys can trigger long rebalances and lag spikes unless membership and assignor are tuned.

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

1. Roll one pod at a time.
2. Pause autoscaler during rollout.
3. Gate next step on lag stabilization.
4. Abort on rebalance-duration threshold.

---

## Runnable Code Block

~~~text
Rollback trigger example:
- rebalance > 20s for 3 consecutive events
- lag growth slope > threshold
~~~

---

## Verify

~~~bash
# pre/post deploy lag snapshots
kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe
~~~

---

## Failure Drill

Simulate slow startup initialization and verify rollout gate halts progression.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
