# Java Multithreading and Concurrency Series Master Plan

This is the execution roadmap for the full Java multithreading and concurrency series.
It is an internal reference document, not a published post.

Plan summary:

- Start date: January 1, 2025
- End date: June 9, 2025
- Publishing cadence: 1 post daily
- Main posts planned: 160
- Modules planned: 12
- Planned banner count: 12
- Banner strategy: one reusable banner per module, shared by every post in that module
- Writing strategy: roadmap first, then one production-grade post at a time

---

## What This Series Must Achieve

If someone studies this series carefully, they should come away with:

- a correct mental model of threads, memory visibility, and coordination
- the ability to write safe concurrent code in Java 8+ and understand newer Java directions
- the ability to diagnose race conditions, deadlocks, starvation, livelock, and throughput collapse
- practical skill with `synchronized`, `wait`, `notify`, locks, atomics, executors, futures, queues, and coordination utilities
- enough realism that they can apply the material in backend systems, not just toy examples

This means every post needs more than syntax.
Every post should explain:

1. what problem this tool solves
2. what goes wrong without it
3. the exact guarantees it gives
4. where it is misused
5. a realistic example
6. testing, debugging, and performance notes

---

## Teaching Rules for the Series

Each post should include:

- one broken or naive example first
- one correct implementation next
- one realistic backend or systems example
- explanation of thread-safety guarantees in plain language
- notes on trade-offs, contention, fairness, throughput, and failure modes

Recommended recurring domains:

- order processing pipeline
- inventory and stock reservation
- payment and settlement workflow
- report generation and batching
- producer-consumer logging or job processing system
- in-memory cache and read-heavy service

---

## Standard Template for Every Post

To keep the series book-quality, every post should follow a stable structure:

1. problem statement
2. incorrect or naive version
3. correct mental model
4. API explanation
5. complete example
6. failure modes and edge cases
7. performance and trade-offs
8. testing and debugging notes
9. decision guide: when to use and when not to use

---

## Module Banner Map

1. `assets/images/java-concurrency-module-01-foundations-banner.svg`
2. `assets/images/java-concurrency-module-02-thread-basics-banner.svg`
3. `assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg`
4. `assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg`
5. `assets/images/java-concurrency-module-05-volatile-immutability-banner.svg`
6. `assets/images/java-concurrency-module-06-explicit-locks-banner.svg`
7. `assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg`
8. `assets/images/java-concurrency-module-08-coordination-utilities-banner.svg`
9. `assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg`
10. `assets/images/java-concurrency-module-10-executors-futures-banner.svg`
11. `assets/images/java-concurrency-module-11-forkjoin-async-banner.svg`
12. `assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg`

---

## Roadmap

## Module 1: Foundations Before Writing Threads

- Date range: January 1, 2025 to January 10, 2025
- Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
- Planned posts: 10

1. [Why Concurrency Is Hard in Java: Correctness, Latency, Throughput, and Coordination](/java/concurrency/why-concurrency-is-hard-java-correctness-latency-throughput-coordination/)
   Date: January 1, 2025
   Planned file: _posts/2025-01-01-why-concurrency-is-hard-java-correctness-latency-throughput-coordination.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
2. [Process vs Thread vs Task in Java Systems](/java/concurrency/process-vs-thread-vs-task-java-systems/)
   Date: January 2, 2025
   Planned file: _posts/2025-01-02-process-vs-thread-vs-task-java-systems.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
3. [Concurrency vs Parallelism vs Asynchrony in Java](/java/concurrency/concurrency-vs-parallelism-vs-asynchrony-java/)
   Date: January 3, 2025
   Planned file: _posts/2025-01-03-concurrency-vs-parallelism-vs-asynchrony-java.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
4. [Java Thread Lifecycle and Thread States Explained](/java/concurrency/java-thread-lifecycle-and-thread-states-explained/)
   Date: January 4, 2025
   Planned file: _posts/2025-01-04-java-thread-lifecycle-and-thread-states-explained.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
5. [Context Switching and Why Threads Are Expensive](/java/concurrency/context-switching-and-why-threads-are-expensive/)
   Date: January 5, 2025
   Planned file: _posts/2025-01-05-context-switching-and-why-threads-are-expensive.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
6. [Shared Memory vs Message Passing in Java Applications](/java/concurrency/shared-memory-vs-message-passing-java-applications/)
   Date: January 6, 2025
   Planned file: _posts/2025-01-06-shared-memory-vs-message-passing-java-applications.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
7. [CPU Cache Main Memory and Why Visibility Bugs Happen](/java/concurrency/cpu-cache-main-memory-and-why-visibility-bugs-happen/)
   Date: January 7, 2025
   Planned file: _posts/2025-01-07-cpu-cache-main-memory-and-why-visibility-bugs-happen.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
8. [Introduction to the Java Memory Model for Backend Engineers](/java/concurrency/introduction-to-java-memory-model-backend-engineers/)
   Date: January 8, 2025
   Planned file: _posts/2025-01-08-introduction-to-java-memory-model-backend-engineers.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
9. [Happens-Before in Java Explained with Practical Examples](/java/concurrency/happens-before-in-java-explained-with-practical-examples/)
   Date: January 9, 2025
   Planned file: _posts/2025-01-09-happens-before-in-java-explained-with-practical-examples.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg
10. [Atomicity Visibility and Ordering in Java Concurrency](/java/concurrency/atomicity-visibility-ordering-java-concurrency/)
   Date: January 10, 2025
   Planned file: _posts/2025-01-10-atomicity-visibility-ordering-java-concurrency.md
   Planned banner: assets/images/java-concurrency-module-01-foundations-banner.svg

---

## Module 2: Core Thread Basics

- Date range: January 11, 2025 to January 20, 2025
- Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
- Planned posts: 10

11. [Creating Threads with Thread in Java and Where It Breaks Down](/java/concurrency/creating-threads-with-thread-in-java-and-where-it-breaks-down/)
   Date: January 11, 2025
   Planned file: _posts/2025-01-11-creating-threads-with-thread-in-java-and-where-it-breaks-down.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
