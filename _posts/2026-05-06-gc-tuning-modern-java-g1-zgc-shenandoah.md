---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-06
seo_title: GC Tuning in Modern Java for Production Systems
seo_description: Tune Java garbage collectors using pause-time, throughput, and allocation
  telemetry.
tags:
- java
- gc
- g1gc
- zgc
- shenandoah
- performance
title: GC Tuning in Modern Java (G1 ZGC Shenandoah) Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Balancing Pause Time Throughput and Allocation Rate
---
GC tuning should be outcome-driven: latency SLO, throughput target, and memory budget.
Random flag tuning without telemetry usually makes systems worse.

---

## Start With the Right Baseline

- G1: strong default for mixed workloads.
- ZGC: low-pause focus for large heaps and latency-critical services.
- Shenandoah: low-pause collector with different trade-offs and platform considerations.

---

## Tuning Workflow

1. Capture baseline metrics first.
2. Identify whether problem is allocation rate, promotion pressure, or pause variance.
3. Change one knob at a time.
4. Re-run comparable load.
5. Keep rollback-safe config history.

---

## Metrics That Matter

- allocation rate (MB/s)
- GC pause p50/p95/p99
- old-gen occupancy trend
- promotion failure / evacuation failure events
- request latency correlation with GC events

---

## Example Startup Profiles

```bash
# Baseline G1
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Xms2g -Xmx2g -jar app.jar

# Low-pause ZGC trial
java -XX:+UseZGC -Xms4g -Xmx4g -jar app.jar
```

---

## Common Pitfalls

1. Setting too many flags before measuring.
2. Under-provisioning heap and forcing constant GC churn.
3. Ignoring object lifetime patterns in application code.
4. Tuning collector flags instead of fixing allocation hotspots.

---

## Practical Engineering Moves

- reduce temporary object creation in hot loops.
- reuse buffers where safe.
- flatten large object graphs in high-throughput paths.
- eliminate accidental boxing in tight compute paths.

---

## Key Takeaways

- GC tuning is an observability problem first, configuration problem second.
- choose collector by latency vs throughput priorities.
- application allocation behavior dominates long-term GC stability.

---

## GC Tuning Runbook Template

Create a repeatable runbook so tuning is measurable:

1. fix load shape (RPS, payload size, think time)
2. capture baseline: p99 latency, allocation rate, GC pause histogram
3. apply one collector/flag change
4. compare confidence interval, not just one run
5. keep a rollback command for each experiment

```bash
jcmd <pid> GC.heap_info
jcmd <pid> GC.class_histogram
jcmd <pid> VM.native_memory summary
```

---

## Case Study: Latency Regression After Traffic Spike

When traffic doubles, allocation rate often rises faster than heap budget.
Teams tune collector flags first, but root cause is usually allocation pattern drift.

Stabilization pattern:

- cap burst concurrency to protect heap
- remove temporary allocations in top hot paths
- only then tune pause goals and heap sizing
- compare p99 latency and GC pause histograms side-by-side

Collector tuning cannot compensate for uncontrolled allocation behavior.

---

## Fast Triage Flow (Dry Run Style)

Symptom: p99 jumps from `180ms` to `420ms`.

1. check GC log/JFR timeline: do spikes align with long pauses?
2. if yes, inspect allocation rate and old-gen occupancy trend
3. if occupancy climbs continuously, likely allocation/promotion pressure
4. reduce allocation hotspots, then retest before deep flag changes

This sequence prevents random flag churn and shortens incident resolution.

---

## Practical Collector Selection Heuristic

- strict low-latency SLO + large heap: start with ZGC/Shenandoah trial
- balanced throughput + moderate heap: start with G1
- always validate with real workload; collector choice is empirical, not ideological
