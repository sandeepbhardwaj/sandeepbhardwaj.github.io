---
title: Middle of the Linked List in Java
date: '2019-07-17'
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
seo_title: Middle of the Linked List in Java (LeetCode 876)
seo_description: Find middle node of linked list with slow and fast pointers.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Middle of the Linked List in Java

This guide explains the intuition, optimized approach, and Java implementation for middle of the linked list in java, with practical tips for interviews and production coding standards.

## Problem

Return middle node of a linked list. If two middles exist, return second one.

## Approach

- `slow` moves 1 step
- `fast` moves 2 steps

When `fast` reaches end, `slow` is at middle.

## Java Solution

```java
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Note

This same pointer pattern is reused in cycle detection and palindrome linked list checks.

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
