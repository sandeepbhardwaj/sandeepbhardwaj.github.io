---
title: Linked List Cycle II in Java (Find Cycle Start)
date: '2019-07-15'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- fast-slow-pointers
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Linked List Cycle II in Java (LeetCode 142)
seo_description: Find the node where cycle begins in linked list using Floyd cycle
  detection.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the best Floyd fast/slow pointer problems because detection is only half the job.
The real interview value is explaining why the cycle entry can be recovered after the first meeting point.

That second phase is what separates memorization from understanding.

## Quick Summary

| Phase | Goal |
| --- | --- |
| phase 1 | detect whether a cycle exists |
| phase 2 | locate the exact node where the cycle starts |
| key idea | after the meeting point, one pointer from head and one from the meeting point converge at the entry |

The invariant that matters most is:
once slow and fast meet inside the cycle, resetting one pointer to head makes both pointers equally far from the cycle entry.

## Problem Statement

Given the head of a linked list, return the node where the cycle begins.
If there is no cycle, return `null`.

## Java Solution

```java
class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                ListNode p1 = head;
                ListNode p2 = slow;

                while (p1 != p2) {
                    p1 = p1.next;
                    p2 = p2.next;
                }

                return p1;
            }
        }

        return null;
    }
}
```

## Phase 1: Detect the Cycle

Use standard Floyd logic:

- `slow` moves 1 step
- `fast` moves 2 steps

If there is no cycle:

- `fast` eventually reaches `null`

If there is a cycle:

- `fast` laps `slow`
- they meet somewhere inside the cycle

That only proves existence.
It does not yet tell us where the cycle begins.

## Phase 2: Find the Entry

Suppose:

- `a` = distance from head to cycle entry
- `b` = distance from entry to first meeting point
- `c` = remaining distance in the cycle

At the first meeting:

- slow has traveled `a + b`
- fast has traveled `a + b + k(b + c)` for some whole number `k`

Because fast moves twice as fast, the difference in their traveled distance is a whole number of cycle lengths.
That leads to the important result:

- the distance from head to entry
- equals the distance from meeting point to entry when moving forward around the cycle

So after the meeting:

- put one pointer back at head
- keep the other at the meeting point
- move both one step at a time

They meet at the cycle entry.

## Dry Run

List:

```text
3 -> 2 -> 0 -> -4
     ^         |
     |---------|
```

Cycle entry is node `2`.

### Phase 1

- slow and fast eventually meet somewhere inside the loop
- that meeting is not guaranteed to be node `2`

### Phase 2

- `p1 = head`
- `p2 = meetingPoint`
- move both one step at a time

They meet at node `2`.

That is the correct answer.

## Why Reference Equality Matters

This is a linked structure problem, not a value comparison problem.

Two different nodes can both contain the value `2`.
So this is wrong:

```java
node1.val == node2.val
```

What we need is:

```java
node1 == node2
```

The algorithm is about reaching the exact same node object.

## Common Mistakes

1. Returning the first slow/fast meeting point directly.
2. Comparing node values instead of node references.
3. Forgetting `fast != null && fast.next != null`.
4. Memorizing the algebra but not being able to explain the two-phase pointer behavior.

## Interview Explanation That Sounds Strong

A clean explanation is:

1. first use Floyd's algorithm to confirm a cycle exists
2. when slow and fast meet, reset one pointer to head
3. move both one step at a time
4. their next meeting point is the cycle entry

That explanation is usually better than diving straight into formulas.
The formula supports the proof.
The pointer movement tells the story.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Pattern Generalization

This problem belongs to the fast/slow pointer family:

- cycle detection
- midpoint detection
- linked-list splitting
- structural inference without extra memory

The general lesson is that different pointer speeds can reveal shape, not just traverse nodes.

## Key Takeaways

- Floyd's algorithm solves both cycle detection and cycle-entry recovery.
- The first meeting point is inside the loop, not necessarily at the start.
- Resetting one pointer to head is the key move that recovers the exact entry node.
