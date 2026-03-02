---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-12
seo_title: "Sealed Classes for Domain Modeling in Java"
seo_description: "Model closed domain hierarchies safely using sealed classes in Java."
tags: [java, sealed-classes, domain-modeling, oop]
canonical_url: "https://sandeepbhardwaj.github.io/java/sealed-classes-domain-modeling/"
title: "Sealed Classes for Domain Modeling in Java"
toc: true
toc_icon: cog
toc_label: "In This Article"
header:
  overlay_image: /assets/images/java-advanced-generic-banner.svg
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: "Closed Type Hierarchies for Domain Safety"
---

# Sealed Classes for Domain Modeling in Java

Sealed classes let you model closed sets of domain states explicitly.
This improves compile-time safety and branch exhaustiveness.

---

## Domain Modeling Benefits

- prevent unintended subtype extension
- encode business state machine boundaries
- simplify exhaustive pattern handling

---

## Example

```java
public sealed interface SettlementState permits Pending, Settled, Failed {}

public record Pending(Instant createdAt) implements SettlementState {}
public record Settled(String txId, Instant settledAt) implements SettlementState {}
public record Failed(String reason) implements SettlementState {}
```

---

## Why It Helps in Production

- illegal states become unrepresentable.
- refactors surface missing branches at compile time.
- API consumers gain clearer contract about possible outcomes.

---

## Integration Pattern

Use sealed hierarchy at service boundary and map to wire DTOs explicitly.
Do not leak internal type details across external contracts unless versioned carefully.

---

## Key Takeaways

- sealed hierarchies improve domain safety and maintainability.
- they pair well with records and pattern matching.
- use them to encode constrained business outcomes explicitly.
