---
title: Building a Non Blocking Stack or Queue in Java
date: 2025-03-25
categories:
- Java
- Concurrency
tags:
- java
- concurrency
- non-blocking
- lock-free
- stack
- queue
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Building a Non Blocking Stack or Queue in Java
seo_description: Learn the basic shape of a non-blocking stack in Java with
  AtomicReference, and why queues are harder than they first appear.
header:
  overlay_image: "/assets/images/java-concurrency-module-07-atomics-non-blocking-banner.svg"
  overlay_filter: 0.35
  caption: Java Concurrency Series - Module 7
  show_overlay_excerpt: false
---
Once you understand CAS loops, the next natural question is:

- can I build a real non-blocking data structure with them

Yes.

The simplest classic example is a stack backed by an atomic head reference.
It is much easier than a queue, which is why stacks are usually the teaching starting point.

---

## Problem Statement

A stack only needs one changing top pointer:

- push puts a new node at the head
- pop removes the current head

That makes it a good candidate for a compare-and-set loop.

The rule is straightforward:

- observe the current head
- compute the new head
- install it only if the head is still what you observed

---

## Runnable Example

```java
import java.util.concurrent.atomic.AtomicReference;

public class LockFreeStackDemo {

    public static void main(String[] args) {
        LockFreeStack<String> stack = new LockFreeStack<>();
        stack.push("A");
        stack.push("B");
        stack.push("C");

        System.out.println(stack.pop());
        System.out.println(stack.pop());
        System.out.println(stack.pop());
        System.out.println(stack.pop());
    }

    static final class LockFreeStack<T> {
        private final AtomicReference<Node<T>> head = new AtomicReference<>();

        void push(T value) {
            while (true) {
                Node<T> currentHead = head.get();
                Node<T> newHead = new Node<>(value, currentHead);
                if (head.compareAndSet(currentHead, newHead)) {
                    return;
                }
            }
        }

        T pop() {
            while (true) {
                Node<T> currentHead = head.get();
                if (currentHead == null) {
                    return null;
                }

                Node<T> newHead = currentHead.next;
                if (head.compareAndSet(currentHead, newHead)) {
                    return currentHead.value;
                }
            }
        }
    }

    static final class Node<T> {
        private final T value;
        private final Node<T> next;

        Node(T value, Node<T> next) {
            this.value = value;
            this.next = next;
        }
    }
}
```

This is the essential Treiber stack shape:

- one atomic head pointer
- one CAS loop for push
- one CAS loop for pop

---

## Why Queues Are Harder

Queues usually require coordinating both head and tail behavior.

That introduces more edge cases:

- empty transitions
- tail lag
- helping other operations finish
- harder correctness reasoning

That is why a non-blocking queue is a much more advanced structure than a non-blocking stack.

In production application code, you should usually prefer `ConcurrentLinkedQueue` instead of building your own.

---

## Important Caveats

Even the simple stack is not the whole story.

Real concerns include:

- retry cost under contention
- ABA-style edge cases in some designs
- memory churn from node allocation
- debugging complexity compared with locked structures

The algorithm may avoid explicit locks, but it does not avoid complexity.

---

## Practical Guidance

Build a custom non-blocking structure only when:

- you have a specific need not met by JDK collections
- you can test and reason about it rigorously
- the performance goal justifies the complexity

Otherwise use:

- `ConcurrentLinkedQueue`
- `LinkedBlockingQueue`
- a simple locked structure

The standard library already covers most real needs.

---

## Mental Model

A non-blocking stack or queue is not merely "a collection without locks."
It is an algorithm whose correctness depends on many threads coordinating through repeated state observations and conditional updates.
That means the real work is in preserving structural invariants while other threads keep interfering.

For a stack, the core state is often just the head pointer, so the shape is relatively approachable.
For a queue, the state usually involves more moving pieces such as head, tail, and linkage assumptions.
That is one reason non-blocking queues are harder to design and verify correctly than non-blocking stacks.

## Why Backpressure and Ownership Still Matter

Even if the data structure itself is lock-free, the surrounding system still needs a policy for overload.
A non-blocking queue does not magically solve:

- what happens when producers outrun consumers
- how memory growth is bounded
- how cancellation or shutdown interacts with in-flight nodes
- whether retries and contention are acceptable at peak load

That is a valuable reader lesson.
Algorithmic progress guarantees and system-level capacity control are different concerns.
You still need a coherent admission, draining, and observability story around the structure.

## Testing and Review Notes

Custom non-blocking structures need stronger testing than ordinary collection wrappers.
Useful checks include:

- repeated push-pop or enqueue-dequeue races
- integrity assertions on final size and remaining elements
- stress tests that run far longer than a normal unit test
- comparisons against a simpler lock-based version for both correctness and performance

If the benchmark win is small and the maintenance burden is large, the custom structure is often the wrong trade.
For most application teams, built-in concurrent queues are the right default unless there is a measured reason to go lower level.

## Second Example: The Built-In Queue Alternative

A second example matters here because most readers should not build their own queue.
They should recognize when the JDK already provides the right abstraction.

```java
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class ConcurrentLinkedQueueDemo {

    public static void main(String[] args) {
        Queue<String> queue = new ConcurrentLinkedQueue<>();
        queue.offer("A");
        queue.offer("B");

        System.out.println(queue.poll());
        System.out.println(queue.poll());
    }
}
```

This is a useful contrast with the custom stack:

- the lock-free algorithm already exists
- the queue edge cases are already handled
- application code stays focused on business behavior instead of non-blocking algorithm maintenance

## Key Takeaways

- A non-blocking stack can be built with an atomic head pointer and CAS loops.
- Stacks are much simpler than non-blocking queues.
- Avoiding locks does not remove correctness and maintenance cost.
- In production code, prefer standard concurrent collections unless you truly need a custom structure.

Next post: [Practical Limits of Lock Free Programming in Application Code](/java/concurrency/practical-limits-of-lock-free-programming-in-application-code/)
