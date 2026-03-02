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
author_profile: true
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

# Detect a Loop in Linked List (Floyd Cycle Detection)

This guide explains the intuition, optimized approach, and Java implementation for detect a loop in linked list (floyd cycle detection), with practical tips for interviews and production coding standards.

## Problem

Determine whether a linked list contains a cycle.

## Approach: Slow and Fast Pointers

- `slow` moves one step
- `fast` moves two steps
- If there is a cycle, they must meet
- If `fast` reaches `null`, no cycle exists

## Java Solution

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) return false;

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

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Why This Is Better Than HashSet

HashSet approach works but uses extra memory `O(n)`. Floyd’s algorithm gives constant-space detection.

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
