---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-23
seo_title: "Multi Region Kafka Replication and Failover Patterns (Part 2)"
seo_description: "Hands-on guide: Multi Region Kafka Replication and Failover Patterns. Client failover behavior."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-multi-region-replication-failover-part-2/"
title: "Multi Region Kafka Replication and Failover Patterns (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Multi Region Kafka Replication and Failover Patterns (Part 2)

Part goal: **Client failover behavior**.

---

## Real-World Scenario

Region outage handling requires tested failover and failback workflows, not just replication enabled by default.

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

1. Configure client endpoint failover list.
2. Validate retry/backoff behavior.
3. Measure RTO and data gap.

---

## Runnable Code Block

~~~properties
bootstrap.servers=primary:9092,secondary:9092
reconnect.backoff.ms=200
~~~

---

## Verify

~~~bash
# observe publish latency and failover transition in logs/metrics
~~~

---

## Failure Drill

Force DNS/endpoint switch and measure how fast producers stabilize.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
