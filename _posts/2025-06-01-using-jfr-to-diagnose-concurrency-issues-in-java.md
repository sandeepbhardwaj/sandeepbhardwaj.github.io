---
title: Using JFR to Diagnose Concurrency Issues in Java
date: 2025-06-01
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- jfr
- diagnostics
- profiling
- production
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Using JFR to Diagnose Concurrency Issues in Java
seo_description: Learn how Java Flight Recorder helps diagnose concurrency
  issues such as blocking, contention, and stalled threads in production.
header:
  overlay_image: "/assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 12
  show_overlay_excerpt: false
---
Thread dumps are excellent snapshots.
JFR is better when you need a time-based story.

That is why Java Flight Recorder is so useful for concurrency diagnostics.

It helps answer questions like:

- where are threads blocking over time
- which locks are hot
- what kinds of stalls are recurring
- when did the slowdown start

Those are hard questions to answer from one static dump alone.

---

## Problem Statement

Many concurrency incidents are not single moments.
They are patterns over time:

- rising lock contention
- frequent thread parking
- bursts of blocked monitors
- starvation around pool saturation

If you only inspect one dump, you may miss the timeline.

JFR adds time, frequency, and event context to the diagnosis.

---

## Mental Model

Think of JFR as low-overhead event recording for JVM behavior.

For concurrency work, it can help surface:

- monitor contention
- thread park behavior
- blocking patterns
- execution hotspots near contended code paths

It is strongest when you need to correlate:

- application slowdown
- JVM thread behavior
- lock or waiting patterns

over an interval rather than at one instant.

---

## Useful Commands

One common way to start a recording is:

```bash
jcmd <pid> JFR.start name=concurrency settings=profile duration=5m filename=concurrency.jfr
```

You can then inspect the recording in tools that understand JFR data.

The exact tooling matters less than the workflow:

- capture during or near the incident
- inspect blocking and contention related events
- correlate with the time window of bad behavior

---

## What to Look For

Useful concurrency-oriented questions include:

- which threads are parking frequently
- whether lock contention is concentrated on a few classes or methods
- whether the application is spending time blocked rather than computing
- whether pool threads appear underutilized or stuck behind waiting dependencies

JFR helps you find repeated patterns, not just one dramatic stack trace.

---

## Why JFR Is Often Better Than Guessing

Teams often jump from:

- "latency is bad"

to:

- "we need more threads"

or:

- "the database must be slow"

JFR is useful because it replaces intuition with evidence about:

- actual blocking
- actual contention
- actual waiting behavior

That narrows root-cause search much faster.

---

## Common Mistakes

### Capturing a recording without a clear incident window

You still need context from metrics and timestamps.

### Looking only at CPU hotspots

Concurrency issues are often about blocked time, not just hot methods.

### Using JFR without thread names or pool clarity

Good thread naming makes event interpretation far easier.

### Treating JFR as a replacement for thread dumps

It complements dumps.
It does not make them obsolete.

---

## Practical Guidance

Use JFR when:

- the system is slow but not obviously crashed
- contention is suspected
- thread dumps alone feel too static
- you need evidence from a period of time

For the strongest diagnosis, combine:

- JFR recording
- thread dumps
- executor metrics
- request latency graphs

Concurrency incidents are rarely explained by one signal alone.

---

## Key Takeaways

- JFR adds a time dimension to concurrency diagnosis that thread dumps alone do not provide.
- It is especially useful for recurring blocking, contention, and parking patterns.
- JFR works best when paired with metrics, good thread naming, and incident timestamps.
- Use it to replace guesswork with evidence about how threads actually behaved over the slowdown window.

Next post: [Lock Contention Profiling in Java](/2025/06/02/lock-contention-profiling-in-java/)
