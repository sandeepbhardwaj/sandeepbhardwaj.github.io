---
title: Micrometer/OpenTelemetry with high-cardinality metric governance
date: 2026-07-11
categories:
- Java
- Spring Boot
- Backend
tags:
- java
- spring-boot
- backend
- architecture
- production
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Micrometer/OpenTelemetry with high-cardinality metric governance - Advanced
  Guide
seo_description: Advanced practical guide on micrometer/opentelemetry with high-cardinality
  metric governance with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Spring Boot Runtime Engineering
---
Observability gets expensive long before it gets useful if a team does not govern metric cardinality.
Micrometer and OpenTelemetry make instrumentation easier, but they also make it easy to emit labels and attributes that look helpful in a dashboard and quietly destroy query cost, storage, and operator trust.

---

## Start With the Three Different Signals

A healthy observability design separates:

- **metrics** for trend and saturation signals
- **traces** for request-path debugging
- **logs** for event detail and irregular context

The mistake is forcing all detail into metrics.
If user IDs, order IDs, request IDs, or tenant IDs end up as metric tags, the system will eventually pay for that mistake.

> [!IMPORTANT]
> High-cardinality values belong in traces or logs far more often than they belong in metrics.

---

## What Cardinality Actually Means

A metric name is rarely the expensive part.
The expensive part is the number of unique label combinations it creates.

Examples:

- `http.server.requests{status="200", method="GET"}` is usually manageable
- `http.server.requests{userId="u-12345"}` is usually a bad idea
- `inventory.calls{tenantId="t-42", region="ap-south-1", sku="p-991"}` can explode very quickly

Each new unique label combination creates a new time series.
That is why observability design is partly a data-governance problem.

---

## A Safer Spring Instrumentation Shape

Micrometer makes it easy to define useful low-cardinality metrics:

```java
Counter orderFailures = Counter.builder("orders.failures")
        .tag("flow", "checkout")
        .tag("reason", "validation")
        .register(meterRegistry);

orderFailures.increment();
```

This is useful because:

- the metric is stable
- the tags are bounded
- the result is still searchable and cheap to aggregate

If the team needs request-specific details, that belongs in logs or spans, not additional metric tags.

---

## Where OpenTelemetry Fits

OpenTelemetry is often the better place for high-detail request context because trace attributes can carry richer information without turning every detail into a permanent metric time series.

```java
Span current = Span.current();
current.setAttribute("tenant.id", tenantId);
current.setAttribute("order.id", orderId);
current.setAttribute("flow", "checkout");
```

That kind of detail is extremely useful when debugging one bad request path.
It is usually much less useful as a metric dimension.

---

## The Governance Problem

Instrumentation quality in a large system usually fails in one of these ways:

- every team adds tags without a cardinality review
- dashboards depend on labels that should never have been metrics
- traces, logs, and metrics carry the same data redundantly
- nobody owns the question "how many time series did this release add"

That is why governance matters.
Observability should not be left to individual convenience alone.

---

## A Practical Rule Set

Good candidates for metric tags:

- outcome class
- HTTP method
- bounded region or environment labels
- fixed workflow names

Bad candidates for metric tags:

- request ID
- user ID
- order ID
- unbounded tenant or partner identifiers
- free-form exception messages

> [!NOTE]
> "We might want to filter by it someday" is not a good reason to put a value into metric labels.

---

## Failure Drill

A strong drill for this topic is instrumentation abuse:

1. add an unbounded tag such as `customerId` to a hot request metric
2. run a synthetic workload with many unique values
3. measure time-series growth, scrape cost, and dashboard behavior
4. remove the tag and reattach the same detail to traces or logs instead

This teaches the team the operational cost of bad metric design far faster than a style guide alone.

---

## Debug Steps

- review new metrics for bounded versus unbounded label space
- compare metric tags against trace attributes and remove duplication where possible
- inspect the highest-cardinality metrics regularly
- make cardinality review part of code review for instrumentation changes
- ensure sampling and export settings are aligned with incident-debugging needs

---

## Production Checklist

- metric tags are intentionally low-cardinality
- request-specific detail is pushed to traces or logs
- top time-series producers are visible to the team
- instrumentation changes are reviewed like schema changes
- dashboards depend on stable dimensions, not accidental ones

---

## Key Takeaways

- Micrometer and OpenTelemetry are powerful together when metrics stay bounded and traces carry the rich request detail.
- Cardinality is a cost and reliability concern, not only a dashboard concern.
- The best observability systems are designed, not just emitted.
- If a tag value can grow without bound, it probably does not belong on a metric.
