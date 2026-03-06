---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-29
seo_title: Retry Topics DLQ Design and Poison Message Governance (Part 3)
seo_description: 'Hands-on guide: Retry Topics DLQ Design and Poison Message Governance.
  DLQ governance playbook.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Retry Topics DLQ Design and Poison Message Governance (Part 3)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **DLQ governance playbook**.

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

1. Classify DLQ by root cause.
2. Assign owner and SLA.
3. Automate replay after fix.
4. Audit replay outcomes.

---

## Runnable Code Block

~~~text
DLQ policy:
- transient infra errors: auto-replay
- schema errors: replay after producer fix
- business rejects: no replay
~~~

---

## Verify

~~~bash
# sample replay command pipeline (replace with internal tool)
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.dlq --from-beginning | head
~~~

---

## Failure Drill

Run synthetic DLQ drill and verify playbook completion within target recovery window.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
