---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-06
seo_title: "GC Tuning in Modern Java for Production Systems"
seo_description: "Tune Java garbage collectors using pause-time, throughput, and allocation telemetry."
tags: [java, gc, g1gc, zgc, shenandoah, performance]
canonical_url: "https://sandeepbhardwaj.github.io/java/gc-tuning-modern-java-g1-zgc-shenandoah/"
title: "GC Tuning in Modern Java (G1 ZGC Shenandoah) Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Balancing Pause Time Throughput and Allocation Rate"
---

# GC Tuning in Modern Java (G1 ZGC Shenandoah) Guide

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
