---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-30
seo_title: "Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 3)"
seo_description: "Hands-on guide: Schema Evolution with Avro and Protobuf Compatibility Contracts. Rollout and deprecation policy."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-schema-evolution-compatibility-part-3/"
title: "Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 3)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 3)

Part goal: **Rollout and deprecation policy**.

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

1. Deploy consumers supporting old+new first.
2. Deploy producers with new schema.
3. Remove deprecated fields after retention window.

---

## Runnable Code Block

~~~text
Rollout order is non-negotiable for safety.
Consumer-first prevents runtime decode failures.
~~~

---

## Verify

~~~bash
# monitor deserialization error rate during rollout
~~~

---

## Failure Drill

Rollback producer to old schema during rollout and verify consumers remain backward-compatible.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
