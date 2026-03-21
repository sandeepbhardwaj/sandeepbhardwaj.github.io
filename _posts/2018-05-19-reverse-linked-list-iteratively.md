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
Reversing a linked list is one of the cleanest pointer problems in DSA. It looks simple, but it teaches an important lesson: when we change links in place, the order of updates matters more than the updates themselves.

## Problem 1: Reverse Linked List Iteratively

Problem description:
Given the head of a singly linked list, reverse the list and return the new head.

Example:

- Input: `1 -> 2 -> 3 -> 4 -> 5`
- Output: `5 -> 4 -> 3 -> 2 -> 1`

What we are solving actually:
We are not just "reading the list backward." We are changing the direction of every `next` pointer so the list can be traversed from the old tail back toward the old head. The tricky part is making those changes without losing access to the remaining nodes.

What we are doing actually:

1. Keep `prev` as the head of the already reversed portion.
2. Keep `current` as the node we are currently processing.
3. Save `current.next` in `nextNode` before changing anything.
4. Reverse one link by pointing `current.next` to `prev`.
5. Move all pointers one step forward and repeat.

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;

        while (current != null) {
            ListNode nextNode = current.next; // Save the rest of the list before rewiring.
            current.next = prev; // Reverse the current link.
            prev = current; // Current node becomes the new front of reversed part.
            current = nextNode; // Continue with the untouched remainder.
        }

        return prev; // Prev ends at the new head.
    }
}
```

## Why This Works

At any moment:

- `prev` points to a correctly reversed partial list
- `current` points to the first node not processed yet
- everything after `current` is still in its original order

Each loop iteration moves exactly one node from the original part into the reversed part. Because we save `nextNode` first, we never lose the remaining list.

## Dry Run

For `1 -> 2 -> 3 -> 4 -> 5`:

1. Start with `prev = null`, `current = 1`
2. Save `nextNode = 2`, set `1.next = null`, move `prev = 1`, `current = 2`
3. Save `nextNode = 3`, set `2.next = 1`, move `prev = 2 -> 1`, `current = 3`
4. Save `nextNode = 4`, set `3.next = 2`, move `prev = 3 -> 2 -> 1`, `current = 4`
5. Continue until `current = null`

At the end, `prev` points to `5 -> 4 -> 3 -> 2 -> 1`, which is the answer.

## Common Mistakes

1. Forgetting to save `nextNode` before changing `current.next`
2. Returning `head` instead of `prev`
3. Updating `current` before reversing the pointer
4. Thinking a second pass is needed when one pass is enough

## Debug Steps

Debug steps:

- print `prev`, `current`, and `nextNode` at each iteration
- test `null`, one-node, and two-node lists first
- check that no node is skipped and no cycle is created
- verify that the final returned node is the old tail

## Boundary Cases

- empty list returns `null`
- single node returns the same node
- two nodes should simply swap direction
- large lists still work in one pass with constant extra space

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Why Iterative Reversal Is a Core Pattern

This same pointer update pattern appears in:

- reverse a sublist
- reverse nodes in `k` groups
- reorder list style problems
- palindrome linked-list checks

So this is more than one interview question. It is a reusable linked-list building block.

## Key Takeaways

- iterative reversal is controlled pointer rewiring, not value swapping
- the order `save next`, `reverse link`, `move pointers` is the whole algorithm
- `prev` becomes the new head after the traversal finishes
