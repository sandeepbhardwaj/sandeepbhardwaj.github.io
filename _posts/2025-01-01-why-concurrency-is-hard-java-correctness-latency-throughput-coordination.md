---
title: Why Concurrency Is Hard in Java — Correctness, Latency, Throughput, and Coordination
date: 2025-01-01
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- multithreading
- backend
- performance
- synchronization
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Why Concurrency Is Hard in Java
seo_description: Learn why Java concurrency is difficult in production systems through
  realistic examples covering correctness, latency, throughput, shared state, and
  coordination.
header:
  overlay_image: "/assets/images/java-concurrency-module-01-foundations-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 1
  show_overlay_excerpt: false
---
Concurrency is hard because it forces you to optimize several things at once:
correctness, latency, throughput, resource usage, and failure handling.

Most Java concurrency bugs do not look dramatic at first.
They show up as rare stale reads, missing updates, hanging requests, or throughput collapse under load.

This first post sets the baseline for the entire series:
before choosing `synchronized`, `Lock`, `Semaphore`, or `CompletableFuture`, you need a clear model of what concurrency is actually trying to solve and why it so often goes wrong.

---

## The Real Problem

Backend systems rarely use concurrency because “multiple threads sounds faster.”
They use concurrency because the system is under pressure from at least one of these forces:

- many requests need work at the same time
- some work is blocked on I/O while other work could continue
- shared state must stay correct while multiple actors update it
- latency targets force overlapping work instead of serial execution
- throughput goals require controlled parallelism without exhausting resources

That last point matters.
Concurrency is not just about doing more at once.
It is about doing more at once without destroying correctness.

---

## Why Simple Code Stops Being Simple

Single-threaded code is easier because control flow is linear.
When a variable changes, you know where it changed.
When a method returns, you know what happened before it.

Concurrency breaks those assumptions:

- multiple threads can observe or update the same state
- execution order is no longer obvious
- failures can happen in one task while other tasks keep running
- resource contention changes behavior under load

That is why concurrent code is often less about writing instructions and more about establishing guarantees.

The important questions become:

1. who owns this state?
2. who may update it?
3. when are writes visible to other threads?
4. what happens if two threads act at once?
5. what happens if one task stalls, fails, or gets cancelled?

---

## Four Pressures That Shape Concurrent Design

### 1. Correctness

The program must still produce valid results when work overlaps.

Example failures:

- two threads reserve the same inventory
- a shutdown signal is not seen by a worker
- request counters lose increments

### 2. Latency

A request waiting on several downstream calls often needs overlapping work to stay fast.

Example:

- fetch customer profile
- fetch recent orders
- fetch recommendations

If these run sequentially, total latency is the sum.
If they run concurrently, latency is closer to the slowest dependency.

### 3. Throughput

A service may need to process more work per second than one thread can handle.

But more threads is not automatically better:

- threads consume memory
- context switching costs CPU time
- too much contention can make the system slower

### 4. Coordination

Different parts of the system need to agree on ordering and visibility.

Examples:

- a producer should not overrun a consumer
- a batch job should wait for all workers to finish
- readers should not observe partially published configuration

---

## A Naive Example That Looks Fine Until Load

Suppose an order service stores remaining inventory in memory.
The code looks harmless:

```java
public final class InventoryService {
    private int available = 10;

    public boolean reserve(int quantity) {
        if (available >= quantity) {
            available -= quantity;
            return true;
        }
        return false;
    }

    public int availableUnits() {
        return available;
    }
}
```

In a single-threaded test, this behaves correctly.
Under concurrent requests, it does not.

Two threads can both pass the `available >= quantity` check before either writes back the new value.
That creates overselling.

This is the first core lesson of concurrency:
code that is locally reasonable can still be globally broken when interleavings change.

---

## Broken Production-Style Demonstration

