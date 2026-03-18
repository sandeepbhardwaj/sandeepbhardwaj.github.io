---
title: Java 25 New Features — Complete Guide with Examples
date: 2026-03-12
categories:
- Java
tags:
- java
- java25
- jdk25
- lts
- backend
- jvm
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Java 25 Features with Examples (Complete Guide)
seo_description: Comprehensive Java 25 guide covering all JDK 25 release features
  with practical examples.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: 'Java 25 LTS: Language, Runtime, and Tooling Updates'
  show_overlay_excerpt: false
---
Java 25 is an LTS release (GA on September 16, 2025).
This article covers all JDK 25 release features, and the major developer-facing items now have fuller examples and more realistic use cases instead of short release-note snippets.

---

# 1) Module Import Declarations (JEP 511)

Module import declarations let you import everything exported by a module.
This is especially helpful in small scripts, compact source files, and learning-oriented examples where you want less ceremony.

Complete example:

```java
import module java.sql;

void main() {
    System.out.println(Connection.class.getName());
    System.out.println("Registered JDBC drivers = " + DriverManager.drivers().count());
}
```

Run it directly:

```bash
java --source 25 DbApiImports.java
```

Real use case:

- quick JDBC troubleshooting scripts
- tiny one-file demos
- beginner-friendly examples that need many types from one module

Why this matters:

- less import noise in small files
- easier discovery for teaching and scripting
- cleaner source when a module is the real dependency boundary

---

# 2) Compact Source Files and Instance Main Methods (JEP 512)

Java 25 finalizes the simplified entry-point style.
This is a real quality-of-life improvement for utilities, demos, data-fix scripts, and onboarding examples.

Complete example:

```java
import java.nio.file.Files;
import java.nio.file.Path;

long countFailedOrders(Path csvFile) throws Exception {
    try (var lines = Files.lines(csvFile)) {
        return lines
                .skip(1)
                .filter(line -> line.endsWith(",FAILED"))
                .count();
    }
}

void main(String[] args) throws Exception {
    Path csvFile = Path.of(args[0]);
    System.out.println("Failed orders = " + countFailedOrders(csvFile));
}
```

Run directly:

```bash
java --source 25 FailedOrders.java orders.csv
```

Real use case:

- one-off operational scripts
- CSV and log analyzers
- internal developer tooling without project scaffolding

This is not a replacement for normal project structure in larger services, but it is genuinely useful for small tasks.

---

# 3) Flexible Constructor Bodies (JEP 513)

Flexible constructor bodies allow constructor prologue logic before `super(...)`, as long as language safety rules are preserved.

This helps when constructor arguments need normalization, validation, or preprocessing before the superclass is initialized.

Complete example:

```java
class BaseServiceConfig {
    final int port;
    final String host;

    BaseServiceConfig(String host, int port) {
        this.host = host;
        this.port = port;
    }
}

class OrderApiConfig extends BaseServiceConfig {
    OrderApiConfig(String inputHost, int inputPort) {
        String normalizedHost = inputHost.isBlank() ? "127.0.0.1" : inputHost.trim();
        int normalizedPort = Math.max(1024, inputPort);
        super(normalizedHost, normalizedPort);
    }
}

public class FlexibleConstructorDemo {
    public static void main(String[] args) {
        OrderApiConfig config = new OrderApiConfig("  ", 808);
        System.out.println(config.host + ":" + config.port);
    }
}
```

Real use case:

- configuration normalization
- constructor argument sanitization
- pre-validation before superclass initialization

Why this matters:

- less constructor boilerplate
- cleaner inheritance code
- easier migration of awkward helper methods that existed only to preprocess arguments

---

# 4) Scoped Values (Final, JEP 506)

Scoped values are final in Java 25.
They are a cleaner alternative to many `ThreadLocal` use cases and fit especially well with modern concurrency patterns.

Complete example:

