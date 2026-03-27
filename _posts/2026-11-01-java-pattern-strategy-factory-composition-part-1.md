---
categories:
- Java
- Design Patterns
- Architecture
date: 2026-11-01
seo_title: Strategy + factory composition for runtime pluggable behavior - Advanced
  Guide
seo_description: Advanced practical guide on strategy + factory composition for runtime
  pluggable behavior with architecture decisions, trade-offs, and production patterns.
tags:
- java
- design-patterns
- architecture
- backend
- software-design
title: Strategy + factory composition for runtime pluggable behavior
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced Design Patterns with Java
---
Strategy plus factory is one of the most overused combinations in Java codebases.
Teams reach for it when they want "clean extensibility," but the real question is more specific:
do we have multiple valid behaviors, and is selecting the right one a stable responsibility that deserves its own boundary?

When the answer is yes, this pair works well.
When the answer is vague, the result is often a registry of tiny classes plus a factory that mostly moves `if` statements around.

## Quick Summary

| Question | Strong fit | Weak fit |
| --- | --- | --- |
| Do you have several interchangeable algorithms or policies? | yes | no, there is one dominant path |
| Is runtime selection a real responsibility? | yes | no, selection is trivial and local |
| Will new variants arrive over time? | yes | rarely |
| Can callers depend on one stable interface? | yes | no, each variant changes the contract |

Strategy handles the behavior swap.
Factory handles the selection and assembly.
The pair is useful only when both responsibilities are genuinely present.

## Where This Pattern Actually Helps

A good example is payment pricing or shipping policy selection.
Suppose the system must choose behavior based on:

- tenant plan
- market
- fulfillment mode
- experiment flag

The application should not have this logic scattered across controllers and services.
It should ask for one policy object that already represents the chosen behavior.

That is the moment Strategy plus Factory starts paying rent.

## A Concrete Example: Shipping Cost Policies

```java
public interface ShippingCostStrategy {
    Money calculate(Shipment shipment);
}

public final class FlatRateShipping implements ShippingCostStrategy {
    @Override
    public Money calculate(Shipment shipment) {
        return Money.of(499);
    }
}

public final class DistanceBasedShipping implements ShippingCostStrategy {
    @Override
    public Money calculate(Shipment shipment) {
        long cents = 299 + shipment.distanceKm() * 12L;
        return Money.of(cents);
    }
}

public final class ShippingStrategyFactory {
    public ShippingCostStrategy resolve(TenantContext tenant, Shipment shipment) {
        if (tenant.isEnterprise() && shipment.isLocal()) {
            return new FlatRateShipping();
        }
        return new DistanceBasedShipping();
    }
}
```

The important design choice is not "we used a pattern."
It is that strategy selection now has one visible home.

## Why This Can Be Better Than One Big `switch`

The improvement is not automatic.
It appears when the following are true:

- each strategy has meaningful logic of its own
- the selection rules deserve tests
- different teams or product changes add new variants over time
- callers should not know how the variant was chosen

In that situation, one giant `switch` often becomes a pressure sink for unrelated concerns.
The factory gives the selection logic a boundary, and the strategies keep the behavior modular.

## The Biggest Failure Mode

Many teams split the code into strategies too early.

Warning signs:

- each strategy is 5 lines long and barely differs
- the factory still needs huge nested conditionals
- strategies keep reaching back into shared mutable services
- every new variant requires touching half the existing strategies anyway

That is not pluggability.
That is ceremony.

> [!warning]
> If the selection logic is still the hardest part to understand after introducing Strategy plus Factory, the abstraction may have moved complexity instead of reducing it.

## Composition Boundaries Matter

The factory should usually own:

- variant selection
- dependency wiring for the chosen strategy
- default or fallback strategy choice

The strategy should usually own:

- the actual behavior for one policy or algorithm
- only the dependencies needed to execute that behavior

If strategies start selecting other strategies on the fly, the boundary is getting muddy.

## Better Alternatives Sometimes Exist

### Plain methods

Use a simple `switch` or map lookup when there are only a few stable variants and no real extension pressure.

### Enum plus behavior map

Useful when the variant set is closed and easy to enumerate.

### Rules engine or configuration table

Better when non-developers change the selection logic frequently or the matrix of conditions is highly dynamic.

Strategy plus Factory is strongest when the behavior implementations are code-owned and selection is meaningful, but still understandable.

## Testing Strategy

Test it in two layers:

1. each strategy's behavior
2. the factory's selection rules

That means questions like:

- does enterprise local shipping resolve to the correct strategy?
- does distance-based pricing calculate correctly at boundary distances?
- does adding a new strategy avoid changing unrelated callers?

If the only tests are end-to-end, you have probably hidden too much inside the composition layer.

## A Practical Decision Rule

Use Strategy plus Factory when all of these are true:

1. the caller should depend on one stable behavior interface
2. runtime selection rules are real and worth isolating
3. each variant has enough logic to deserve its own implementation

Skip it when one method can still tell the truth more clearly.

## Key Takeaways

- Strategy solves interchangeable behavior. Factory solves choosing and wiring it.
- The pair is useful only when both responsibilities are real.
- Good implementations make selection visible and keep variant logic local.
- Bad implementations create many classes without reducing decision complexity.
