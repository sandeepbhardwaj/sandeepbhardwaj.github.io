---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-11
seo_title: Java Records in Production API Design
seo_description: Use Java records for immutable contracts and cleaner backend API
  boundaries.
tags:
- java
- records
- api-design
- backend
title: Records in Production API Design — Java Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Immutable Data Contracts with Minimal Boilerplate
---
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

---

        ## Problem 1: Use Records at Boundaries Where Immutability Is an Asset

        Problem description:
        Teams often replace every DTO and domain type with records without deciding where immutable value semantics help and where lifecycle-heavy entities still need behavior.

        What we are solving actually:
        We are placing records where they strengthen API clarity, equality, and serialization contracts. The goal is not to turn every object into a record; it is to make boundary data explicit and stable.

        What we are doing actually:

        1. use records for request, response, and event payloads with clear value semantics
2. validate invariants in the compact constructor so invalid data cannot exist
3. keep mutation-heavy aggregates as regular classes with behavior
4. treat record evolution as contract evolution and version it carefully

        ```mermaid
flowchart LR
    A[HTTP / Messaging boundary] --> B[Record input]
    B --> C[Validation]
    C --> D[Domain service]
```

        This section is worth making concrete because architecture advice around records production api design often stays too abstract.
        In real services, the improvement only counts when the team can point to one measured risk that became easier to reason about after the change.

        ## Production Example

        ```java
        public record CreateCustomerRequest(String email, String country) {
    public CreateCustomerRequest {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email is required");
        }
        if (country == null || country.isBlank()) {
            throw new IllegalArgumentException("country is required");
        }
    }
}
        ```

        The code above is intentionally small.
        The important part is not the syntax itself; it is the boundary it makes explicit so code review and incident review get easier.

        ## Failure Drill

        Try to evolve a record used in public APIs by renaming or reordering components. You will immediately see why records work best where versioning and migration rules are already explicit.

        ## Debug Steps

        Debug steps:

        - review serialization compatibility before changing record components
- keep domain rules close to the constructor instead of scattered setters
- avoid hiding behavior-heavy aggregates behind records just to look modern
- test equality and JSON mapping when records cross service boundaries

        ## Review Checklist

        - Use records for value carriers, not long-lived mutable entities.
- Keep constructors small and invariant-focused.
- Document compatibility expectations for public record types.