12. [Runnable in Java Beyond Basics](/java/concurrency/runnable-in-java-beyond-basics/)
   Date: January 12, 2025
   Planned file: _posts/2025-01-12-runnable-in-java-beyond-basics.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
13. [Callable in Java Returning Results from Concurrent Work](/java/concurrency/callable-in-java-returning-results-from-concurrent-work/)
   Date: January 13, 2025
   Planned file: _posts/2025-01-13-callable-in-java-returning-results-from-concurrent-work.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
14. [Naming Threads and Why Thread Identity Matters in Production](/java/concurrency/naming-threads-and-why-thread-identity-matters-in-production/)
   Date: January 14, 2025
   Planned file: _posts/2025-01-14-naming-threads-and-why-thread-identity-matters-in-production.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
15. [Thread Priorities in Java and Why They Rarely Solve Real Problems](/java/concurrency/thread-priorities-in-java-and-why-they-rarely-solve-real-problems/)
   Date: January 15, 2025
   Planned file: _posts/2025-01-15-thread-priorities-in-java-and-why-they-rarely-solve-real-problems.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
16. [sleep yield and Interruption Basics in Java](/java/concurrency/sleep-yield-and-interruption-basics-in-java/)
   Date: January 16, 2025
   Planned file: _posts/2025-01-16-sleep-yield-and-interruption-basics-in-java.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
17. [join in Java Waiting for Thread Completion Correctly](/java/concurrency/join-in-java-waiting-for-thread-completion-correctly/)
   Date: January 17, 2025
   Planned file: _posts/2025-01-17-join-in-java-waiting-for-thread-completion-correctly.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
18. [Daemon Threads in Java and JVM Shutdown Behavior](/java/concurrency/daemon-threads-in-java-and-jvm-shutdown-behavior/)
   Date: January 18, 2025
   Planned file: _posts/2025-01-18-daemon-threads-in-java-and-jvm-shutdown-behavior.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
19. [Cooperative Cancellation with Interruption in Java](/java/concurrency/cooperative-cancellation-with-interruption-in-java/)
   Date: January 19, 2025
   Planned file: _posts/2025-01-19-cooperative-cancellation-with-interruption-in-java.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg
20. [Designing Long Running Tasks to Respond to Interruption Correctly](/java/concurrency/designing-long-running-tasks-to-respond-to-interruption-correctly/)
   Date: January 20, 2025
   Planned file: _posts/2025-01-20-designing-long-running-tasks-to-respond-to-interruption-correctly.md
   Planned banner: assets/images/java-concurrency-module-02-thread-basics-banner.svg

---

## Module 3: Intrinsic Locking and Monitor Mechanics

- Date range: January 21, 2025 to February 3, 2025
- Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
- Planned posts: 14

21. [synchronized Methods and Blocks in Java](/java/concurrency/synchronized-methods-and-blocks-in-java/)
   Date: January 21, 2025
   Planned file: _posts/2025-01-21-synchronized-methods-and-blocks-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
22. [What a Monitor Is in Java and How Intrinsic Locking Works](/java/concurrency/what-a-monitor-is-in-java-and-how-intrinsic-locking-works/)
   Date: January 22, 2025
   Planned file: _posts/2025-01-22-what-a-monitor-is-in-java-and-how-intrinsic-locking-works.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
23. [Object Header Monitor Ownership and Monitor Entry in Java](/java/concurrency/object-header-monitor-ownership-and-monitor-entry-in-java/)
   Date: January 23, 2025
   Planned file: _posts/2025-01-23-object-header-monitor-ownership-and-monitor-entry-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
24. [Mutual Exclusion with synchronized in Java](/java/concurrency/mutual-exclusion-with-synchronized-in-java/)
   Date: January 24, 2025
   Planned file: _posts/2025-01-24-mutual-exclusion-with-synchronized-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
25. [Visibility Guarantees of Entering and Exiting a Java Monitor](/java/concurrency/visibility-guarantees-of-entering-and-exiting-a-java-monitor/)
   Date: January 25, 2025
   Planned file: _posts/2025-01-25-visibility-guarantees-of-entering-and-exiting-a-java-monitor.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
26. [Reentrancy of Intrinsic Locks in Java](/java/concurrency/reentrancy-of-intrinsic-locks-in-java/)
   Date: January 26, 2025
   Planned file: _posts/2025-01-26-reentrancy-of-intrinsic-locks-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
27. [wait notify and notifyAll in Java Explained Properly](/java/concurrency/wait-notify-and-notifyall-in-java-explained-properly/)
   Date: January 27, 2025
   Planned file: _posts/2025-01-27-wait-notify-and-notifyall-in-java-explained-properly.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
28. [Why wait Must Always Be Used in a Loop](/java/concurrency/why-wait-must-always-be-used-in-a-loop/)
   Date: January 28, 2025
   Planned file: _posts/2025-01-28-why-wait-must-always-be-used-in-a-loop.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
29. [Spurious Wakeups and Condition Rechecking in Java](/java/concurrency/spurious-wakeups-and-condition-rechecking-in-java/)
   Date: January 29, 2025
   Planned file: _posts/2025-01-29-spurious-wakeups-and-condition-rechecking-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
30. [Guarded Blocks Pattern in Java Concurrency](/java/concurrency/guarded-blocks-pattern-in-java-concurrency/)
   Date: January 30, 2025
   Planned file: _posts/2025-01-30-guarded-blocks-pattern-in-java-concurrency.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
31. [Producer Consumer with wait and notifyAll in Java](/java/concurrency/producer-consumer-with-wait-and-notifyall-in-java/)
   Date: January 31, 2025
   Planned file: _posts/2025-01-31-producer-consumer-with-wait-and-notifyall-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
32. [Common Bugs with wait and notify in Java](/java/concurrency/common-bugs-with-wait-and-notify-in-java/)
   Date: February 1, 2025
   Planned file: _posts/2025-02-01-common-bugs-with-wait-and-notify-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
