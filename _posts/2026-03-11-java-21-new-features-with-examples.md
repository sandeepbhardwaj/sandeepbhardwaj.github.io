---
title: Java 21 New Features — Complete Guide with Examples
date: 2026-03-11
categories:
- Java
tags:
- java
- java21
- jdk21
- lts
- backend
- virtual-threads
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Java 21 Features with Examples (Complete Guide)
seo_description: Comprehensive Java 21 LTS guide covering all JDK 21 JEP features
  with practical examples.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Java 21 LTS for High-Scale Systems
  show_overlay_excerpt: false
---
Java 21 is an LTS release with major improvements in concurrency, pattern matching, and collections.
This article covers all JDK 21 release JEPs.
For the features most teams actually use, the examples below are complete, realistic examples instead of tiny syntax snippets.

---

# 1) Virtual Threads (Final, JEP 444)

Virtual threads make thread-per-request and thread-per-task style practical again.
That matters because many backend services spend most of their time waiting on databases, HTTP calls, queues, and caches.

```java
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ShippingQuoteAggregator {
    record ShippingQuote(String carrier, int priceInCents, int etaDays) {}

    static ShippingQuote fetchQuote(String carrier, int weightKg) throws InterruptedException {
        Thread.sleep(200); // simulate blocking HTTP call

        return switch (carrier) {
            case "BlueDart" -> new ShippingQuote(carrier, 5400 + weightKg * 50, 2);
            case "DTDC" -> new ShippingQuote(carrier, 4900 + weightKg * 60, 3);
            default -> new ShippingQuote(carrier, 6200 + weightKg * 40, 1);
        };
    }

    public static void main(String[] args) throws Exception {
        List<String> carriers = List.of("BlueDart", "DTDC", "ExpressX");
        Instant start = Instant.now();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<ShippingQuote>> futures = carriers.stream()
                    .<Callable<ShippingQuote>>map(carrier -> () -> fetchQuote(carrier, 5))
                    .map(executor::submit)
                    .toList();

            for (Future<ShippingQuote> future : futures) {
                System.out.println(future.get());
            }
        }

        System.out.println("Elapsed = " + Duration.between(start, Instant.now()).toMillis() + " ms");
    }
}
```

Real use case:

- a checkout service asks several shipping partners for quotes
- each call is blocking I/O
- the code still stays simple and readable

Why this matters:

- you keep ordinary blocking Java code
- you avoid the complexity of callback-heavy designs for many I/O workflows
- scaling to thousands of tasks becomes much easier than using one platform thread per request

Production advice:

- start with I/O-heavy endpoints, not CPU-heavy jobs
- keep database, HTTP, and queue concurrency limits in place
- watch for thread pinning around long `synchronized` blocks or native calls

---

# 2) Structured Concurrency (Preview, JEP 453)

Structured concurrency treats related concurrent tasks as one unit of work.
This is very useful in request fan-out code where one incoming request triggers several downstream calls.

```java
import java.util.List;
import java.util.concurrent.StructuredTaskScope;

public class CustomerDashboardLoader {
    record Customer(String id, String name) {}
    record Order(String id, int totalInCents) {}
    record Dashboard(Customer customer, List<Order> orders, int loyaltyPoints) {}

    static Customer fetchCustomer(String customerId) throws InterruptedException {
        Thread.sleep(120);
        return new Customer(customerId, "Asha");
    }

    static List<Order> fetchRecentOrders(String customerId) throws InterruptedException {
        Thread.sleep(180);
        return List.of(
                new Order("ORD-1001", 2599),
                new Order("ORD-1002", 4999)
        );
    }

    static int fetchLoyaltyPoints(String customerId) throws InterruptedException {
        Thread.sleep(150);
        return 420;
    }

    static Dashboard loadDashboard(String customerId) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            var customer = scope.fork(() -> fetchCustomer(customerId));
            var orders = scope.fork(() -> fetchRecentOrders(customerId));
            var points = scope.fork(() -> fetchLoyaltyPoints(customerId));

            scope.join().throwIfFailed();

            return new Dashboard(customer.get(), orders.get(), points.get());
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println(loadDashboard("C-101"));
    }
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview CustomerDashboardLoader.java
java --enable-preview CustomerDashboardLoader
```

