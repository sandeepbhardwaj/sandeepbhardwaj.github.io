---
title: Enum in Java
date: '2011-03-04'
categories:
- Java
tags:
- java
- enum
author_profile: true
seo_title: Enum in Java with Fields, Methods, and Switch Examples
seo_description: Understand Java enums with custom fields, methods, and real-world
  usage examples.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
toc: true
toc_label: In This Article
toc_icon: cog
---
Enums model a fixed set of constants with type safety and encapsulated behavior.

## Real-World Use Cases

- order/payment states
- workflow stages
- permission levels
- domain-safe constants instead of raw strings

## Java Example with Fields

```java
enum Day {
    SUNDAY(1), MONDAY(2), TUESDAY(3), WEDNESDAY(4), THURSDAY(5), FRIDAY(6), SATURDAY(7);

    private final int code;

    Day(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
```

## Behavior per Enum Constant

Enums can encapsulate behavior, not just values. This helps remove scattered `if/switch` logic.

```java
enum BillingPlan {
    FREE {
        @Override
        int monthlyCostInCents(int seats) { return 0; }
    },
    PRO {
        @Override
        int monthlyCostInCents(int seats) { return seats * 2_000; }
    },
    ENTERPRISE {
        @Override
        int monthlyCostInCents(int seats) { return seats * 4_500; }
    };

    abstract int monthlyCostInCents(int seats);
}
```

This pattern keeps domain rules close to the domain type.

## Java 21+ Improvement Pattern

Use modern switch expressions for enum-driven behavior:

```java
static String dayType(Day day) {
    return switch (day) {
        case SATURDAY, SUNDAY -> "Weekend";
        default -> "Weekday";
    };
}
```

Java 17 also supports this clean style (switch expressions became standard before 17), so you can use the same pattern in long-term-support runtimes.

## Java 25 Note

Enum fundamentals are stable and still recommended for closed sets of values.

## Parsing and Validation Pattern

`Enum.valueOf(...)` throws when input is unknown. For external input (API/query/header), use safe parsing.

```java
static Optional<Day> parseDay(String raw) {
    if (raw == null || raw.isBlank()) return Optional.empty();
    try {
        return Optional.of(Day.valueOf(raw.trim().toUpperCase(Locale.ROOT)));
    } catch (IllegalArgumentException ex) {
        return Optional.empty();
    }
}
```

This avoids leaking parsing exceptions into business flow.

## Persistence and API Design Guidance

- For database persistence with JPA, prefer `@Enumerated(EnumType.STRING)` over ordinal.
- Avoid persisting enum ordinal values because reordering constants breaks old data.
- For JSON contracts, keep stable external names if enum names may change.

Example with explicit wire value:

```java
enum PaymentStatus {
    PENDING("pending"),
    SETTLED("settled"),
    FAILED("failed");

    private final String wire;
    PaymentStatus(String wire) { this.wire = wire; }
    public String wire() { return wire; }
}
```

## Common Mistakes

1. Using enum ordinals in DB or API payloads.
2. Putting large mutable state inside enums.
3. Duplicating enum logic in many switches across services.
4. Treating unknown external values as impossible.

## Key Takeaways

- Enums are safer than `String`/`int` constants.
- Keep enum behavior close to enum values.
- Use modern switch expressions for cleaner enum branching.
- Prefer stable string representation for persistence and APIs.
