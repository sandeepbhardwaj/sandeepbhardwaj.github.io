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
This guide explains the intuition, optimized approach, and Java implementation for linked list cycle ii in java (find cycle start), with practical tips for interviews and production coding standards.

## Problem

If a linked list has a cycle, return the node where cycle begins. Otherwise return `null`.

## Floyd’s Two-Phase Method

1. Detect meeting point with slow/fast pointers.
2. Move one pointer to head and step both by 1. Their next meeting point is cycle start.

## Java Solution

```java
class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;

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

## Why Phase 2 Finds Cycle Start (Intuition)

Let:

- `a` = distance from head to cycle start
- `b` = distance from cycle start to meeting point
- `c` = remaining cycle distance (`cycleLen - b`)

At meeting:

- slow distance = `a + b`
- fast distance = `a + b + k * cycleLen`

Since fast moves twice as fast, `a + b` is a multiple of cycle length offset, which implies moving one pointer from head and one from meeting point one step at a time makes them meet at cycle start.

## Dry Run Pattern

For list: `3 -> 2 -> 0 -> -4 -> (back to 2)`

1. slow/fast meet inside cycle
2. reset pointer `p1=head`, keep `p2=meeting`
3. move both one step each
4. first node where `p1==p2` is node `2` (cycle start)

## Common Mistakes

1. Returning first meeting point directly (it is not always cycle start).
2. Comparing node values instead of node references.
3. Missing null checks for `fast` and `fast.next`.

## Testing Checklist

- no cycle
- cycle starts at head
- cycle starts in middle
- single-node self-cycle
- two-node cycle

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Interview Note

This is one of the best examples of math + pointer invariants in linked lists.

## Key Takeaways

- after fast/slow meet, resetting one pointer to head finds cycle entry.
- this works because distances traveled by pointers satisfy a modular relation in cycle length.
- handle no-cycle lists early to avoid null dereference paths.
