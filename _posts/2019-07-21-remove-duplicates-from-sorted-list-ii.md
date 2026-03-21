---
title: Remove Duplicates from Sorted List II in Java
date: '2019-07-21'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- leetcode
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove Duplicates from Sorted List II in Java (LeetCode 82)
seo_description: Remove all nodes that have duplicate numbers from a sorted linked
  list.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This variant is more subtle than the simpler sorted-list deduplication problem.
We are not keeping one copy of repeated values. We are removing every value that appears more than once.

---

## Problem 1: Remove Duplicates from Sorted List II

Problem description:
Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only nodes whose values appear exactly once.

What we are solving actually:
In the simpler version, duplicates are collapsed to one node. Here, duplicate values must disappear completely. That means we need to detect an entire duplicate block first, then decide whether to keep it or skip all of it.

What we are doing actually:

1. Use a dummy node so we can safely remove duplicates even if they start at the head.
2. Let `prev` point to the last confirmed unique node.
3. Let `current` scan through the list and detect duplicate runs.
4. If a duplicate run is found, connect `prev.next` to the first node after that run.

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode prev = dummy;
        ListNode current = head;

        while (current != null) {
            boolean duplicate = false;

            while (current.next != null && current.val == current.next.val) {
                current = current.next; // Walk through the whole duplicate block.
                duplicate = true;
            }

            if (duplicate) {
                prev.next = current.next; // Skip the entire duplicate value block.
            } else {
                prev = prev.next; // Current value is unique, so lock it in.
            }

            current = current.next;
        }

        return dummy.next;
    }
}
```

Debug steps:

- print `prev.val` and `current.val` before each outer loop iteration
- test `1->2->3->3->4->4->5`, `1->1->1->2`, and `1->2->3`
- verify the invariant that all nodes before `prev` are already confirmed unique and final

---

## Difference from the Easier Variant

For LeetCode 83:

- `1 -> 1 -> 2 -> 3 -> 3`
- becomes `1 -> 2 -> 3`

For this problem:

- `1 -> 1 -> 2 -> 3 -> 3`
- becomes `2`

That difference changes the pointer strategy completely.
Here we need:

- a dummy node
- a `prev` pointer to the last safe node
- full duplicate-block detection

---

## Dry Run

Input: `1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5`

1. `1` is unique
   move `prev` to `1`

2. `2` is unique
   move `prev` to `2`

3. detect duplicate block `3 -> 3`
   skip all `3`s
   list becomes `1 -> 2 -> 4 -> 4 -> 5` from the connection point

4. detect duplicate block `4 -> 4`
   skip all `4`s

5. `5` is unique
   keep it

Result: `1 -> 2 -> 5`

---

## Why the Dummy Node Is Essential

Consider:

- `1 -> 1 -> 2 -> 3`

The duplicates start at the original head.
If we do not use a dummy node, removing that block makes head handling awkward.

The dummy node gives us one stable pointer before the real list.
So even if the original head must disappear, we can still relink cleanly.

---

## Why `prev` Must Not Move on Duplicates

This is the most common bug.

If `current` is part of a duplicate block, `prev` should stay where it is.
Why?

Because `prev.next` still needs to be rewired to the first node after the whole duplicate run.

Only truly unique values let `prev` move forward.

---

## Common Mistakes

1. moving `prev` even after a duplicate block is detected
2. forgetting the dummy node and breaking head-removal cases
3. confusing this problem with the "keep one copy" variant
4. skipping only one duplicate node instead of the full block

---

## Boundary Cases

- all unique list -> unchanged
- duplicates only at head -> head shifts
- duplicates only at tail -> tail block disappears
- every node duplicated -> result is empty

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- this variant removes duplicate values entirely, not just extra copies
- dummy node plus `prev` pointer makes head deletion safe
- the key move is detecting and skipping the whole duplicate block