The following example is intentionally small enough to run, but shaped like a real backend pressure:
many requests trying to reserve a small shared inventory.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class OversellDemo {

    public static void main(String[] args) throws Exception {
        InventoryService inventoryService = new InventoryService(50);
        ExecutorService executor = Executors.newFixedThreadPool(12);

        List<Callable<Boolean>> tasks = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            tasks.add(() -> inventoryService.reserve(1));
        }

        List<Future<Boolean>> futures = executor.invokeAll(tasks);

        int successCount = 0;
        for (Future<Boolean> future : futures) {
            if (future.get()) {
                successCount++;
            }
        }

        System.out.println("Successful reservations: " + successCount);
        System.out.println("Remaining units: " + inventoryService.availableUnits());

        executor.shutdown();
    }

    static final class InventoryService {
        private int available;

        InventoryService(int available) {
            this.available = available;
        }

        boolean reserve(int quantity) {
            if (available >= quantity) {
                // Simulate real application work between check and update.
                doSomeWork();
                available -= quantity;
                return true;
            }
            return false;
        }

        int availableUnits() {
            return available;
        }

        private void doSomeWork() {
            for (int i = 0; i < 10_000; i++) {
                Math.sqrt(i);
            }
        }
    }
}
```

What can go wrong:

- more than 50 reservations may succeed
- the remaining count may become inconsistent
- the bug may reproduce only sometimes

This is exactly what makes concurrency bugs expensive:
they often pass basic tests and fail under timing variation.

---

## A Safe Version of the Same Boundary

The point of this first post is not to optimize the inventory service.
The point is to show that correctness requires an explicit guarantee.

One simple correct version is:

```java
public final class SafeInventoryService {
    private int available = 10;

    public synchronized boolean reserve(int quantity) {
        if (available >= quantity) {
            available -= quantity;
            return true;
        }
        return false;
    }

    public synchronized int availableUnits() {
        return available;
    }
}
```

This does not solve every future scalability question, but it does establish a real correctness boundary:

- only one thread can run the critical section at a time
- updates are no longer interleaved arbitrarily
- reads observe a consistent value through the same synchronization boundary

That distinction is central to this series:
first establish the guarantee, then improve the design if contention or latency becomes a real problem.

---

## The Correct Mental Shift

When state is shared, the question is no longer “does this code look right?”
The question is “what guarantee makes this update safe?”

That guarantee usually comes from one of these ideas:

- confinement: only one thread owns the state
- immutability: state is never mutated after publication
- synchronization: updates are serialized and visible
- message passing: state changes flow through queues instead of shared mutation
- coordination utilities: threads rendezvous with explicit control points

The rest of this series is really about learning when to apply which guarantee.

---

## A More Realistic Backend Example

Consider a dashboard endpoint that needs:

- account profile from a customer service
- open invoices from a billing service
- fraud flags from a risk service

This endpoint has two competing pressures:

1. it wants concurrency because the downstream calls are independent
2. it wants correctness because timeouts, partial failures, and thread-pool exhaustion must not corrupt the response path

The problem is not just “run three tasks in parallel.”
The real design problem is:

- what executor runs them?
- what is the timeout policy?
- what happens if one dependency fails?
- what happens under overload?
- what state is shared across requests?

That is why concurrency is a design problem, not just a syntax problem.

---

## Production-Grade Example: Latency vs Safety

The example below is deliberately more realistic than a toy thread demo.
It simulates a service aggregating three downstream calls and highlights the tension between latency and control.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class DashboardAggregationPressureDemo {

    public static void main(String[] args) {
        ExecutorService ioExecutor = Executors.newFixedThreadPool(8);
        DashboardService dashboardService = new DashboardService(ioExecutor);

        long start = System.currentTimeMillis();
        DashboardResponse response = dashboardService.fetchDashboard("acct-42");
        long duration = System.currentTimeMillis() - start;

        System.out.println(response);
        System.out.println("Completed in " + duration + " ms");

        ioExecutor.shutdown();
    }

    static final class DashboardService {
        private final ExecutorService ioExecutor;
        private final CustomerClient customerClient = new CustomerClient();
        private final BillingClient billingClient = new BillingClient();
        private final RiskClient riskClient = new RiskClient();

        DashboardService(ExecutorService ioExecutor) {
            this.ioExecutor = ioExecutor;
        }

        DashboardResponse fetchDashboard(String accountId) {
            CompletableFuture<CustomerProfile> profileFuture =
                    CompletableFuture.supplyAsync(() -> customerClient.fetch(accountId), ioExecutor);

            CompletableFuture<InvoiceSummary> invoiceFuture =
                    CompletableFuture.supplyAsync(() -> billingClient.fetch(accountId), ioExecutor);

            CompletableFuture<RiskSummary> riskFuture =
                    CompletableFuture.supplyAsync(() -> riskClient.fetch(accountId), ioExecutor);

            return profileFuture
                    .thenCombine(invoiceFuture, ProfileInvoice::new)
                    .thenCombine(riskFuture,
                            (profileInvoice, riskSummary) -> new DashboardResponse(
                                    profileInvoice.profile,
                                    profileInvoice.invoiceSummary,
                                    riskSummary))
                    .join();
        }
    }

    static final class CustomerClient {
        CustomerProfile fetch(String accountId) {
            sleep(700);
            return new CustomerProfile(accountId, "enterprise");
        }
    }

    static final class BillingClient {
        InvoiceSummary fetch(String accountId) {
            sleep(900);
            return new InvoiceSummary(4, 18200);
        }
    }

    static final class RiskClient {
        RiskSummary fetch(String accountId) {
            sleep(500);
            return new RiskSummary(false);
        }
    }

    static final class ProfileInvoice {
        final CustomerProfile profile;
        final InvoiceSummary invoiceSummary;

        ProfileInvoice(CustomerProfile profile, InvoiceSummary invoiceSummary) {
            this.profile = profile;
            this.invoiceSummary = invoiceSummary;
        }
    }

    static final class CustomerProfile {
        final String accountId;
        final String segment;

        CustomerProfile(String accountId, String segment) {
            this.accountId = accountId;
            this.segment = segment;
        }

        @Override
        public String toString() {
            return "CustomerProfile{accountId='" + accountId + "', segment='" + segment + "'}";
        }
    }

    static final class InvoiceSummary {
        final int openInvoices;
        final int totalDue;

        InvoiceSummary(int openInvoices, int totalDue) {
            this.openInvoices = openInvoices;
            this.totalDue = totalDue;
        }

        @Override
        public String toString() {
            return "InvoiceSummary{openInvoices=" + openInvoices + ", totalDue=" + totalDue + "}";
        }
    }

    static final class RiskSummary {
        final boolean flagged;

        RiskSummary(boolean flagged) {
            this.flagged = flagged;
        }

        @Override
        public String toString() {
            return "RiskSummary{flagged=" + flagged + "}";
        }
    }

    static final class DashboardResponse {
        final CustomerProfile customerProfile;
        final InvoiceSummary invoiceSummary;
        final RiskSummary riskSummary;

        DashboardResponse(
                CustomerProfile customerProfile,
                InvoiceSummary invoiceSummary,
                RiskSummary riskSummary) {
            this.customerProfile = customerProfile;
            this.invoiceSummary = invoiceSummary;
            this.riskSummary = riskSummary;
        }

        @Override
        public String toString() {
            return "DashboardResponse{" +
                    "customerProfile=" + customerProfile +
                    ", invoiceSummary=" + invoiceSummary +
                    ", riskSummary=" + riskSummary +
                    '}';
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
}
```

