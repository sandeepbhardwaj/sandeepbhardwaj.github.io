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
author_profile: true
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

# Remove Duplicates from Sorted List (LeetCode 83)

Given a sorted linked list, remove duplicate nodes so each value appears exactly once.

Input: `1 -> 1 -> 2 -> 3 -> 3`  
Output: `1 -> 2 -> 3`

---

## Core Idea

Because list is sorted, duplicates are always adjacent.
Use one pointer `current`:

- if `current.val == current.next.val`, skip next node
- otherwise move `current` forward

---

## Java Solution

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode current = head;

        while (current != null && current.next != null) {
            if (current.val == current.next.val) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }

        return head;
    }
}
```

---

## Dry Run

Input: `1 -> 1 -> 2 -> 3 -> 3`

1. `current=1`, next `1` -> duplicate, skip next  
   list becomes `1 -> 2 -> 3 -> 3`
2. `current=1`, next `2` -> move to `2`
3. `current=2`, next `3` -> move to `3`
4. `current=3`, next `3` -> duplicate, skip next

Result: `1 -> 2 -> 3`

---

## Important Pointer Rule

After deletion, do not move `current` immediately.
Reason: there may be more duplicates of same value (for example `1 -> 1 -> 1`).

---

## Common Mistakes

1. advancing pointer after deletion and skipping checks
2. missing loop condition `current.next != null`
3. applying this logic to unsorted list

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- sorted order makes duplicates local and easy to remove in one pass.
- mutation is done by relinking `next` pointers, no extra nodes needed.
- this differs from LeetCode 82, where all duplicate values must be removed entirely.
