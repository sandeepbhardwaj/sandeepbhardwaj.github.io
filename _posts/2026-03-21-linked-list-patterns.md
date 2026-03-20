---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-21
seo_title: Linked List Patterns in Java – Complete Guide
seo_description: Master linked list patterns in Java including fast-slow pointers,
  reversal, merge, and cycle detection.
tags:
- dsa
- java
- linked-list
- fast-slow
- algorithms
title: Linked List Patterns in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/linked-list-banner.svg"
  overlay_filter: 0.35
  caption: Pointer Discipline and In-Place Transformations
  show_overlay_excerpt: false
---
Linked list problems are pointer manipulation problems.
Most solutions reduce to a few reusable patterns.

---

## Core Patterns

- fast/slow pointers
- in-place reversal
- dummy head for edge-safe insert/delete
- merge of sorted lists

---

## Pattern 1: Fast-Slow Pointer (Middle)

What we are doing actually:

1. Move `fast` two steps at a time.
2. Move `slow` one step at a time.
3. When `fast` reaches the end, `slow` is at the middle.

```java
public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; // Moves one node per iteration.
        fast = fast.next.next; // Moves two nodes per iteration.
    }
    return slow;
}
```

Debug steps:

- trace `slow` and `fast` values on a 1-node, 2-node, and 5-node list
- verify the loop checks both `fast` and `fast.next`
- remember even-length lists return the second middle in this version

---

## Pattern 2: Iterative Reversal

What we are doing actually:

1. Save `next` before breaking the current link.
2. Reverse the pointer direction for `cur`.
3. Advance `prev` and `cur`.

```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next; // Save remainder before rewiring.
        cur.next = prev; // Reverse current pointer.
        prev = cur; // Grow reversed prefix.
        cur = next; // Continue with unreversed remainder.
    }
    return prev;
}
```

Debug steps:

- print `prev`, `cur`, and `next` at each step
- verify no node becomes unreachable after `cur.next = prev`
- test empty list and single-node list first

---

## Problem 1: Linked List Cycle

Problem description:
Detect whether the linked list contains a cycle.

What we are doing actually:

1. Move `slow` by one and `fast` by two.
2. If there is a cycle, `fast` eventually laps `slow`.
3. If `fast` hits `null`, the list is acyclic.

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
```

Debug steps:

- trace `slow` and `fast` on a tiny cyclic and acyclic list
- verify comparison is by node reference, not value
- test `head = null` and one-node self-cycle

---

## Problem 2: Merge Two Sorted Lists

Problem description:
Merge two already sorted linked lists into one sorted result.

What we are doing actually:

1. Use a dummy head to simplify edge cases.
2. Always attach the smaller current node.
3. Move the pointer in the list that contributed the node.
4. Append the remaining tail at the end.

```java
public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;

    while (a != null && b != null) {
        if (a.val <= b.val) {
            tail.next = a; // Next smallest node comes from list a.
            a = a.next;
        } else {
            tail.next = b; // Next smallest node comes from list b.
            b = b.next;
        }
        tail = tail.next; // Advance merged tail.
    }
    tail.next = (a != null) ? a : b; // Attach whichever list still has nodes.
    return dummy.next;
}
```

Debug steps:

- print the merged list after each append
- verify `tail` always points to the last merged node
- test when one input list is empty

---

## Problem 3: Remove Nth Node From End

Problem description:
Remove the nth node from the end in one pass.

What we are doing actually:

1. Add a dummy node so removing the head is easy.
2. Move `first` ahead by `n + 1` steps to create a fixed gap.
3. Move both pointers together until `first` reaches the end.
4. `second.next` is then the node we must remove.

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode first = dummy, second = dummy;

    for (int i = 0; i <= n; i++) first = first.next; // Maintain a gap of n nodes between pointers.

    while (first != null) {
        first = first.next;
        second = second.next;
    }

    second.next = second.next.next; // Skip the target node.
    return dummy.next;
}
```

Debug steps:

- print `first` and `second` during gap creation and synchronized movement
- test removing the head, tail, and a middle node
- verify why the dummy node makes head removal safe

Edge note: this assumes `n` is valid (`1 <= n <= length`).
If input can be invalid, guard against `first == null` during initial gap advance.

---

## Pointer Debug Strategy

For complex linked-list edits, debug with tiny lists and snapshot states:

```text
prev=2 cur=3 next=4
```

After each mutation (`cur.next = prev` etc.), verify:

1. no node is orphaned unexpectedly
2. no accidental cycles are created
3. termination pointer eventually reaches `null`

Short traces catch most pointer bugs quickly.

---

## Interview-Grade Invariant Habit

Before coding, define one invariant sentence, e.g.:

- reversal: "`prev` is head of reversed prefix"
- merge: "`tail` is last node of sorted merged list"
- fast/slow: "`slow` advances half speed of `fast`"

This reduces trial-and-error pointer updates.

---

## Common Mistakes

1. Losing next pointer during reversal
2. Not using dummy node for head-edge deletes
3. Null checks missing in fast/slow loops
4. Mixing node references after mutation

---

## Practice Set (Recommended Order)

1. Middle of the Linked List (LC 876)  
   [LeetCode](https://leetcode.com/problems/middle-of-the-linked-list/)
2. Reverse Linked List (LC 206)  
   [LeetCode](https://leetcode.com/problems/reverse-linked-list/)
3. Linked List Cycle (LC 141)  
   [LeetCode](https://leetcode.com/problems/linked-list-cycle/)
4. Remove Nth Node From End (LC 19)  
   [LeetCode](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
5. Merge Two Sorted Lists (LC 21)  
   [LeetCode](https://leetcode.com/problems/merge-two-sorted-lists/)
6. Reorder List (LC 143)  
   [LeetCode](https://leetcode.com/problems/reorder-list/)

---

## Key Takeaways

- Linked list mastery is pointer-state mastery.
- Dummy nodes and clear invariants prevent most bugs.
- Fast/slow and reversal are foundational for many advanced problems.
