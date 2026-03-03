---
title: Remove Linked List Elements in Java
date: '2019-07-11'
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
seo_title: Remove Linked List Elements in Java (LeetCode 203)
seo_description: Remove nodes matching target value in a linked list using dummy head
  pattern.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Remove Linked List Elements in Java

This guide explains the intuition, optimized approach, and Java implementation for remove linked list elements in java, with practical tips for interviews and production coding standards.

## Problem

Remove all nodes with value `val` from a linked list.

## Why Dummy Head Helps

If head itself must be removed, code becomes messy without a sentinel node.

## Java Solution

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode current = dummy;

        while (current.next != null) {
            if (current.next.val == val) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        return dummy.next;
    }
}
```

## Dry Run

Input: `head = 1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6`, `val = 6`

1. `current` starts at dummy (`0 -> 1 -> ...`)
2. when `current.next.val != 6`, move forward
3. when node `6` is found, bypass it with `current.next = current.next.next`
4. continue until end

Result: `1 -> 2 -> 3 -> 4 -> 5`

## Why `current` Does Not Move After Deletion

After removing `current.next`, the new `current.next` may also need deletion.
If you move immediately, you may skip consecutive target nodes.

## Common Mistakes

1. Not using dummy node and failing when head needs removal.
2. Advancing pointer after deletion and skipping nodes.
3. Forgetting null checks on `current.next`.

## Recursive Alternative (Readable, More Stack Use)

```java
ListNode removeElementsRec(ListNode head, int val) {
    if (head == null) return null;
    head.next = removeElementsRec(head.next, val);
    return head.val == val ? head.next : head;
}
```

Prefer iterative version for very long lists to avoid deep recursion stack.

## Testing Checklist

- empty list
- single-node remove and keep cases
- all nodes equal to target
- no node equal to target
- multiple target runs (including at head and tail)

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Edge Cases

- All nodes removed
- No nodes removed
- Multiple removals at head

## Key Takeaways

- dummy node makes head removals safe and simplifies pointer logic.
- remove-by-value is a pointer relinking problem, not node mutation.
- always test consecutive removals at list head and tail.
