---
categories:
- Java
- Design
- Architecture
date: 2026-10-02
seo_title: Composition over inheritance in extensible Java systems - Advanced Guide
seo_description: Advanced practical guide on composition over inheritance in extensible
  java systems with architecture decisions, trade-offs, and production patterns.
tags:
- java
- lld
- oop
- architecture
- design
title: Composition over inheritance in extensible Java systems
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
Inheritance is attractive because it looks like reuse.
The problem is that it also reuses assumptions: constructor rules, override hooks, lifecycle expectations, and sometimes the wrong invariants.

That is why "composition over inheritance" is not a slogan about elegance.
It is a boundary choice about where behavior is allowed to vary and where the core model must stay boringly stable.

## Quick Summary

| Design question | Composition is usually better | Inheritance is usually better |
| --- | --- | --- |
| Behavior changes by policy, region, tenant, or feature set | Yes | No |
| Multiple behaviors may be combined independently | Yes | No |
| Base type has one strong invariant and a true subtype relationship | Maybe | Yes |
| Teams keep adding boolean flags and protected hooks | Yes | No |
| The real goal is to share implementation for one closed hierarchy | Maybe | Yes |

Part 1 is about the baseline decision:
how do we keep variation flexible without turning the domain model into a fragile inheritance tree?

## The Core Smell

Inheritance starts causing damage when the team is no longer modeling "is-a."
It is modeling "works-like-this-for-now."

Typical warning signs:

- subclasses override half the parent behavior
- the parent exposes `protected` state just so children can survive
- adding one new variation changes the base class constructor
- tests for one subclass fail because another subclass changed a shared assumption
- the hierarchy grows around workflow differences, not true type differences

That last one matters most.
If the behavior changes because of pricing policy, delivery mode, compliance rule, or tenant contract, you usually want composition, not a class tree.

## Where Inheritance Still Makes Sense

This post is not anti-inheritance.
It is anti-accidental inheritance.

Use inheritance when all three are true:

1. the subtype relationship is real and stable
2. the parent owns an invariant every child must preserve
3. variation is mostly additive, not a rewrite of the parent lifecycle

Examples that can fit:

- a sealed hierarchy of domain outcomes
- UI component extension inside a framework that is explicitly designed for it
- a small internal hierarchy where the parent contract is tight and the child behavior is predictable

If the hierarchy is open-ended and business-driven, be much more careful.

## A Common Bad Design

Suppose an order pipeline starts simple:

```java
abstract class OrderProcessor {
    public final Receipt process(Order order) {
        validate(order);
        Money total = calculateTotal(order);
        persist(order, total);
        publish(order);
        return new Receipt(order.id(), total);
    }

    protected abstract void validate(Order order);
    protected abstract Money calculateTotal(Order order);

    protected void persist(Order order, Money total) { /* default */ }
    protected void publish(Order order) { /* default */ }
}
```

Then product asks for:

- B2B pricing
- region-specific tax rules
- delayed publishing for some channels
- tenant-specific validation

Now subclasses start overriding pieces of the lifecycle:

- `B2BOrderProcessor`
- `MarketplaceOrderProcessor`
- `EuOrderProcessor`
- `VipTenantOrderProcessor`

At this point, the hierarchy is encoding policy combinations.
That is exactly what inheritance is bad at.

## A Better Baseline: Stable Core Plus Composed Policies

Instead of subclassing the whole workflow, keep one processor with explicit collaborators.

```java
public interface ValidationPolicy {
    void validate(Order order);
}

public interface PricingPolicy {
    Money calculate(Order order);
}

public interface PublicationPolicy {
    void publish(Order order, Money total);
}

public final class OrderService {
    private final ValidationPolicy validationPolicy;
    private final PricingPolicy pricingPolicy;
    private final PublicationPolicy publicationPolicy;
    private final OrderRepository orderRepository;

    public OrderService(
            ValidationPolicy validationPolicy,
            PricingPolicy pricingPolicy,
            PublicationPolicy publicationPolicy,
            OrderRepository orderRepository) {
        this.validationPolicy = validationPolicy;
        this.pricingPolicy = pricingPolicy;
        this.publicationPolicy = publicationPolicy;
        this.orderRepository = orderRepository;
    }

    public Receipt process(Order order) {
        validationPolicy.validate(order);
        Money total = pricingPolicy.calculate(order);
        order.confirm(total);
        orderRepository.save(order);
        publicationPolicy.publish(order, total);
        return new Receipt(order.id(), total);
    }
}
```

This design does something important:
the workflow stays explicit, while the variation points become ordinary dependencies.

That makes change cheaper because:

- policies can evolve independently
- tests can focus on one variation at a time
- composition can happen at wiring time instead of inside subclass logic
- the aggregate can still own its invariants

## The Real Benefit: Change Moves to the Edges

Composition is not automatically cleaner because "interfaces are good."
It is cleaner when it moves unstable choices away from the core model.

For most business systems, unstable choices include:

- tax calculation
- discounting
- feature gates
- fraud checks
- delivery channel behavior
- tenant-specific rules

Those are rarely good candidates for a permanent class hierarchy.
They are policies.

Once you name them as policies, the model becomes easier to reason about.
The `Order` stays an `Order`.
The pricing rule stops pretending to be a subtype.

## Guardrails for Composition

Composition can also be overdone.
Not every two-line variation deserves three interfaces and a factory.

Use composition well by following a few rules:

### Keep the invariant owner obvious

If five collaborator objects can all mutate order state freely, you did not gain clarity.
You just hid coupling behind interfaces.

One object should still own the key state transition.

### Compose behavior, not everything

You do not need a `NameFormatter`, `SkuFormatter`, and `DisplayFormatter` hierarchy just because composition exists.
Extract what changes meaningfully, not what happens to be a method.

### Prefer constructor-visible dependencies

If behavior is injected through hidden service locators or mutable registries, the design becomes harder to test than the inheritance version.

### Keep policy boundaries domain-shaped

`PricingPolicy` is a better collaborator than `PricingHelper`.
The first describes a business role.
The second describes a code convenience.

## When Simpler Is Better

Sometimes the best answer is neither a hierarchy nor a policy graph.

A plain class with a few private methods is enough when:

- there is one behavior today
- variation is speculative
- the invariants are still being discovered
- the code is not yet under change pressure

Premature composition is just premature abstraction in a friendlier outfit.
If the domain has not earned the boundary yet, keep it simple and let tests show where variation really appears.

## A Practical Decision Rule

Before choosing inheritance, ask:

1. am I modeling a true subtype or just a behavioral option?
2. will these variations need to be combined independently later?
3. would a new variant force me to edit the parent lifecycle?

If the answers are "behavioral option," "yes," and "yes," composition is usually the safer default.

Before choosing composition, ask:

1. what invariant still has one clear owner?
2. which dependencies actually vary?
3. can a teammate understand the assembly without reading a DI container maze?

If not, the design may be abstract but still not good.

## Production Checklist

- the core invariant owner is explicit
- policies or strategies match real business variation
- adding a variant does not require parent-class surgery
- tests can isolate one behavior without mocking the world
- constructors reveal the important moving parts
- a plain class was rejected for a concrete reason, not fashion

## Key Takeaways

- Inheritance fails most often when it is used to model policy combinations instead of true subtype relationships.
- Composition works best when the core workflow stays stable and variation is pushed into explicit collaborators.
- The goal is not fewer classes or more classes. The goal is a model whose invariants survive change.