33. [Timed Waiting with wait timeout in Java](/java/concurrency/timed-waiting-with-wait-timeout-in-java/)
   Date: February 2, 2025
   Planned file: _posts/2025-02-02-timed-waiting-with-wait-timeout-in-java.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg
34. [Why Low Level Monitor Coordination Becomes Hard to Maintain](/java/concurrency/why-low-level-monitor-coordination-becomes-hard-to-maintain/)
   Date: February 3, 2025
   Planned file: _posts/2025-02-03-why-low-level-monitor-coordination-becomes-hard-to-maintain.md
   Planned banner: assets/images/java-concurrency-module-03-monitors-intrinsic-locks-banner.svg

---

## Module 4: Concurrency Bugs and Failure Modes

- Date range: February 4, 2025 to February 17, 2025
- Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
- Planned posts: 14

35. [Race Conditions with Shared Mutable State in Java](/java/concurrency/race-conditions-with-shared-mutable-state-in-java/)
   Date: February 4, 2025
   Planned file: _posts/2025-02-04-race-conditions-with-shared-mutable-state-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
36. [Check Then Act Race Condition in Java](/java/concurrency/check-then-act-race-condition-in-java/)
   Date: February 5, 2025
   Planned file: _posts/2025-02-05-check-then-act-race-condition-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
37. [Read Modify Write Race Condition in Java](/java/concurrency/read-modify-write-race-condition-in-java/)
   Date: February 6, 2025
   Planned file: _posts/2025-02-06-read-modify-write-race-condition-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
38. [Visibility Bugs Without Synchronization in Java](/java/concurrency/visibility-bugs-without-synchronization-in-java/)
   Date: February 7, 2025
   Planned file: _posts/2025-02-07-visibility-bugs-without-synchronization-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
39. [Lost Updates in Concurrent Java Code](/java/concurrency/lost-updates-in-concurrent-java-code/)
   Date: February 8, 2025
   Planned file: _posts/2025-02-08-lost-updates-in-concurrent-java-code.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
40. [Unsafe Publication in Java and How Objects Leak Broken State](/java/concurrency/unsafe-publication-in-java-and-how-objects-leak-broken-state/)
   Date: February 9, 2025
   Planned file: _posts/2025-02-09-unsafe-publication-in-java-and-how-objects-leak-broken-state.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
41. [Escaping this During Construction in Java](/java/concurrency/escaping-this-during-construction-in-java/)
   Date: February 10, 2025
   Planned file: _posts/2025-02-10-escaping-this-during-construction-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
42. [Deadlock in Java Reproduction Detection and Prevention](/java/concurrency/deadlock-in-java-reproduction-detection-and-prevention/)
   Date: February 11, 2025
   Planned file: _posts/2025-02-11-deadlock-in-java-reproduction-detection-and-prevention.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
43. [Livelock in Java and How It Differs from Deadlock](/java/concurrency/livelock-in-java-and-how-it-differs-from-deadlock/)
   Date: February 12, 2025
   Planned file: _posts/2025-02-12-livelock-in-java-and-how-it-differs-from-deadlock.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
44. [Starvation in Java Concurrency](/java/concurrency/starvation-in-java-concurrency/)
   Date: February 13, 2025
   Planned file: _posts/2025-02-13-starvation-in-java-concurrency.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
45. [Priority Inversion in Concurrent Systems](/java/concurrency/priority-inversion-in-concurrent-systems/)
   Date: February 14, 2025
   Planned file: _posts/2025-02-14-priority-inversion-in-concurrent-systems.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
46. [Thread Leakage and Executor Leakage in Java Services](/java/concurrency/thread-leakage-and-executor-leakage-in-java-services/)
   Date: February 15, 2025
   Planned file: _posts/2025-02-15-thread-leakage-and-executor-leakage-in-java-services.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
47. [False Sharing and Cache Line Contention in Java](/java/concurrency/false-sharing-and-cache-line-contention-in-java/)
   Date: February 16, 2025
   Planned file: _posts/2025-02-16-false-sharing-and-cache-line-contention-in-java.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg
48. [Contention Collapse Under Load in Java Services](/java/concurrency/contention-collapse-under-load-in-java-services/)
   Date: February 17, 2025
   Planned file: _posts/2025-02-17-contention-collapse-under-load-in-java-services.md
   Planned banner: assets/images/java-concurrency-module-04-concurrency-bugs-banner.svg

---

## Module 5: Volatile, Immutability, and Safe Sharing

- Date range: February 18, 2025 to March 1, 2025
- Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
- Planned posts: 12

49. [What volatile Does and Does Not Do in Java](/java/concurrency/what-volatile-does-and-does-not-do-in-java/)
   Date: February 18, 2025
   Planned file: _posts/2025-02-18-what-volatile-does-and-does-not-do-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
50. [Using volatile for Visibility in Java](/java/concurrency/using-volatile-for-visibility-in-java/)
   Date: February 19, 2025
   Planned file: _posts/2025-02-19-using-volatile-for-visibility-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
51. [Why volatile Does Not Make Compound Actions Atomic](/java/concurrency/why-volatile-does-not-make-compound-actions-atomic/)
   Date: February 20, 2025
   Planned file: _posts/2025-02-20-why-volatile-does-not-make-compound-actions-atomic.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
52. [volatile vs synchronized in Java](/java/concurrency/volatile-vs-synchronized-in-java/)
   Date: February 21, 2025
   Planned file: _posts/2025-02-21-volatile-vs-synchronized-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
53. [volatile vs Locks vs Atomics in Java](/java/concurrency/volatile-vs-locks-vs-atomics-in-java/)
   Date: February 22, 2025
   Planned file: _posts/2025-02-22-volatile-vs-locks-vs-atomics-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
54. [Immutable Classes in Java and Why They Simplify Concurrency](/java/concurrency/immutable-classes-in-java-and-why-they-simplify-concurrency/)
   Date: February 23, 2025
   Planned file: _posts/2025-02-23-immutable-classes-in-java-and-why-they-simplify-concurrency.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
