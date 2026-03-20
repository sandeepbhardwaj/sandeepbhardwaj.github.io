---
title: Exchanger in Java and When It Is Useful
date: 2025-04-04
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- exchanger
- coordination
- buffers
- handoff
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Exchanger in Java and When It Is Useful
seo_description: Learn how Exchanger works in Java for two-party handoff and
  buffer swapping, and when it is the right or wrong coordination primitive.
header:
  overlay_image: "/assets/images/java-concurrency-module-08-coordination-utilities-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 8
  show_overlay_excerpt: false
---
`Exchanger` is one of the least-used coordination utilities in everyday Java application code.

That does not make it useless.
It makes it specialized.

Its core idea is precise:

- two threads meet
- each hands an object to the other
- both continue with what they received

That is not a queue.
It is not a barrier for many parties.
It is a pairwise exchange point.

---

## Problem Statement

Suppose one thread fills a reusable buffer and another consumes it.

You want to avoid:

- constant allocation of new buffers
- ad hoc synchronization around shared lists
- complex handoff state

The natural flow is:

- producer fills buffer A
- consumer drains buffer B
- when both are ready, they swap

That swap pattern is exactly where `Exchanger` fits.

---

## Mental Model

`Exchanger<T>` is a rendezvous point for exactly two threads.

Each thread calls:

- `exchange(value)`

When both arrive:

- each receives the other thread's value

That means it combines:

- synchronization
- data handoff

in one operation.

This is why it is especially good for double-buffer-style workflows.

---

## Runnable Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Exchanger;
import java.util.concurrent.TimeUnit;

public class ExchangerDemo {

    public static void main(String[] args) throws Exception {
        Exchanger<List<String>> exchanger = new Exchanger<>();

        Thread producer = new Thread(() -> runProducer(exchanger), "producer");
        Thread consumer = new Thread(() -> runConsumer(exchanger), "consumer");

        producer.start();
        consumer.start();

        producer.join();
        consumer.join();
    }

    static void runProducer(Exchanger<List<String>> exchanger) {
        List<String> buffer = new ArrayList<>();
        try {
            for (int batch = 1; batch <= 3; batch++) {
                buffer.add("event-" + batch + "-a");
                buffer.add("event-" + batch + "-b");
                System.out.println("Producer prepared " + buffer);
                buffer = exchanger.exchange(buffer);
                buffer.clear();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }

    static void runConsumer(Exchanger<List<String>> exchanger) {
        List<String> emptyBuffer = new ArrayList<>();
        try {
            for (int batch = 1; batch <= 3; batch++) {
                List<String> fullBuffer = exchanger.exchange(emptyBuffer);
                System.out.println("Consumer received " + fullBuffer);
                TimeUnit.MILLISECONDS.sleep(150);
                fullBuffer.clear();
                emptyBuffer = fullBuffer;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

The important shape is:

- producer and consumer each own one buffer
- the exchange swaps ownership cleanly
- no shared mutable list needs concurrent mutation

That is elegant when the workflow truly is two-party buffer swapping.

---

## When It Helps

Strong fits:

- double-buffer handoff
- producer-consumer pairs with reusable containers
- genetic algorithms or simulations with pairwise state exchange
- tightly coupled two-thread workflows

The best signal is that the two threads are peers in a symmetric handoff relationship.

---

## When It Does Not Fit

Poor fits:

- many producers or many consumers
- queue-style asynchronous pipelines
- one thread handing work to an unknown pool
- workflows where either side may be absent for long periods

If the system is really a work queue, use a queue.
If the coordination is really many-party, use a barrier or phaser.

`Exchanger` is narrow by design.

---

## Common Mistakes

### Treating it like a general message bus

It only coordinates two parties at a rendezvous point.

### Ignoring timeout needs

If one side disappears or stalls, the other may wait indefinitely unless you use timed exchange.

### Sharing exchanged objects concurrently afterward

The clean pattern is ownership transfer:

- I hand you this object
- you now own it

If both sides keep mutating the same object after exchange, the design loses the safety benefit.

---

## Testing and Debugging Notes

When an `Exchanger` flow hangs, the main questions are:

1. did both parties reach the exchange point
2. did one side exit early
3. was interruption or timeout handled correctly

Useful practices:

- log batch numbers before each exchange
- use timed exchange in fragile workflows
- design around clean ownership transfer of the exchanged object

Because the primitive is pairwise, debugging is usually simpler than queue debugging, but only if the two-party contract is explicit.

---

## Decision Guide

Use `Exchanger` when:

- exactly two threads rendezvous
- each side has an object to hand to the other
- double-buffer or ownership-swap semantics are natural

Do not use it when:

- the coordination is many-to-many
- the workflow is queue-like
- one side may not reliably reach the rendezvous

---

## Key Takeaways

- `Exchanger` is a specialized two-party rendezvous primitive that swaps objects between threads.
- It shines in buffer-swapping and ownership-transfer workflows.
- It is not a queue, not a many-party barrier, and not a general async messaging tool.
- Use it when the two-party handoff model is the design, not when you are trying to force a broader coordination problem into a narrow primitive.

Next post: [CompletableFuture as a Coordination Primitive](/java/completablefuture/concurrency/completablefuture-as-a-coordination-primitive/)