Real use case:

- fetch customer profile
- fetch recent orders
- fetch reward points
- combine them into one response

Why teams like this model:

- if one subtask fails, sibling tasks can be cancelled cleanly
- task lifetime stays bounded to one lexical scope
- the code structure matches the business operation

---

# 3) Scoped Values (Preview, JEP 446)

Scoped values are an immutable alternative to many `ThreadLocal` use cases.
The most common backend example is request context propagation: request ID, tenant ID, user ID, or tracing metadata.

```java
import java.lang.ScopedValue;
import java.time.Instant;

public class CheckoutAuditDemo {
    record RequestContext(String requestId, String tenantId, String userId) {}

    static final ScopedValue<RequestContext> CONTEXT = ScopedValue.newInstance();

    static void handleCheckout() {
        log("validating cart");
        chargeCard();
        reserveInventory();
        log("checkout completed");
    }

    static void chargeCard() {
        log("calling payment gateway");
    }

    static void reserveInventory() {
        log("reserving inventory");
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
        RequestContext context = new RequestContext("req-2026-0311", "acme-retail", "u-17");
        ScopedValue.where(CONTEXT, context).run(CheckoutAuditDemo::handleCheckout);
    }
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview CheckoutAuditDemo.java
java --enable-preview CheckoutAuditDemo
```

Why this is useful:

- request metadata is bound once and read everywhere below it
- the context is immutable inside the scope
- it is easier to reason about than mutable thread-local state

This fits very well in web applications, job runners, and any code that needs request-scoped metadata.

---

# 4) Sequenced Collections (Final, JEP 431)

Java 21 adds `SequencedCollection`, `SequencedSet`, and `SequencedMap` so ordered collections have a consistent first/last/reversed model.
This sounds small, but it removes a lot of friction around ordered maps, sets, and activity feeds.

```java
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.SequencedMap;

public class RecentOrderFeed {
    record OrderEvent(String orderId, String status, LocalDateTime updatedAt) {}

    static void addMostRecent(SequencedMap<String, OrderEvent> feed, OrderEvent event, int capacity) {
        feed.remove(event.orderId());
        feed.putFirst(event.orderId(), event);

        while (feed.size() > capacity) {
            feed.pollLastEntry();
        }
    }

    public static void main(String[] args) {
        SequencedMap<String, OrderEvent> feed = new LinkedHashMap<>();

        addMostRecent(feed, new OrderEvent("ORD-1001", "PLACED", LocalDateTime.now().minusMinutes(8)), 3);
        addMostRecent(feed, new OrderEvent("ORD-1002", "PACKED", LocalDateTime.now().minusMinutes(6)), 3);
        addMostRecent(feed, new OrderEvent("ORD-1003", "SHIPPED", LocalDateTime.now().minusMinutes(3)), 3);
        addMostRecent(feed, new OrderEvent("ORD-1002", "OUT_FOR_DELIVERY", LocalDateTime.now()), 3);

        System.out.println("Newest event: " + feed.firstEntry());
        System.out.println("Oldest event: " + feed.lastEntry());

        feed.forEach((orderId, event) ->
                System.out.println(orderId + " -> " + event.status() + " at " + event.updatedAt()));
    }
}
```

Real use case:

- recent orders feed
- bounded history list
- LRU-style cache metadata

Why this matters:

- ordered collection code becomes clearer
- no custom helper methods for first/last or reversed views
- `LinkedHashMap` and `LinkedHashSet` become much nicer to use directly

---

# 5) Record Patterns (Final, JEP 440)

Record patterns let you deconstruct record objects directly where you match them.
This is especially helpful when records represent commands, DTOs, or domain events.

