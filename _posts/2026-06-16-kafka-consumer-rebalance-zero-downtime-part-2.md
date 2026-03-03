---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-16
seo_title: "Consumer Group Rebalance Internals and Zero Downtime Tuning (Part 2)"
seo_description: "Hands-on guide: Consumer Group Rebalance Internals and Zero Downtime Tuning. Cooperative and static membership."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-consumer-rebalance-zero-downtime-part-2/"
title: "Consumer Group Rebalance Internals and Zero Downtime Tuning (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Consumer Group Rebalance Internals and Zero Downtime Tuning (Part 2)

Part goal: **Cooperative and static membership**.

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

1. Switch to CooperativeStickyAssignor.
2. Add stable group.instance.id per pod.
3. Re-run rolling restart.

---

## Runnable Code Block

~~~properties
partition.assignment.strategy=org.apache.kafka.clients.consumer.CooperativeStickyAssignor
group.instance.id=orders-c1
~~~

---

## Verify

~~~bash
kafka-consumer-groups --bootstrap-server localhost:9092 --group orders-cg --describe
~~~

---

## Failure Drill

Restart one instance under load and compare lag spike vs Part 1.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
