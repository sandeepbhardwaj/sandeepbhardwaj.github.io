---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-22
seo_title: "Event Time Versus Processing Time Tradeoffs in Stream Pipelines (Part 2)"
seo_description: "Hands-on guide: Event Time Versus Processing Time Tradeoffs in Stream Pipelines. Grace period and lateness policy."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-event-time-vs-processing-time-part-2/"
title: "Event Time Versus Processing Time Tradeoffs in Stream Pipelines (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Event Time Versus Processing Time Tradeoffs in Stream Pipelines (Part 2)

Part goal: **Grace period and lateness policy**.

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

1. Configure grace window.
2. Measure drop/correction behavior.
3. Align with business SLA.

---

## Runnable Code Block

~~~text
Window policy:
- size: 5m
- grace: 2m
- late beyond grace: drop with metric
~~~

---

## Verify

~~~bash
# inspect late-event counter and corrected aggregate output
~~~

---

## Failure Drill

Send out-of-order events beyond grace and verify explicit drop handling.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
