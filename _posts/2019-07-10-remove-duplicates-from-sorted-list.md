---
title: Remove Duplicates from Sorted List (LeetCode 83)
date: '2019-07-10'
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
seo_title: Remove Duplicates from Sorted List in Java (LeetCode 83)
seo_description: In-place linked-list deduplication for sorted lists in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Remove Duplicates from Sorted List (LeetCode 83)

This guide explains the intuition, optimized approach, and Java implementation for remove duplicates from sorted list (leetcode 83), with practical tips for interviews and production coding standards.

## Problem

Given a sorted linked list, delete duplicate nodes so each value appears once.

## Example

Input: `1 -> 1 -> 2 -> 3 -> 3`  
Output: `1 -> 2 -> 3`

## Approach

Since list is sorted, duplicates are adjacent.

- Walk list with `current`
- If `current.val == current.next.val`, skip next node
- Otherwise move forward

## Java Solution

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode current = head;

        while (current != null && current.next != null) {
            if (current.val == current.next.val) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        return head;
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
