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

## Mental Model

The easiest way to understand ABA is to separate value equality from state freshness.
A plain CAS operation can answer this question well:

- is the current value equal to what I expected

It cannot answer this stronger question:

- has nothing important happened since I last inspected this location

ABA is what you get when those two questions diverge.
The location ends up holding `A` again, so equality still matches, but the history in between may have invalidated the first thread's plan.
That is why the problem appears mainly in algorithms where history matters, not just final value.

## A Production-Shaped Example

Imagine a non-blocking stack implemented as linked nodes.
Thread one reads the current head node and plans to pop it.
Before it completes, another thread pops that node, does more work, and later pushes the same logical node reference back to the head.
Now the head looks familiar again.
A plain CAS based only on pointer equality may succeed, even though the structure changed in a way the first thread never observed.

This is the crucial reader lesson:
ABA is rarely about strings like `A`, `B`, and `A` in business code.
It is about stale structural assumptions in pointer-like coordination.
That is why many application engineers never hit it with counters or flags, but custom lock-free data structures absolutely can.

## Testing and Review Notes

If you suspect ABA risk, review for these warning signs:

- custom non-blocking linked structures
- node reuse or pool reuse across updates
- algorithms that depend on "nothing changed since I looked"
- plain CAS on references where version history actually matters

Tests should not only assert final values.
They should exercise repeated interleavings, especially pop-push or remove-reinsert patterns that can make the final reference look unchanged.
In many teams, the most practical mitigation is not heroic testing but design restraint: use `AtomicStampedReference`, versioned state, or higher-level concurrent collections instead of inventing custom lock-free structures unless the need is real.

## When Stamps Are Enough and When They Are Not

A version stamp is often the simplest practical fix because it upgrades the question from "is the value equal" to "is this still the same observed version of the state."
That is enough for many pointer-like coordination algorithms.
But even then, the broader design still matters.
If the structure is complicated enough that freshness, ownership, and reclamation are all hard to explain, the better answer may be to avoid custom lock-free design entirely.

## Why Everyday Atomics Usually Escape ABA

Most application uses of atomics involve counters, flags, or immutable snapshot references where the important question is the current value, not the hidden structural history.
That is why many engineers can use atomics successfully for years without hitting ABA directly.
The problem becomes central only when the algorithm depends on proving that a pointer-like state did not leave and return between observations.

## Reader Shortcut

If you are not building pointer-like lock-free structures, ABA is probably not your first atomic problem.
That perspective matters because it keeps everyday engineering attention on the higher-value concerns: clear invariants, simple synchronization, and maintainable ownership boundaries.

## Second Example: What Plain CAS Misses

The stamped example is the fix.
It is also useful to see the plain reference version that looks fine but loses the history signal.

```java
import java.util.concurrent.atomic.AtomicReference;

public class PlainAbaDemo {

    public static void main(String[] args) {
        AtomicReference<String> slot = new AtomicReference<>("A");

        String observed = slot.get();
        slot.compareAndSet("A", "B");
        slot.compareAndSet("B", "A");

        boolean updated = slot.compareAndSet(observed, "C");
        System.out.println("Plain CAS succeeded? " + updated);
        System.out.println("Current value = " + slot.get());
    }
}
```

This is exactly the issue:

- the final value looks unchanged to the first thread
- plain equality says the update is still safe
- the missing history is what the stamp restores

## Key Takeaways

- ABA means a value changed away from `A` and back to `A`, hiding an important intermediate change.
- Plain compare-and-set may miss that history.
- Stamps or version numbers restore the missing freshness signal.
- ABA mainly matters in custom lock-free structures, not in every atomic use case.

Next post: [LongAdder and LongAccumulator Under Contention](/2025/03/20/longadder-and-longaccumulator-under-contention/)
