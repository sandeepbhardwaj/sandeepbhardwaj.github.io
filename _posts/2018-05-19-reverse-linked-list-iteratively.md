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

## Dry Run (First 3 Steps)

Initial:

- `prev = null`
- `current = 1 -> 2 -> 3 -> 4 -> 5`

Step 1:

- `next = 2`
- reverse `1.next = null`
- move: `prev = 1`, `current = 2`

Step 2:

- `next = 3`
- reverse `2.next = 1`
- move: `prev = 2 -> 1`, `current = 3`

Step 3:

- `next = 4`
- reverse `3.next = 2`
- move: `prev = 3 -> 2 -> 1`, `current = 4`

Continue until `current == null`. Final `prev` is new head.

## Common Mistakes

1. Forgetting to store `next` before rewiring `current.next`.
2. Returning `head` instead of `prev`.
3. Accidentally creating a cycle by wrong pointer update order.

## Useful Variant: Reverse First K Nodes

```java
ListNode reverseFirstK(ListNode head, int k) {
    ListNode prev = null, curr = head;
    while (curr != null && k-- > 0) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    head.next = curr; // connect remainder
    return prev;
}
```

This pattern is reused in problems like reversing in groups.

## Testing Checklist

- `[]` -> `[]`
- `[1]` -> `[1]`
- `[1,2]` -> `[2,1]`
- `[1,2,3,4,5]` -> `[5,4,3,2,1]`

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Edge Cases

- Empty list -> return `null`
- Single node -> same node returned
- Long list -> still linear scan

## Key Takeaways

- iterative reversal is pointer choreography using `prev`, `curr`, and `next`.
- update order matters: save `next` before changing `curr.next`.
- iterative approach is production-safe for long lists due to constant stack usage.