```java
import java.lang.ScopedValue;
import java.time.Instant;

public class RequestContextDemo {
    record RequestContext(String requestId, String tenantId, String userId) {}

    static final ScopedValue<RequestContext> CONTEXT = ScopedValue.newInstance();

    static void handleRequest() {
        log("validating request");
        chargePayment();
        publishEvent();
        log("request completed");
    }

    static void chargePayment() {
        log("calling payment gateway");
    }

    static void publishEvent() {
        log("publishing order-created event");
    }

    static void log(String message) {
        RequestContext context = CONTEXT.get();
        System.out.printf(
                "%s requestId=%s tenant=%s user=%s %s%n",
                Instant.now(),
                context.requestId(),
                context.tenantId(),
                context.userId(),
                message
        );
    }

    public static void main(String[] args) {
        RequestContext context = new RequestContext("req-2026-001", "acme", "u-17");
        ScopedValue.where(CONTEXT, context).run(RequestContextDemo::handleRequest);
    }
}
```

Real use case:

- request ID propagation
- tenant context propagation
- structured logging and tracing metadata

Why this matters:

- request context becomes immutable and scoped
- code is easier to reason about than mutable thread-local state
- it composes well with modern structured concurrency

---

# 5) Structured Concurrency (Fifth Preview, JEP 505)

Structured concurrency is still preview in Java 25, but it continues to improve.
The core idea remains the same: a group of child tasks should have a bounded lifetime and belong to one parent operation.

Complete example using the Java 25 preview API shape:

```java
import java.util.List;
import java.util.concurrent.StructuredTaskScope;
import java.util.stream.Stream;

public class FraudSignalsDashboard {
    record RiskSignal(String provider, int score) {}

    static RiskSignal fetchSignal(String provider, int score) throws InterruptedException {
        Thread.sleep(100);
        return new RiskSignal(provider, score);
    }

    static List<RiskSignal> loadSignals() throws Exception {
        try (var scope = StructuredTaskScope.<RiskSignal, Stream<StructuredTaskScope.Subtask<RiskSignal>>>open(
                StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {
            scope.fork(() -> fetchSignal("device-fingerprint", 35));
            scope.fork(() -> fetchSignal("velocity-check", 20));
            scope.fork(() -> fetchSignal("chargeback-history", 55));

            return scope.join()
                    .map(StructuredTaskScope.Subtask::get)
                    .toList();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println(loadSignals());
    }
}
```

Compile/run preview:

```bash
javac --release 25 --enable-preview FraudSignalsDashboard.java
java --enable-preview FraudSignalsDashboard
```

Real use case:

- fraud-signal fan-out
- parallel pricing requests
- fetching multiple independent data sources for one response

Why teams care:

- child tasks are bounded to a parent scope
- failure handling becomes more predictable
- code structure better matches the business operation

---

# 6) Primitive Types in Patterns, `instanceof`, and `switch` (Third Preview, JEP 507)

Java 25 preview expands pattern matching to primitive types.
That sounds subtle, but it removes a common mismatch where object patterns were expressive while primitive-heavy code stayed comparatively rigid.

Complete example:

```java
public class PrimitivePatternsDemo {
    static String classify(long latencyMicros) {
        return switch (latencyMicros) {
            case long value when value < 1_000 -> "fast";
            case long value when value < 5_000 -> "acceptable";
            case long value -> "slow: " + value;
        };
    }

    public static void main(String[] args) {
        System.out.println(classify(800));
        System.out.println(classify(2800));
        System.out.println(classify(9000));
    }
}
```

Compile/run preview:

```bash
javac --release 25 --enable-preview PrimitivePatternsDemo.java
java --enable-preview PrimitivePatternsDemo
```

Real use case:

- latency classification
- score bucketing
- telemetry threshold routing

---

# 7) Stable Values (Preview, JEP 502)

Stable values are a preview feature for safe, lazy, one-time initialization.
This is useful when you want shared read-mostly data without custom locking or double-checked initialization patterns.

Complete example:

