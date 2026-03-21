---
title: Detecting Deadlocks with Thread Dumps in Java
date: 2025-05-30
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- deadlock
- thread-dumps
- debugging
- diagnostics
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Detecting Deadlocks with Thread Dumps in Java
seo_description: Learn how to detect Java deadlocks using thread dumps and what
  to look for when threads wait on each other indefinitely.
header:
  overlay_image: "/assets/images/java-concurrency-module-12-testing-modern-concurrency-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 12
  show_overlay_excerpt: false
---
Deadlocks are one of the few concurrency failures that can leave a system looking alive while useful work has stopped.

The JVM is running.
Threads exist.
CPU may even be low.

But progress is gone because some set of threads is waiting in a cycle that cannot resolve.

Thread dumps are one of the fastest practical tools for diagnosing this.

---

## Problem Statement

A deadlock happens when threads hold resources and wait for each other in a cycle.

A classic shape is:

- thread A holds lock 1 and waits for lock 2
- thread B holds lock 2 and waits for lock 1

The same pattern can happen with more threads and more resources.

From the outside, symptoms often look like:

- hung requests
- stuck jobs
- zero throughput in one subsystem
- test suites that never finish

---

## How Thread Dumps Help

A thread dump shows:

- which threads exist
- what state they are in
- what locks or monitors they hold
- what locks or monitors they are waiting for

That is exactly the information you need to identify a wait cycle.

In many cases, the JVM can even flag a deadlock directly in the dump output.

---

## Useful Commands

Common ways to capture a dump include:

```bash
jstack <pid>
```

or:

```bash
jcmd <pid> Thread.print
```

During a local test hang, capturing multiple dumps a few seconds apart is often more informative than capturing only one.

---

## Runnable Example of the Bug Shape

```java
public class DeadlockDemo {
    private static final Object LOCK_A = new Object();
    private static final Object LOCK_B = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK_A) {
                sleep();
                synchronized (LOCK_B) {
                    System.out.println("t1 done");
                }
            }
        }, "deadlock-t1");

        Thread t2 = new Thread(() -> {
            synchronized (LOCK_B) {
                sleep();
                synchronized (LOCK_A) {
                    System.out.println("t2 done");
                }
            }
        }, "deadlock-t2");

        t1.start();
        t2.start();
    }

    static void sleep() {
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

This is the textbook pattern thread dumps expose very clearly.

---

## What to Look For in the Dump

Focus on:

- threads in `BLOCKED`
- monitor ownership
- lines showing `waiting to lock`
- lines showing `locked`

If thread A is waiting for a lock held by thread B, and thread B is waiting for one held by thread A, you have found the cycle.

The important skill is not reading every thread.
It is following the resource ownership graph.

---

## Common Mistakes During Diagnosis

### Looking at only one suspicious thread

Deadlocks are about relationships between threads, not isolated stack traces.

### Confusing long blocking with deadlock

A slow database call is bad, but it is not automatically a deadlock.

### Capturing only one dump

Multiple dumps can distinguish:

- truly stuck

from:

- just temporarily busy

### Ignoring thread names

Good thread naming dramatically speeds diagnosis.

---

## Prevention Guidance

Common deadlock prevention techniques include:

- consistent lock ordering
- reducing nested locking
- using timeouts where appropriate
- simplifying ownership boundaries

The best deadlock debugging is often deadlock prevention through simpler lock design.

---

## A Repeatable Incident Workflow

Deadlock diagnosis is easier when the team follows the same sequence every time:

1. capture multiple dumps close together
2. let the JVM's own deadlock detection speak first if it can
3. identify the involved thread names and lock owners
4. map those locks back to the code paths and business operation
5. confirm whether the ordering pattern can recur under load

That workflow matters because deadlocks are rarely just about thread state labels.
They are about a cycle in resource ownership, and the cycle is easier to explain when you tie it back to the application operation that created it.

## Prevention Review Notes

After fixing a deadlock, do not stop at the one bug.
Review the broader locking policy:

- do locks have a documented acquisition order
- are large synchronized blocks hiding multiple responsibilities
- could one side be replaced with message passing or queue ownership
- should timeout or interruptible acquisition be part of the design

Those review questions turn a one-off incident into a design improvement instead of a temporary patch.

## Key Takeaways

- Thread dumps are one of the fastest practical ways to detect deadlocks in Java.
- Look for threads waiting on locks held by each other in a cycle.
- Multiple dumps and good thread names make diagnosis much easier.
- Not every blocked thread indicates deadlock, but deadlocks leave a recognizable ownership pattern in dumps.

Next post: [Reading Thread Dumps Effectively for Java Incidents](/java/concurrency/reading-thread-dumps-effectively-for-java-incidents/)