55. [Designing Immutable Value Objects in Java](/java/concurrency/designing-immutable-value-objects-in-java/)
   Date: February 24, 2025
   Planned file: _posts/2025-02-24-designing-immutable-value-objects-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
56. [Mutable vs Immutable Classes in Concurrent Systems](/java/concurrency/mutable-vs-immutable-classes-in-concurrent-systems/)
   Date: February 25, 2025
   Planned file: _posts/2025-02-25-mutable-vs-immutable-classes-in-concurrent-systems.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
57. [Thread Confinement and Stack Confinement in Java](/java/concurrency/thread-confinement-and-stack-confinement-in-java/)
   Date: February 26, 2025
   Planned file: _posts/2025-02-26-thread-confinement-and-stack-confinement-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
58. [Safe Publication Patterns in Java](/java/concurrency/safe-publication-patterns-in-java/)
   Date: February 27, 2025
   Planned file: _posts/2025-02-27-safe-publication-patterns-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
59. [Final Fields and Initialization Safety in Java](/java/concurrency/final-fields-and-initialization-safety-in-java/)
   Date: February 28, 2025
   Planned file: _posts/2025-02-28-final-fields-and-initialization-safety-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg
60. [Singleton Publication Done Correctly in Java](/java/concurrency/singleton-publication-done-correctly-in-java/)
   Date: March 1, 2025
   Planned file: _posts/2025-03-01-singleton-publication-done-correctly-in-java.md
   Planned banner: assets/images/java-concurrency-module-05-volatile-immutability-banner.svg

---

## Module 6: Explicit Locks and Conditions

- Date range: March 2, 2025 to March 15, 2025
- Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
- Planned posts: 14

61. [Lock Interface in Java and Why It Exists](/java/concurrency/lock-interface-in-java-and-why-it-exists/)
   Date: March 2, 2025
   Planned file: _posts/2025-03-02-lock-interface-in-java-and-why-it-exists.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
62. [ReentrantLock in Java Deep Dive](/java/concurrency/reentrantlock-in-java-deep-dive/)
   Date: March 3, 2025
   Planned file: _posts/2025-03-03-reentrantlock-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
63. [Fair vs Non Fair Locks in Java](/java/concurrency/fair-vs-non-fair-locks-in-java/)
   Date: March 4, 2025
   Planned file: _posts/2025-03-04-fair-vs-non-fair-locks-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
64. [tryLock and Timed Lock Acquisition in Java](/java/concurrency/trylock-and-timed-lock-acquisition-in-java/)
   Date: March 5, 2025
   Planned file: _posts/2025-03-05-trylock-and-timed-lock-acquisition-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
65. [Interruptible Lock Acquisition in Java](/java/concurrency/interruptible-lock-acquisition-in-java/)
   Date: March 6, 2025
   Planned file: _posts/2025-03-06-interruptible-lock-acquisition-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
66. [Condition in Java as a Structured wait notify Alternative](/java/concurrency/condition-in-java-as-a-structured-wait-notify-alternative/)
   Date: March 7, 2025
   Planned file: _posts/2025-03-07-condition-in-java-as-a-structured-wait-notify-alternative.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
67. [Multiple Condition Queues with Condition in Java](/java/concurrency/multiple-condition-queues-with-condition-in-java/)
   Date: March 8, 2025
   Planned file: _posts/2025-03-08-multiple-condition-queues-with-condition-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
68. [Producer Consumer with ReentrantLock and Condition in Java](/java/concurrency/producer-consumer-with-reentrantlock-and-condition-in-java/)
   Date: March 9, 2025
   Planned file: _posts/2025-03-09-producer-consumer-with-reentrantlock-and-condition-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
69. [ReadWriteLock Mental Model in Java](/java/concurrency/readwritelock-mental-model-in-java/)
   Date: March 10, 2025
   Planned file: _posts/2025-03-10-readwritelock-mental-model-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
70. [ReentrantReadWriteLock for Read Heavy Workloads](/java/concurrency/reentrantreadwritelock-for-read-heavy-workloads/)
   Date: March 11, 2025
   Planned file: _posts/2025-03-11-reentrantreadwritelock-for-read-heavy-workloads.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
71. [Lock Downgrading and Lock Upgrade Limitations in Java](/java/concurrency/lock-downgrading-and-lock-upgrade-limitations-in-java/)
   Date: March 12, 2025
   Planned file: _posts/2025-03-12-lock-downgrading-and-lock-upgrade-limitations-in-java.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
72. [StampedLock in Java Optimistic Read Read Lock and Write Lock](/java/concurrency/stampedlock-in-java-optimistic-read-read-lock-and-write-lock/)
   Date: March 13, 2025
   Planned file: _posts/2025-03-13-stampedlock-in-java-optimistic-read-read-lock-and-write-lock.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
73. [When StampedLock Helps and When It Hurts](/java/concurrency/when-stampedlock-helps-and-when-it-hurts/)
   Date: March 14, 2025
   Planned file: _posts/2025-03-14-when-stampedlock-helps-and-when-it-hurts.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg
74. [Choosing Between synchronized ReentrantLock ReadWriteLock and StampedLock](/java/concurrency/choosing-between-synchronized-reentrantlock-readwritelock-and-stampedlock/)
   Date: March 15, 2025
   Planned file: _posts/2025-03-15-choosing-between-synchronized-reentrantlock-readwritelock-and-stampedlock.md
   Planned banner: assets/images/java-concurrency-module-06-explicit-locks-banner.svg

---

## Module 7: Atomics and Non-Blocking Techniques

- Date range: March 16, 2025 to March 26, 2025
- Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
- Planned posts: 11

75. [Atomic Classes in Java Overview](/java/concurrency/atomic-classes-in-java-overview/)
   Date: March 16, 2025
   Planned file: _posts/2025-03-16-atomic-classes-in-java-overview.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
