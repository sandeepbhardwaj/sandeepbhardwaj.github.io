---
title: "Java 25 New Features — Complete Guide with Examples"
date: 2026-03-12
categories: [Java]
tags: [java, java25, jdk25, lts, backend, jvm]
author_profile: true
toc: true
toc_label: "In This Article"
toc_icon: "cog"
seo_title: "Java 25 Features with Examples (Complete Guide)"
seo_description: "Comprehensive Java 25 guide covering all JDK 25 release features with practical examples."
header:
  overlay_image: /assets/images/default-post-banner.svg
  overlay_filter: 0.4
  caption: "Java 25 LTS: Language, Runtime, and Tooling Updates"
canonical_url: "https://sandeepbhardwaj.github.io/java/java-25-new-features-with-examples/"
---

# Introduction

Java 25 is an LTS release (GA on September 16, 2025).
This article covers all JDK 25 release JEPs with practical examples.

---

# 1) Module Import Declarations (JEP 511)

You can import an entire module in source code.

```java
import module java.sql;

void main() throws Exception {
    Connection c = DriverManager.getConnection("jdbc:h2:mem:test");
    System.out.println(c.isValid(2));
}
```

Useful for beginner-friendly files and small scripts.

---

# 2) Compact Source Files and Instance Main Methods (JEP 512)

Java 25 finalizes the simplified entry-point style.

```java
void main() {
    System.out.println("Hello from Java 25 compact source file");
}
```

Run directly:

```bash
java Hello.java
```

---

# 3) Flexible Constructor Bodies (JEP 513)

Constructor prologue code can run before `super(...)` (with language safety rules).

```java
class Base {
    Base(int port) {}
}

class ServerConfig extends Base {
    ServerConfig(int inputPort) {
        int normalized = Math.max(1024, inputPort); // prologue logic
        super(normalized);
    }
}
```

This reduces constructor boilerplate when arguments need preprocessing.

---

# 4) Scoped Values (Final, JEP 506)

Scoped values are now final in Java 25.

```java
import java.lang.ScopedValue;

public class RequestContextDemo {
    static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();

    static void handle() {
        System.out.println("requestId=" + REQUEST_ID.get());
    }

    public static void main(String[] args) {
        ScopedValue.where(REQUEST_ID, "req-2026-001").run(RequestContextDemo::handle);
    }
}
```

---

# 5) Structured Concurrency (Fifth Preview, JEP 505)

Structured concurrency keeps child tasks bounded to the parent scope.

```java
// Java 25 preview API shape
try (var scope = new java.util.concurrent.StructuredTaskScope.ShutdownOnFailure()) {
    var profile = scope.fork(() -> fetchProfile());
    var orders = scope.fork(() -> fetchOrders());
    scope.join();
    scope.throwIfFailed();
    return new Dashboard(profile.get(), orders.get());
}
```

Compile/run preview:

```bash
javac --release 25 --enable-preview App.java
java --enable-preview App
```

---

# 6) Primitive Types in Patterns, `instanceof`, and `switch` (Third Preview, JEP 507)

Pattern matching expands to primitive types (preview).

```java
// Java 25 preview-style example
static String classify(int value) {
    return switch (value) {
        case int i when i < 0 -> "negative";
        case int i when i == 0 -> "zero";
        case int i -> "positive: " + i;
    };
}
```

---

# 7) Stable Values (Preview, JEP 502)

Stable values provide a mechanism for safe, lazy, one-time initialization (preview).

```java
// Preview API concept example:
// a value is initialized once and then read cheaply/safely by many threads.
```

Use case:

- expensive shared config objects
- memoized service singletons without custom locking

---

# 8) Key Derivation Function API (JEP 510)

Java 25 adds a standard API for key-derivation operations.

```java
// API concept example:
// derive subkeys from a master key for encryption, MAC, or token signing.
```

Use case:

- deriving per-tenant/per-session keys from one root secret
- standardizing cryptographic key expansion logic

---

# 9) PEM Encodings of Cryptographic Objects (Preview, JEP 470)

Java adds preview support for working with PEM encodings of cryptographic objects.

Example workflow:

- read PEM key/certificate material
- convert to Java security objects
- use directly in TLS/signing flows

---

# 10) Vector API (Tenth Incubator, JEP 508)

Vector API continues incubation for explicit SIMD workloads.

```bash
java --add-modules jdk.incubator.vector App
```

Typical domains:

- ML preprocessing
- financial analytics
- image/signal processing

---

# 11) Stream Gatherers (JEP 485)

Stream Gatherers enable custom intermediate stream operations.

```java
import java.util.stream.Gatherers;
import java.util.stream.IntStream;

var windows = IntStream.rangeClosed(1, 8)
        .boxed()
        .gather(Gatherers.windowFixed(3))
        .toList();

System.out.println(windows); // [[1,2,3], [4,5,6]]
```

---

# 12) Class-File API (JEP 484)

Java 25 provides a standard API to parse/generate/transform class files.

Example use:

- build bytecode tools without depending on third-party parsers
- write custom class transformers for build tooling

---

# 13) JFR CPU-Time Profiling (Experimental, JEP 509)

JFR can collect CPU-time-based profiling data (experimental).

Example:

```bash
java -XX:StartFlightRecording=filename=app.jfr,duration=60s -jar app.jar
jfr summary app.jfr
```

---

# 14) JFR Cooperative Sampling (JEP 518)

JFR sampling internals are improved for better scalability and safer stack walking.

Operational benefit:

- lower profiling bias
- better behavior with modern collectors

---

# 15) JFR Method Timing & Tracing (JEP 520)

JFR adds method timing/tracing capabilities for deeper diagnostics.

Example use:

- identify top latency methods in production-safe recordings

---

# 16) Ahead-of-Time Command-Line Ergonomics (JEP 514)

AOT flows become easier to operate via command-line ergonomics improvements.

Practical example:

- simpler JVM startup tuning for applications using AOT-related capabilities

---

# 17) Ahead-of-Time Method Profiling (JEP 515)

JVM can leverage ahead-of-time method profiling information.

Practical impact:

- faster warm-up for frequently executed methods
- better startup behavior in repeated deployment patterns

---

# 18) Late Barrier Expansion for G1 (JEP 475)

HotSpot improves G1 barrier expansion timing for better optimization opportunities.

Practical impact:

- better compiled code quality in some memory-intensive paths
- potential throughput wins for G1-based workloads

---

# 19) Compact Object Headers (JEP 519)

Java 25 introduces compact object headers (implementation/runtime feature).

Expected benefit:

- lower memory footprint for object-heavy applications
- better cache efficiency in some workloads

---

# 20) Generational Shenandoah (JEP 521)

Shenandoah gains generational mode.

Example run:

```bash
java -XX:+UseShenandoahGC -jar app.jar
```

---

# 21) Remove the Non-Generational Mode of ZGC (JEP 490)

Java 25 removes non-generational ZGC mode.

Operational note:

- `-XX:+UseZGC` now runs with generational behavior
- simplify tuning assumptions around ZGC mode selection

---

# 22) Removal: 32-bit x86 Port (JEP 503)

32-bit x86 port is removed in Java 25.

Migration note:

- move legacy 32-bit deployments to 64-bit platforms before upgrade

---

# Key Takeaways

- Java 25 LTS delivers major language ergonomics (`module import`, compact source files, flexible constructors).
- It strengthens modern concurrency with `ScopedValue` finalization and ongoing structured concurrency previews.
- Runtime and observability advances (JFR, Shenandoah, object headers, AOT profiling) target production performance at scale.
