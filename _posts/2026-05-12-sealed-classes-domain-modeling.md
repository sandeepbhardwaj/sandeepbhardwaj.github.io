---
title: Sealed Classes for Domain Modeling in Java
date: 2026-05-12
categories:
- Java
- Backend
tags:
- java
- sealed-classes
- domain-modeling
- oop
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Sealed Classes for Domain Modeling in Java
seo_description: Model closed domain hierarchies safely using sealed classes in Java.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Closed Type Hierarchies for Domain Safety
---
Sealed classes are most useful when the domain genuinely has a closed set of valid variants and you want the compiler to enforce that assumption everywhere the model is handled.

That makes them a strong fit for business state, domain outcomes, policy decisions, and other places where "someone can add a subtype later" is not a feature. It is a risk.

---

## Why Sealed Types Help Domain Models

Many business concepts are finite even when the code around them keeps expanding:

- a payment is `Pending`, `Authorized`, `Captured`, or `Failed`
- an onboarding review is `Approved`, `Rejected`, or `NeedsManualReview`
- an order fulfillment step is one of a known set of workflow states

When the set is closed, the model should say so.

That gives you two big benefits:

- invalid extension becomes impossible outside the permitted set
- decision logic becomes exhaustiveness-checked instead of convention-based

---

## A Good Example: Payment State

```java
public sealed interface PaymentState
        permits PaymentState.Pending,
                PaymentState.Authorized,
                PaymentState.Captured,
                PaymentState.Failed {

    record Pending(Instant createdAt) implements PaymentState {}
    record Authorized(String authId, Instant authorizedAt) implements PaymentState {}
    record Captured(String captureId, Instant capturedAt) implements PaymentState {}
    record Failed(String code, String reason) implements PaymentState {}
}
```

This is not just cleaner syntax. It expresses an important business claim: only these states are valid.

That is stronger than relying on comments, enum-plus-fields combinations, or open inheritance that anyone can extend later.

---

## Sealed Types Become More Valuable With Explicit Transitions

The model becomes much stronger when transitions are written as code instead of being scattered across services.

```java
public final class PaymentTransitions {

    public PaymentState authorize(PaymentState state, String authId, Instant now) {
        return switch (state) {
            case PaymentState.Pending ignored -> new PaymentState.Authorized(authId, now);
            case PaymentState.Authorized s -> s;
            case PaymentState.Captured s ->
                    throw new IllegalStateException("Already captured: " + s.captureId());
            case PaymentState.Failed s ->
                    throw new IllegalStateException("Cannot authorize failed payment: " + s.code());
        };
    }

    public PaymentState capture(PaymentState state, String captureId, Instant now) {
        return switch (state) {
            case PaymentState.Authorized ignored -> new PaymentState.Captured(captureId, now);
            case PaymentState.Captured s -> s;
            case PaymentState.Pending s ->
                    throw new IllegalStateException("Authorize before capture: " + s.createdAt());
            case PaymentState.Failed s ->
                    throw new IllegalStateException("Cannot capture failed payment: " + s.code());
        };
    }
}
```

Now if a new state such as `Chargeback` is introduced, the compiler immediately points to the places where the business logic must be revisited.

---

## This Is Better Than a "Status" Enum When State Carries Data

A plain enum is still useful when state names are enough.

Sealed hierarchies become more compelling when each state carries different data:

- `Authorized` needs an authorization ID and timestamp
- `Failed` needs a reason and code
- `Captured` needs capture metadata

That lets the model keep state-specific data and state-specific handling together without falling back to nullable fields or sprawling "status + extras" objects.

---

## Do Not Expose Internal Sealed Types as Public API by Default

One of the easiest mistakes is to let a neat internal domain model leak directly into external contracts.

Usually, a better split is:

- sealed hierarchy for internal domain safety
- stable DTOs for HTTP or messaging boundaries

That gives you room to evolve internal state modeling without turning every domain refinement into a public compatibility event.

> [!TIP]
> Sealed classes are strongest when they protect the domain from invalid internal states. Public API versioning is a separate concern and should stay explicit.

---

## Avoid the `default` Escape Hatch

If the hierarchy is sealed, a broad `default` branch usually weakens the model.

Why?

Because it hides the exact kind of drift sealed types are meant to catch:

- a new state gets added
- one important switch is not revisited
- the compiler would have helped, but `default` swallowed the warning

When the domain is closed, let the code say that directly.

---

## A Safe Change Scenario

Suppose the payment workflow adds `Chargeback`.

The best part of a sealed model is not that adding the type is easy. It is that incomplete handling becomes visible immediately:

1. add the new permitted subtype
2. compile
3. update every transition and policy switch the compiler flags
4. add tests for legal and illegal transitions

That turns "hope we updated all the branches" into a guided refactor.

---

## When Sealed Types Are the Wrong Abstraction

Avoid them when:

- the subtype space is intentionally open for extension
- behavior matters more than state shape
- persistence constraints dominate the model
- the hierarchy is being used only for framework cleverness

If the domain is not actually closed, forcing it into a sealed hierarchy creates friction rather than safety.

---

## Key Takeaways

- Sealed classes are a strong fit for closed business concepts with finite valid variants.
- They become especially useful when paired with explicit transition logic.
- They are better than enums when each state carries different data and behavior rules.
- Keep internal sealed models separate from public contracts unless the external boundary is also intentionally closed.
