---
title: CompletableFuture — Error Handling & Thread Pool Architecture
date: 2026-03-06
categories:
- Java
- CompletableFuture
tags:
- java
- java8
- completablefuture
- backend
- error-handling
- thread-pool
author_profile: true
toc: true
seo_title: CompletableFuture — Error Handling & Thread Pool Architecture
seo_description: Production-ready CompletableFuture patterns for exception handling,
  fallbacks, timeout control, and thread pool architecture.
header:
  overlay_image: "/assets/images/java-8-completablefuture-error-handling-banner.svg"
  overlay_filter: 0.4
  show_overlay_excerpt: false
---
Async code without clear failure policy becomes fragile quickly.
This post focuses on robust `CompletableFuture` error handling and thread-pool design for production systems.

---

# Exception Handling APIs

## `exceptionally`

Use for fallback value on error.

```java
CompletableFuture<User> userF = CompletableFuture
        .supplyAsync(() -> userClient.fetch(userId), ioExecutor)
        .exceptionally(ex -> User.guest(userId));
```

## `handle`

Use when you need both success and failure branches.

```java
CompletableFuture<Response> responseF = future.handle((value, ex) -> {
    if (ex != null) {
        return Response.partial("dependency-failed");
    }
    return Response.ok(value);
});
```

## `whenComplete`

Use for side effects (logging/metrics), not transformation.

```java
future.whenComplete((v, ex) -> {
    if (ex != null) {
        log.error("async call failed", ex);
    }
});
```

---

# Timeout Patterns in Java 8

Java 8 does not provide `orTimeout`/`completeOnTimeout` APIs.
Use scheduled completion.

```java
public static <T> CompletableFuture<T> withTimeout(
        CompletableFuture<T> original,
        long timeoutMs,
        ScheduledExecutorService scheduler) {

    CompletableFuture<T> timeoutFuture = new CompletableFuture<>();
    scheduler.schedule(
            () -> timeoutFuture.completeExceptionally(new TimeoutException("timeout")),
            timeoutMs,
            TimeUnit.MILLISECONDS
    );

    return original.applyToEither(timeoutFuture, Function.identity());
}
```

---

# Fallback Strategy Example

```java
CompletableFuture<CreditScore> creditF = withTimeout(
        CompletableFuture.supplyAsync(() -> creditClient.fetch(userId), ioExecutor),
        300,
        scheduler
).exceptionally(ex -> CreditScore.unknown());
```

This keeps endpoint latency bounded and avoids total failure from one dependency.

That pattern is easier to trust once you can run it.
The two examples below are complete Java 8 programs that show how failures, retries, fallbacks, and executor separation behave in realistic backend-style flows.

---

# Runnable Example 1: Timeout, Retry, and Partial Response

This example simulates an endpoint that assembles a loan eligibility view from:

- user profile
- credit score
- fraud check

The credit service is flaky, so the flow:

- retries it a limited number of times
- applies a timeout
- falls back to `unknown` if it still fails

The endpoint still returns a usable response instead of failing completely.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.function.Supplier;

public class AsyncFailureRecoveryDemo {

    public static void main(String[] args) {
        ExecutorService ioExecutor = Executors.newFixedThreadPool(8);
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        LoanOfferService service = new LoanOfferService(ioExecutor, scheduler);

        long start = System.currentTimeMillis();
        LoanDecisionResponse response = service.fetchLoanDecision("user-42");
        long elapsed = System.currentTimeMillis() - start;

        System.out.println(response);
        System.out.println("Completed in " + elapsed + " ms");

        ioExecutor.shutdown();
        scheduler.shutdown();
    }

    static final class LoanOfferService {
        private final ExecutorService ioExecutor;
        private final ScheduledExecutorService scheduler;
        private final UserClient userClient = new UserClient();
        private final CreditClient creditClient = new CreditClient();
        private final FraudClient fraudClient = new FraudClient();

        LoanOfferService(ExecutorService ioExecutor, ScheduledExecutorService scheduler) {
            this.ioExecutor = ioExecutor;
            this.scheduler = scheduler;
        }

        LoanDecisionResponse fetchLoanDecision(String userId) {
            CompletableFuture<UserProfile> userFuture = CompletableFuture.supplyAsync(
                    () -> userClient.fetch(userId), ioExecutor);

            CompletableFuture<FraudStatus> fraudFuture = CompletableFuture.supplyAsync(
                    () -> fraudClient.fetch(userId), ioExecutor);

            CompletableFuture<CreditScore> creditFuture = withTimeout(
                    retryAsync(
                            () -> CompletableFuture.supplyAsync(() -> creditClient.fetch(userId), ioExecutor),
                            2,
                            scheduler,
                            200
                    ),
                    1200,
                    scheduler
            ).exceptionally(ex -> {
                System.out.println("Credit fallback: " + rootCause(ex).getMessage());
                return CreditScore.unknown();
            });

            return userFuture
                    .thenCombine(fraudFuture, UserFraud::new)
                    .thenCombine(creditFuture, (userFraud, creditScore) ->
                            new LoanDecisionResponse(
                                    userFraud.userProfile,
                                    userFraud.fraudStatus,
                                    creditScore,
                                    decide(userFraud.fraudStatus, creditScore)
                            ))
                    .join();
        }

