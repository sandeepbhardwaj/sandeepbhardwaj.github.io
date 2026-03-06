---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-06
seo_title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 1)
seo_description: 'Hands-on guide: Schema Evolution with Avro and Protobuf Compatibility
  Contracts. Baseline compatibility workflow.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Baseline compatibility workflow**.

---

## Real-World Scenario

Schema changes can break consumers unless compatibility is enforced in registry and CI.

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

1. Register v1 schema.
2. Produce and consume v1.
3. Add compatible v2 optional field.
4. Validate mixed-version consumers.

---

## Runnable Code Block

~~~proto
message PaymentCreated {
  string payment_id = 1;
  int64 amount_minor = 2;
  string currency = 3;
  string merchant_id = 4; // compatible add
}
~~~

---

## Verify

~~~bash
curl -s http://localhost:8081/subjects/payment-value/versions/latest
~~~

---

## Failure Drill

Attempt remove/renumber field; confirm compatibility check fails.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
