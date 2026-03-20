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
Recursive linked-list reversal is elegant because it shifts the pointer work to the unwind phase of the call stack. The code is short, but the logic only feels easy once we are clear about what the recursive call returns.

## Problem 1: Reverse Linked List Recursively

Problem description:
Given the head of a singly linked list, reverse the list and return the new head using recursion.

Example:

- Input: `1 -> 2 -> 3 -> 4`
- Output: `4 -> 3 -> 2 -> 1`

What we are solving actually:
We want the recursive call to reverse the smaller list starting from `head.next`, and then we want to attach the current `head` at the end of that reversed result. In other words, each stack frame asks the next frame to solve the harder part first, then fixes one link while the recursion unwinds.

What we are doing actually:

1. Stop when the list is empty or has only one node.
2. Recursively reverse everything after `head`.
3. When the smaller list comes back reversed, make `head.next.next = head`.
4. Break the old forward link by setting `head.next = null`.
5. Return the new head found by the deepest recursive call.

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head; // Base case: empty list or single node is already reversed.
        }

        ListNode newHead = reverseList(head.next); // Reverse the rest of the list first.
        head.next.next = head; // Put current node after its next node.
        head.next = null; // Break the original forward link to avoid a cycle.

        return newHead; // Deepest node becomes the new head for all callers.
    }
}
```

## Why the Recursive Idea Works

Suppose we are at node `2` in `1 -> 2 -> 3 -> 4`.
If recursion already reversed `3 -> 4` into `4 -> 3`, then the only thing left is to place `2` after `3`.
That is exactly what `head.next.next = head` does.

The base case is important because the last node is already the head of the reversed list. That node is the answer every stack frame should return upward.

## Dry Run

For `1 -> 2 -> 3 -> 4`:

1. `reverse(1)` calls `reverse(2)`
2. `reverse(2)` calls `reverse(3)`
3. `reverse(3)` calls `reverse(4)`
4. `reverse(4)` returns `4` because it is the base case

Now the stack unwinds:

1. At node `3`, set `4.next = 3`, then `3.next = null`
2. At node `2`, set `3.next = 2`, then `2.next = null`
3. At node `1`, set `2.next = 1`, then `1.next = null`

The returned `newHead` remains `4` the whole time.

## Common Mistakes

1. Returning `head` instead of `newHead`
2. Forgetting `head.next = null`, which can create a cycle
3. Missing the base case for empty or one-node lists
4. Thinking recursion changes node values instead of node links

## Debug Steps

Debug steps:

- trace each recursive call with the current node value
- trace each unwind step where `head.next.next` is reassigned
- test `null`, one-node, and two-node lists first
- verify the old head ends with `next = null`

## Recursive vs Iterative

The recursive version is compact and expressive, which makes it great for learning.
The iterative version is usually safer in production because it uses `O(1)` extra space.
In Java, very deep recursion can risk stack overflow, so the iterative approach is often preferred for large inputs.

## Complexity

- Time: `O(n)`
- Space: `O(n)` because of the recursion stack

## Key Takeaways

- recursion reverses the tail first and fixes links during unwind
- `head.next.next = head` builds the reversed direction
- `head.next = null` is required to avoid keeping the old link alive
