---
title: Immutability and concurrency-safe object modeling (Part 2)
date: 2026-10-16
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
seo_title: Immutability and concurrency-safe object modeling (Part 2) - Advanced Guide
seo_description: Advanced practical guide on immutability and concurrency-safe object
  modeling (part 2) with architecture decisions, trade-offs, and production patterns.
header:
  overlay_image: "/assets/images/java-advanced-generic-banner.svg"
  overlay_filter: 0.35
  show_overlay_excerpt: false
  caption: Advanced LLD and OOP Design in Java
---
Part 1 established the baseline idea:
immutability is often the cleanest way to make object behavior easier to reason about under concurrency.

Part 2 is where teams usually get into trouble.
They accept the idea in principle, then quietly reintroduce races through mutable collections, unsafe publication, cache-backed fields, or "just this one setter during bootstrap."

The real design question is not "should we like immutable objects?"
It is "where does mutation live, and how do we stop it from leaking across thread boundaries?"

## Quick Summary

| Pressure | Good direction | Common mistake |
| --- | --- | --- |
| read-heavy shared state | immutable snapshots | synchronized mutable maps everywhere |
| configuration refresh | rebuild a new object graph, then swap atomically | mutate fields in place |
| collections in domain objects | defensive copy on input and output | exposing live lists or maps |
| lazy derived values | compute once safely or precompute | unsafely memoizing without publication discipline |

The most useful mental model is:
keep a small mutable shell around an immutable core, not a big mutable object that hopes callers behave.

## Where Immutability Starts Paying Rent

Immutability matters most when an object crosses one of these boundaries:

- between threads
- between asynchronous stages
- into a cache
- into long-lived shared application state

Inside one short-lived request path, mutable objects can be fine.
The trouble begins when the same object instance becomes shared state.

That is why immutable models are so effective for:

- pricing rules
- feature configuration
- policy objects
- read models
- command objects

They give readers one stable picture instead of a moving target.

## The Boundary That Matters: Mutable Shell, Immutable Core

A practical architecture often looks like this:

```mermaid
flowchart LR
    A[Inputs / updates] --> B[Mutable assembly or coordination layer]
    B --> C[Immutable domain snapshot]
    C --> D[Readers, caches, async work]
```

The mutable shell does the work that genuinely requires mutation:

- input gathering
- validation sequencing
- coordination with storage
- controlled replacement of the current snapshot

The immutable core does the work that benefits from stability:

- shared reads
- policy evaluation
- downstream publication
- cross-thread visibility

That split is often much cheaper than putting locks inside every domain object.

## Safe Publication Is the Real Concurrency Rule

Immutability alone is not enough if the object is published unsafely.

You still need one clear publication mechanism:

- constructor-complete object assigned to a `final` field
- replacement through a `volatile` reference
- publication through thread-safe initialization
- handoff through a concurrent queue or executor boundary

Example:

```java
public final class PricingRules {
    private final Map<String, Integer> markupByRegion;

    public PricingRules(Map<String, Integer> markupByRegion) {
        this.markupByRegion = Map.copyOf(markupByRegion);
    }

    public int markupFor(String region) {
        return markupByRegion.getOrDefault(region, 0);
    }
}

public final class PricingRulesRegistry {
    private volatile PricingRules current = new PricingRules(Map.of());

    public PricingRules current() {
        return current;
    }

    public void replace(Map<String, Integer> freshRules) {
        current = new PricingRules(freshRules);
    }
}
```

The registry is mutable.
The rules object is not.
That is usually the better design boundary.

## The Most Common Leaks

### Mutable collections hidden inside "immutable" objects

This is the classic fake-immutability bug.

```java
public final class ReportConfig {
    private final List<String> regions;

    public ReportConfig(List<String> regions) {
        this.regions = regions; // bad
    }
}
```

If the caller still owns the list, the object is not truly immutable.

Use a defensive copy:

```java
this.regions = List.copyOf(regions);
```

### Partially initialized publication

If an object escapes during construction, the fact that fields are "meant to be immutable" does not save the design.

### Lazy caches with no synchronization story

Teams often add:

```java
private ExpensiveValue cached;
```

and then quietly introduce visibility races.
If lazy derivation matters, either:

- precompute it
- compute it once behind a clear concurrency primitive
- or accept recomputation if it is cheap enough

### Builders that outlive their purpose

Builders are fine as mutation zones.
They should not become shared runtime objects.

## When Immutability Is the Wrong Default

Not every object needs to be immutable.

Be cautious when:

- the object is a short-lived internal accumulator
- mutation is local and not shared
- copying costs are significant and the object graph is huge
- the real problem is coordination or ownership, not field mutation

For example, a workflow engine runtime object that accumulates transition state inside one thread may be fine as mutable.
What matters is that the mutable state does not become casually shared.

## A Better Design Rule for Refreshable State

For refreshable configuration, model the problem as snapshot replacement, not in-place mutation.

Bad mental model:
"Update the live object carefully."

Better mental model:
"Build the next valid snapshot, then swap the reference."

That approach usually improves:

- correctness
- rollback behavior
- testability
- observability during reloads

## Testing Strategy

Useful tests are not only "field has no setter."

Test for:

1. defensive-copy behavior
2. safe replacement under concurrent reads
3. no visible partial state during refresh
4. unchanged readers after publication

Example questions:

- can a caller mutate input collections after construction?
- do concurrent readers ever observe a half-updated configuration?
- can a refresh be rolled back by swapping to the previous snapshot?

## Practical Rule of Thumb

Use immutability aggressively for values that are shared, cached, or published across threads.

Keep mutation at the edges:

- assembly
- persistence coordination
- explicit reference replacement

If the design needs locks inside every object just to remain trustworthy, it is often a sign that mutation lives too deep in the model.

## Key Takeaways

- Immutability helps most when paired with safe publication, not treated as a style preference.
- A mutable shell around an immutable core is often the most practical concurrency-safe shape.
- Defensive copies and snapshot replacement matter more than slogans about pure objects.
- If shared state must change, prefer atomic replacement of immutable state over in-place mutation.
