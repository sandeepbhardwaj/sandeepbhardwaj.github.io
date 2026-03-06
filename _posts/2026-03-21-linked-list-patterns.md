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

```java
public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

---

## Pattern 2: Iterative Reversal

```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
```

---

## Problem 1: Linked List Cycle

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

---

## Problem 2: Merge Two Sorted Lists

```java
public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;

    while (a != null && b != null) {
        if (a.val <= b.val) {
            tail.next = a;
            a = a.next;
        } else {
            tail.next = b;
            b = b.next;
        }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}
```

---

## Problem 3: Remove Nth Node From End

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode first = dummy, second = dummy;

    for (int i = 0; i <= n; i++) first = first.next;

    while (first != null) {
        first = first.next;
        second = second.next;
    }

    second.next = second.next.next;
    return dummy.next;
}
```

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
