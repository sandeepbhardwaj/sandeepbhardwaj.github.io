---
categories:
- Java
- Design
- Architecture
date: 2026-10-03
seo_title: Refactoring anemic domain models into behavior-rich design - Advanced Guide
seo_description: Advanced practical guide on refactoring anemic domain models into
  behavior-rich design with architecture decisions, trade-offs, and production patterns.
tags:
- java
- lld
- oop
- architecture
- design
title: Refactoring anemic domain models into behavior-rich design
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
An anemic domain model is not "a class with fields."
It is a model where the rules that should protect the data live somewhere else, usually in a service layer that keeps growing because the domain object is allowed to say almost nothing.

That design feels tidy at first.
Then one business rule changes, and now every caller needs to remember it.
That is where the real cost appears.

## Quick Summary

| Signal | Likely healthy | Likely anemic |
| --- | --- | --- |
| Who enforces invariants? | the aggregate or domain object | service methods and controller checks |
| Can invalid state be created through setters? | rarely | often |
| Where does behavior live? | near the data it protects | spread across services, mappers, listeners |
| Do tests talk in domain actions? | usually | often test implementation flow instead |
| Refactor pressure | behavior changes are localized | every caller knows too much |

Part 1 is about the baseline move:
how do we pull important business behavior back into the model without turning the model into a god object?

## What "Anemic" Really Means

A model becomes anemic when the object is mostly a data bag while the real domain rules live elsewhere.

Example:

```java
public final class Order {
    private OrderStatus status;
    private Money total;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public Money getTotal() { return total; }
    public void setTotal(Money total) { this.total = total; }
}
```

Now the service carries all the meaning:

```java
public void approve(Order order) {
    if (order.getStatus() != OrderStatus.SUBMITTED) {
        throw new IllegalStateException("only submitted orders can be approved");
    }
    order.setStatus(OrderStatus.APPROVED);
}
```

One method like this is not a disaster.
Fifty of them across handlers, jobs, and listeners usually is.

## The Real Problem Is Invariant Leakage

The issue is not style purity.
The issue is that the business rule stops having one home.

Once invariants leak outward:

- multiple callers reimplement the same checks
- some paths forget a rule entirely
- setters allow illegal states in tests and utility code
- audits become harder because the domain transition is not explicit
- the object cannot protect itself

That is why "behavior-rich design" is really about invariant ownership.

## A Better Direction

Move behavior into the object that owns the state, especially when the behavior changes that state.

```java
public final class Order {
    private final OrderId id;
    private OrderStatus status;
    private Money authorizedAmount;

    public Order(OrderId id) {
        this.id = id;
        this.status = OrderStatus.DRAFT;
    }

    public void submit(Money requestedAmount) {
        if (status != OrderStatus.DRAFT) {
            throw new IllegalStateException("only draft orders can be submitted");
        }
        if (requestedAmount.isNegativeOrZero()) {
            throw new IllegalArgumentException("amount must be positive");
        }
        this.authorizedAmount = requestedAmount;
        this.status = OrderStatus.SUBMITTED;
    }

    public void approve() {
        if (status != OrderStatus.SUBMITTED) {
            throw new IllegalStateException("only submitted orders can be approved");
        }
        this.status = OrderStatus.APPROVED;
    }

    public void cancel() {
        if (status == OrderStatus.APPROVED) {
            throw new IllegalStateException("approved orders require reversal flow");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

Now the language of the model is clearer:

- `submit`
- `approve`
- `cancel`

Those are domain actions, not field mutations.

## What Should Stay Outside the Aggregate

Behavior-rich does not mean "put every line of business logic inside one entity."

Keep these outside when appropriate:

- cross-aggregate orchestration
- infrastructure access
- external gateway calls
- reporting queries
- workflow coordination spanning multiple domain objects

A good rule:
if the logic decides whether this object may change state, it probably belongs close to the object.
If the logic coordinates multiple systems or aggregates, it probably belongs in an application service.

## A Safe Refactoring Sequence

Teams often try to "DDD-ify" everything in one big move and make the code worse.
A more reliable sequence is:

1. identify one invariant that is currently duplicated
2. add a named domain method that owns that rule
3. remove public setters that bypass the rule
4. update callers to use the new method
5. repeat with the next most important transition

This works because the goal is not to make the model academically rich.
It is to reduce places where the same business decision can drift.

## When Not to Force Behavior Into the Model

Some data structures are fine as simple carriers:

- API response models
- persistence projections
- read-optimized DTOs
- integration payloads

Do not force rich behavior into every class just because it has fields.
The object should earn domain behavior by owning a real invariant.

If a class only exists to return query results, making it "smarter" often adds confusion instead of safety.

## Avoid the Opposite Mistake

There is also a bad overcorrection:
an aggregate that owns too much.

Warning signs:

- one entity knows policy for unrelated workflows
- object methods call three repositories and two gateways
- the aggregate becomes impossible to construct without half the application
- tests become integration-heavy just to validate one rule

That is not behavior-rich design.
That is service logic wearing an entity costume.

## A Practical Test

Open the current code and ask:

1. where is the rule "an order cannot be approved before submission" actually enforced?
2. how many places can mutate `status` directly?
3. can a unit test accidentally build an impossible object state?

If those answers are "multiple services," "many," and "yes," the refactor is justified.

The success condition is not "more methods on the entity."
It is "illegal state becomes harder to create."

## Refactoring Checklist

- one duplicated business rule is moved into a domain method
- public mutation points that bypass the rule are removed or narrowed
- application services coordinate, but do not own the aggregate invariant
- DTOs and projections stay simple when they should
- tests speak in domain actions instead of setter choreography
- impossible states are harder to construct accidentally

## Key Takeaways

- An anemic model becomes costly when the important invariants leak into services and callers.
- A better design moves state-changing business rules back to the object that owns the state.
- The goal is not maximum cleverness. The goal is fewer places where the domain can silently drift.
