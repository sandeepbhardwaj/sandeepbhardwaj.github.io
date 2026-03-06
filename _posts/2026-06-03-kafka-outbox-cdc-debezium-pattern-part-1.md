---
author_profile: true
categories:
- Java
- Kafka
- Distributed Systems
date: 2026-06-03
seo_title: Outbox Plus CDC with Debezium for Reliable Event Publishing (Part 1)
seo_description: 'Hands-on guide: Outbox Plus CDC with Debezium for Reliable Event
  Publishing. Transactional outbox baseline.'
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
title: Outbox Plus CDC with Debezium for Reliable Event Publishing (Part 1)
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part goal: **Transactional outbox baseline**.

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

1. Create `orders` and `outbox_event` tables.
2. Insert business row + outbox row in one transaction.
3. Register Debezium connector.
4. Consume emitted events.

---

## Runnable Code Block

~~~sql
begin;
insert into orders(id,amount_minor,status) values ('ord-1001',2500,'CREATED');
insert into outbox_event(id,aggregate_type,aggregate_id,event_type,payload)
values ('evt-1001','Order','ord-1001','OrderCreated','{"orderId":"ord-1001"}');
commit;
~~~

---

## Verify

~~~bash
curl -X POST http://localhost:8083/connectors -H "Content-Type: application/json" -d @connector-outbox.json
kafka-console-consumer --bootstrap-server localhost:9092 --topic ordersdb.public.outbox_event --from-beginning
~~~

---

## Failure Drill

Stop application after DB commit; Debezium should still publish the outbox event.

---

## What You Should Learn

- where this pattern fails under load or restart conditions
- which metrics prove correctness and stability
- how to convert this into a production runbook
