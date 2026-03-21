---
title: Mutable vs Immutable Classes in Concurrent Systems
date: 2025-02-25
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- mutable
- immutable
- design
- thread-safety
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Mutable vs Immutable Classes in Concurrent Systems
seo_description: Compare mutable and immutable classes in concurrent Java
  systems and learn when each model is appropriate in real application design.
header:
  overlay_image: "/assets/images/java-concurrency-module-05-volatile-immutability-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 5
  show_overlay_excerpt: false
---
Mutable and immutable classes are not just two object-modeling styles.

In concurrent systems, they create very different correctness and maintenance costs.

One pushes complexity into coordination.
The other pushes complexity into construction and replacement.

That trade-off matters everywhere in backend design.

---

## Problem Statement

Suppose you have a shared configuration object used by many request threads.

If the object is mutable, you must answer hard questions:

- who is allowed to update it
- how readers coordinate with writers
- whether several fields must change together
- how partially updated state is prevented

If the object is immutable, the problem changes:

- create a new snapshot
- publish it safely
- let readers keep using the old or new whole object

The second model is often dramatically easier to reason about.

---

## Mutable Object Example

```java
class MutableRoutingConfig {
    private String primaryHost;
    private String fallbackHost;
    private int connectTimeoutMillis;

    void setPrimaryHost(String primaryHost) {
        this.primaryHost = primaryHost;
    }

    void setFallbackHost(String fallbackHost) {
        this.fallbackHost = fallbackHost;
    }

    void setConnectTimeoutMillis(int connectTimeoutMillis) {
        this.connectTimeoutMillis = connectTimeoutMillis;
    }
}
```

This object may be totally fine in single-threaded or one-owner code.

In shared concurrent code, it creates several risks:

- one reader may see old `primaryHost` with new timeout
- several setters may need one atomic business update
- safe publication of later mutations becomes your responsibility

The object is not wrong by itself.
The sharing model makes it expensive.

---

## Immutable Object Example

```java
final class ImmutableRoutingConfig {
    private final String primaryHost;
    private final String fallbackHost;
    private final int connectTimeoutMillis;

    ImmutableRoutingConfig(String primaryHost,
                           String fallbackHost,
                           int connectTimeoutMillis) {
        this.primaryHost = primaryHost;
        this.fallbackHost = fallbackHost;
        this.connectTimeoutMillis = connectTimeoutMillis;
    }

    String primaryHost() {
        return primaryHost;
    }

    String fallbackHost() {
        return fallbackHost;
    }

    int connectTimeoutMillis() {
        return connectTimeoutMillis;
    }
}
```

If this object is safely published, readers can use it without additional coordination because:

- fields do not change
- there is no mid-update state
- one object represents one stable snapshot

---

## Runnable Example

```java
public class MutableVsImmutableDemo {

    public static void main(String[] args) {
        MutablePricing mutablePricing = new MutablePricing(1000, "USD");
        mutablePricing.setAmountCents(1200);
        mutablePricing.setCurrency("EUR");

        ImmutablePricing immutablePricing = new ImmutablePricing(1000, "USD");
        ImmutablePricing updatedPricing = immutablePricing.withAmountCents(1200)
                .withCurrency("EUR");

        System.out.println("Mutable amount   = " + mutablePricing.getAmountCents());
        System.out.println("Mutable currency = " + mutablePricing.getCurrency());

        System.out.println("Immutable old    = " + immutablePricing.getAmountCents()
                + " " + immutablePricing.getCurrency());
        System.out.println("Immutable new    = " + updatedPricing.getAmountCents()
                + " " + updatedPricing.getCurrency());
    }

    static final class MutablePricing {
        private long amountCents;
        private String currency;

        MutablePricing(long amountCents, String currency) {
            this.amountCents = amountCents;
            this.currency = currency;
        }

        long getAmountCents() {
            return amountCents;
        }

        String getCurrency() {
            return currency;
        }

        void setAmountCents(long amountCents) {
            this.amountCents = amountCents;
        }

        void setCurrency(String currency) {
            this.currency = currency;
        }
    }

    static final class ImmutablePricing {
        private final long amountCents;
        private final String currency;

        ImmutablePricing(long amountCents, String currency) {
            this.amountCents = amountCents;
            this.currency = currency;
        }

        long getAmountCents() {
            return amountCents;
        }

        String getCurrency() {
            return currency;
        }

        ImmutablePricing withAmountCents(long newAmountCents) {
            return new ImmutablePricing(newAmountCents, currency);
        }

        ImmutablePricing withCurrency(String newCurrency) {
            return new ImmutablePricing(amountCents, newCurrency);
        }
    }
}
```

This demo shows the mental difference:

- mutable objects change in place
- immutable objects produce a new value representing the next state

In concurrency, that difference is huge.

---

## Why Immutable Often Wins in Concurrent Systems

Immutable classes make several hard problems disappear:

- no races on in-place mutation
- no need to lock for simple reads
- easier caching and reuse
- safer sharing across threads
- simpler reasoning about invariants

This is why immutable value objects work so well for:

- money
- configuration
- permission sets
- DTOs
- snapshot views

---

## Why Mutable Still Exists

Mutable classes are still necessary and useful.

They are often the right model for:

- connection pools
- caches with internal eviction state
- schedulers
- queues
- resource managers

These objects are not pure values.
They are stateful coordinators.

Trying to force everything into immutable snapshots can become awkward or wasteful.

---

## Production-Style Comparison

Immutable is usually the better choice when:

- the object is widely shared
- reads dominate writes
- the object represents a business value or snapshot
- replacement is natural

Mutable is usually appropriate when:

- one component owns the state
- the object coordinates resources over time
- mutation is part of its identity and purpose
- shared access is already disciplined by confinement or locking

The key question is not “which is better.”
The key question is “is this object a value to be shared or a stateful component to be controlled.”

---

## Common Mistakes

- making an object mutable only because setters feel convenient
- making an object immutable on the surface while exposing mutable internals
- sharing mutable state broadly instead of narrowing ownership
- assuming immutable automatically means safe if publication is still broken

Immutability reduces concurrency burden a lot, but publication still matters.

---

## Key Takeaways

- Immutable objects simplify concurrency because readers never race with in-place mutation.
- Mutable objects are still necessary for coordinators, pools, caches, and other stateful components.
- Default toward immutability for shared values and snapshots.
- Choose mutability deliberately, with a clear ownership and coordination model.

Next post: [Thread Confinement and Stack Confinement in Java](/java/concurrency/thread-confinement-and-stack-confinement-in-java/)
