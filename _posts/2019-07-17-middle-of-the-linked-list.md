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
This is one of the best introductory fast-and-slow pointer problems.
It looks simple, but it teaches a pattern that later shows up in cycle detection, palindrome checks, and linked-list splitting.

---

## Problem 1: Middle of the Linked List

Problem description:
Given the head of a singly linked list, return its middle node. If the list has two middle nodes, return the second middle node.

What we are solving actually:
We do not want to count the total number of nodes first and then walk again. The real trick is to let one pointer represent "halfway progress" while another pointer represents "full-speed progress" in the same pass.

What we are doing actually:

1. Start two pointers, `slow` and `fast`, at the head.
2. Move `slow` by one node each loop.
3. Move `fast` by two nodes each loop.
4. When `fast` can no longer move two steps, `slow` is at the middle.

```java
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next; // slow advances one step at a time
            fast = fast.next.next; // fast advances twice as quickly
        }

        return slow; // slow lands on the middle, or the second middle for even length
    }
}
```

Debug steps:

- print the values at `slow` and `fast` after each loop iteration
- test both odd length (`1->2->3->4->5`) and even length (`1->2->3->4->5->6`)
- verify the invariant that `fast` has moved twice as many steps as `slow`

---

## Fast and Slow Pointer Idea

The whole reason this works is relative speed:

- `slow` covers the list at normal pace
- `fast` burns through the list twice as quickly

So by the time `fast` reaches the end, `slow` has covered half the distance.

This also naturally handles the problem requirement for even-length lists.
Because the loop continues while `fast.next != null`, `slow` ends on the second middle rather than the first.

---

## Dry Run

Input: `1 -> 2 -> 3 -> 4 -> 5`

1. start: `slow=1`, `fast=1`
2. move: `slow=2`, `fast=3`
3. move: `slow=3`, `fast=5`
4. stop because `fast.next == null`

Answer: node `3`

Now an even-length case:

Input: `1 -> 2 -> 3 -> 4 -> 5 -> 6`

1. start: `slow=1`, `fast=1`
2. move: `slow=2`, `fast=3`
3. move: `slow=3`, `fast=5`
4. move: `slow=4`, `fast=null`

Answer: node `4`

That matches the required "second middle" behavior.

---

## Why This Is Correct

After `k` loop iterations:

- `slow` has moved `k` nodes
- `fast` has moved `2k` nodes

When the loop stops, `fast` has reached the end or stepped just beyond it.
That means `slow` has covered half the list length.

This is the core invariant:
if `fast` is twice as far from the start as `slow`, then the time when `fast` finishes is exactly the time when `slow` is in the middle.

---

## Boundary Cases

- one node -> that node is the middle
- two nodes -> return the second node
- empty list -> problem usually avoids this, but the loop still handles `null` safely if needed

The guard `fast != null && fast.next != null` is what protects these cases.

---

## Common Mistakes

1. writing `while (fast.next != null)` and risking `NullPointerException`
2. moving `fast` by one step instead of two
3. expecting the first middle when this problem explicitly asks for the second middle
4. overcomplicating the solution by counting length first

---

## Where This Pattern Reappears

The same pointer-speed idea appears in:

- linked-list cycle detection
- finding the start of a cycle
- checking whether a linked list is a palindrome
- splitting a list into two halves for merge sort

So this problem is worth mastering as a reusable pattern, not just as a one-off interview question.

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- fast and slow pointers let you find the middle in one pass
- the loop guard determines whether even-length lists return the first or second middle
- this is a core linked-list pattern that shows up in several harder problems
