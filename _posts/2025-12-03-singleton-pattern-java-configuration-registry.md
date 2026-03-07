---
title: Singleton Pattern in Java with a Configuration Registry Example
date: 2025-12-03
categories:
- Java
- Design Patterns
tags:
- java
- java8
- singleton
- configuration
- design-patterns
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Singleton Pattern in Java with a Configuration Registry Example
seo_description: Learn the Singleton pattern in Java 8+ with a practical configuration registry example, thread-safety notes, and UML.
header:
  overlay_image: "/assets/images/java-design-patterns-series-banner.svg"
  overlay_filter: 0.35
  caption: Java Design Patterns Series
  show_overlay_excerpt: false
---
Singleton is the most overused pattern in Java.
That does not make it useless. It means it must be applied carefully and only when a single shared instance is truly part of the problem definition.

---

## When Singleton Is Legitimate

Good use cases:

- process-wide immutable configuration
- a coordinated registry with controlled lifecycle
- lightweight stateless services where multiple instances add no value

Bad use cases:

- hiding global mutable state
- replacing dependency injection
- sharing state to avoid proper object design

---

## Example Problem

Our application loads environment-specific feature flags and service endpoints once during startup.
Every part of the application needs read-only access to that configuration.

---

## UML

```mermaid
classDiagram
    class AppConfigurationRegistry {
      -Map~String,String~ values
      -AppConfigurationRegistry()
      +getInstance() AppConfigurationRegistry
      +get(String) String
      +isEnabled(String) boolean
    }
```

---

## Implementation Walkthrough

```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public final class AppConfigurationRegistry {
    private final Map<String, String> values;

    private AppConfigurationRegistry() {
        Map<String, String> loaded = new HashMap<>();
        loaded.put("payment.provider", "stripe");
        loaded.put("feature.dynamicPricing", "true");
        loaded.put("checkout.timeout.ms", "2500");
        this.values = Collections.unmodifiableMap(loaded);
    }

    private static final class Holder {
        private static final AppConfigurationRegistry INSTANCE = new AppConfigurationRegistry();
    }

    public static AppConfigurationRegistry getInstance() {
        return Holder.INSTANCE;
    }

    public String get(String key) {
        return values.get(key);
    }

    public boolean isEnabled(String key) {
        return Boolean.parseBoolean(values.getOrDefault(key, "false"));
    }
}
```

Usage:

```java
public final class CheckoutService {
    public void printConfiguration() {
        AppConfigurationRegistry config = AppConfigurationRegistry.getInstance();
        System.out.println(config.get("payment.provider"));
        System.out.println(config.isEnabled("feature.dynamicPricing"));
    }
}
```

This example keeps the singleton intentionally boring. That is a good property.
It exposes read-only configuration and avoids becoming a hidden dependency bucket for unrelated concerns such as request-scoped data, counters, or mutable caches.

---

## Why the Holder Idiom Works

It gives:

- lazy initialization
- thread-safe instance creation via class loading semantics
- no explicit synchronization cost on reads

That is a better default than manually synchronized `getInstance()` methods in most Java codebases.

---

## What to Avoid

Do not evolve this into a mutable dumping ground:

```java
public void put(String key, String value) {
    // This is exactly how a clean singleton turns into hidden global state.
}
```

If runtime updates are needed, introduce a well-defined refresh mechanism with explicit synchronization and ownership.

---

## Testing Considerations

Singletons complicate test isolation.
This example reduces the problem by keeping the singleton immutable.

If tests need alternative configuration, a better design is:

- keep the singleton only at application bootstrap
- pass actual values into services via constructors

That way the singleton is a startup detail, not a deep runtime dependency.

That distinction is what usually separates acceptable singleton usage from the kind that makes a codebase harder to test and reason about.

---

## Practical Rule

If you cannot explain why exactly one instance must exist, do not use Singleton.
If the only reason is “easy access from anywhere,” that is not a valid reason.