        String decide(FraudStatus fraudStatus, CreditScore creditScore) {
            if (fraudStatus.flagged) {
                return "MANUAL_REVIEW";
            }
            if (creditScore.value < 0) {
                return "PARTIAL_DATA_REVIEW";
            }
            return creditScore.value >= 700 ? "PRE_APPROVED" : "STANDARD_REVIEW";
        }
    }

    static final class UserClient {
        UserProfile fetch(String userId) {
            sleep(400);
            return new UserProfile(userId, "Enterprise Customer");
        }
    }

    static final class CreditClient {
        private final AtomicInteger attempts = new AtomicInteger();

        CreditScore fetch(String userId) {
            int attempt = attempts.incrementAndGet();
            System.out.println("Credit attempt " + attempt);
            sleep(450);

            if (attempt < 3) {
                throw new RuntimeException("Transient credit bureau failure");
            }
            return new CreditScore(735);
        }
    }

    static final class FraudClient {
        FraudStatus fetch(String userId) {
            sleep(300);
            return new FraudStatus(false);
        }
    }

    static final class UserFraud {
        final UserProfile userProfile;
        final FraudStatus fraudStatus;

        UserFraud(UserProfile userProfile, FraudStatus fraudStatus) {
            this.userProfile = userProfile;
            this.fraudStatus = fraudStatus;
        }
    }

    static final class UserProfile {
        final String userId;
        final String segment;

        UserProfile(String userId, String segment) {
            this.userId = userId;
            this.segment = segment;
        }

        @Override
        public String toString() {
            return "UserProfile{userId='" + userId + "', segment='" + segment + "'}";
        }
    }

    static final class FraudStatus {
        final boolean flagged;

        FraudStatus(boolean flagged) {
            this.flagged = flagged;
        }

        @Override
        public String toString() {
            return "FraudStatus{flagged=" + flagged + "}";
        }
    }

    static final class CreditScore {
        final int value;

        CreditScore(int value) {
            this.value = value;
        }

        static CreditScore unknown() {
            return new CreditScore(-1);
        }

        @Override
        public String toString() {
            return value < 0 ? "CreditScore{unknown}" : "CreditScore{value=" + value + "}";
        }
    }

    static final class LoanDecisionResponse {
        final UserProfile userProfile;
        final FraudStatus fraudStatus;
        final CreditScore creditScore;
        final String decision;

        LoanDecisionResponse(
                UserProfile userProfile,
                FraudStatus fraudStatus,
                CreditScore creditScore,
                String decision) {
            this.userProfile = userProfile;
            this.fraudStatus = fraudStatus;
            this.creditScore = creditScore;
            this.decision = decision;
        }

        @Override
        public String toString() {
            return "LoanDecisionResponse{" +
                    "userProfile=" + userProfile +
                    ", fraudStatus=" + fraudStatus +
                    ", creditScore=" + creditScore +
                    ", decision='" + decision + '\'' +
                    '}';
        }
    }

    static <T> CompletableFuture<T> retryAsync(
            Supplier<CompletableFuture<T>> supplier,
            int maxRetries,
            ScheduledExecutorService scheduler,
            long delayMs) {
        CompletableFuture<T> result = new CompletableFuture<T>();
        attempt(supplier, maxRetries, scheduler, delayMs, result);
        return result;
    }

    static <T> void attempt(
            Supplier<CompletableFuture<T>> supplier,
            int retriesLeft,
            ScheduledExecutorService scheduler,
            long delayMs,
            CompletableFuture<T> result) {
        supplier.get().whenComplete((value, ex) -> {
            if (ex == null) {
                result.complete(value);
                return;
            }
            if (retriesLeft == 0) {
                result.completeExceptionally(rootCause(ex));
                return;
            }
            scheduler.schedule(
                    () -> attempt(supplier, retriesLeft - 1, scheduler, delayMs, result),
                    delayMs,
                    TimeUnit.MILLISECONDS
            );
        });
    }

    static <T> CompletableFuture<T> withTimeout(
            CompletableFuture<T> original,
            long timeoutMs,
            ScheduledExecutorService scheduler) {
        CompletableFuture<T> timeout = new CompletableFuture<T>();
        scheduler.schedule(
                () -> timeout.completeExceptionally(
                        new TimeoutException("Timed out after " + timeoutMs + " ms")),
                timeoutMs,
                TimeUnit.MILLISECONDS
        );
        return original.applyToEither(timeout, Function.identity());
    }

