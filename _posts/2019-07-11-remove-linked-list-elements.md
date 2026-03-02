---
title: Remove Linked List Elements in Java
date: '2019-07-11'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove Linked List Elements in Java (LeetCode 203)
seo_description: Remove nodes matching target value in a linked list using dummy head
  pattern.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Remove Linked List Elements in Java

This guide explains the intuition, optimized approach, and Java implementation for remove linked list elements in java, with practical tips for interviews and production coding standards.

## Problem

Remove all nodes with value `val` from a linked list.

## Why Dummy Head Helps

If head itself must be removed, code becomes messy without a sentinel node.

## Java Solution

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode current = dummy;

        while (current.next != null) {
            if (current.next.val == val) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        return dummy.next;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Edge Cases

- All nodes removed
- No nodes removed
- Multiple removals at head

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