This example is intentionally not presented as “the final answer.”
It is here to show the concurrency pressure clearly:
latency improves because independent work overlaps, but the design now has to care about executors, failure propagation, timeouts, and cancellation.

Later posts in this series will build the missing pieces step by step.

---

## Where Concurrency Goes Wrong in Real Systems

Most production failures cluster around a small set of mistakes:

- shared mutable state without clear ownership
- wrong assumption about visibility between threads
- too many threads for the workload
- blocking I/O inside the wrong executor
- missing backpressure
- assuming cancellation stops work immediately
- mixing correctness concerns and latency optimization without clear boundaries

If you learn to spot these pressure points early, many concurrency APIs become easier to evaluate.

---

## Performance Trade-Offs Start Early

Even at the first design step, concurrency creates trade-offs:

- more parallel work can reduce latency
- more threads can increase context switching
- more locks can protect correctness but reduce throughput
- more queues can smooth bursts but increase tail latency

There is no free concurrency.
Every gain comes with some coordination cost.

That is why good concurrent design is about controlled overlap, not maximum overlap.

---

## Testing and Debugging Notes

For this stage of the series, the important testing habit is simple:
never trust a single successful run of concurrent code.

Useful early practices:

- rerun concurrency tests many times
- increase thread count to amplify races
- insert small delays in critical sections to widen bad interleavings
- log thread names while learning
- treat flaky tests as serious design signals, not noise

If a bug disappears when you add logging, that does not mean it is fixed.
It often means timing changed.

---

## Decision Guidance

At this stage, the right decision is usually not “which concurrency API should I pick?”
The right decision is:

1. do I truly need shared mutable state here?
2. do I truly need overlapping work here?
3. what correctness guarantee must hold before I optimize latency?

That is the lens for the next posts.

---

## Key Takeaways

- Concurrency is hard because it combines correctness, latency, throughput, and coordination pressure.
- Most bugs come from unclear guarantees, not from complicated syntax.
- Shared mutable state is the main danger zone.
- More concurrency is not automatically better performance.
- The rest of this series will build the guarantees one primitive at a time.

---

## Next Post

[Process vs Thread vs Task in Java Systems](/java/concurrency/process-vs-thread-vs-task-java-systems/)
