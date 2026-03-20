---
title: Add Two Numbers Represented as Linked List
date: '2019-07-07'
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
seo_title: Add Two Numbers (Linked List) in Java - LeetCode 2
seo_description: Add two numbers represented by reverse-order linked lists with carry
  handling in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is a linked-list version of grade-school addition.
The main challenge is not arithmetic itself, but carrying digits correctly while the two lists may have different lengths.

---

## Problem 1: Add Two Numbers Represented as Linked List

Problem description:
Two non-empty linked lists represent two non-negative integers. Digits are stored in reverse order, and each node contains one digit. Add the two numbers and return the sum as a linked list in the same reverse-order format.

What we are solving actually:
We are adding digit by digit from least significant to most significant, just like manual addition. The hidden complication is that one list can end earlier than the other, and a final carry may still remain after both lists are exhausted.

What we are doing actually:

1. Walk through both lists at the same time.
2. Treat a missing node as digit `0` once one list ends.
3. Compute `sum = x + y + carry`.
4. Append `sum % 10` to the output and update `carry = sum / 10`.

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;
            int sum = x + y + carry;

            carry = sum / 10; // Carry moves to the next digit position.
            tail.next = new ListNode(sum % 10); // Current output digit is the ones place.
            tail = tail.next;

            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }

        return dummy.next; // Skip the helper node and return the real head.
    }
}
```

Debug steps:

- print `x`, `y`, `sum`, and `carry` on every loop iteration
- test `(2->4->3) + (5->6->4)`, `(9) + (1)`, and unequal lengths like `(9->9->9) + (1)`
- verify the invariant that the built output list always represents the correct sum of digits processed so far

---

## Why Reverse Order Makes It Easier

Because the least significant digit comes first:

- the head nodes are the ones digits
- the next nodes are the tens digits
- and so on

That means we can add from head to tail in one pass.
If digits were stored in forward order, we would need stacks or list reversal first.

---

## Dry Run

Input:

- `l1 = 2 -> 4 -> 3`
- `l2 = 5 -> 6 -> 4`

Step 1:

- `2 + 5 + carry(0) = 7`
- output digit = `7`
- carry = `0`

Step 2:

- `4 + 6 + carry(0) = 10`
- output digit = `0`
- carry = `1`

Step 3:

- `3 + 4 + carry(1) = 8`
- output digit = `8`
- carry = `0`

Result: `7 -> 0 -> 8`

That corresponds to:

- `342 + 465 = 807`

stored again in reverse order.

---

## Why the Dummy Node Helps

Without a dummy node, the first output digit needs special handling:

- if this is the first node, create head
- otherwise append normally

The dummy node removes that branch entirely.
You always attach the next node to `tail.next` and move `tail` forward.

That keeps the pointer logic much cleaner.

---

## Final Carry Case

The loop condition includes:

`|| carry != 0`

That part is essential.

Example:

- `(9) + (1)`
- `9 + 1 = 10`

Output must become:

- `0 -> 1`

If the loop stopped as soon as both lists ended, the final carry node would be lost.

---

## Common Mistakes

1. forgetting to include the final carry in the loop condition
2. advancing pointers before reading their current values
3. mishandling unequal list lengths
4. trying to modify and reuse input nodes in a way that corrupts the original lists

---

## Boundary Cases

- `0 + 0` -> `0`
- one extra carry at the end -> like `9 + 1`
- one list longer than the other -> still fine because missing digits are treated as `0`
- many carry chains -> like `9->9->9 + 1`

---

## Complexity

- Time: `O(max(m, n))`
- Space: `O(max(m, n))` for the output list

---

## Key Takeaways

- this is digit-by-digit addition with carry, expressed through linked lists
- reverse order allows one forward traversal
- dummy node plus carry handling makes the implementation compact and reliable
