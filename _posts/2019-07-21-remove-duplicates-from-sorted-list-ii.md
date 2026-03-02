---
title: Remove Duplicates from Sorted List II in Java
date: '2019-07-21'
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
seo_title: Remove Duplicates from Sorted List II in Java (LeetCode 82)
seo_description: Remove all nodes that have duplicate numbers from a sorted linked
  list.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Remove Duplicates from Sorted List II in Java

This guide explains the intuition, optimized approach, and Java implementation for remove duplicates from sorted list ii in java, with practical tips for interviews and production coding standards.

## Problem

Remove all values that appear more than once in a sorted linked list.

Example: `1->2->3->3->4->4->5` -> `1->2->5`

## Approach

Use a dummy node and two pointers:

- `prev` points to last confirmed unique node
- `current` scans duplicates block

## Java Solution

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode prev = dummy;
        ListNode current = head;

        while (current != null) {
            boolean duplicate = false;
            while (current.next != null && current.val == current.next.val) {
                current = current.next;
                duplicate = true;
            }

            if (duplicate) prev.next = current.next;
            else prev = prev.next;

            current = current.next;
        }

        return dummy.next;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