76. [AtomicInteger AtomicLong AtomicBoolean and AtomicReference in Java](/java/concurrency/atomicinteger-atomiclong-atomicboolean-and-atomicreference-in-java/)
   Date: March 17, 2025
   Planned file: _posts/2025-03-17-atomicinteger-atomiclong-atomicboolean-and-atomicreference-in-java.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
77. [Compare And Set and CAS Loops in Java](/java/concurrency/compare-and-set-and-cas-loops-in-java/)
   Date: March 18, 2025
   Planned file: _posts/2025-03-18-compare-and-set-and-cas-loops-in-java.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
78. [ABA Problem Explained for Java Engineers](/java/concurrency/aba-problem-explained-for-java-engineers/)
   Date: March 19, 2025
   Planned file: _posts/2025-03-19-aba-problem-explained-for-java-engineers.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
79. [LongAdder and LongAccumulator Under Contention](/java/concurrency/longadder-and-longaccumulator-under-contention/)
   Date: March 20, 2025
   Planned file: _posts/2025-03-20-longadder-and-longaccumulator-under-contention.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
80. [Counters Under Contention in Java](/java/concurrency/counters-under-contention-in-java/)
   Date: March 21, 2025
   Planned file: _posts/2025-03-21-counters-under-contention-in-java.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
81. [Atomic Field Updaters in Java](/java/concurrency/atomic-field-updaters-in-java/)
   Date: March 22, 2025
   Planned file: _posts/2025-03-22-atomic-field-updaters-in-java.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
82. [VarHandle in Java as the Modern Low Level Concurrency Mechanism](/java/concurrency/varhandle-in-java-as-the-modern-low-level-concurrency-mechanism/)
   Date: March 23, 2025
   Planned file: _posts/2025-03-23-varhandle-in-java-as-the-modern-low-level-concurrency-mechanism.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
83. [Lock Free vs Wait Free vs Obstruction Free Explained](/java/concurrency/lock-free-vs-wait-free-vs-obstruction-free-explained/)
   Date: March 24, 2025
   Planned file: _posts/2025-03-24-lock-free-vs-wait-free-vs-obstruction-free-explained.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
84. [Building a Non Blocking Stack or Queue in Java](/java/concurrency/building-a-non-blocking-stack-or-queue-in-java/)
   Date: March 25, 2025
   Planned file: _posts/2025-03-25-building-a-non-blocking-stack-or-queue-in-java.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg
85. [Practical Limits of Lock Free Programming in Application Code](/java/concurrency/practical-limits-of-lock-free-programming-in-application-code/)
   Date: March 26, 2025
   Planned file: _posts/2025-03-26-practical-limits-of-lock-free-programming-in-application-code.md
   Planned banner: assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg

---

## Module 8: Coordination Utilities

- Date range: March 27, 2025 to April 6, 2025
- Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
- Planned posts: 11

86. [CountDownLatch in Java Deep Dive](/java/concurrency/countdownlatch-in-java-deep-dive/)
   Date: March 27, 2025
   Planned file: _posts/2025-03-27-countdownlatch-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
87. [One Shot Gates vs Reusable Barriers in Java](/java/concurrency/one-shot-gates-vs-reusable-barriers-in-java/)
   Date: March 28, 2025
   Planned file: _posts/2025-03-28-one-shot-gates-vs-reusable-barriers-in-java.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
88. [CyclicBarrier in Java Deep Dive](/java/concurrency/cyclicbarrier-in-java-deep-dive/)
   Date: March 29, 2025
   Planned file: _posts/2025-03-29-cyclicbarrier-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
89. [Barrier Action Patterns with CyclicBarrier](/java/concurrency/barrier-action-patterns-with-cyclicbarrier/)
   Date: March 30, 2025
   Planned file: _posts/2025-03-30-barrier-action-patterns-with-cyclicbarrier.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
90. [Phaser in Java for Reusable Phase Coordination](/java/concurrency/phaser-in-java-for-reusable-phase-coordination/)
   Date: March 31, 2025
   Planned file: _posts/2025-03-31-phaser-in-java-for-reusable-phase-coordination.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
91. [Semaphore in Java Deep Dive](/java/concurrency/semaphore-in-java-deep-dive/)
   Date: April 1, 2025
   Planned file: _posts/2025-04-01-semaphore-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
92. [Binary Semaphore vs Counting Semaphore in Java](/java/concurrency/binary-semaphore-vs-counting-semaphore-in-java/)
   Date: April 2, 2025
   Planned file: _posts/2025-04-02-binary-semaphore-vs-counting-semaphore-in-java.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
93. [Rate Limiting and Concurrency Limiting with Semaphore](/java/concurrency/rate-limiting-and-concurrency-limiting-with-semaphore/)
   Date: April 3, 2025
   Planned file: _posts/2025-04-03-rate-limiting-and-concurrency-limiting-with-semaphore.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
94. [Exchanger in Java and When It Is Useful](/java/concurrency/exchanger-in-java-and-when-it-is-useful/)
   Date: April 4, 2025
   Planned file: _posts/2025-04-04-exchanger-in-java-and-when-it-is-useful.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
95. [CompletableFuture as a Coordination Primitive](/java/concurrency/completablefuture-as-a-coordination-primitive/)
   Date: April 5, 2025
   Planned file: _posts/2025-04-05-completablefuture-as-a-coordination-primitive.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg
96. [Choosing the Right Coordination Utility in Java](/java/concurrency/choosing-the-right-coordination-utility-in-java/)
   Date: April 6, 2025
   Planned file: _posts/2025-04-06-choosing-the-right-coordination-utility-in-java.md
   Planned banner: assets/images/java-concurrency-module-08-coordination-utilities-banner.svg

---

## Module 9: Concurrent Collections and Blocking Queues

- Date range: April 7, 2025 to April 23, 2025
- Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
- Planned posts: 17

97. [Why Ordinary Collections Are Unsafe Under Concurrent Mutation](/java/concurrency/why-ordinary-collections-are-unsafe-under-concurrent-mutation/)
   Date: April 7, 2025
   Planned file: _posts/2025-04-07-why-ordinary-collections-are-unsafe-under-concurrent-mutation.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
