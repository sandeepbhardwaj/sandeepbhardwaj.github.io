---
title: 'Varargs in Java: Variable-Argument Methods'
date: '2011-02-16'
categories:
- Java
tags:
- java
- java-basics
author_profile: true
seo_title: 'Varargs in Java: Variable-Argument Methods with Examples'
seo_description: Learn Java varargs syntax, overload rules, and common pitfalls with
  practical examples.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
toc: true
toc_label: In This Article
toc_icon: cog
---

# Varargs in Java: Variable-Argument Methods

Varargs (`...`) lets a method accept zero or more arguments of the same type.

## Real-World Use Cases

- utility logging methods
- SQL/criteria builders
- event publishing with optional metadata

## Java 8 Example

```java
public static int sum(int... values) {
    int total = 0;
    for (int value : values) {
        total += value;
    }
    return total;
}
```

## Java 21+ Example

```java
public static String joinWithPrefix(String prefix, String... parts) {
    return prefix + String.join(",", parts);
}
```

Varargs behavior is unchanged across Java 8, JDK 11, Java 17, Java 21, and Java 25. Improvements in newer versions are around surrounding language features, not varargs itself.

## Rules

- only one varargs parameter allowed
- varargs must be last parameter
- internally treated as array

## Key Takeaways

- Varargs improves API ergonomics for optional lists of inputs.
- Avoid ambiguous overloads with boxed/primitive varargs combinations.
- Prefer explicit overloads when readability is more important than flexibility.
