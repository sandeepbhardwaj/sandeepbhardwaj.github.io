---
title: "Java 21 New Features — Complete Guide with Examples"
date: 2026-03-11
categories: [Java]
tags: [java, java21, jdk21, lts, backend, virtual-threads]
author_profile: true
toc: true
toc_label: "In This Article"
toc_icon: "cog"
seo_title: "Java 21 Features with Examples (Complete Guide)"
seo_description: "Comprehensive Java 21 LTS guide covering all JDK 21 JEP features with practical examples."
header:
  overlay_image: /assets/images/default-post-banner.svg
  overlay_filter: 0.4
  caption: "Java 21 LTS for High-Scale Systems"
canonical_url: "https://sandeepbhardwaj.github.io/java/java-21-new-features-with-examples/"
---

# Introduction

Java 21 is an LTS release with major improvements in concurrency, pattern matching, and collections.
This article covers all JDK 21 release JEPs with examples.

---

# 1) Virtual Threads (Final, JEP 444)

Virtual threads enable high-concurrency request handling with thread-per-task style.

```java
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        executor.submit(() -> {
            // blocking I/O style code remains simple
            Thread.sleep(50);
            return null;
        });
    }
}
```

---

# 2) Structured Concurrency (Preview, JEP 453)

Treat related concurrent tasks as a single unit.

```java
// Java 21 preview API shape
try (var scope = new java.util.concurrent.StructuredTaskScope.ShutdownOnFailure()) {
    var userFuture = scope.fork(() -> fetchUser());
    var ordersFuture = scope.fork(() -> fetchOrders());
    scope.join();
    scope.throwIfFailed();
    return new Dashboard(userFuture.get(), ordersFuture.get());
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview App.java
java --enable-preview App
```

---

# 3) Scoped Values (Preview, JEP 446)

Scoped values are an immutable, safer alternative to many thread-local use cases.

```java
// Java 21 preview API shape
static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();

ScopedValue.where(REQUEST_ID, "req-123").run(() -> {
    System.out.println(REQUEST_ID.get());
});
```

---

# 4) Sequenced Collections (Final, JEP 431)

New interfaces provide consistent first/last/reversed operations.

```java
java.util.SequencedSet<String> set = new java.util.LinkedHashSet<>();
set.add("A");
set.add("B");
System.out.println(set.getFirst()); // A
System.out.println(set.getLast());  // B
System.out.println(set.reversed()); // [B, A]
```

---

# 5) Record Patterns (Final, JEP 440)

Deconstruct records directly in pattern matching.

```java
record Point(int x, int y) {}

static String label(Object o) {
    if (o instanceof Point(int x, int y)) {
        return "Point(" + x + "," + y + ")";
    }
    return "Other";
}
```

---

# 6) Pattern Matching for `switch` (Final, JEP 441)

Pattern matching in switch became final in Java 21.

```java
static String format(Object value) {
    return switch (value) {
        case Integer i -> "int=" + i;
        case String s when s.isBlank() -> "blank string";
        case String s -> "str=" + s;
        case null -> "null";
        default -> "other";
    };
}
```

---

# 7) String Templates (Preview, JEP 430)

String templates provide safer, clearer string interpolation.

```java
// Java 21 preview API shape
import static java.lang.StringTemplate.STR;

String name = "Sandeep";
int count = 3;
String msg = STR."Hello \{name}, you have \{count} messages.";
```

---

# 8) Unnamed Patterns and Variables (Preview, JEP 443)

Use `_` where a variable is required syntactically but not used.

```java
// Java 21 preview syntax example shape
if (obj instanceof Point(int x, int _)) {
    System.out.println(x);
}
```

---

# 9) Unnamed Classes and Instance Main Methods (Preview, JEP 445)

Simplified entry point for small programs and learning.

```java
void main() {
    System.out.println("Hello Java 21");
}
```

---

# 10) Generational ZGC (JEP 439)

ZGC gains generational mode for improved throughput and memory behavior.

Example run:

```bash
java -XX:+UseZGC -jar app.jar
```

---

# 11) Key Encapsulation Mechanism API (JEP 452)

Adds API support for key encapsulation mechanisms in cryptographic workflows.

Use case:

- hybrid/public-key key exchange workflows
- modern secure channel negotiation

---

# 12) Foreign Function & Memory API (Third Preview, JEP 442)

Continued preview improvements for native interop and off-heap memory.

```java
// Java 21 preview API shape (FFM evolved across previews)
// Typical flow: define function descriptor, obtain linker symbol, invoke method handle.
```

---

# 13) Vector API (Sixth Incubator, JEP 448)

Continued incubator progress for explicit SIMD programming.

```bash
java --add-modules jdk.incubator.vector App
```

---

# 14) Deprecations and Removals in Java 21

- Deprecate Windows 32-bit x86 port for removal (JEP 449)
- Prepare to disallow dynamic agent loading by default (JEP 451)

Operational impact:

- review runtime tooling that relies on dynamic attach
- modernize target architectures toward 64-bit environments

---

# 15) Key Takeaways

- Java 21 LTS is a major productivity and scalability release.
- Virtual threads and structured concurrency change server-side concurrency design.
- Pattern matching and records improve type-safe domain modeling.
