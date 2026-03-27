---
title: Enum in Java
date: '2011-03-04'
categories:
- Java
tags:
- java
- enum
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Enum in Java with Fields, Methods, and Switch Examples
seo_description: Understand Java enums with custom fields, methods, and real-world
  usage examples.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Enums are one of the most underappreciated modeling tools in Java.

Many developers first meet them as a nicer replacement for integer constants.
That is true, but incomplete.
The real value of an enum is that it expresses a closed set of legal states and can keep the behavior for those states close to the type itself.

That combination is powerful.

## Why Enums Matter

If a value comes from a fixed set, raw strings and integers are usually a poor design choice.

They allow invalid states too easily:

- `"pendng"` instead of `"pending"`
- `4` even though only three modes exist
- repeated `if` or `switch` logic scattered around the codebase

An enum closes that space.
It says, "these are the only allowed values."

## Quick Summary

| Use enums for | Avoid enums for |
| --- | --- |
| workflow states | fast-changing user-managed data |
| fixed billing or account tiers | open-ended taxonomies owned outside the codebase |
| permissions or policy modes | values that must be added without a deploy |
| protocol or API values with stable contracts | huge mutable state holders |

If the allowed values are genuinely closed and owned by the application, an enum is usually a strong fit.

## Basic Enum Example

```java
enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}
```

That already gives you:

- type safety
- readable comparisons
- a clear list of legal values

But enums become much more useful when they carry behavior or stable metadata.

## Enums With Fields

```java
enum Day {
    SUNDAY(1),
    MONDAY(2),
    TUESDAY(3),
    WEDNESDAY(4),
    THURSDAY(5),
    FRIDAY(6),
    SATURDAY(7);

    private final int code;

    Day(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
```

This is useful when each constant needs fixed metadata.

Examples:

- external code mappings
- UI labels
- workflow priority or severity
- stable wire-format values

The key rule is that enum fields should usually be immutable.

## Enums With Behavior

A very good use of enums is to attach behavior that naturally belongs to each value.

```java
enum BillingPlan {
    FREE {
        @Override
        int monthlyCostInCents(int seats) {
            return 0;
        }
    },
    PRO {
        @Override
        int monthlyCostInCents(int seats) {
            return seats * 2_000;
        }
    },
    ENTERPRISE {
        @Override
        int monthlyCostInCents(int seats) {
            return seats * 4_500;
        }
    };

    abstract int monthlyCostInCents(int seats);
}
```

This can be better than scattering the same business rule across many `switch` blocks.

A good heuristic:
if the behavior changes because the enum value changes, the behavior may belong in the enum.

## Modern Switch Expressions Work Very Well With Enums

Enums and switch expressions fit together naturally:

```java
static String dayType(Day day) {
    return switch (day) {
        case SATURDAY, SUNDAY -> "Weekend";
        default -> "Weekday";
    };
}
```

This style is cleaner than old switch statements and makes enum branching easier to read.

It is especially useful when:

- mapping enum values to labels
- deriving small view-model fields
- translating internal state into API responses

## Safe Parsing for External Input

`Enum.valueOf(...)` is fine for trusted internal code.
It is a poor default for user input, headers, query params, or JSON-like external values.

Why:

- it is case-sensitive
- it throws on unknown values
- it leaks parsing behavior into business code

A safer pattern:

```java
static Optional<Day> parseDay(String raw) {
    if (raw == null || raw.isBlank()) {
        return Optional.empty();
    }

    try {
        return Optional.of(Day.valueOf(raw.trim().toUpperCase(Locale.ROOT)));
    } catch (IllegalArgumentException ex) {
        return Optional.empty();
    }
}
```

This keeps parsing failure explicit and localized.

## Persistence and API Design Rules

Enums are great inside Java code.
At boundaries, you need a little more discipline.

### Database Persistence

With JPA, prefer:

```java
@Enumerated(EnumType.STRING)
```

over ordinal persistence.

Why:
ordinal values look compact but become dangerous when constants are reordered or inserted later.

### API Contracts

If an enum value is exposed externally, think about whether the Java enum name is the right wire representation.

Sometimes the enum name is fine.
Sometimes a stable explicit value is safer:

```java
enum PaymentStatus {
    PENDING("pending"),
    SETTLED("settled"),
    FAILED("failed");

    private final String wire;

    PaymentStatus(String wire) {
        this.wire = wire;
    }

    public String wire() {
        return wire;
    }
}
```

That protects the external contract from later refactors of internal naming.

## When an Enum Is the Wrong Tool

Enums are not a universal answer.

Avoid them when:

- the value set is controlled by users or config data
- new values must appear without a code deploy
- the domain is open-ended by design
- the type is turning into a giant object with mutable state and service dependencies

If the set is not closed, pretending it is closed will create friction later.

## Common Mistakes

### Persisting Ordinals

This is a classic maintenance trap.
Readable string persistence is usually worth the extra bytes.

### Treating Unknown External Values as Impossible

External systems evolve.
Robust code plans for invalid or unexpected input.

### Duplicating Logic Across Many Switch Blocks

If five classes switch on the same enum to compute related behavior, the design is probably drifting.

### Putting Too Much Mutable State Into Enums

Enums are best as stable values with small, fixed metadata and behavior.
They are usually a bad home for complicated mutable object graphs.

## Practical Decision Rule

Use an enum when all three are true:

1. the allowed values are genuinely finite
2. the application owns that closed set
3. type safety or colocated behavior improves the design

If those are not true, a table, configuration model, or regular class hierarchy may be a better fit.

## Final Takeaways

- Enums are much more than named constants.
- They are excellent for closed sets with stable behavior.
- Keep persistence and API representations explicit.
- Do not force an enum onto a domain that needs to stay open-ended.

Good enum design reduces invalid states and removes a surprising amount of duplicated decision logic.
