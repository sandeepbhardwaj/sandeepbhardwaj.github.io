---
title: GC Tuning in Modern Java (G1 ZGC Shenandoah) Guide
date: 2026-05-06
categories:
- Java
- Backend
tags:
- java
- gc
- g1gc
- zgc
- shenandoah
- performance
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: GC Tuning in Modern Java for Production Systems
seo_description: Tune Java garbage collectors using pause-time, throughput, and allocation
  telemetry.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Balancing Pause Time Throughput and Allocation Rate
---
GC tuning is rarely a search for the "best" collector. It is a search for the least surprising runtime behavior under your workload.

That means the right starting point is not JVM folklore. It is a clear answer to three questions:

- what latency SLO must the service meet?
- how much heap can the service afford?
- is the real problem GC behavior or application allocation behavior?

If you do not know those answers, flag tuning usually becomes noise.

---

## Start With the Collector Fit

At a high level:

- `G1` is the pragmatic default for many mixed workloads
- `ZGC` is attractive when low pause times matter more than squeezing every bit of throughput
- `Shenandoah` also targets low pauses, with its own platform and operational trade-offs

The mistake is treating this as ideology. Collector choice is empirical. A service with a moderate heap and healthy latency on G1 does not become better just because ZGC sounds more modern.

---

## Most GC Incidents Start in the Application

Teams often react to long pauses by reaching for flags first. The more common root causes are:

- temporary object churn in hot paths
- burst concurrency that overwhelms heap headroom
- oversized object graphs
- promotion pressure from objects living just a little too long

Collector tuning helps once you understand those patterns. It does not replace that analysis.

---

## Build a Baseline Before Changing Anything

A useful baseline should include:

- allocation rate
- pause histogram, not just average pause
- old-generation occupancy trend
- request latency over the same period
- any evacuation or promotion failures

Without that, you do not know whether a new flag made the service better or merely different.

```bash
jcmd <pid> GC.heap_info
jcmd <pid> GC.class_histogram
jcmd <pid> VM.native_memory summary
```

If possible, pair those with JFR so you can correlate pauses with allocation and thread behavior instead of reading GC data in isolation.

---

## A Clean Tuning Workflow

Use a simple loop:

1. keep the workload shape fixed
2. capture baseline metrics
3. change one collector setting or heap parameter
4. rerun the same load
5. compare latency, pause distribution, and allocation effects
6. keep a rollback-ready configuration

This sounds slower than "just try a few flags," but it is faster in practice because it produces believable results.

---

## Example Starting Profiles

```bash
# Baseline G1 for a moderate mixed workload
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Xms2g -Xmx2g -jar app.jar

# Trial low-pause setup for a larger heap and tighter latency SLO
java -XX:+UseZGC -Xms4g -Xmx4g -jar app.jar
```

These are not prescriptions. They are starting points for measurement.

---

## How to Choose the Next Investigation Step

When p99 latency jumps, use the symptoms to decide where to look next:

- pauses rising with stable allocation rate: collector behavior or heap sizing may be the issue
- allocation rate climbing sharply: application changes may be the real cause
- old generation filling steadily: long-lived object retention may matter more than pause tuning
- burst traffic causing both allocation spikes and pause spikes: concurrency and memory budget need to be looked at together

That prevents the common mistake of treating every latency regression as a collector problem.

---

## G1, ZGC, and Shenandoah Need Different Expectations

### G1

Good default when you want balanced behavior and familiar operational patterns.

Watch for:

- pause variance under heavy allocation
- old-generation pressure
- too little headroom in the heap

### ZGC

Good when low pause behavior matters strongly and you can afford the operational learning curve.

Watch for:

- total memory budget
- actual end-to-end latency gains, not just prettier GC charts
- whether allocation churn is still the dominant cost

### Shenandoah

Useful in similar low-pause contexts, but it should be adopted based on proven behavior in your environment, not on category labels alone.

---

## The Highest-Leverage Fix Is Often Less Allocation

Before deep GC tuning, check whether the service can simply allocate less:

- reuse buffers safely
- reduce short-lived wrapper objects
- flatten request-path object graphs
- remove accidental boxing in tight loops

Those changes tend to survive collector migrations because they improve the workload itself, not just one runtime configuration.

> [!TIP]
> If a service only behaves well after extensive flag tuning, that is often a signal that the allocation profile deserves more attention.

---

## A Practical Triage Example

Imagine p99 latency moves from `180ms` to `420ms` after traffic doubles.

A good sequence is:

1. check whether the spike aligns with GC pauses
2. inspect allocation rate over the same period
3. compare old-generation occupancy trend
4. look for recent application changes that increased temporary object creation
5. only then decide whether collector settings should change

This is how you avoid solving a code problem with runtime guesswork.

---

## Key Takeaways

- GC tuning is an observability problem before it is a flags problem.
- Pick a collector based on workload goals, not fashion.
- Allocation behavior and heap pressure often matter more than the specific collector.
- Change one thing at a time and keep rollback simple.
