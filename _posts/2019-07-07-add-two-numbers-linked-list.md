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
  show_overlay_excerpt: false
---
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

## Dry Run (Given Example)

Input:

- `l1 = 2 -> 4 -> 3`
- `l2 = 5 -> 6 -> 4`

Steps:

1. `2 + 5 + carry(0) = 7` -> node `7`, carry `0`
2. `4 + 6 + carry(0) = 10` -> node `0`, carry `1`
3. `3 + 4 + carry(1) = 8` -> node `8`, carry `0`

Result: `7 -> 0 -> 8`

## Why Dummy Node Helps

`dummy` simplifies list construction by removing special handling for first node.
Without it, code needs extra branch logic when output is still empty.

## Common Mistakes

1. Forgetting final carry node (`carry != 0`).
2. Advancing list pointers before reading current values.
3. Mishandling unequal list lengths.
4. Reusing input nodes and corrupting original lists unintentionally.

## Variant: Digits in Forward Order

If digits are stored most-significant-first, this direct loop does not work.
Common solutions:

- reverse both lists first, then reuse this method
- or use stacks to process from the end

## Testing Checklist

- `0 + 0` -> `0`
- `[9] + [1]` -> `[0,1]`
- unequal lengths: `[9,9,9] + [1]` -> `[0,0,0,1]`
- long random lists cross-checked with big integer conversion in tests

## Complexity

- Time: `O(max(m, n))`
- Space: `O(max(m, n))` for output list

## Key Takeaways

- dummy node simplifies output list construction and removes first-node special cases.
- loop condition must include carry so final overflow digit is not lost.
- this pattern generalizes to many digit-by-digit linked-list arithmetic problems.