98. [Synchronized Wrappers vs Concurrent Collections in Java](/java/concurrency/synchronized-wrappers-vs-concurrent-collections-in-java/)
   Date: April 8, 2025
   Planned file: _posts/2025-04-08-synchronized-wrappers-vs-concurrent-collections-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
99. [ConcurrentHashMap in Java Deep Dive](/java/concurrency/concurrenthashmap-in-java-deep-dive/)
   Date: April 9, 2025
   Planned file: _posts/2025-04-09-concurrenthashmap-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
100. [Compound Actions on ConcurrentHashMap Done Correctly](/java/concurrency/compound-actions-on-concurrenthashmap-done-correctly/)
   Date: April 10, 2025
   Planned file: _posts/2025-04-10-compound-actions-on-concurrenthashmap-done-correctly.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
101. [CopyOnWriteArrayList in Java and When It Fits](/java/concurrency/copyonwritearraylist-in-java-and-when-it-fits/)
   Date: April 11, 2025
   Planned file: _posts/2025-04-11-copyonwritearraylist-in-java-and-when-it-fits.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
102. [ConcurrentLinkedQueue in Java](/java/concurrency/concurrentlinkedqueue-in-java/)
   Date: April 12, 2025
   Planned file: _posts/2025-04-12-concurrentlinkedqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
103. [ConcurrentSkipListMap and Sorted Concurrent Structures](/java/concurrency/concurrentskiplistmap-and-sorted-concurrent-structures/)
   Date: April 13, 2025
   Planned file: _posts/2025-04-13-concurrentskiplistmap-and-sorted-concurrent-structures.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
104. [BlockingQueue in Java Overview](/java/concurrency/blockingqueue-in-java-overview/)
   Date: April 14, 2025
   Planned file: _posts/2025-04-14-blockingqueue-in-java-overview.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
105. [ArrayBlockingQueue in Java](/java/concurrency/arrayblockingqueue-in-java/)
   Date: April 15, 2025
   Planned file: _posts/2025-04-15-arrayblockingqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
106. [LinkedBlockingQueue in Java](/java/concurrency/linkedblockingqueue-in-java/)
   Date: April 16, 2025
   Planned file: _posts/2025-04-16-linkedblockingqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
107. [PriorityBlockingQueue in Java](/java/concurrency/priorityblockingqueue-in-java/)
   Date: April 17, 2025
   Planned file: _posts/2025-04-17-priorityblockingqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
108. [DelayQueue in Java](/java/concurrency/delayqueue-in-java/)
   Date: April 18, 2025
   Planned file: _posts/2025-04-18-delayqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
109. [SynchronousQueue in Java](/java/concurrency/synchronousqueue-in-java/)
   Date: April 19, 2025
   Planned file: _posts/2025-04-19-synchronousqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
110. [Producer Consumer with BlockingQueue in Java](/java/concurrency/producer-consumer-with-blockingqueue-in-java/)
   Date: April 20, 2025
   Planned file: _posts/2025-04-20-producer-consumer-with-blockingqueue-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
111. [Bounded Queues and Backpressure in Java Systems](/java/concurrency/bounded-queues-and-backpressure-in-java-systems/)
   Date: April 21, 2025
   Planned file: _posts/2025-04-21-bounded-queues-and-backpressure-in-java-systems.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
112. [Poison Pill Shutdown Pattern in Java](/java/concurrency/poison-pill-shutdown-pattern-in-java/)
   Date: April 22, 2025
   Planned file: _posts/2025-04-22-poison-pill-shutdown-pattern-in-java.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg
113. [Work Queue Design Mistakes in Backend Systems](/java/concurrency/work-queue-design-mistakes-in-backend-systems/)
   Date: April 23, 2025
   Planned file: _posts/2025-04-23-work-queue-design-mistakes-in-backend-systems.md
   Planned banner: assets/images/java-concurrency-module-09-concurrent-collections-queues-banner.svg

---

## Module 10: Executors, Futures, and Task Orchestration

- Date range: April 24, 2025 to May 11, 2025
- Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
- Planned posts: 18

114. [Why Raw Thread Creation Does Not Scale](/java/concurrency/why-raw-thread-creation-does-not-scale/)
   Date: April 24, 2025
   Planned file: _posts/2025-04-24-why-raw-thread-creation-does-not-scale.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
115. [Executor Framework Overview in Java](/java/concurrency/executor-framework-overview-in-java/)
   Date: April 25, 2025
   Planned file: _posts/2025-04-25-executor-framework-overview-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
116. [Executor vs ExecutorService in Java](/java/concurrency/executor-vs-executorservice-in-java/)
   Date: April 26, 2025
   Planned file: _posts/2025-04-26-executor-vs-executorservice-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
117. [Fixed Thread Pools in Java](/java/concurrency/fixed-thread-pools-in-java/)
   Date: April 27, 2025
   Planned file: _posts/2025-04-27-fixed-thread-pools-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
118. [Cached Thread Pools in Java](/java/concurrency/cached-thread-pools-in-java/)
   Date: April 28, 2025
   Planned file: _posts/2025-04-28-cached-thread-pools-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
119. [Single Thread Executors in Java](/java/concurrency/single-thread-executors-in-java/)
   Date: April 29, 2025
   Planned file: _posts/2025-04-29-single-thread-executors-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
120. [Scheduled Executors in Java](/java/concurrency/scheduled-executors-in-java/)
   Date: April 30, 2025
   Planned file: _posts/2025-04-30-scheduled-executors-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
121. [Future in Java Deep Dive](/java/concurrency/future-in-java-deep-dive/)
   Date: May 1, 2025
   Planned file: _posts/2025-05-01-future-in-java-deep-dive.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
122. [Cancellation and Interruption with Future in Java](/java/concurrency/cancellation-and-interruption-with-future-in-java/)
   Date: May 2, 2025
   Planned file: _posts/2025-05-02-cancellation-and-interruption-with-future-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
