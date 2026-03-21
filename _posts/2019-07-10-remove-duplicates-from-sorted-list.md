---
title: Remove Duplicates from Sorted List (LeetCode 83)
date: '2019-07-10'
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
seo_title: Remove Duplicates from Sorted List in Java (LeetCode 83)
seo_description: In-place linked-list deduplication for sorted lists in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the cleanest linked-list problems where sorted order removes most of the complexity.
Because equal values appear next to each other, we can delete duplicates in one pass without extra memory.

Input: `1 -> 1 -> 2 -> 3 -> 3`  
Output: `1 -> 2 -> 3`

---

## Problem 1: Remove Duplicates from Sorted List

Problem description:
Given the head of a sorted singly linked list, delete duplicate nodes so each value appears exactly once, and return the updated head.

What we are solving actually:
The hard part in linked lists is usually searching backward or managing many pointers. Sorted order removes that pain: duplicates only appear right next to each other. So the real job is not "find all duplicates anywhere," but "compare each node only with its immediate next node and relink when needed."

What we are doing actually:

1. Start from the head with one pointer `current`.
2. Compare `current.val` with `current.next.val`.
3. If the values are equal, bypass the duplicate node by changing `current.next`.
4. If the values differ, move `current` forward.

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode current = head;

        while (current != null && current.next != null) {
            if (current.val == current.next.val) {
                // Duplicate found, so skip the next node and keep checking
                // the same value in case there are more duplicates after it.
                current.next = current.next.next;
            } else {
                // Values differ, so current is already clean and we can move forward.
                current = current.next;
            }
        }

        return head;
    }
}
```

Debug steps:

- print `current.val` and `current.next.val` before each comparison
- test `1->1->1`, `1->2->3`, and `1->1->2->3->3` to cover repeated duplicates and no-duplicate cases
- verify the invariant that every node before `current` is already deduplicated

---

## Why Sorted Order Changes Everything

If the list were unsorted, duplicates could appear anywhere and we would need a `HashSet` or some more complex tracking.

Because the list is sorted:

- all duplicates of a value form one adjacent block
- once we leave a value, we never need to think about it again
- one pointer is enough

That makes this an in-place pointer-update problem, not a search problem.

---

## Dry Run

Input: `1 -> 1 -> 2 -> 3 -> 3`

1. `current = 1`, next is `1`  
   duplicate found -> skip next  
   list becomes `1 -> 2 -> 3 -> 3`

2. `current = 1`, next is `2`  
   values differ -> move `current` to `2`

3. `current = 2`, next is `3`  
   values differ -> move `current` to `3`

4. `current = 3`, next is `3`  
   duplicate found -> skip next  
   list becomes `1 -> 2 -> 3`

5. `current.next == null`  
   stop

Final answer: `1 -> 2 -> 3`

---

## Important Pointer Rule

After deleting a duplicate, do not move `current` immediately.

Why?

Because there might be more duplicates of the same value:

`1 -> 1 -> 1 -> 2`

If we delete only one duplicate and move forward too early, we can miss the next duplicate in the same block.
That is why the correct pattern is:

- delete and stay
- move only when the next value changes

---

## Boundary Cases

- empty list -> return `null`
- one node -> return that node
- all nodes equal -> collapse to one node
- already unique sorted list -> return original list unchanged

The loop condition `current != null && current.next != null` protects all of these cases cleanly.

---

## Common Mistakes

1. moving `current` after deletion and skipping part of a duplicate block
2. forgetting `current.next != null` in the loop condition
3. applying this same logic to an unsorted list
4. confusing this problem with LeetCode 82, where all duplicated values must be removed completely

---

## Related Problem: Remove All Duplicate Values Entirely

This problem keeps one copy of each value.

For LeetCode 82:

- `1 -> 1 -> 2 -> 3 -> 3` becomes `2`

That variant is harder because you need to remove the whole duplicate block, not just extra copies.
So if your solution here seems "too easy," that is because the requirements are different.

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- sorted linked lists turn duplicate removal into a local adjacency check
- relinking `next` pointers is enough; no extra nodes or arrays are needed
- the key invariant is: everything before `current` is already clean
