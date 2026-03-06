---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-27
seo_title: "Outbox Plus CDC with Debezium for Reliable Event Publishing (Part 3)"
seo_description: "Hands-on guide: Outbox Plus CDC with Debezium for Reliable Event Publishing. Operational governance and replay."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-outbox-cdc-debezium-pattern-part-3/"
title: "Outbox Plus CDC with Debezium for Reliable Event Publishing (Part 3)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Outbox Plus CDC with Debezium for Reliable Event Publishing (Part 3)

Part goal: **Operational governance and replay**.

---

## Real-World Scenario

An order write succeeds, but app crashes before publish; outbox+CDC is needed to close this dual-write gap.

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

1. Monitor outbox oldest-row age.
2. Alert on connector lag/restarts.
3. Build replay script by event_id range.
4. Archive sent outbox rows by retention policy.

---

## Runnable Code Block

~~~bash
# backlog health query
psql -c "select count(*) pending, max(now()-created_at) oldest_age from outbox_event;"
~~~

---

## Verify

~~~bash
# replay filtered events (example)
kafka-console-consumer --bootstrap-server localhost:9092 --topic orders.event.OrderCreated --from-beginning | grep evt- | head
~~~

---

## Failure Drill

Pause connector for 10 minutes, build backlog, resume, and measure drain time + consumer correctness.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
