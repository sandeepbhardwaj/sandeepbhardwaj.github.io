---
author_profile: true
categories:
- Java
- Backend
date: 2026-05-12
seo_title: Sealed Classes for Domain Modeling in Java
seo_description: Model closed domain hierarchies safely using sealed classes in Java.
tags:
- java
- sealed-classes
- domain-modeling
- oop
title: Sealed Classes for Domain Modeling in Java
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Closed Type Hierarchies for Domain Safety
---
Sealed classes are ideal when your domain has a closed set of valid states.
They make invalid extension impossible and force exhaustive handling at compile time.

---

## Why Sealed Types Fit Domain Modeling

- business states are often finite (`Pending`, `Approved`, `Rejected`)
- extension should be controlled by domain owners
- decision logic should fail compilation when a new state is added but not handled

This gives stronger guarantees than open inheritance.

---

## Example: Payment State Model

```java
public sealed interface PaymentState permits PaymentState.Pending, PaymentState.Authorized,
        PaymentState.Captured, PaymentState.Failed {

    record Pending(Instant createdAt) implements PaymentState {}
    record Authorized(String authId, Instant authorizedAt) implements PaymentState {}
    record Captured(String captureId, Instant capturedAt) implements PaymentState {}
    record Failed(String code, String reason) implements PaymentState {}
}
```

A service can now only work with known, approved states.

---

## Transition Rules as Code

Model transitions explicitly to avoid hidden state changes.

```java
public final class PaymentTransitions {

    public PaymentState authorize(PaymentState state, String authId, Instant now) {
        return switch (state) {
            case PaymentState.Pending ignored -> new PaymentState.Authorized(authId, now);
            case PaymentState.Authorized s -> s; // idempotent retry
            case PaymentState.Captured s -> throw new IllegalStateException("Already captured: " + s.captureId());
            case PaymentState.Failed s -> throw new IllegalStateException("Cannot authorize failed payment: " + s.code());
        };
    }

    public PaymentState capture(PaymentState state, String captureId, Instant now) {
        return switch (state) {
            case PaymentState.Authorized ignored -> new PaymentState.Captured(captureId, now);
            case PaymentState.Captured s -> s; // idempotent retry
            case PaymentState.Pending s -> throw new IllegalStateException("Authorize before capture: " + s.createdAt());
            case PaymentState.Failed s -> throw new IllegalStateException("Cannot capture failed payment: " + s.code());
        };
    }
}
```

If you add `Refunded`, compiler forces these switches to be revisited.

---

## Integration Pattern: Domain vs API Contract

Do not expose sealed internal types directly as external API payloads by default.
Map domain model to stable wire DTOs.

- internal sealed hierarchy can evolve with domain constraints
- external DTO versions can evolve with compatibility guarantees

This separation avoids breaking public clients when domain internals change.

---

## Dry Run: Adding New State Safely

Requirement: add `Chargeback` state.

1. add `Chargeback` to `permits` list.
2. compile project.
3. every non-exhaustive `switch` now fails at compile time.
4. update transition methods and business handlers.
5. add tests for legal and illegal transitions.

Outcome: missed logic is caught before runtime.

---

## Common Mistakes

- creating "catch-all" default branches that hide missing state handling
- mixing persistence entity concerns with sealed domain hierarchy
- allowing state mutation through setters instead of transition functions
- exposing sealed state classes directly in public API without versioning policy

---

## Key Takeaways

- sealed classes are powerful for closed, business-critical state models.
- compile-time exhaustiveness makes refactors safer.
- combine sealed states with explicit transition methods for predictable domain behavior.

---

            ## Problem 1: Make Sealed Classes for Domain Modeling in Java Operationally Explainable

            Problem description:
            Backend topics sound straightforward until the runtime boundary becomes fuzzy. Teams usually know the API surface, but they often skip the part where ownership, rollback, and the main production signal are written down explicitly.

            What we are solving actually:
            We are turning sealed classes for domain modeling in java into an engineering choice with a clear boundary, one measurable success signal, and one failure mode the team is ready to debug.

            What we are doing actually:

            1. define where this technique starts and where another subsystem takes over
            2. attach one metric or invariant that proves the design is helping
            3. rehearse one failure or rollout scenario before scaling the pattern
            4. keep the implementation small enough that operators can still explain it during an incident

            ```mermaid
flowchart TD
    A[Request or event] --> B[Core boundary]
    B --> C[Resource or dependency]
    C --> D[Observability and rollback]
```

            ## Debug Steps

            Debug steps:

            - identify the first metric that should move when the design works
            - record the rollback trigger before production rollout
            - keep dependency boundaries and timeouts explicit in code and docs
            - prefer one clear safety rule over several implicit assumptions
