---
title: Kafka Streams Stateful Processing and RocksDB Tuning (Part 2)
date: 2026-06-21
categories:
- Java
- Kafka
- Distributed Systems
permalink: /java/kafka/distributed-systems/kafka-streams-stateful-processing-rocksdb-part-2/
tags:
- java
- kafka
- distributed-systems
- streaming
- backend
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Kafka Streams Stateful Processing and RocksDB Tuning (Part 2)
seo_description: 'Hands-on guide: Kafka Streams Stateful Processing and RocksDB Tuning.
  Tune cache/commit/threads.'
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: June Kafka Hands-On Series
---
Part 1 established the stateful baseline and made restore cost visible. Part 2 is where tuning becomes worth discussing, but only in relation to that baseline. Cache size, commit interval, and stream-thread count are not generic performance knobs. Each one shifts the balance between throughput, latency, and recovery behavior.

That trade-off is the real subject of this post.

## What Each Knob Actually Changes

For a simple baseline, these are the main controls:

~~~properties
cache.max.bytes.buffering=104857600
commit.interval.ms=1000
num.stream.threads=4
~~~

Their effects are different:

- larger cache can improve steady-state throughput, but may change flush behavior and memory pressure
- shorter commit intervals can reduce how much state is buffered before commit, but may increase overhead
- more stream threads can improve concurrency, but only if the topology and host resources support it

Part 2 is not about maximizing all three. It is about choosing a defensible balance.

## Why Restore Still Matters While Tuning

It is easy to optimize for steady-state benchmarks and forget restart behavior. That mistake is expensive in production.

A tuning change is only truly useful if you understand its impact on:

- processing latency
- local state growth
- changelog pressure
- restore time after restart

That last metric keeps the tuning honest.

## A Better Way to Compare Changes

Change one knob at a time and keep the workload stable.

For example:

1. increase cache size and record throughput plus restore cost
2. reset to baseline
3. change commit interval and compare again
4. only then experiment with thread count

If you move all three together, you may get a faster topology, but you will not know why.

## Local Setup

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

## A More Useful Failure Drill

Force a restart under load after each tuning change and compare recovery against the Part 1 baseline.

That question is more valuable than raw throughput alone:

"Did we speed up steady-state processing by making restart behavior worse?"

If the answer is yes, the topology may still need more design work before more tuning.

> [!important]
> Stateful streaming performance is not just records per second. Recovery characteristics are part of the runtime contract.

## Common Mistakes

### Treating bigger cache as automatically better

It may help throughput, but it also changes memory behavior and can make the system feel different under burst or failure conditions.

### Adding threads without checking partition-level parallelism

More threads do not help if the topology is not partitioned in a way that can use them.

### Ignoring the changelog while tuning local state

A local improvement that overloads changelog traffic or restore cost is not really a net win.

## What This Part Should Leave You With

After Part 2, the team should understand:

1. what cache, commit interval, and threads each influence
2. how to compare tuning changes against the Part 1 baseline
3. why recovery metrics have to stay in the tuning conversation

That is what makes RocksDB and Streams tuning an engineering exercise instead of a guess-and-hope loop.
