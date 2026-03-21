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
This is a basic but important linked-list deletion pattern.
The key lesson is that deleting by value is really about rewiring pointers safely, especially when the head itself may need to be removed.

---

## Problem 1: Remove Linked List Elements

Problem description:
Given the head of a linked list and an integer `val`, remove all nodes whose value equals `val`, and return the new head.

What we are solving actually:
The tricky case is not removing a middle node. It is removing nodes at the head, or removing several target nodes in a row. A dummy node gives us one stable pointer before the real list so every deletion becomes uniform.

What we are doing actually:

1. Create a dummy node that points to the real head.
2. Let `current` start at the dummy node.
3. Inspect `current.next`, not `current`, because we may need to bypass that next node.
4. If `current.next.val` matches the target, skip it; otherwise move forward.

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode current = dummy;

        while (current.next != null) {
            if (current.next.val == val) {
                current.next = current.next.next; // Delete the next node by unlinking it.
            } else {
                current = current.next; // Only move when the next node is confirmed safe to keep.
            }
        }

        return dummy.next;
    }
}
```

Debug steps:

- print `current.val` and `current.next.val` before each decision
- test removals at the head, in the middle, and consecutive target runs
- verify the invariant that all nodes before `current` are already finalized in the output list

---

## Why the Dummy Node Helps

Without a dummy node, removing the head requires special logic:

- if head should be deleted, move head
- otherwise use normal pointer updates

With a dummy node:

- every deletion is "remove `current.next`"

That uniform rule is much less error-prone.

---

## Dry Run

Input:

- `head = 1 -> 2 -> 6 -> 3 -> 4 -> 5 -> 6`
- `val = 6`

1. `current` starts at dummy
2. `current.next = 1`, keep it -> move forward
3. `current.next = 2`, keep it -> move forward
4. `current.next = 6`, delete it by bypassing
5. continue scanning
6. final `6` at tail is also bypassed

Result: `1 -> 2 -> 3 -> 4 -> 5`

---

## Why `current` Does Not Move After Deletion

Suppose the list is:

- `6 -> 6 -> 6 -> 1`

If we delete one `6` and move `current` immediately, we may skip the next `6`.
By staying in place after a deletion, we re-check the new `current.next` and handle consecutive target nodes correctly.

---

## Recursive Alternative

The recursive version is elegant:

```java
ListNode removeElementsRec(ListNode head, int val) {
    if (head == null) return null;
    head.next = removeElementsRec(head.next, val);
    return head.val == val ? head.next : head;
}
```

It is nice for understanding, but the iterative dummy-node version is usually safer in Java for very long lists.

---

## Common Mistakes

1. not using a dummy node and breaking head-removal cases
2. advancing `current` after deletion and skipping consecutive matches
3. forgetting to check `current.next != null`
4. mutating node values instead of fixing the links

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- dummy node makes head deletion as easy as middle deletion
- deletion in linked lists is pointer relinking, not shifting values
- after deletion, stay at the same pointer to catch consecutive target nodes