```java
import java.lang.StableValue;
import java.time.Duration;

public class StableConfigDemo {
    static final StableValue<String> CONFIG = StableValue.of();

    static String loadConfig() {
        try {
            Thread.sleep(Duration.ofMillis(50));
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        return "jdbc:postgresql://orders-db:5432/app";
    }

    public static void main(String[] args) {
        System.out.println(CONFIG.orElseSet(StableConfigDemo::loadConfig));
        System.out.println(CONFIG.orElseSet(StableConfigDemo::loadConfig));
    }
}
```

Compile/run preview:

```bash
javac --release 25 --enable-preview StableConfigDemo.java
java --enable-preview StableConfigDemo
```

Real use case:

- lazy shared configuration
- memoized expensive clients or schemas
- one-time setup without manual synchronization

---

# 8) Key Derivation Function API (JEP 510)

Java 25 adds a standard Key Derivation Function API via `javax.crypto.KDF`.
This is important when one master secret must deterministically produce many scoped child secrets.

Complete example with HKDF:

```java
import javax.crypto.KDF;
import javax.crypto.spec.HKDFParameterSpec;
import java.nio.charset.StandardCharsets;

public class HkdfTenantKeys {
    public static void main(String[] args) throws Exception {
        byte[] ikm = "root-secret".getBytes(StandardCharsets.UTF_8);
        byte[] salt = "orders-service".getBytes(StandardCharsets.UTF_8);
        byte[] info = "tenant-42:token-signing".getBytes(StandardCharsets.UTF_8);

        HKDFParameterSpec params = HKDFParameterSpec.ofExtract()
                .addIKM(ikm)
                .addSalt(salt)
                .thenExpand(info, 32);

        KDF kdf = KDF.getInstance("HKDF-SHA256");
        byte[] keyBytes = kdf.deriveData(params);

        System.out.println(keyBytes.length);
        System.out.println(java.util.HexFormat.of().formatHex(keyBytes));
    }
}
```

Real use case:

- per-tenant signing keys
- per-session encryption keys
- standardized key expansion from one root secret

Why this matters:

- standard API instead of ad-hoc crypto helpers
- clearer, safer derivation flows
- easier interoperability with modern cryptographic designs

---

# 9) PEM Encodings of Cryptographic Objects (Preview, JEP 470)

Java 25 preview adds public PEM encoding and decoding support.
This is practical because PEM is everywhere in real systems: TLS keys, certificates, signing keys, and infrastructure automation.

Complete example:

```java
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PEMDecoder;
import java.security.PEMEncoder;
import java.security.PublicKey;

public class PemKeyRoundTrip {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("Ed25519");
        KeyPair pair = generator.generateKeyPair();

        String pem = PEMEncoder.of().encodeToString(pair.getPublic());
        PublicKey decoded = PEMDecoder.of().decode(pem, PublicKey.class);

        System.out.println(pem.lines().findFirst().orElse(""));
        System.out.println(decoded.getAlgorithm());
        System.out.println(java.util.Arrays.equals(pair.getPublic().getEncoded(), decoded.getEncoded()));
    }
}
```

Compile/run preview:

```bash
javac --release 25 --enable-preview PemKeyRoundTrip.java
java --enable-preview PemKeyRoundTrip
```

Real use case:

- load keys from infrastructure-managed PEM files
- convert PEM material into Java security objects
- emit PEM output for interop with external systems

---

# 10) Vector API (Tenth Incubator, JEP 508)

The Vector API continues incubation.
It remains a specialized feature, but for numeric-heavy code it can be extremely valuable.

Complete example:

```java
import jdk.incubator.vector.FloatVector;
import jdk.incubator.vector.VectorOperators;
import jdk.incubator.vector.VectorSpecies;

public class EmbeddingSimilarity {
    private static final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;

    static float dotProduct(float[] left, float[] right) {
        int i = 0;
        float sum = 0f;
        int upperBound = SPECIES.loopBound(left.length);

        for (; i < upperBound; i += SPECIES.length()) {
            var lv = FloatVector.fromArray(SPECIES, left, i);
            var rv = FloatVector.fromArray(SPECIES, right, i);
            sum += lv.mul(rv).reduceLanes(VectorOperators.ADD);
        }

        for (; i < left.length; i++) {
            sum += left[i] * right[i];
        }

        return sum;
    }

    public static void main(String[] args) {
        float[] user = {0.2f, 0.8f, 0.1f, 0.4f, 0.9f, 0.6f};
        float[] item = {0.4f, 0.7f, 0.2f, 0.5f, 0.3f, 0.8f};

        System.out.println(dotProduct(user, item));
    }
}
```

