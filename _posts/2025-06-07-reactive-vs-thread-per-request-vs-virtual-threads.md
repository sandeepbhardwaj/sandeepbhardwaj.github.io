---
title: Reactive vs Thread Per Request vs Virtual Threads
date: 2025-06-07
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- reactive
- virtual-threads
- backend
- architecture
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Reactive vs Thread Per Request vs Virtual Threads
seo_description: Learn how reactive programming, classic thread-per-request, and
  virtual threads compare in Java backend systems.
header:
  overlay_image: "/assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 12
  show_overlay_excerpt: false
---
By 2025, Java backend teams often evaluate three broad concurrency styles:

- classic thread-per-request
- reactive pipelines
- virtual-thread based thread-per-request

The right choice is not ideological.
It depends on:

- workload shape
- complexity tolerance
- dependency model
- operational constraints

This comparison is about design trade-offs, not dogma.

---

## Classic Thread Per Request

This model is straightforward:

- one platform thread handles one request
- blocking code is natural
- control flow is easy to read

Its traditional weakness is scalability under high blocking concurrency because platform threads are relatively expensive.

Still, for moderate scale and clear code, it remains a good model.

---

## Reactive

Reactive systems aim to handle large concurrency with fewer threads by avoiding blocking and expressing workflows as asynchronous streams or pipelines.

Strengths:

- high efficiency when the stack is truly non-blocking
- strong control over backpressure
- useful for high-concurrency event-driven systems

Costs:

- more complex mental model
- harder debugging in many teams
- context propagation and tracing can be trickier
- benefits are reduced if blocking dependencies still dominate

Reactive is powerful, but it raises the abstraction cost.

---

## Virtual Threads

Virtual threads reopen the possibility of simple blocking code at high concurrency.

Strengths:

- straightforward programming model
- far cheaper thread-per-request concurrency than platform threads alone
- easier migration path for many existing blocking backends

Costs:

- blocking downstream resources are still finite
- synchronization bottlenecks still hurt
- some old assumptions about thread-local context need review

Virtual threads simplify a lot, but they do not make every architecture problem trivial.

---

## Decision Pressure Points

Choose based on:

1. Are dependencies mostly blocking or truly non-blocking?
2. Does the team have strong reactive expertise?
3. Is codebase simplicity a major priority?
4. Is backpressure handling a primary system concern?
5. Are downstream resource limits the main bottleneck rather than thread cost?

These questions matter more than fashion.

---

## Common Misunderstandings

### "Reactive is always more scalable"

Not automatically.
It depends on the full stack and workload.

### "Virtual threads make reactive obsolete"

No.
Reactive still has strong use cases, especially where non-blocking backpressure is fundamental.

### "Classic thread-per-request is always outdated"

It is often still the clearest model for moderate concurrency and simpler systems.

---

## Practical Guidance

Many modern Java backends now have a compelling default:

- simple request-oriented design with virtual threads

That is especially attractive when:

- business logic is imperative
- dependencies are mostly blocking
- team productivity benefits from direct control flow

Reactive remains compelling when:

- the stack is end-to-end non-blocking
- very high concurrency with explicit backpressure is essential
- the team is comfortable with the model

---

## Key Takeaways

- Classic thread-per-request is simple but historically constrained by expensive platform threads.
- Reactive trades simplicity for strong non-blocking and backpressure-oriented concurrency.
- Virtual threads make thread-per-request viable again for many high-concurrency Java backends.
- The best choice depends on workload, team skill, dependency behavior, and operational priorities.

Next post: [How Modern Java Changes Concurrency Design Choices](/2025/06/08/how-modern-java-changes-concurrency-design-choices/)
