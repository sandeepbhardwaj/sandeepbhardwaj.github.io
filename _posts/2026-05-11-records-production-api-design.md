---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-11
seo_title: "Java Records in Production API Design"
seo_description: "Use Java records for immutable contracts and cleaner backend API boundaries."
tags: [java, records, api-design, backend]
canonical_url: "https://sandeepbhardwaj.github.io/java/records-production-api-design/"
title: "Records in Production API Design — Java Guide"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Immutable Data Contracts with Minimal Boilerplate"
---

# Records in Production API Design — Java Guide

Java records are best used for immutable data contracts.
They reduce boilerplate and make API boundary models explicit, especially for request/response DTOs and event payloads.

---

## Where Records Work Best

- REST/gRPC request and response models
- event payloads published to Kafka or queues
- read-model projections from domain entities

Avoid records for persistence entities or aggregates that require lifecycle mutation and lazy loading.

---

## Example: Boundary DTO with Invariant Validation

```java
public record InvoiceSummary(String id, BigDecimal amount, String currency) {
    public InvoiceSummary {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("id is required");
        }
        if (amount == null || amount.signum() < 0) {
            throw new IllegalArgumentException("amount must be >= 0");
        }
        if (currency == null || currency.length() != 3) {
            throw new IllegalArgumentException("currency must be ISO-4217 code");
        }
    }
}
```

Compact constructors are the right place for simple structural invariants.

---

## Record + Jackson Integration

Records serialize cleanly with modern Jackson versions.
Use explicit property names when you need stable external contracts.

```java
public record CreateOrderRequest(
    @JsonProperty("customer_id") String customerId,
    @JsonProperty("items") List<OrderItem> items
) {
    public CreateOrderRequest {
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("customer_id is required");
        }
        items = List.copyOf(items == null ? List.of() : items);
        if (items.isEmpty()) {
            throw new IllegalArgumentException("items cannot be empty");
        }
    }
}
```

---

## Versioning Strategy

Field changes in records are API changes.
Treat them as contract evolution, not simple refactors.

- adding optional field: usually backward compatible for consumers
- renaming/removing field: breaking change, requires version bump
- changing semantics of existing field: breaking from business perspective even if type stays same

Use `v1`, `v2` DTO packages or endpoint versioning for breaking updates.

---

## Dry Run: Mutable DTO to Record Migration

Current state:

- mutable `OrderResponse` POJO used by controllers and tests

Migration steps:

1. introduce new record `OrderResponseV2` with same JSON shape.
2. add mapper from domain entity -> `OrderResponseV2`.
3. update controller return type to record.
4. run contract tests against golden JSON snapshots.
5. remove old mutable DTO after one release cycle.

Result:

- no accidental setter-based mutation in controller/service layers
- simpler equality semantics for tests (`equals/hashCode` generated)

---

## Common Mistakes

- putting business workflow logic inside record methods
- using records as JPA entities
- silently changing record component names and breaking wire contracts
- exposing internal domain objects directly as API records without anti-corruption mapping

---

## Key Takeaways

- records are excellent for immutable API and messaging contracts.
- validate structural invariants in compact constructors.
- treat record component changes as versioned contract changes.
