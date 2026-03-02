---
title: Reverse Linked List Recursively in Java
date: '2018-05-20'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- recursion
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Reverse Linked List Recursively in Java
seo_description: Recursive linked-list reversal in Java with base case, call stack
  behavior, and complexity.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Reverse Linked List Recursively in Java

This guide explains the intuition, optimized approach, and Java implementation for reverse linked list recursively in java, with practical tips for interviews and production coding standards.

## Problem

Reverse a singly linked list using recursion.

## Example

Input: `1 -> 2 -> 3 -> 4`  
Output: `4 -> 3 -> 2 -> 1`

## Approach

Recursively reverse the sublist starting from `head.next`, then attach current node at the end.

Key operations after recursive call returns:

- `head.next.next = head`
- `head.next = null`

## Java Solution

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(n)` due to recursion stack

## When to Use

Prefer iterative solution in production if stack depth can be large.
Recursive version is elegant and useful for interviews and small lists.

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
