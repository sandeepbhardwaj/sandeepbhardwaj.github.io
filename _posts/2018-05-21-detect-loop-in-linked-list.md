---
title: Detect a Loop in Linked List (Floyd Cycle Detection)
date: '2018-05-21'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
- fast-slow-pointers
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Detect Loop in Linked List in Java (Floyd Algorithm)
seo_description: Detect cycle in linked list using slow and fast pointers in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Detect a Loop in Linked List (Floyd Cycle Detection)

This guide explains the intuition, optimized approach, and Java implementation for detect a loop in linked list (floyd cycle detection), with practical tips for interviews and production coding standards.

## Problem

Determine whether a linked list contains a cycle.

## Approach: Slow and Fast Pointers

- `slow` moves one step
- `fast` moves two steps
- If there is a cycle, they must meet
- If `fast` reaches `null`, no cycle exists

## Java Solution

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) return false;

        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
}
```

## Extension: Find Cycle Start Node

After `slow` and `fast` meet, move one pointer to head.
Then move both one step at a time; meeting point is cycle start.

```java
ListNode detectCycleStart(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            ListNode p1 = head, p2 = slow;
            while (p1 != p2) {
                p1 = p1.next;
                p2 = p2.next;
            }
            return p1;
        }
    }
    return null;
}
```

## Extension: Cycle Length

Once a meeting point is found, loop once around cycle to count length.

```java
int cycleLength(ListNode meet) {
    int len = 1;
    ListNode curr = meet.next;
    while (curr != meet) {
        len++;
        curr = curr.next;
    }
    return len;
}
```

## Common Mistakes

1. Advancing `fast = fast.next.next` without `fast.next` null check.
2. Comparing node values instead of node references.
3. Returning true for single-node non-cycle lists.

## Testing Checklist

- empty list
- one node without cycle
- one node with self-cycle
- cycle in middle (`1->2->3->4->2`)
- long acyclic list

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Why This Is Better Than HashSet

HashSet approach works but uses extra memory `O(n)`. Floyd’s algorithm gives constant-space detection.

## Key Takeaways

- Floyd's fast/slow pointers detect cycles without extra memory.
- meeting of pointers proves cycle existence, not just chance overlap.
- always include empty and single-node cases in cycle tests.
