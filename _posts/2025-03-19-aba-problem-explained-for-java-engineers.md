---
title: ABA Problem Explained for Java Engineers
date: 2025-03-19
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- aba
- cas
- atomicstampedreference
- atomics
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: ABA Problem Explained for Java Engineers
seo_description: Learn the ABA problem in Java, why compare-and-set can miss
  intermediate changes, and how stamped references mitigate the issue.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
The ABA problem is one of the classic edge cases in non-blocking algorithms.

The short version is:

- a thread reads value `A`
- another thread changes it to `B`
- then changes it back to `A`
- the first thread sees `A` again and assumes nothing changed

That assumption can be wrong.

---

## Why This Matters

Plain compare-and-set only checks whether the current value still equals the expected value.

It does not answer a stronger question:

- has this location remained untouched since I last looked?

Those are different questions.
ABA appears when the difference starts to matter.

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicStampedReference;

public class AbaProblemDemo {

    public static void main(String[] args) {
        AtomicStampedReference<String> slot =
                new AtomicStampedReference<>("A", 0);

        int[] observedStamp = new int[1];
        String observedValue = slot.get(observedStamp);

        // Another thread could do this while we are paused:
        slot.compareAndSet("A", "B", 0, 1);
        slot.compareAndSet("B", "A", 1, 2);

        boolean updated = slot.compareAndSet(
                observedValue,
                "C",
                observedStamp[0],
                observedStamp[0] + 1);

        System.out.println("Observed value = " + observedValue);
        System.out.println("Observed stamp = " + observedStamp[0]);
        System.out.println("CAS succeeded? " + updated);
        System.out.println("Current value = " + slot.getReference());
        System.out.println("Current stamp = " + slot.getStamp());
    }
}
```

Even though the value returned to `A`, the stamp changed from `0` to `2`.

That is why the final CAS fails.
The stamped reference preserves the history signal that plain value equality loses.

---

## Where ABA Shows Up

ABA matters most in low-level lock-free structures such as:

- stacks
- queues
- free lists
- pooled node or slot management

It is much less common in everyday business counters and flags.

That is why many application developers never see it directly until they start building custom non-blocking data structures.

---

## Common Mitigations

Typical defenses include:

- version numbers or stamps
- `AtomicStampedReference`
- redesigning ownership so stale observations are less dangerous
- using higher-level concurrent data structures instead of custom lock-free code

In Java, garbage collection removes some memory-reclamation hazards common in lower-level languages, but it does not eliminate ABA itself.

---

## Practical Guidance

Do not overgeneralize the problem.

ABA does not mean "CAS is unsafe."
It means:

- CAS on plain values may be too weak for certain algorithms
- some algorithms need extra state to prove freshness

For ordinary counters, flags, and immutable snapshot swaps, ABA is often irrelevant.
For pointer-like coordination structures, it can be central.

---

## Key Takeaways

- ABA means a value changed away from `A` and back to `A`, hiding an important intermediate change.
- Plain compare-and-set may miss that history.
- Stamps or version numbers restore the missing freshness signal.
- ABA mainly matters in custom lock-free structures, not in every atomic use case.

Next post: [LongAdder and LongAccumulator Under Contention](/2025/03/20/longadder-and-longaccumulator-under-contention/)
