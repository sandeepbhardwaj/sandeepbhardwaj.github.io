---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-31
seo_title: "Profiling and Performance Benchmarking with JMH"
seo_description: "Benchmark Java code correctly with JMH methodology and production-aligned profiling."
tags: [java, jmh, performance, benchmarking, jvm]
canonical_url: "https://sandeepbhardwaj.github.io/java/profiling-performance-benchmarking-jmh/"
title: "Profiling and Performance Benchmarking with JMH"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Reliable JVM Microbenchmarking and Profiling"
---

# Profiling and Performance Benchmarking with JMH

JMH is the reliable way to benchmark JVM code. Naive microbenchmarks are often invalid due to JIT, dead-code elimination, and warmup effects.

---

## Benchmarking Principles

- isolate target operation
- warm up JIT before measurement
- run multiple forks for process-level variance
- consume outputs to avoid DCE

---

## Minimal JMH Example

```java
@Benchmark
public int sumLoop() {
    int s = 0;
    for (int i = 0; i < 1000; i++) s += i;
    return s;
}
```

---

## Correct Experiment Design

- benchmark alternatives under identical input distributions.
- measure allocation rate and GC alongside raw throughput.
- keep CPU scaling/governor consistent across runs.
- separate microbenchmark findings from end-to-end system latency.

---

## Integration With Profiling

- use JMH for controlled micro comparisons.
- use JFR/profilers for whole-service bottleneck attribution.
- validate that local wins translate to production endpoints.

---

## Key Takeaways

- JMH is mandatory for credible JVM microbenchmarking.
- methodology quality matters more than one headline number.
- combine benchmark and production profiling for trustworthy optimization decisions.
