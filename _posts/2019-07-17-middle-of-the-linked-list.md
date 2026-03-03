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

Given the head of a singly linked list, return its middle node.
If the list has two middle nodes, return the second middle.

---

## Fast and Slow Pointer Idea

- `slow` moves 1 step each iteration
- `fast` moves 2 steps each iteration

When `fast` reaches the end, `slow` is at middle.
For even-length lists, this naturally lands on the second middle.

---

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

---

## Dry Run

Input: `1 -> 2 -> 3 -> 4 -> 5`

- start: `slow=1`, `fast=1`
- step 1: `slow=2`, `fast=3`
- step 2: `slow=3`, `fast=5`
- next move not possible (`fast.next == null`), stop

Answer: node `3`

Input: `1 -> 2 -> 3 -> 4 -> 5 -> 6`

- start: `slow=1`, `fast=1`
- step 1: `slow=2`, `fast=3`
- step 2: `slow=3`, `fast=5`
- step 3: `slow=4`, `fast=null`

Answer: node `4` (second middle)

---

## Why This Is Correct

After `k` iterations:

- `slow` has moved `k` nodes
- `fast` has moved `2k` nodes

So when `fast` has traversed the full list, `slow` is at half distance.

---

## Common Mistakes

1. using `while (fast.next != null)` and causing `NullPointerException`
2. moving `fast` by one step accidentally
3. returning first middle when problem asks for second middle

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- fast/slow pointers give one-pass middle detection.
- the loop guard `fast != null && fast.next != null` is critical.
- this pattern is reused in cycle detection and linked-list palindrome checks.
