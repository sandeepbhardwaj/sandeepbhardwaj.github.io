---
title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 1)
date: 2026-06-06
categories:
- Java
- Kafka
- Distributed Systems
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Schema Evolution with Avro and Protobuf Compatibility Contracts (Part 1)
seo_description: 'Hands-on guide: Schema Evolution with Avro and Protobuf Compatibility
  Contracts. Baseline compatibility workflow.'
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Schema evolution is rarely where a Kafka program feels exciting, but it is where a lot of quiet production damage starts. A producer deploys a "small" payload change, one older consumer cannot deserialize it, and now the topic contract is broken in the middle of a rolling rollout.

Part 1 is about building the discipline before automation: a baseline contract, explicit compatibility rules, and mixed-version testing that proves the change is safe in a real deployment window.

## The Design Problem Behind the Syntax

This is not fundamentally an Avro problem or a Protobuf problem. It is a coordination problem.

The real questions are:

- which fields are safe to add
- which changes break old readers or writers
- how long old consumers are expected to coexist with new producers
- whether the team treats the registry as a guardrail or as a box-checking step

```mermaid
flowchart LR
    A[Schema v1 in production] --> B[Producer proposes change]
    B --> C[Compatibility check]
    C --> D[Mixed-version test]
    D --> E[Safe rollout]
```

A contract is only trustworthy when both the registry and the running consumers agree.

## A Safer Baseline Change

For Part 1, keep the change intentionally boring: add an optional field or one with a compatible default. That teaches the process without dragging the team into advanced compatibility edge cases too early.

For example:

~~~proto
message PaymentCreated {
  string payment_id = 1;
  int64 amount_minor = 2;
  string currency = 3;
  string merchant_id = 4;
}
~~~

If `merchant_id` is a new optional addition, older consumers can usually continue to read the record without crashing, assuming the compatibility mode and serializer behavior are aligned.

## The Changes That Deserve More Fear

Teams get into trouble when they:

- renumber fields
- change meaning without changing names
- remove fields still needed by older readers
- switch a field from optional to effectively required during rollout

Those are not harmless refactors. They are contract changes with operational blast radius.

> [!warning]
> A schema change that passes review because it "looks tiny" can still be the most dangerous change in the release if older consumers are still alive.

## Why Mixed-Version Testing Matters

A registry compatibility check is necessary, but it is not the whole proof.

You still want to test:

- old consumer reading new producer data
- new consumer reading historical data
- at least one rolling deployment window where versions coexist

If you only test latest producer with latest consumer, you are testing a lab state that production rarely stays in.

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

## Verification Flow

First verify the registry sees the expected latest version:

~~~bash
curl -s http://localhost:8081/subjects/payment-value/versions/latest
~~~

Then do the more important test: produce both versions and read them through the consumer version you actually intend to keep live during rollout.

That second check catches the real integration mistakes.

## Operational Guidance

### Write down allowed versus forbidden changes

Do not leave compatibility rules as tribal knowledge. A short team policy is often enough:

- adding optional fields is allowed
- field renumbering is forbidden
- semantic repurposing of existing fields is forbidden
- removals require a migration plan

### Align subject naming and ownership

If nobody knows which subject belongs to which event stream, the registry becomes harder to trust during incidents.

### Treat schema review like API review

Because that is what it is. A topic schema is not just serialization detail; it is an interface shared across teams and time.

## What This Part Should Leave You With

After Part 1, the team should understand:

1. why additive, compatibility-preserving changes are the right baseline
2. why registry acceptance is necessary but insufficient
3. why mixed-version runtime tests are part of real contract safety

That baseline makes later schema governance and automation credible instead of ceremonial.