    static Throwable rootCause(Throwable ex) {
        Throwable current = ex;
        while (current instanceof CompletionException && current.getCause() != null) {
            current = current.getCause();
        }
        return current;
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}
```

What this demonstrates:

- bounded retry instead of hidden endless retry loops
- timeout control in plain Java 8
- fallback to partial response instead of total request failure
- exception unwrapping for cleaner logging and policy decisions

If you want to see the fallback path instead of a successful retry path, increase the credit-client sleep or reduce the timeout.

---

# Retry Pattern (Bounded and Explicit)

Avoid hidden infinite retries inside async chains.
Use bounded retry utility with clear attempt count and delay policy.

```java
CompletableFuture<CreditScore> creditF = retryAsync(
        () -> CompletableFuture.supplyAsync(() -> creditClient.fetch(userId), ioExecutor),
        2 // max retries
).exceptionally(ex -> CreditScore.unknown());
```

Keep retry policy dependency-specific; do not apply one global retry rule to all exceptions.

---

# Runnable Example 2: Separate IO and CPU Pools Under Load

This example shows why thread-pool architecture is part of correctness, not just tuning.

The flow:

- fetch three reports using an IO pool
- run a CPU-heavy scoring step on a separate CPU pool
- handle overload with a bounded queue and `CallerRunsPolicy`
- log completion timing with `whenComplete`

This is much closer to how a real backend behaves when remote calls and local computation share the same request path.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ThreadPoolArchitectureDemo {

    public static void main(String[] args) {
        ExecutorService ioExecutor = new ThreadPoolExecutor(
                4, 4, 0L, TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<Runnable>(8),
                new ThreadPoolExecutor.CallerRunsPolicy()
        );

        ExecutorService cpuExecutor = new ThreadPoolExecutor(
                2, 2, 0L, TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<Runnable>(4),
                new ThreadPoolExecutor.CallerRunsPolicy()
        );

        AnalyticsService service = new AnalyticsService(ioExecutor, cpuExecutor);

        List<CompletableFuture<AnalyticsResponse>> requests = new ArrayList<CompletableFuture<AnalyticsResponse>>();
        for (int i = 1; i <= 6; i++) {
            requests.add(service.buildAnalytics("account-" + i));
        }

        CompletableFuture.allOf(requests.toArray(new CompletableFuture[0])).join();

        for (CompletableFuture<AnalyticsResponse> request : requests) {
            System.out.println(request.join());
        }

        ioExecutor.shutdown();
        cpuExecutor.shutdown();
    }

    static final class AnalyticsService {
        private final ExecutorService ioExecutor;
        private final ExecutorService cpuExecutor;
        private final MetricsClient metricsClient = new MetricsClient();
        private final BillingClient billingClient = new BillingClient();
        private final UsageClient usageClient = new UsageClient();

        AnalyticsService(ExecutorService ioExecutor, ExecutorService cpuExecutor) {
            this.ioExecutor = ioExecutor;
            this.cpuExecutor = cpuExecutor;
        }

        CompletableFuture<AnalyticsResponse> buildAnalytics(String accountId) {
            long start = System.nanoTime();

            CompletableFuture<AccountMetrics> metricsFuture = CompletableFuture.supplyAsync(
                    () -> metricsClient.fetch(accountId), ioExecutor);

            CompletableFuture<BillingSnapshot> billingFuture = CompletableFuture.supplyAsync(
                    () -> billingClient.fetch(accountId), ioExecutor);

            CompletableFuture<UsageSnapshot> usageFuture = CompletableFuture.supplyAsync(
                    () -> usageClient.fetch(accountId), ioExecutor);

            return metricsFuture.thenCombine(billingFuture, MetricsBilling::new)
                    .thenCombine(usageFuture, (metricsBilling, usageSnapshot) ->
                            new AnalyticsInput(accountId, metricsBilling.accountMetrics, metricsBilling.billingSnapshot, usageSnapshot))
                    .thenApplyAsync(this::computeScore, cpuExecutor)
                    .whenComplete((value, ex) -> {
                        long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
                        String threadName = Thread.currentThread().getName();
                        if (ex != null) {
                            System.out.println("FAILED " + accountId + " in " + durationMs + " ms on " + threadName);
                        } else {
                            System.out.println("SUCCESS " + accountId + " in " + durationMs + " ms on " + threadName);
                        }
                    });
        }

        AnalyticsResponse computeScore(AnalyticsInput input) {
            busyCpu(250);
            int score = input.accountMetrics.activeUsers + input.usageSnapshot.apiCalls / 100 + input.billingSnapshot.monthlySpend / 1000;
            return new AnalyticsResponse(input.accountId, score);
        }
    }

    static final class MetricsClient {
        AccountMetrics fetch(String accountId) {
            sleep(400);
            return new AccountMetrics(120);
        }
    }

    static final class BillingClient {
        BillingSnapshot fetch(String accountId) {
            sleep(500);
            return new BillingSnapshot(18000);
        }
    }

    static final class UsageClient {
        UsageSnapshot fetch(String accountId) {
            sleep(350);
            return new UsageSnapshot(4200);
        }
    }

    static final class MetricsBilling {
        final AccountMetrics accountMetrics;
        final BillingSnapshot billingSnapshot;

        MetricsBilling(AccountMetrics accountMetrics, BillingSnapshot billingSnapshot) {
            this.accountMetrics = accountMetrics;
            this.billingSnapshot = billingSnapshot;
        }
    }

    static final class AnalyticsInput {
        final String accountId;
        final AccountMetrics accountMetrics;
        final BillingSnapshot billingSnapshot;
        final UsageSnapshot usageSnapshot;

        AnalyticsInput(
                String accountId,
                AccountMetrics accountMetrics,
                BillingSnapshot billingSnapshot,
                UsageSnapshot usageSnapshot) {
            this.accountId = accountId;
            this.accountMetrics = accountMetrics;
            this.billingSnapshot = billingSnapshot;
            this.usageSnapshot = usageSnapshot;
        }
    }

    static final class AccountMetrics {
        final int activeUsers;

        AccountMetrics(int activeUsers) {
            this.activeUsers = activeUsers;
        }
    }

    static final class BillingSnapshot {
        final int monthlySpend;

        BillingSnapshot(int monthlySpend) {
            this.monthlySpend = monthlySpend;
        }
    }

    static final class UsageSnapshot {
        final int apiCalls;

        UsageSnapshot(int apiCalls) {
            this.apiCalls = apiCalls;
        }
    }

    static final class AnalyticsResponse {
        final String accountId;
        final int score;

        AnalyticsResponse(String accountId, int score) {
            this.accountId = accountId;
            this.score = score;
        }

        @Override
        public String toString() {
            return "AnalyticsResponse{accountId='" + accountId + "', score=" + score + "}";
        }
    }

    static void sleep(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }

    static void busyCpu(long millis) {
        long end = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(millis);
        long value = 0;
        while (System.nanoTime() < end) {
            value += System.nanoTime() % 7;
        }
        if (value == -1) {
            System.out.println(value);
        }
    }
}
```

What this demonstrates:

- remote IO and CPU work should not compete in the same executor
- bounded queues expose pressure instead of hiding overload
- `thenApplyAsync(..., cpuExecutor)` makes the thread-boundary explicit
- `whenComplete` is the right place for metrics and completion logging

If you collapse both executors into one small pool, latency gets worse quickly and the flow becomes much harder to reason about.

---

# Thread Pool Architecture

Use separate pools by workload type:

- IO executor for network/database calls
- CPU executor for heavy computation
- scheduler for timeouts/retries

```java
ExecutorService ioExecutor = Executors.newFixedThreadPool(48);
ExecutorService cpuExecutor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
```

Avoid using one giant pool for everything.

---

# Backpressure and Queue Control

Executors with unbounded queues can hide overload until latency explodes.
Prefer bounded queues with explicit rejection behavior in critical services.

```java
ExecutorService ioExecutor = new ThreadPoolExecutor(
        32, 64, 60, TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(500),
        new ThreadPoolExecutor.CallerRunsPolicy()
);
```

This forces pressure back to callers instead of silently buffering unlimited tasks.

---

# Error Taxonomy Guidance

Treat errors differently:

- transient network failures -> retry/fallback
- validation/domain errors -> fail fast
- timeout/circuit open -> degrade gracefully

`CompletionException` wraps inner exception, so unwrap root cause in logging and metrics.

---

# Observability Pattern

```java
long start = System.nanoTime();
future.whenComplete((v, ex) -> {
    long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
    metrics.timer("profile.fetch.ms").record(durationMs, TimeUnit.MILLISECONDS);
    if (ex != null) {
        metrics.counter("profile.fetch.errors").increment();
    }
});
```

Without timing/error metrics, async failures remain invisible until incidents.

---

# Best Practices Checklist

- define timeout per dependency
- implement fallback or partial response policy
- use explicit executors, not common pool
- separate IO and CPU workloads
- unwrap and classify exceptions
- instrument latency and failure counters

---

# Related Posts

- [CompletableFuture Deep Dive](/java/completablefuture/java-8-completablefuture-deep-dive/)
- [Parallel Streams Performance](/java/java-8-parallel-streams-performance/)
- [Java 8 Date & Time API](/java/java-8-date-time-api/)
