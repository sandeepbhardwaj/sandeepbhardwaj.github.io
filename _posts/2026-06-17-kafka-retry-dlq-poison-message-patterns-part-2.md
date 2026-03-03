---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-17
seo_title: "Retry Topics DLQ Design and Poison Message Governance (Part 2)"
seo_description: "Hands-on guide: Retry Topics DLQ Design and Poison Message Governance. Metadata and replay controls."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-retry-dlq-poison-message-patterns-part-2/"
title: "Retry Topics DLQ Design and Poison Message Governance (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Retry Topics DLQ Design and Poison Message Governance (Part 2)

Part goal: **Metadata and replay controls**.

---

## Real-World Scenario

A poison event can block partition progress unless retries and DLQ are bounded and policy-driven.

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

1. Add headers: event_id, attempt, error_code, first_failure_at.
2. Enforce max attempts.
3. Build replay filter by event_id and error class.

---

## Runnable Code Block

~~~json
{
  "eventId": "evt-88",
  "attempt": 3,
  "errorCode": "SCHEMA_VALIDATION_FAILED"
}
~~~

---

## Verify

~~~bash
# inspect DLQ volume
kafka-run-class kafka.tools.GetOffsetShell --broker-list localhost:9092 --topic orders.dlq
~~~

---

## Failure Drill

Replay only fixed error class; ensure unrepaired poison messages remain quarantined.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
