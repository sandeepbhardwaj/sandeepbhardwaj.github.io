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
toc: true
toc_label: In This Article
toc_icon: cog
---

# Enum in Java

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

## Key Takeaways

- Enums are safer than `String`/`int` constants.
- Keep enum behavior close to enum values.
- Use modern switch expressions for cleaner enum branching.
