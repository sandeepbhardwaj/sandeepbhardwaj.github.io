---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-20
seo_title: "Event Versioning and Upcasting Strategy in Long Lived Domains (Part 2)"
seo_description: "Hands-on guide: Event Versioning and Upcasting Strategy in Long Lived Domains. Upcaster chain implementation."
tags: [java, kafka, distributed-systems, streaming, backend]
canonical_url: "https://sandeepbhardwaj.github.io/kafka-event-versioning-upcasting-part-2/"
title: "Event Versioning and Upcasting Strategy in Long Lived Domains (Part 2)"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "June Kafka Hands-On Series"
---

# Event Versioning and Upcasting Strategy in Long Lived Domains (Part 2)

Part goal: **Upcaster chain implementation**.

---

## Real-World Scenario

Historical events retained for replay require upcasters to transform old payloads into current domain shape.

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

1. Add v1->v2 upcaster.
2. Keep handlers accepting latest version only.
3. Replay from beginning.

---

## Runnable Code Block

~~~java
OrderCreatedV2 upcastV1(OrderCreatedV1 old) {
    return new OrderCreatedV2(old.orderId(), "STANDARD");
}
~~~

---

## Verify

~~~bash
# replay stream from earliest offset
~~~

---

## Failure Drill

Disable upcaster and confirm replay fails on legacy event.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
