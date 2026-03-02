---
title: Reverse Linked List Iteratively in Java
date: '2018-05-19'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- two-pointers
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Reverse Linked List Iteratively in Java (O(n), O(1))
seo_description: Learn the iterative pointer-reversal technique for reversing a singly
  linked list in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Reverse Linked List Iteratively in Java

This guide explains the intuition, optimized approach, and Java implementation for reverse linked list iteratively in java, with practical tips for interviews and production coding standards.

## Problem

Given the head of a singly linked list, reverse the list and return the new head.

## Example

Input: `1 -> 2 -> 3 -> 4 -> 5`  
Output: `5 -> 4 -> 3 -> 2 -> 1`

## Intuition

Keep three pointers:

- `prev` (already reversed part)
- `current` (node being processed)
- `next` (saved reference so list is not lost)

At each step, reverse one link and move forward.

## Java Solution

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;

        while (current != null) {
            ListNode next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }

        return prev;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Edge Cases

- Empty list -> return `null`
- Single node -> same node returned
- Long list -> still linear scan

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
