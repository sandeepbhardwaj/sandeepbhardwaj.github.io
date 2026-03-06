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
author_profile: true
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
This guide explains the intuition, optimized approach, and Java implementation for remove duplicates from sorted list ii in java, with practical tips for interviews and production coding standards.

## Problem

Remove all values that appear more than once in a sorted linked list.

Example: `1->2->3->3->4->4->5` -> `1->2->5`

## Approach

Use a dummy node and two pointers:

- `prev` points to last confirmed unique node
- `current` scans duplicates block

## Java Solution

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
                current = current.next;
                duplicate = true;
            }

            if (duplicate) prev.next = current.next;
            else prev = prev.next;

            current = current.next;
        }

        return dummy.next;
    }
}
```

## Difference from LeetCode 83

- LeetCode 83 keeps one copy of duplicates.
- LeetCode 82 removes all duplicate-valued nodes entirely.

That is why this solution needs `prev` + dummy node and duplicate-block detection.

## Dry Run

Input: `1->2->3->3->4->4->5`

1. `1` unique -> keep (`prev` moves)
2. `2` unique -> keep
3. detect duplicate block `3->3` -> skip all 3s
4. detect duplicate block `4->4` -> skip all 4s
5. `5` unique -> keep

Result: `1->2->5`

## Common Mistakes

1. Advancing `prev` even when duplicate block detected.
2. Missing dummy node and failing when head value is duplicated.
3. Confusing this with “keep one duplicate” variant.

## Testing Checklist

- all unique list
- duplicates only at head
- duplicates only at tail
- all nodes duplicated (result should be empty)
- mixed blocks of duplicates and uniques

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- unlike LeetCode 83, this variant removes all values that appear more than once.
- dummy node is essential because duplicates may include the original head.
- keep prev pointer at last confirmed-unique node while scanning duplicate runs.
