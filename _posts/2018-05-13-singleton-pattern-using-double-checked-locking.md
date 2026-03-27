---
title: Double-Checked Locking Singleton Pattern in Java
date: '2018-05-13'
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- singleton
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Double-Checked Locking Singleton in Java (Thread-Safe)
seo_description: Build a thread-safe singleton in Java using double-checked locking
  and volatile.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Double-checked locking is one of those Java patterns that is both legitimate and overused.

It solves a real problem:
lazy initialization of a shared object without paying synchronization cost on every read.

But it is not the default answer to "I need a singleton."
In many production codebases, the better answer is an enum singleton, the holder idiom, or simply letting a DI container manage lifecycle.

## The Short Version

Use double-checked locking only when all three of these are true:

1. lazy initialization is genuinely valuable
2. the object must be globally shared in-process
3. simpler alternatives do not fit the design

If those conditions are not true, this pattern usually adds more ceremony than value.

## Why This Pattern Exists

The naive singleton implementation is easy:

```java
public final class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

The problem is concurrency.
Two threads can observe `instance == null` at the same time and both create an object.

The obvious fix is to synchronize the whole method:

```java
public static synchronized Singleton getInstance() {
    if (instance == null) {
        instance = new Singleton();
    }
    return instance;
}
```

That is correct, but every read now pays synchronization cost even after initialization is complete.
Double-checked locking exists to reduce that cost while keeping the initialization race safe.

## Correct Java Implementation

```java
public final class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

Two details matter:

- the first null check avoids locking after initialization
- `volatile` is mandatory

Without `volatile`, the pattern is broken.

## Why `volatile` Is Non-Negotiable

The danger is not just "two objects might get created."
The subtler problem is publication safety.

Without `volatile`, one thread can observe a reference to an object whose construction is not safely visible yet.
That means another thread may see a partially initialized instance.

Modern Java makes double-checked locking valid only when the field is `volatile`.

> [!important]
> If the singleton field is not `volatile`, do not call the implementation thread-safe.

## When Double-Checked Locking Is Reasonable

This pattern can make sense for:

- expensive in-process helper initialization
- lazily created caches or registries
- shared parsers, metadata builders, or adapters created on first use

Even then, ask one more question:
"Does this really need a hand-written singleton, or is lazy dependency wiring enough?"

That question prevents a lot of unnecessary global state.

## Better Alternatives Most of the Time

| Option | Best when | Why it is often better |
| --- | --- | --- |
| enum singleton | one instance for the whole JVM is fine | simple, serialization-safe, hard to break |
| initialization-on-demand holder | you want lazy loading without explicit synchronization code | concise and usually clearer |
| DI container singleton | application/service code | testable, configurable, lifecycle managed |
| synchronized accessor | the access path is cold and simplicity matters more than micro-optimization | easier to read |

### Enum Singleton

```java
public enum AppSingleton {
    INSTANCE;
}
```

This is often the safest singleton pattern in plain Java when you truly want one instance and no extra lifecycle complexity.

### Holder Idiom

```java
public final class HolderSingleton {
    private HolderSingleton() {}

    private static class Holder {
        private static final HolderSingleton INSTANCE = new HolderSingleton();
    }

    public static HolderSingleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

This is lazy, thread-safe, and easier to explain than double-checked locking.

### Dependency Injection Singleton

In most backend applications, a framework-managed singleton is better than a static global singleton.

```java
import org.springframework.stereotype.Service;

@Service
public class CurrencyRateService {
    public double convert(double amount, double rate) {
        return amount * rate;
    }
}
```

That design is easier to test, easier to replace, and easier to evolve than hiding everything behind `Singleton.getInstance()`.

## The Real Production Tradeoff

Double-checked locking optimizes access overhead after initialization.
What it does not optimize is design quality.

The real questions are:

- should this state be global at all?
- who owns lifecycle and reset behavior?
- how will tests isolate state?
- does classloader scope matter in this environment?

If those questions are ignored, the code may be thread-safe and still be difficult to maintain.

## Common Mistakes

### Forgetting `volatile`

This is the classic bug.
It invalidates the pattern.

### Hiding Heavy Side Effects in the Constructor

A singleton constructor that performs network I/O, reads big files, or acquires locks turns initialization into an operational surprise.

If startup cost matters, surface it explicitly.

### Using a Singleton Where Dependency Injection Should Be Used

Static global access feels convenient at first.
Later it becomes test coupling, hidden configuration, and awkward replacement logic.

### Assuming One Singleton Means One Instance Everywhere

In plugin systems, application servers, or other multi-classloader environments, you can end up with one singleton per classloader.

That may be correct or disastrous depending on the design.

## Testing and Maintenance Advice

If your singleton carries mutable state, tests will feel the pain first.

Practical rules:

- avoid mutable singleton state when possible
- keep initialization deterministic
- prefer DI-managed scope for business services
- expose reset hooks only when test isolation truly requires them

The best testing story is often not "better singleton tests."
It is "less singleton design."

## Decision Rule

Use double-checked locking when:

- laziness matters
- access is frequent enough that you care about post-init overhead
- you understand the memory-model requirements
- simpler alternatives would make the design worse, not better

Otherwise, prefer one of the simpler options.

## Final Takeaways

- Double-checked locking is valid in Java only with `volatile`.
- The pattern solves lazy initialization, not general lifecycle design.
- The holder idiom or enum singleton is often simpler.
- In service applications, DI-managed singletons are usually the healthiest default.

If a team reaches for double-checked locking by reflex, that is usually a design smell.
If a team reaches for it after ruling out simpler options, it can be a good tool.
