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
  show_overlay_excerpt: false
---

# Reverse Linked List Recursively in Java

Reverse a singly linked list using recursion.

Input: `1 -> 2 -> 3 -> 4`  
Output: `4 -> 3 -> 2 -> 1`

---

## Core Idea

Recursively reverse from `head.next` onward.
After recursion returns, current `head` should be attached at the end of reversed sublist.

Pointer rewiring on unwind:

- `head.next.next = head`
- `head.next = null`

---

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

---

## Dry Run (Call Stack)

List: `1 -> 2 -> 3 -> 4`

Recursive descent:

- `reverse(1)` calls `reverse(2)`
- `reverse(2)` calls `reverse(3)`
- `reverse(3)` calls `reverse(4)`
- `reverse(4)` hits base case and returns node `4`

Unwind:

- at `3`: make `4.next = 3`, set `3.next = null`
- at `2`: make `3.next = 2`, set `2.next = null`
- at `1`: make `2.next = 1`, set `1.next = null`

Return `newHead = 4`.

---

## Why `head.next = null` Is Critical

Without this step, old forward links remain and create cycles.
Example: `2.next` would still point to `3` while `3.next` is rewired to `2`.

---

## Recursive vs Iterative

- recursive approach is concise and easy to reason about
- iterative approach is safer for very long lists (`O(1)` stack)

Java does not guarantee tail-call optimization, so recursion depth can overflow on large input.

---

## Common Mistakes

1. returning `head` instead of `newHead`
2. missing base case `head == null || head.next == null`
3. forgetting to nullify `head.next`

---

## Complexity

- Time: `O(n)`
- Space: `O(n)` due to recursion stack

---

## Key Takeaways

- recursion solves reversal by rewiring links during unwind phase.
- two pointer updates are enough for correctness.
- prefer iterative version when input size can be very large.