123. [invokeAll and invokeAny in Java](/java/concurrency/invokeall-and-invokeany-in-java/)
   Date: May 3, 2025
   Planned file: _posts/2025-05-03-invokeall-and-invokeany-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
124. [CompletionService in Java for Fastest Result Collection](/java/concurrency/completionservice-in-java-for-fastest-result-collection/)
   Date: May 4, 2025
   Planned file: _posts/2025-05-04-completionservice-in-java-for-fastest-result-collection.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
125. [Thread Pool Sizing for CPU Bound Workloads](/java/concurrency/thread-pool-sizing-for-cpu-bound-workloads/)
   Date: May 5, 2025
   Planned file: _posts/2025-05-05-thread-pool-sizing-for-cpu-bound-workloads.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
126. [Thread Pool Sizing for IO Bound Workloads](/java/concurrency/thread-pool-sizing-for-io-bound-workloads/)
   Date: May 6, 2025
   Planned file: _posts/2025-05-06-thread-pool-sizing-for-io-bound-workloads.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
127. [Queue Choice in ThreadPoolExecutor](/java/concurrency/queue-choice-in-threadpoolexecutor/)
   Date: May 7, 2025
   Planned file: _posts/2025-05-07-queue-choice-in-threadpoolexecutor.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
128. [Rejection Policies and Overload Behavior in ThreadPoolExecutor](/java/concurrency/rejection-policies-and-overload-behavior-in-threadpoolexecutor/)
   Date: May 8, 2025
   Planned file: _posts/2025-05-08-rejection-policies-and-overload-behavior-in-threadpoolexecutor.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
129. [Custom ThreadFactory in Java](/java/concurrency/custom-threadfactory-in-java/)
   Date: May 9, 2025
   Planned file: _posts/2025-05-09-custom-threadfactory-in-java.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
130. [Metrics and Instrumentation for Executors in Production](/java/concurrency/metrics-and-instrumentation-for-executors-in-production/)
   Date: May 10, 2025
   Planned file: _posts/2025-05-10-metrics-and-instrumentation-for-executors-in-production.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg
131. [Thread Pool Anti Patterns in Backend Services](/java/concurrency/thread-pool-anti-patterns-in-backend-services/)
   Date: May 11, 2025
   Planned file: _posts/2025-05-11-thread-pool-anti-patterns-in-backend-services.md
   Planned banner: assets/images/java-concurrency-module-10-executors-futures-banner.svg

---

## Module 11: Fork/Join, Parallelism, and Async Composition

- Date range: May 12, 2025 to May 26, 2025
- Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
- Planned posts: 15

132. [Fork Join Framework Mental Model](/java/concurrency/fork-join-framework-mental-model/)
   Date: May 12, 2025
   Planned file: _posts/2025-05-12-fork-join-framework-mental-model.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
133. [Work Stealing in Java Fork Join Pool](/java/concurrency/work-stealing-in-java-fork-join-pool/)
   Date: May 13, 2025
   Planned file: _posts/2025-05-13-work-stealing-in-java-fork-join-pool.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
134. [RecursiveTask in Java with Production Style Examples](/java/concurrency/recursivetask-in-java-with-production-style-examples/)
   Date: May 14, 2025
   Planned file: _posts/2025-05-14-recursivetask-in-java-with-production-style-examples.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
135. [RecursiveAction in Java with Production Style Examples](/java/concurrency/recursiveaction-in-java-with-production-style-examples/)
   Date: May 15, 2025
   Planned file: _posts/2025-05-15-recursiveaction-in-java-with-production-style-examples.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
136. [Choosing Task Granularity in Fork Join Workloads](/java/concurrency/choosing-task-granularity-in-fork-join-workloads/)
   Date: May 16, 2025
   Planned file: _posts/2025-05-16-choosing-task-granularity-in-fork-join-workloads.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
137. [Performance Traps in Fork Join Code](/java/concurrency/performance-traps-in-fork-join-code/)
   Date: May 17, 2025
   Planned file: _posts/2025-05-17-performance-traps-in-fork-join-code.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
138. [Parallel Streams and the Common Pool in Java](/java/concurrency/parallel-streams-and-the-common-pool-in-java/)
   Date: May 18, 2025
   Planned file: _posts/2025-05-18-parallel-streams-and-the-common-pool-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
139. [When Parallel Streams Help and When They Hurt](/java/concurrency/when-parallel-streams-help-and-when-they-hurt/)
   Date: May 19, 2025
   Planned file: _posts/2025-05-19-when-parallel-streams-help-and-when-they-hurt.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
140. [CompletableFuture Fundamentals in Java](/java/concurrency/completablefuture-fundamentals-in-java/)
   Date: May 20, 2025
   Planned file: _posts/2025-05-20-completablefuture-fundamentals-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
141. [thenApply thenCompose thenCombine allOf and anyOf in CompletableFuture](/java/concurrency/thenapply-thencompose-thencombine-allof-and-anyof-in-completablefuture/)
   Date: May 21, 2025
   Planned file: _posts/2025-05-21-thenapply-thencompose-thencombine-allof-and-anyof-in-completablefuture.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
142. [Error Handling with CompletableFuture in Java](/java/concurrency/error-handling-with-completablefuture-in-java/)
   Date: May 22, 2025
   Planned file: _posts/2025-05-22-error-handling-with-completablefuture-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
143. [Timeouts and Fallback with CompletableFuture in Java](/java/concurrency/timeouts-and-fallback-with-completablefuture-in-java/)
   Date: May 23, 2025
   Planned file: _posts/2025-05-23-timeouts-and-fallback-with-completablefuture-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
144. [Thread Pool Architecture for Async Backends in Java](/java/concurrency/thread-pool-architecture-for-async-backends-in-java/)
   Date: May 24, 2025
   Planned file: _posts/2025-05-24-thread-pool-architecture-for-async-backends-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
145. [CompletableFuture vs Blocking Future in Java](/java/concurrency/completablefuture-vs-blocking-future-in-java/)
   Date: May 25, 2025
   Planned file: _posts/2025-05-25-completablefuture-vs-blocking-future-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg
