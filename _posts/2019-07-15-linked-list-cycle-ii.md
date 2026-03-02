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
---

# Linked List Cycle II in Java (Find Cycle Start)

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

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Interview Note

This is one of the best examples of math + pointer invariants in linked lists.

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