```java
import java.math.BigDecimal;

public class FraudReviewRules {
    record Customer(String id, String tier) {}
    record Money(BigDecimal amount, String currency) {}
    record PurchaseOrder(String orderId, Customer customer, Money total) {}

    static String reviewDecision(Object message) {
        if (message instanceof PurchaseOrder(
                String orderId,
                Customer(String customerId, String tier),
                Money(BigDecimal amount, String currency))
                && amount.compareTo(new BigDecimal("10000")) > 0
                && tier.equals("NEW")
                && currency.equals("USD")) {
            return "Send order " + orderId + " for manual review. customer=" + customerId;
        }

        return "Auto-approve";
    }

    public static void main(String[] args) {
        Object risky = new PurchaseOrder(
                "ORD-77",
                new Customer("C-11", "NEW"),
                new Money(new BigDecimal("12000"), "USD")
        );

        Object normal = new PurchaseOrder(
                "ORD-78",
                new Customer("C-12", "GOLD"),
                new Money(new BigDecimal("2200"), "USD")
        );

        System.out.println(reviewDecision(risky));
        System.out.println(reviewDecision(normal));
    }
}
```

Why this is better than older code:

- no manual cast after `instanceof`
- nested extraction stays close to the business rule
- code reads more like the actual data shape

---

# 6) Pattern Matching for `switch` (Final, JEP 441)

Pattern matching for `switch` became final in Java 21.
This is one of the most practical language upgrades in the release because it makes branching over domain types much cleaner.

```java
public class PaymentActionRouter {
    sealed interface PaymentResult permits Approved, Declined, RetryableFailure, ManualReview {}

    record Approved(String authCode, int amountInCents) implements PaymentResult {}
    record Declined(String reason, boolean userCanRetry) implements PaymentResult {}
    record RetryableFailure(int httpStatus, int retryAfterSeconds) implements PaymentResult {}
    record ManualReview(String queueName) implements PaymentResult {}

    static String nextAction(PaymentResult result) {
        return switch (result) {
            case Approved(String authCode, int amountInCents) ->
                    "Capture payment with authCode=" + authCode + " for " + amountInCents + " cents";

            case Declined(String reason, boolean userCanRetry) when userCanRetry ->
                    "Show retry screen: " + reason;

            case Declined(String reason, boolean userCanRetry) ->
                    "Ask customer to use another payment method: " + reason;

            case RetryableFailure(int httpStatus, int retryAfterSeconds) when retryAfterSeconds <= 30 ->
                    "Retry automatically. status=" + httpStatus;

            case RetryableFailure(int httpStatus, int retryAfterSeconds) ->
                    "Move to async recovery queue. retryAfter=" + retryAfterSeconds + "s";

            case ManualReview(String queueName) ->
                    "Send transaction to " + queueName;
        };
    }

    public static void main(String[] args) {
        System.out.println(nextAction(new Approved("AUTH-991", 2599)));
        System.out.println(nextAction(new Declined("CVV mismatch", true)));
        System.out.println(nextAction(new RetryableFailure(503, 45)));
    }
}
```

Why this matters:

- `switch` can now model real application branching logic
- sealed hierarchies become exhaustively checkable
- guards with `when` keep rules readable

This is great for command handlers, workflow engines, API response mapping, and state machines.

---

# 7) String Templates (Preview, JEP 430)

String templates were previewed in Java 21 to make string interpolation and multiline text generation cleaner.

```java
import java.math.BigDecimal;
import java.time.LocalDate;

import static java.lang.StringTemplate.STR;

public class PaymentReminderTemplate {
    public static void main(String[] args) {
        String customer = "Ananya";
        int overdueInvoices = 2;
        BigDecimal outstanding = new BigDecimal("15499.00");

        String email = STR."""
                Hello \{customer},

                You currently have \{overdueInvoices} overdue invoices.
                Total outstanding: INR \{outstanding}
                Please clear payment by \{LocalDate.now().plusDays(3)}.

                Finance Team
                """;

        System.out.println(email);
    }
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview PaymentReminderTemplate.java
java --enable-preview PaymentReminderTemplate
```

Real use case:

- email or notification rendering
- JSON or HTML generation
- cleaner multiline text assembly

Preview caution:

- keep preview features isolated from stable modules
- do not spread them casually across shared libraries
- for stable production code, text blocks plus `formatted()` are still a safe choice

---

# 8) Unnamed Patterns and Variables (Preview, JEP 443)

Unnamed patterns and variables let you say "this value exists, but I do not care about its name."
That sounds minor, but it makes record-heavy matching code much cleaner.

