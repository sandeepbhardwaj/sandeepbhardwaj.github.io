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
author_profile: true
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
This is one of the best fast-and-slow pointer problems because it has two phases:
first prove a cycle exists, then find the exact node where the cycle begins.

---

## Problem 1: Linked List Cycle II

Problem description:
Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return `null`.

What we are solving actually:
Detecting that a cycle exists is not enough. The first meeting point of slow and fast pointers is usually somewhere inside the cycle, not necessarily at the entry. So the real challenge is using that meeting point to recover the cycle start.

What we are doing actually:

1. Run slow and fast pointers to detect whether a cycle exists.
2. If they never meet, return `null`.
3. If they do meet, place one pointer back at the head.
4. Move both pointers one step at a time; their next meeting point is the cycle entry.

```java
class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) { // Meeting point somewhere inside the cycle.
                ListNode p1 = head;
                ListNode p2 = slow;

                while (p1 != p2) {
                    p1 = p1.next; // Move from head toward the cycle start.
                    p2 = p2.next; // Move from meeting point toward the same cycle start.
                }

                return p1;
            }
        }

        return null;
    }
}
```

Debug steps:

- print pointer identities, not just values, while slow and fast move
- test no-cycle, self-cycle, and cycle-starts-in-middle cases
- verify the invariant that phase two moves both pointers at the same speed toward the entry node

---

## Phase 1: Detect a Cycle

The standard Floyd argument applies:

- `slow` moves 1 step
- `fast` moves 2 steps

If there is a cycle, `fast` eventually laps `slow` and they meet.
If there is no cycle, `fast` reaches `null`.

That tells us whether a cycle exists at all.

---

## Phase 2: Find the Entry

Let:

- `a` = distance from head to cycle start
- `b` = distance from cycle start to first meeting point
- `c` = remaining distance in the cycle

At the meeting point:

- slow traveled `a + b`
- fast traveled `a + b + k(b + c)`

Because fast moves twice as fast, the difference between their distances is a whole number of cycle lengths.
That leads to the key result:

- distance from head to cycle start
- equals distance from meeting point to cycle start when walking forward

So resetting one pointer to head and moving both one step at a time makes them meet exactly at the cycle start.

---

## Dry Run Pattern

List:

`3 -> 2 -> 0 -> -4`

and `-4` points back to node `2`

Phase 1:

- slow and fast meet somewhere inside the cycle

Phase 2:

- set `p1 = head`
- set `p2 = meetingPoint`
- move both one step at a time

They meet at node `2`, which is the cycle start.

---

## Why You Must Compare Node References

Do not compare node values.

Different nodes can hold the same value, so:

- `node1.val == node2.val`

does not mean:

- `node1 == node2`

This problem is about meeting at the exact same node object.

---

## Common Mistakes

1. returning the first slow/fast meeting point directly
2. comparing node values instead of node references
3. missing null checks on `fast` and `fast.next`
4. memorizing the formula without understanding the two-phase pointer logic

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- Floyd's algorithm solves both detection and entry-finding
- the first meeting point is inside the cycle, not necessarily at the start
- resetting one pointer to head is the key step that turns detection into exact entry recovery
