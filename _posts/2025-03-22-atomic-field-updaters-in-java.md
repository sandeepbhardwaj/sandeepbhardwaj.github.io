---
title: Atomic Field Updaters in Java
date: 2025-03-22
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- atomic-field-updater
- atomics
- performance
- memory
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Atomic Field Updaters in Java
seo_description: Learn atomic field updaters in Java, when they help reduce
  per-instance overhead, and why they are more fragile than ordinary atomic
  fields.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Atomic field updaters occupy an awkward but useful middle ground.

They let you perform atomic updates on selected `volatile` fields inside normal objects without wrapping every field in its own atomic object.

That can be valuable.
It can also be much more fragile than using ordinary atomic classes directly.

---

## Why They Exist

Suppose you have a very large number of objects and each instance needs:

- one retry counter
- one lifecycle state

Embedding separate `AtomicInteger` or `AtomicReference` fields in every instance increases allocation and indirection.

Atomic field updaters exist so the object can keep plain `volatile` fields while still supporting atomic updates on those fields.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

public class AtomicFieldUpdaterDemo {

    public static void main(String[] args) {
        Session session = new Session("created");

        session.recordRetry();
        session.recordRetry();
        session.promote("created", "running");

        System.out.println("Retries = " + session.retries());
        System.out.println("State = " + session.state());
    }

    static final class Session {
        private static final AtomicIntegerFieldUpdater<Session> RETRIES =
                AtomicIntegerFieldUpdater.newUpdater(Session.class, "retries");
        private static final AtomicReferenceFieldUpdater<Session, String> STATE =
                AtomicReferenceFieldUpdater.newUpdater(
                        Session.class, String.class, "state");

        private volatile int retries;
        private volatile String state;

        Session(String state) {
            this.state = state;
        }

        void recordRetry() {
            RETRIES.incrementAndGet(this);
        }

        boolean promote(String expected, String updated) {
            return STATE.compareAndSet(this, expected, updated);
        }

        int retries() {
            return retries;
        }

        String state() {
            return state;
        }
    }
}
```

The object still looks like an ordinary domain object.
The updater handles the atomic transition logic from the outside.

---

## When They Help

Atomic field updaters are most useful when:

- there are many instances
- per-object memory footprint matters
- only a small number of fields need atomic updates
- you want to avoid separate atomic wrapper objects for every instance

They appear more often in infrastructure libraries than in routine business services.

---

## Why They Are More Fragile

Compared with `AtomicInteger` or `AtomicReference`, field updaters have more constraints:

- the field must be `volatile`
- access rules must allow the updater to reach the field
- the updater type and field type must match exactly
- errors often surface later and are easier to misconfigure

So while they may save some overhead, they are not the cleanest default.

---

## Practical Guidance

Prefer ordinary atomic fields when:

- instance count is modest
- readability matters more than squeezing out wrapper overhead
- you want the simplest possible code

Consider field updaters when:

- profiling or memory analysis justifies them
- you are building high-scale libraries or data structures
- the team is comfortable with the added constraints

---

## Key Takeaways

- Atomic field updaters let you atomically update selected `volatile` fields on ordinary objects.
- They can reduce per-instance overhead when many objects need only a small number of atomic fields.
- They are more brittle and less readable than standard atomic wrapper fields.
- Use them deliberately, not as the default atomic style.

Next post: [VarHandle in Java as the Modern Low Level Concurrency Mechanism](/2025/03/23/varhandle-in-java-as-the-modern-low-level-concurrency-mechanism/)
