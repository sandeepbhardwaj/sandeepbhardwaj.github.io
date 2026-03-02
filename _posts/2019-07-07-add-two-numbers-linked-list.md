---
title: Add Two Numbers Represented as Linked List
date: '2019-07-07'
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
seo_title: Add Two Numbers (Linked List) in Java - LeetCode 2
seo_description: Add two numbers represented by reverse-order linked lists with carry
  handling in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Add Two Numbers Represented as Linked List

This guide explains the intuition, optimized approach, and Java implementation for add two numbers represented as linked list, with practical tips for interviews and production coding standards.

## Problem

Two non-empty linked lists represent two non-negative integers in reverse order. Add them and return the sum as a linked list.

## Example

`(2 -> 4 -> 3) + (5 -> 6 -> 4)` -> `7 -> 0 -> 8`

## Approach

Traverse both lists together, digit by digit:

- Add current digits and carry
- Create a node with `sum % 10`
- Update carry with `sum / 10`
- Continue until both lists and carry are exhausted

## Java Solution

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;
            int sum = x + y + carry;

            carry = sum / 10;
            tail.next = new ListNode(sum % 10);
            tail = tail.next;

            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }

        return dummy.next;
    }
}
```

## Complexity

- Time: `O(max(m, n))`
- Space: `O(max(m, n))` for output list

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