146. [Async Orchestration Patterns for Service Aggregation in Java](/java/concurrency/async-orchestration-patterns-for-service-aggregation-in-java/)
   Date: May 26, 2025
   Planned file: _posts/2025-05-26-async-orchestration-patterns-for-service-aggregation-in-java.md
   Planned banner: assets/images/java-concurrency-module-11-forkjoin-async-banner.svg

---

## Module 12: Testing, Diagnostics, and Modern Java Concurrency

- Date range: May 27, 2025 to June 9, 2025
- Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
- Planned posts: 14

147. [How to Test Concurrent Code Without Fooling Yourself](/java/concurrency/how-to-test-concurrent-code-without-fooling-yourself/)
   Date: May 27, 2025
   Planned file: _posts/2025-05-27-how-to-test-concurrent-code-without-fooling-yourself.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
148. [Deterministic Testing Techniques for Concurrent Java Code](/java/concurrency/deterministic-testing-techniques-for-concurrent-java-code/)
   Date: May 28, 2025
   Planned file: _posts/2025-05-28-deterministic-testing-techniques-for-concurrent-java-code.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
149. [Stress Testing and Repeated Run Strategy for Concurrency Bugs](/java/concurrency/stress-testing-and-repeated-run-strategy-for-concurrency-bugs/)
   Date: May 29, 2025
   Planned file: _posts/2025-05-29-stress-testing-and-repeated-run-strategy-for-concurrency-bugs.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
150. [Detecting Deadlocks with Thread Dumps in Java](/java/concurrency/detecting-deadlocks-with-thread-dumps-in-java/)
   Date: May 30, 2025
   Planned file: _posts/2025-05-30-detecting-deadlocks-with-thread-dumps-in-java.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
151. [Reading Thread Dumps Effectively for Java Incidents](/java/concurrency/reading-thread-dumps-effectively-for-java-incidents/)
   Date: May 31, 2025
   Planned file: _posts/2025-05-31-reading-thread-dumps-effectively-for-java-incidents.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
152. [Using JFR to Diagnose Concurrency Issues in Java](/java/concurrency/using-jfr-to-diagnose-concurrency-issues-in-java/)
   Date: June 1, 2025
   Planned file: _posts/2025-06-01-using-jfr-to-diagnose-concurrency-issues-in-java.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
153. [Lock Contention Profiling in Java](/java/concurrency/lock-contention-profiling-in-java/)
   Date: June 2, 2025
   Planned file: _posts/2025-06-02-lock-contention-profiling-in-java.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
154. [Benchmarking Concurrency Correctly with JMH](/java/concurrency/benchmarking-concurrency-correctly-with-jmh/)
   Date: June 3, 2025
   Planned file: _posts/2025-06-03-benchmarking-concurrency-correctly-with-jmh.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
155. [Virtual Threads in Java 21 for Backend Engineers](/java/concurrency/virtual-threads-in-java-21-for-backend-engineers/)
   Date: June 4, 2025
   Planned file: _posts/2025-06-04-virtual-threads-in-java-21-for-backend-engineers.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
156. [Structured Concurrency in Java 21](/java/concurrency/structured-concurrency-in-java-21/)
   Date: June 5, 2025
   Planned file: _posts/2025-06-05-structured-concurrency-in-java-21.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
157. [ThreadLocal Pitfalls and Context Propagation in Java](/java/concurrency/threadlocal-pitfalls-and-context-propagation-in-java/)
   Date: June 6, 2025
   Planned file: _posts/2025-06-06-threadlocal-pitfalls-and-context-propagation-in-java.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
158. [Reactive vs Thread Per Request vs Virtual Threads](/java/concurrency/reactive-vs-thread-per-request-vs-virtual-threads/)
   Date: June 7, 2025
   Planned file: _posts/2025-06-07-reactive-vs-thread-per-request-vs-virtual-threads.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
159. [How Modern Java Changes Concurrency Design Choices](/java/concurrency/how-modern-java-changes-concurrency-design-choices/)
   Date: June 8, 2025
   Planned file: _posts/2025-06-08-how-modern-java-changes-concurrency-design-choices.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg
160. [How to Choose the Right Concurrency Primitive in Java](/java/concurrency/how-to-choose-the-right-concurrency-primitive-in-java/)
   Date: June 9, 2025
   Planned file: _posts/2025-06-09-how-to-choose-the-right-concurrency-primitive-in-java.md
   Planned banner: assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg

---

## Topic Checklist So We Do Not Miss Anything

- `Thread`
- `Runnable`
- `Callable`
- `Future`
- `CompletableFuture`
- `Executor`
- `ExecutorService`
- `ScheduledExecutorService`
- `ThreadPoolExecutor`
- Fork/Join framework
- parallel streams
- `synchronized`
- monitor
- intrinsic lock
- `wait`
- `notify`
- `notifyAll`
- `Lock`
- `ReentrantLock`
- `Condition`
- `ReadWriteLock`
- `ReentrantReadWriteLock`
- `StampedLock`
- `volatile`
- immutable classes
- mutable classes
- atomic classes
- `LongAdder`
- `CountDownLatch`
- `CyclicBarrier`
- `Phaser`
- `Semaphore`
- `Exchanger`
- `BlockingQueue`
- `ArrayBlockingQueue`
- `LinkedBlockingQueue`
- `PriorityBlockingQueue`
- `DelayQueue`
- `SynchronousQueue`
- `ConcurrentHashMap`
- `CopyOnWriteArrayList`
- `ConcurrentLinkedQueue`
- interruption
- cancellation
- deadlock
- livelock
- starvation
- race conditions
- visibility bugs
- safe publication
- happens-before
- Java Memory Model
- producer-consumer
- backpressure
- contention
- fairness
- false sharing
- thread dumps
- JFR
- JMH
- virtual threads
- structured concurrency

---

## Execution Note

This plan assumes one post per day from January 1, 2025 through June 9, 2025.
The roadmap should stay stable, and the actual writing should proceed one post at a time with production-grade examples.
