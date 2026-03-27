---
title: API-first LLD with strict validation and versioning boundaries
date: 2026-10-07
categories:
- Java
- Design
- Architecture
tags:
- java
- lld
- oop
- architecture
- design
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: API-first LLD with strict validation and versioning boundaries - Advanced
  Guide
seo_description: Advanced practical guide on api-first lld with strict validation
  and versioning boundaries with architecture decisions, trade-offs, and production
  patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
API-first design is valuable because clients do not care how elegant the inside of the service is.
They care whether the contract is predictable, validation is clear, and version changes do not break them unexpectedly.

That is why API-first LLD is not just about OpenAPI documents or controller annotations.
It is about deciding where request validation ends, where domain invariants begin, and how versioning stops at the edge instead of infecting the whole model.

## Quick Summary

| Concern | Good boundary | Bad boundary |
| --- | --- | --- |
| request validation | API layer or request mapper | spread across controllers, services, and entities |
| domain invariant | aggregate or domain method | DTO annotations pretending to be business safety |
| versioning | edge translation layer | `V1`, `V2`, `V3` types everywhere |
| client contract evolution | explicit compatibility rules | accidental breakage through internal refactors |

Part 1 is about the baseline move:
keep the external contract explicit and narrow, then translate it into a stable domain command model.

## API-First Does Not Mean DTO-First Everywhere

The first trap is letting external request models become the internal domain language.

That usually creates these problems:

- version suffixes leak into services
- domain rules are duplicated in request validators
- internal code starts depending on field names chosen for backward compatibility
- every API change forces domain churn

The healthier rule is:
design the API intentionally, then translate it once.

## A Practical Example

Suppose the public API creates subscriptions.
Version 2 adds an optional billing cycle and a stricter email rule.

At the edge:

```java
public record CreateSubscriptionRequestV2(
        String customerId,
        String planCode,
        String email,
        String billingCycle
) {}
```

Inside the system:

```java
public record CreateSubscriptionCommand(
        CustomerId customerId,
        PlanCode planCode,
        EmailAddress emailAddress,
        BillingCycle billingCycle
) {}
```

And the translator owns the boundary:

```java
public final class SubscriptionRequestMapper {
    public CreateSubscriptionCommand toCommand(CreateSubscriptionRequestV2 request) {
        if (request.customerId() == null || request.customerId().isBlank()) {
            throw new IllegalArgumentException("customerId is required");
        }
        if (request.planCode() == null || request.planCode().isBlank()) {
            throw new IllegalArgumentException("planCode is required");
        }
        if (request.email() == null || !request.email().contains("@")) {
            throw new IllegalArgumentException("valid email is required");
        }

        BillingCycle cycle = request.billingCycle() == null
                ? BillingCycle.MONTHLY
                : BillingCycle.valueOf(request.billingCycle().toUpperCase());

        return new CreateSubscriptionCommand(
                new CustomerId(request.customerId()),
                new PlanCode(request.planCode()),
                new EmailAddress(request.email()),
                cycle
        );
    }
}
```

This gives the API layer a real job:
guard the wire contract and translate it into domain language.

## Validation Has Two Homes, Not One

Good systems usually validate in two places:

### Edge validation

Used for:

- required fields
- format checks
- parseability
- API compatibility rules

### Domain validation

Used for:

- state transition legality
- cross-field business rules
- aggregate invariants
- policy decisions

Confusing these layers creates fragile designs.
If the request DTO is the only place a rule exists, internal callers can bypass it.
If the aggregate is expected to parse raw wire formats, the domain becomes polluted with transport concerns.

## Versioning Should Stop at the Boundary

One of the healthiest API-first moves is to refuse to let versioning spread inward.

Bad sign:

- `CreateSubscriptionV2Service`
- `CreateSubscriptionV2Validator`
- `SubscriptionV2Entity`

Better shape:

- `CreateSubscriptionRequestV2`
- `SubscriptionRequestMapper`
- stable internal command and aggregate model

This keeps the compatibility burden where it belongs:
at the system edge.

## Common Design Mistakes

### Entities depend on request models

Now the domain changes whenever the wire contract changes.

### Validation annotations are treated as full business safety

`@NotBlank` is useful, but it is not a replacement for "customer cannot change billing cycle while suspended."

### Versioning logic leaks across the codebase

That usually means there is no proper translation boundary.

### Controllers become orchestration centers

If the controller parses, validates, translates, applies business policy, and formats errors, the LLD is already overloaded at the edge.

## Testing Strategy

Test API-first design in layers:

1. request validation tests
2. request-to-command mapping tests
3. domain invariant tests
4. compatibility tests between versions

Useful scenarios:

- v2 request with missing email fails at the edge
- absent billing cycle maps to a default
- invalid plan is rejected by the domain, not only the DTO layer
- adding a new optional API field does not break internal command handling

These tests are powerful because they confirm boundary placement, not just happy-path behavior.

## When Simpler Design Is Better

If the service is internal-only, short-lived, and unlikely to need version evolution, a lighter boundary may be fine.
Not every small endpoint needs a large translation layer.

But the moment the API becomes:

- public
- shared by multiple clients
- backward-compatibility sensitive
- likely to evolve independently from domain rules

the translation boundary becomes worth the cost quickly.

## Key Takeaways

- API-first LLD is about preserving a clean contract boundary, not just documenting endpoints.
- Edge validation and domain invariants are different responsibilities and should stay separate.
- Versioning should stop at request mapping boundaries instead of spreading across the domain.
- A stable internal command model usually survives API evolution better than DTO-driven design.
