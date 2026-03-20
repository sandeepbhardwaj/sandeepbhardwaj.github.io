---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-30
seo_title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 3)
seo_description: 'Hands-on guide: Schema Evolution with Avro and Protobuf Compatibility
  Contracts. Rollout and deprecation policy.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 3)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Turn compatibility rules into a safe production rollout and deprecation policy**.

---

## Problem 1: How Do We Roll Out Schema Changes Safely in Production?

Problem description:
Passing registry checks and CI gates is necessary, but not sufficient.
Production rollout still fails when producers move too early, deprecated fields are removed too soon, or rollback paths are unclear.

What we are solving actually:
We are solving operational sequencing for contract changes.
The hard part is not adding a new field; it is coordinating consumers, producers, retention windows, and deprecation timing without service interruption.

What we are doing actually:

1. Deploy consumers that can read both old and new forms first.
2. Move producers to the new schema only after that compatibility is live.
3. Remove deprecated fields only after the retention and migration window is truly over.

```mermaid
flowchart LR
    A[Consumer supports old + new] --> B[Producer emits new schema]
    B --> C[Observe deserialization and lag]
    C --> D[Retention window passes]
    D --> E[Remove deprecated field]
```

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

This is the most important operational rule in the series.
If the producer moves first, compatibility may still look “fine” in theory while live consumers fail in practice.

---

## Verify

~~~bash
# monitor deserialization error rate during rollout
~~~

Also watch consumer lag, dead-letter queues if present, and any fallback or replay paths that depend on event decoding.

---

## Failure Drill

Rollback the producer to the old schema during rollout and verify consumers remain backward-compatible.
Then simulate a premature removal of a deprecated field and confirm your guardrails catch it before full rollout.

---

## Rollout Checklist

1. Confirm consumers are deployed with dual-read compatibility.
2. Shift producers to the new schema.
3. Monitor deserialization errors and lag during the change window.
4. Keep deprecated fields until the retention and rollback window is complete.
5. Remove old fields only after consumers no longer depend on them.

---

## Debug Steps

Debug steps:

- validate rollout order in staging with old and new consumer versions running together
- monitor deserialization failures directly, not only aggregate application errors
- document field deprecation dates so “temporary compatibility” does not become indefinite clutter
- rehearse rollback paths before a production contract change, not during one

---

## What You Should Learn

- compatibility checks prevent many failures, but rollout order prevents the rest
- consumer-first rollout is the safest default for evolving event contracts
- deprecation needs a real operational policy, not just good intentions

---

## Operator Prompt

For schema evolution with avro and protobuf compatibility contracts (part 3), keep one rollout question in the runbook: what metric tells us the topology is healthy, and what metric tells us to stop or roll back? Kafka systems usually fail operationally before they fail conceptually.
