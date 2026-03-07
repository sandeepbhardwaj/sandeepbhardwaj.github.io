---
title: Choosing and Combining Design Patterns in Java
date: 2025-12-18
categories:
- Java
- Design Patterns
tags:
- java
- java8
- design-patterns
- architecture
- software-design
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Choosing and Combining Design Patterns in Java
seo_description: Learn how to choose and combine design patterns in Java 8+ with a practical checkout system example and trade-off matrix.
header:
  overlay_image: "/assets/images/java-design-patterns-series-banner.svg"
  overlay_filter: 0.35
  caption: Java Design Patterns Series
  show_overlay_excerpt: false
---
The hardest part of design patterns is not implementation.
It is choosing the right pattern and stopping before abstraction becomes ceremony.

This final post ties the series together around one practical question:

**How do patterns combine inside a real Java application?**

---

## Checkout System Example

A practical checkout flow might use:

- `Facade` for the application entry point
- `Strategy` for discount calculation
- `Adapter` for payment providers
- `Observer` for post-order notifications
- `Chain of Responsibility` for request validation
- `Builder` for assembling the final response object

---

## Combination Diagram

```mermaid
flowchart LR
    A[Checkout API] --> B[Validation Chain]
    B --> C[Checkout Facade]
    C --> D[Discount Strategy]
    C --> E[Payment Adapter]
    C --> F[Response Builder]
    C --> G[Order Event Publisher]
    G --> H[Email Observer]
    G --> I[Inventory Observer]
    G --> J[Loyalty Observer]
```

---

## Implementation Walkthrough

```java
public final class CheckoutApplicationService {
    private final ValidationHandler validationHandler;
    private final CheckoutFacade checkoutFacade;

    public CheckoutApplicationService(ValidationHandler validationHandler,
                                      CheckoutFacade checkoutFacade) {
        this.validationHandler = validationHandler;
        this.checkoutFacade = checkoutFacade;
    }

    public CheckoutResult submit(OrderRequest request) {
        validationHandler.handle(request);
        return checkoutFacade.checkout(request.toCommand());
    }
}
```

Notice what each pattern is doing:

- the chain rejects invalid requests early
- the facade simplifies subsystem coordination
- strategies and adapters hide policy and integration variation
- observers decouple side effects

This is the correct way to think about patterns: as focused tools that solve different design pressures in one coherent flow.

The most important discipline is keeping those pattern roles separate.
If the facade starts implementing discount policy, or the adapter starts making validation decisions, the patterns stop clarifying the design and start competing with each other.

---

## Selection Heuristic

Use this matrix:

1. if creation varies, look at creational patterns
2. if integration or wrapping varies, look at structural patterns
3. if runtime algorithm choice or lifecycle behavior varies, look at behavioral patterns
4. if a plain refactor solves the problem, skip the pattern

---

## Final Rule

Do not ask, “Which pattern can I apply here?”
Ask, “What kind of change is making this code difficult to evolve?”

Once that is clear, the right pattern is usually obvious.
