---
title: "Java 8 Collectors — groupingBy, partitioningBy, and Custom Collectors"
date: 2026-03-02
categories: [Java]
tags: [java, java8, streams, collectors, backend, aggregation]
author_profile: true
toc: true
toc_label: "In This Article"
toc_icon: "cog"
seo_title: "Java 8 Collectors Deep Dive (groupingBy, partitioningBy, reducing)"
seo_description: "Master Java 8 Collectors with practical backend aggregation examples, custom collectors, performance notes, and best practices."
header:
  overlay_image: /assets/images/java8-collectors-deep-dive-banner.svg
  overlay_filter: 0.4
  caption: "Modern Backend Development with Java 8"
  show_overlay_excerpt: false
canonical_url: "https://sandeepbhardwaj.github.io/java/java-8-collectors-deep-dive/"
---

# Introduction

Collectors are the aggregation engine of the Stream API.
In backend code, they are used for:

- grouping records
- computing totals and counts
- converting lists to maps
- building API response structures

---

# groupingBy and Downstream Collectors

Group orders by category:

```java
Map<String, List<Order>> byCategory = orders.stream()
        .collect(Collectors.groupingBy(Order::getCategory));
```

Revenue by category:

```java
Map<String, BigDecimal> revenueByCategory = orders.stream()
        .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
        .collect(Collectors.groupingBy(
                Order::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Order::getAmount, BigDecimal::add)
        ));
```

For double-based amounts:

```java
Map<String, Double> revenueByCategory = orders.stream()
        .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
        .collect(Collectors.groupingBy(
                Order::getCategory,
                Collectors.summingDouble(Order::getAmountDouble)
        ));
```

---

# partitioningBy

`partitioningBy` creates exactly two buckets.

```java
Map<Boolean, List<Order>> fraudBuckets = orders.stream()
        .collect(Collectors.partitioningBy(Order::isFraudulent));
```

Great for valid/invalid, active/inactive, paid/unpaid style use cases.

---

# toMap: Handle Duplicate Keys Explicitly

A common production bug is forgetting duplicate key handling.

Bad (throws `IllegalStateException` on duplicate key):

```java
Map<String, User> byEmail = users.stream()
        .collect(Collectors.toMap(User::getEmail, Function.identity()));
```

Good:

```java
Map<String, User> byEmail = users.stream()
        .collect(Collectors.toMap(
                User::getEmail,
                Function.identity(),
                (existing, incoming) -> existing
        ));
```

Always define merge strategy when keys can collide.

---

# Multi-Level Grouping

Revenue by city -> category:

```java
Map<String, Map<String, Double>> revenue = orders.stream()
        .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
        .collect(Collectors.groupingBy(
                Order::getCity,
                Collectors.groupingBy(
                        Order::getCategory,
                        Collectors.summingDouble(Order::getAmountDouble)
                )
        ));
```

This is where stream collectors significantly outperform manual loop readability.

---

# Real API Example: Dashboard Summary DTO

```java
public class SalesSummary {
    private final Map<String, Double> revenueByCategory;
    private final long completedCount;
    private final long fraudCount;

    public SalesSummary(Map<String, Double> revenueByCategory, long completedCount, long fraudCount) {
        this.revenueByCategory = revenueByCategory;
        this.completedCount = completedCount;
        this.fraudCount = fraudCount;
    }
}

Map<String, Double> revenueByCategory = orders.stream()
        .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
        .collect(Collectors.groupingBy(Order::getCategory, Collectors.summingDouble(Order::getAmountDouble)));

long completedCount = orders.stream().filter(o -> o.getStatus() == OrderStatus.COMPLETED).count();
long fraudCount = orders.stream().filter(Order::isFraudulent).count();

SalesSummary dto = new SalesSummary(revenueByCategory, completedCount, fraudCount);
```

---

# Custom Collector Example (Top N)

```java
public static Collector<Order, ?, List<Order>> topNByAmount(int n) {
    return Collector.of(
            () -> new PriorityQueue<Order>(Comparator.comparingDouble(Order::getAmountDouble)),
            (pq, order) -> {
                pq.offer(order);
                if (pq.size() > n) pq.poll();
            },
            (left, right) -> {
                right.forEach(o -> {
                    left.offer(o);
                    if (left.size() > n) left.poll();
                });
                return left;
            },
            pq -> {
                List<Order> result = new ArrayList<>(pq);
                result.sort(Comparator.comparingDouble(Order::getAmountDouble).reversed());
                return result;
            }
    );
}
```

Use custom collectors only when built-ins cannot express your result shape clearly.

---

# Performance and Readability Rules

- use built-in collectors first
- avoid very deep nested collector trees in one expression
- extract complex downstream collectors to helper methods
- for money, prefer `BigDecimal`
- benchmark before parallel collection

---

# Related Posts

- [Stream API Deep Dive](/java/java-8-stream-api-deep-dive/)
- [Optional Best Practices](/java/java-8-optional-best-practices/)
- [Parallel Streams Performance](/java/java-8-parallel-streams-performance/)