```java
public class AuditClassifier {
    record HttpAuditLine(String requestId, int statusCode, long latencyMillis, String responseBody) {}

    static String classify(Object event) {
        return switch (event) {
            case HttpAuditLine(_, int statusCode, _, _) when statusCode >= 500 -> "page on-call";
            case HttpAuditLine(_, int statusCode, long latencyMillis, _) when latencyMillis > 2_000 ->
                    "investigate latency";
            case HttpAuditLine(_, int statusCode, _, _) when statusCode >= 400 -> "business error";
            case HttpAuditLine(_, _, _, _) -> "healthy";
            default -> "unknown";
        };
    }

    static int parseRetryCount(String raw) {
        try {
            return Integer.parseInt(raw);
        } catch (NumberFormatException _) {
            return 0;
        }
    }

    public static void main(String[] args) {
        System.out.println(classify(new HttpAuditLine("req-1", 503, 120, "downstream unavailable")));
        System.out.println(classify(new HttpAuditLine("req-2", 200, 2500, "ok")));
        System.out.println(parseRetryCount("not-a-number"));
    }
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview AuditClassifier.java
java --enable-preview AuditClassifier
```

Real use case:

- log and audit event classification
- record deconstruction where only one or two fields matter
- ignored exception variables in parsing or validation code

---

# 9) Unnamed Classes and Instance Main Methods (Preview, JEP 445)

This preview reduces ceremony for tiny Java programs and scripts.
It is not a replacement for normal project structure, but it is genuinely useful for one-off utilities and learning.

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

Run it directly:

```bash
java --source 21 --enable-preview FailedOrders.java orders.csv
```

Real use case:

- small operational scripts
- quick CSV or log analyzers
- teaching examples with less ceremony

---

# 10) Generational ZGC (JEP 439)

Generational ZGC extends ZGC with separate young and old generations.
The practical benefit is that short-lived objects can be collected more efficiently, which often improves throughput and lowers GC overhead for allocation-heavy services.

Real use case:

- latency-sensitive pricing service
- recommendation service with lots of short-lived objects
- large-heap API where tail latency matters

In Java 21, enable it explicitly:

```bash
java -XX:+UseZGC -XX:+ZGenerational -Xms8g -Xmx8g -jar pricing-service.jar
```

What to measure during rollout:

- p95 and p99 latency before and after
- allocation stall frequency
- GC CPU cost
- heap occupancy under realistic traffic

Do not switch collectors blindly.
Run a load test with the same traffic profile and heap sizing you use in production.

---

# 11) Key Encapsulation Mechanism API (JEP 452)

Java 21 adds a standard KEM API in `javax.crypto`.
This matters in modern cryptographic designs where two parties need to derive shared key material without directly exchanging the secret itself.

Real use case:

- encrypting a one-time content key for a receiver
- HPKE-style workflows
- building modern secure messaging or transport handshakes

Example flow:

```java
import javax.crypto.KEM;
import javax.crypto.SecretKey;
import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KemWorkflowExample {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("X25519");
        KeyPair receiverKeys = keyPairGenerator.generateKeyPair();

        KEM senderKem = KEM.getInstance("DHKEM");
        KEM.Encapsulator encapsulator = senderKem.newEncapsulator(receiverKeys.getPublic());
        KEM.Encapsulated encapsulated = encapsulator.encapsulate();

        SecretKey senderSecret = encapsulated.key();
        byte[] encapsulationMessage = encapsulated.encapsulation();

        KEM receiverKem = KEM.getInstance("DHKEM");
        KEM.Decapsulator decapsulator = receiverKem.newDecapsulator(receiverKeys.getPrivate());
        SecretKey receiverSecret = decapsulator.decapsulate(encapsulationMessage);

        System.out.println(senderSecret.getAlgorithm());
        System.out.println(receiverSecret.getAlgorithm());
        System.out.println(java.util.Arrays.equals(senderSecret.getEncoded(), receiverSecret.getEncoded()));
    }
}
```

Why this is useful:

- standard API instead of provider-specific abstractions
- cleaner foundation for hybrid and post-quantum-ready designs
- easier integration into application-level crypto workflows

---

# 12) Foreign Function & Memory API (Third Preview, JEP 442)

The Foreign Function & Memory API keeps moving Java away from JNI-heavy native interop.
It gives you a structured way to call native functions and manage off-heap memory.