Compile/run:

```bash
javac --release 25 --add-modules jdk.incubator.vector EmbeddingSimilarity.java
java --add-modules jdk.incubator.vector EmbeddingSimilarity
```

Real use case:

- embedding similarity in recommendation systems
- numeric analytics
- signal or image processing pipelines

---

# 11) Stream Gatherers (JEP 485)

Stream Gatherers let you express custom intermediate stream operations without dropping out into hand-written loops everywhere.

Complete example:

```java
import java.util.List;
import java.util.stream.Gatherers;

public class GathererOrderWindows {
    record MetricPoint(String minute, int orders) {}

    public static void main(String[] args) {
        List<MetricPoint> metrics = List.of(
                new MetricPoint("10:00", 12),
                new MetricPoint("10:01", 15),
                new MetricPoint("10:02", 20),
                new MetricPoint("10:03", 21),
                new MetricPoint("10:04", 18)
        );

        var rollingSums = metrics.stream()
                .gather(Gatherers.windowSliding(3))
                .map(window -> window.stream().mapToInt(MetricPoint::orders).sum())
                .toList();

        System.out.println(rollingSums);
    }
}
```

Real use case:

- sliding window analytics
- event batching
- stream reshaping without imperative loop code

Why this matters:

- custom stream behavior becomes first-class
- common windowing logic becomes more readable
- stream pipelines can express richer transformations

---

# 12) Class-File API (JEP 484)

Java 25 provides a standard Class-File API in `java.lang.classfile`.
This matters for build tools, bytecode analyzers, instrumentation, and framework infrastructure.

Complete example:

```java
import java.lang.classfile.ClassFile;
import java.nio.file.Path;

public class ClassFileInspector {
    public static void main(String[] args) throws Exception {
        var classFile = ClassFile.of();
        var model = classFile.parse(Path.of(args[0]));

        System.out.println(model.thisClass().asInternalName());
        System.out.println(model.methods().size());
        System.out.println(model.majorVersion());
    }
}
```

Real use case:

- inspect generated classes in build tooling
- validate bytecode emitted by framework plugins
- replace third-party bytecode readers for simpler inspection tasks

Why this matters:

- standard API instead of ad-hoc parser dependencies
- better foundation for bytecode-aware tools
- easier experimentation in build and instrumentation workflows

---

# 13) JFR CPU-Time Profiling (Experimental, JEP 509)

JFR can now collect CPU-time-based profiling data.
This is useful when wall-clock sampling alone does not explain where CPU is actually going.

Example:

```bash
java -XX:StartFlightRecording=filename=app.jfr,duration=60s -jar app.jar
jfr summary app.jfr
```

Real use case:

- identify true CPU hotspots in a busy service
- compare CPU-heavy versus wait-heavy methods
- troubleshoot performance regressions with less guesswork

---

# 14) JFR Cooperative Sampling (JEP 518)

JFR sampling internals are improved for better scalability and safer stack walking.

Operational benefit:

- lower profiling bias
- better behavior under load
- safer production diagnostics at scale

This is the kind of feature many teams benefit from without touching any application code directly.

---

# 15) JFR Method Timing & Tracing (JEP 520)

JFR adds method timing and tracing capabilities for deeper diagnostics.

Real use case:

- identify which method in a request path is dominating latency
- confirm whether an optimization really moved time out of the hot method

This continues the broader Java 25 theme of making observability more built-in and production-friendly.

---

# 16) Ahead-of-Time Command-Line Ergonomics (JEP 514)

Java 25 improves command-line ergonomics around AOT-related workflows.
For most teams this matters operationally rather than in day-to-day business code.

