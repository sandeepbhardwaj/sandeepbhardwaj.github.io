---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-05
seo_title: Retry Topics DLQ Design and Poison Message Governance (Part 1)
seo_description: 'Hands-on guide: Retry Topics DLQ Design and Poison Message Governance.
  Build retry topology.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Retry Topics DLQ Design and Poison Message Governance (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Build retry topology**.

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

1. Create main/retry/dlq topics.
2. Route transient errors to retry topics with attempt count.
3. Route permanent errors to DLQ.

---

## Runnable Code Block

~~~java
try {
    process(event);
} catch (TimeoutException e) {
    publish("orders.retry.1m", event.withAttempt(attempt + 1));
} catch (Exception fatal) {
    publish("orders.dlq", event.withError("PERMANENT"));
}
~~~

---

## Verify

~~~bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.dlq --from-beginning
~~~

---

## Failure Drill

Send one malformed payload + many valid events; verify only bad event reaches DLQ.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