```java
import java.lang.foreign.Arena;
import java.lang.foreign.FunctionDescriptor;
import java.lang.foreign.Linker;
import java.lang.foreign.MemorySegment;
import java.lang.foreign.SymbolLookup;
import java.lang.invoke.MethodHandle;

import static java.lang.foreign.ValueLayout.ADDRESS;
import static java.lang.foreign.ValueLayout.JAVA_LONG;

public class NativeStrlenDemo {
    public static void main(String[] args) throws Throwable {
        Linker linker = Linker.nativeLinker();
        SymbolLookup libc = linker.defaultLookup();

        MethodHandle strlen = linker.downcallHandle(
                libc.find("strlen").orElseThrow(),
                FunctionDescriptor.of(JAVA_LONG, ADDRESS)
        );

        try (Arena arena = Arena.ofConfined()) {
            MemorySegment text = arena.allocateFrom("shipment-created");
            long length = (long) strlen.invoke(text);
            System.out.println("Native length = " + length);
        }
    }
}
```

Compile/run preview:

```bash
javac --release 21 --enable-preview NativeStrlenDemo.java
java --enable-preview --enable-native-access=ALL-UNNAMED NativeStrlenDemo
```

Real use case:

- calling a native image-processing or compression library
- integrating with an existing C library without JNI boilerplate
- managing off-heap memory with a safer API surface

---

# 13) Vector API (Sixth Incubator, JEP 448)

The Vector API continues incubation for workloads where explicit SIMD can help.
You will not use this in ordinary CRUD code, but it matters in analytics, ML preprocessing, and numeric-heavy systems.

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
javac --release 21 --add-modules jdk.incubator.vector EmbeddingSimilarity.java
java --add-modules jdk.incubator.vector EmbeddingSimilarity
```

Real use case:

- embedding similarity in recommendation systems
- numeric analytics
- signal or image processing loops

---

# 14) Deprecations and Removals in Java 21

- Deprecate Windows 32-bit x86 port for removal (JEP 449)
- Prepare to disallow dynamic agent loading by default (JEP 451)

Practical impact:

- if you still support Windows x86, start planning migration to 64-bit environments
- review APM, profilers, test instrumentation, and hot-attach tooling

Real operational examples:

```bash
# preferred for production agents
java -javaagent:apm-agent.jar -jar app.jar

# explicit opt-in if you still need dynamic attach during troubleshooting
java -XX:+EnableDynamicAgentLoading -jar app.jar

# useful to see who is using instrumentation APIs
java -Djdk.instrument.traceUsage -jar app.jar
```

Why this section matters:

- many teams are more likely to be affected by agent-loading changes than by any syntax feature
- migration work usually shows up in operational tooling, not business code

---

# Production Adoption Strategy

For most backend teams, the safest Java 21 rollout looks like this:

1. runtime upgrade + regression/performance baseline
2. language modernization (switch patterns, record patterns)
3. concurrency modernization (virtual threads for selected endpoints)
4. GC/runtime evaluation (generational ZGC, agent behavior)
5. preview feature experiments in isolated modules only

This minimizes migration risk while capturing practical gains quickly.

---

# Virtual Threads Rollout Checklist

- identify blocking I/O heavy endpoints first
- enforce downstream concurrency budgets (DB/HTTP pool limits)
- track thread pinning and synchronized hot spots
- compare p95/p99 latency and error rates before/after

Virtual threads reduce complexity, but capacity planning still matters.

---

# Preview/Incubator Governance

Java 21 includes several preview/incubator features.
Treat them as opt-in experiments with explicit governance:

- separate build profile for `--enable-preview`
- no accidental dependency from stable modules
- upgrade plan to finalized feature versions in future LTS

This avoids long-term maintenance surprises.

---

# 15) Key Takeaways

- Java 21 is a major LTS release for backend teams.
- Virtual threads are the biggest practical change for high-concurrency I/O services.
- Record patterns and switch patterns make domain code much cleaner.
- Sequenced collections remove a lot of small but common collection friction.
- Generational ZGC and dynamic-agent changes matter during production rollout.
- Preview features are worth learning, but should stay isolated until finalized.
