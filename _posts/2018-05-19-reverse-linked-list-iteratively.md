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
Reversing a linked list iteratively is one of the best pointer-discipline problems in interviews.
The code is short, but only if the mutation order is exactly right.

The real lesson is not "how to reverse a list."
It is how to rewire a structure in place without losing reachability.

## Quick Summary

| Signal | What it means |
| --- | --- |
| singly linked list | all movement is through `next` pointers |
| in-place reversal | we must rewire links, not copy values |
| constant extra space | iterative pointer manipulation is the right direction |
| mutation safety matters | save the next node before changing the current link |

The core invariant is:
`prev` is the head of the already reversed prefix, and `current` is the first node not yet reversed.

## Problem Statement

Given the head of a singly linked list, reverse the list and return the new head.

Example:

- Input: `1 -> 2 -> 3 -> 4 -> 5`
- Output: `5 -> 4 -> 3 -> 2 -> 1`

We are not "reading the list backward."
We are changing every `next` pointer so traversal goes in the opposite direction.

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

## The Only Mutation Order That Matters

Each iteration has three responsibilities:

1. preserve the rest of the list
2. reverse one pointer
3. advance the processing window

That produces the standard order:

1. `nextNode = current.next`
2. `current.next = prev`
3. `prev = current`
4. `current = nextNode`

If you change that order carelessly, you either lose the untouched suffix or create a cycle.

## Why This Works

At every step:

- `prev` points to a correctly reversed partial list
- `current` points to the first node still in original direction
- everything after `current` is still intact

Each loop removes exactly one node from the unreversed suffix and adds it to the front of the reversed prefix.
Because we save `nextNode` first, we never lose the remainder.

That is the whole proof idea.

## Dry Run

Input:

```text
1 -> 2 -> 3 -> 4 -> 5
```

Initial state:

- `prev = null`
- `current = 1`

Iteration 1:

- save `nextNode = 2`
- set `1.next = null`
- move `prev = 1`
- move `current = 2`

Current picture:

```text
prev:    1
current: 2 -> 3 -> 4 -> 5
```

Iteration 2:

- save `nextNode = 3`
- set `2.next = 1`
- move `prev = 2 -> 1`
- move `current = 3`

Current picture:

```text
prev:    2 -> 1
current: 3 -> 4 -> 5
```

Continue until `current = null`.
At that moment, `prev` is the new head:

```text
5 -> 4 -> 3 -> 2 -> 1
```

## Common Mistakes

### Forgetting to save the next node

If you assign `current.next = prev` first and do not preserve the old `current.next`, you lose the rest of the list immediately.

### Returning `head`

After reversal, the old head is the tail.
The correct return value is `prev`.

### Updating `current` too early

If you move `current` before reversing the link, the rewiring step no longer applies to the right node.

### Thinking reversal means value swapping

This is a pointer problem, not an array problem.
We are changing links, not exchanging data fields.

## Boundary Cases Worth Testing

- `null` -> `null`
- one node -> same node
- two nodes -> direction swaps cleanly
- already reversed-looking mental model -> still same algorithm

These cases are useful because they expose whether your pointer updates rely on accidental assumptions.

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## What This Pattern Generalizes To

Iterative reversal is a building block for many harder linked-list problems:

- reverse a sublist
- reverse nodes in `k` groups
- reorder a list
- check linked-list palindrome in `O(1)` extra space
- split and weave linked-list halves

That is why interviewers like this problem.
It is small, but it reveals whether you can mutate pointer structure safely.

## Key Takeaways

- Reversing a linked list iteratively is controlled pointer rewiring.
- The invariant is that `prev` is already reversed and `current` is the next node to process.
- The update order `save next -> reverse link -> move pointers` is the algorithm.
- If you can explain why reachability is never lost, you understand the pattern, not just the code.
