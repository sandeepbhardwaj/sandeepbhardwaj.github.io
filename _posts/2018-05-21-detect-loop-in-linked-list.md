---
title: Detect a Loop in Linked List (Floyd Cycle Detection)
date: '2018-05-21'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- fast-slow-pointers
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Detect Loop in Linked List in Java (Floyd Algorithm)
seo_description: Detect cycle in linked list using slow and fast pointers in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Cycle detection is a classic linked-list problem because it turns a structural question into a pointer-speed question.
Floyd's algorithm is short, `O(1)` extra space, and common in interviews because it tests whether you understand topology instead of just syntax.

## Quick Summary

| Signal | What it tells you |
| --- | --- |
| linked list, constant space, cycle question | think fast/slow pointers |
| traversal may never reach `null` | this is a topology problem, not a value problem |
| follow-up may ask for cycle entry | understand the meeting argument, not just the first boolean answer |

The core invariant is:
if a cycle exists, a fast pointer moving two steps at a time must eventually meet a slow pointer moving one step at a time.

## Problem Statement

Given the head of a singly linked list, determine whether the list contains a cycle.

Example:

- Input: `3 -> 2 -> 0 -> -4`, with tail pointing back to node `2`
- Output: `true`

## Why This Is a Topology Problem

We are not asking whether two node values repeat.
We are asking whether following `next` pointers can continue forever.

If the list is acyclic:

- traversal must eventually hit `null`
- `fast` falls off the list

If the list is cyclic:

- both pointers eventually enter the loop
- `fast` gains one node per iteration relative to `slow`
- on a finite cycle, that guarantees a meeting

That is why the algorithm works without storing visited nodes.

## Optimal Approach

1. move `slow` by one step
2. move `fast` by two steps
3. if `fast` or `fast.next` becomes `null`, there is no cycle
4. if `slow == fast`, there is a cycle

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
}
```

## Why the Meeting Must Happen

Once both pointers are inside the cycle:

- `slow` advances by 1
- `fast` advances by 2

So `fast` gains 1 step per round.
Think of it as a circular track:
if one runner gains one step each lap, they must eventually land on the same position.

The important detail is that we compare node references, not node values.
Two different nodes may store the same value and still mean nothing about cycles.

## Dry Run

Consider:

`1 -> 2 -> 3 -> 4 -> 5`

with `5.next = 3`

1. start: `slow = 1`, `fast = 1`
2. move: `slow = 2`, `fast = 3`
3. move: `slow = 3`, `fast = 5`
4. move: `slow = 4`, `fast = 4`

They meet at node `4`, so a cycle exists.

## Common Mistakes

1. forgetting to check both `fast != null` and `fast.next != null`
2. comparing `slow.val == fast.val` instead of `slow == fast`
3. assuming a single-node list always has a cycle
4. assuming the first meeting point is the cycle entry

## Debug Checklist

- print pointer identities, not just values
- test an empty list
- test a one-node list with no cycle
- test a one-node self-cycle
- test a cycle that starts in the middle instead of at the head

## Useful Extension: Find the Cycle Start

If the interviewer asks for the node where the cycle begins:

1. let `slow` and `fast` meet
2. move one pointer back to `head`
3. move both one step at a time
4. the next meeting point is the cycle entry

```java
ListNode detectCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow == fast) {
            ListNode start = head;

            while (start != slow) {
                start = start.next;
                slow = slow.next;
            }

            return start;
        }
    }

    return null;
}
```

That follow-up matters because it shows whether you understand the pointer math or only memorized the first part.

## Pattern Generalization

The same fast/slow idea appears in:

- middle of linked list
- happy number cycle detection
- duplicate number via implicit cycle modeling

The broader lesson is:
different pointer speeds let you infer structure without extra memory.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- Floyd cycle detection turns a structural problem into a pointer-speed argument.
- `fast` reaching `null` proves the list is acyclic.
- `slow == fast` proves there is a cycle, but not necessarily at the entry node.
