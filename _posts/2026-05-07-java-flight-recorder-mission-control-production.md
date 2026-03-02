---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-07
seo_title: "Java Flight Recorder and Mission Control Production Guide"
seo_description: "Diagnose production JVM behavior with low-overhead profiling via JFR and JMC."
tags: [java, jfr, observability, performance, jmc]
canonical_url: "https://sandeepbhardwaj.github.io/java/java-flight-recorder-mission-control-production/"
title: "Java Flight Recorder and Mission Control in Production"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Low Overhead Production Profiling and Diagnostics"
---

# Java Flight Recorder and Mission Control in Production

JFR is one of the highest-value JVM tools because it captures deep runtime signals with low overhead.
Use it proactively, not only during incidents.

---

## What JFR Gives You

- allocation hotspots by class and stack
- lock contention and blocked time
- GC events and pause details
- method profiling samples
- thread state transitions

---

## Production Recording Strategy

- keep a rolling low-overhead recording in production.
- trigger focused high-detail recording during incident windows.
- archive recordings with build/version metadata.

---

## Command Examples

```bash
# startup recording
java -XX:StartFlightRecording=filename=app.jfr,maxage=30m,settings=profile -jar app.jar

# inspect quickly
jfr summary app.jfr
jfr print --events jdk.GCPhasePause app.jfr
```

---

## How to Use JMC Effectively

- start with automated rule warnings.
- correlate CPU, allocation, and lock panels.
- isolate top offenders by package/module.
- compare before/after recording from performance fix rollout.

---

## Incident Playbook

1. capture 2-5 minutes around failure period.
2. inspect GC pause and safepoint spikes.
3. identify top allocation sites.
4. inspect blocked/parked thread patterns.
5. propose narrow code/config fix, then verify via second recording.

---

## Key Takeaways

- JFR gives production-grade, low-overhead JVM visibility.
- pair runtime recordings with request metrics for root-cause speed.
- keep a repeatable recording/analysis workflow in your runbook.