Practical impact:

- simpler startup and deployment command lines
- fewer confusing flags in AOT-oriented workflows
- easier repeatability in CI and container images

---

# 17) Ahead-of-Time Method Profiling (JEP 515)

The JVM can leverage ahead-of-time method profiling information.

Practical impact:

- faster warm-up for repeatedly deployed services
- better startup behavior for hot methods
- more predictable performance in short-lived environments

This is especially relevant for serverless, autoscaling, and fast-restart deployment patterns.

---

# 18) Late Barrier Expansion for G1 (JEP 475)

HotSpot improves G1 barrier expansion timing for better optimization opportunities.

Practical impact:

- better compiled code in some memory-intensive paths
- potential throughput improvements for G1 users
- one more runtime improvement that lands without requiring application changes

---

# 19) Compact Object Headers (JEP 519)

Java 25 introduces compact object headers as an implementation/runtime feature.

Expected benefit:

- lower memory footprint for object-heavy applications
- better cache efficiency in some workloads
- more objects fitting into the same heap budget

Real use case:

- large domain-object graphs
- cache-heavy services
- event-processing systems with many short-lived objects

Measure memory footprint before and after enabling runtime features like this in your chosen distribution and profile.

---

# 20) Generational Shenandoah (JEP 521)

Java 25 brings generational support to Shenandoah.

Real use case:

- low-latency services with high allocation churn
- systems where Shenandoah already fits the pause-time goals

Practical note:

- availability depends on your JDK distribution
- if your runtime includes Shenandoah, retest pause times, throughput, and allocation behavior with the generational design in mind

---

# 21) Remove the Non-Generational Mode of ZGC (JEP 490)

Java 25 removes the non-generational mode of ZGC.
Operationally, this simplifies the mental model: `-XX:+UseZGC` now means generational ZGC behavior.

Why this matters:

- fewer mode-selection decisions
- simpler tuning assumptions
- one less source of GC configuration drift across environments

---

# 22) Removal: 32-bit x86 Port (JEP 503)

The 32-bit x86 port is removed in Java 25.

Migration note:

- move legacy 32-bit deployments to 64-bit platforms before upgrade
- audit old build agents, desktop launchers, or installer tooling that may still assume x86 32-bit environments

---

# Migration Checklist (Java 21 -> 25)

- verify preview and incubator usage and the required `--enable-preview` paths
- rebaseline GC behavior, especially if you rely on ZGC assumptions
- run memory footprint comparisons if you evaluate compact object headers
- validate security workflows if adopting KDF or PEM APIs
- update CI containers and production JVM flags to JDK 25 equivalents

Run staged performance tests before changing GC, AOT, or JFR tuning knobs.

---

# Practical Adoption Order

1. adopt stable source and library features first (`module import`, compact source files, flexible constructors, `ScopedValue`)
2. apply observability improvements to your profiling playbooks
3. evaluate runtime and GC improvements with controlled benchmarks
4. experiment with preview and incubator features in isolated modules only

This keeps production risk low while still extracting value from the new LTS.

---

# Preview/Incubator Governance for Teams

For features like Structured Concurrency preview, primitive patterns preview, Stable Values preview, PEM preview, and Vector incubator:

- isolate usage behind internal interfaces
- pin compiler and runtime flags in build scripts
- track JEP evolution across updates
- define fallback paths if APIs change

Treat previews as controlled experiments, not core platform dependencies.

---

# Key Takeaways

- Java 25 LTS delivers meaningful source-level ergonomics with module imports, compact source files, and flexible constructor bodies.
- It strengthens modern concurrency with `ScopedValue` finalization and ongoing structured concurrency improvements.
- The KDF, PEM, Gatherers, and Class-File APIs are practical additions for real engineering work, not just academic curiosities.
- Runtime and observability work in Java 25 continues to focus on production performance, startup, and diagnosability at scale.
- As with every modern LTS, the best production approach is to adopt stable features first and isolate previews behind clear boundaries.
