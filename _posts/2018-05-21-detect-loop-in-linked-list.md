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
Cycle detection is a classic linked-list pattern because it turns an apparently tricky structural problem into a pointer-speed problem. Floyd's algorithm is short, efficient, and shows up often in interviews.

## Problem 1: Detect a Loop in Linked List

Problem description:
Given the head of a singly linked list, determine whether the list contains a cycle.

Example:

- Input: `3 -> 2 -> 0 -> -4`, with tail pointing back to node `2`
- Output: `true`

What we are solving actually:
We are trying to detect whether following `next` pointers can keep us moving forever. If the list is acyclic, traversal must eventually hit `null`. If the list has a cycle, a pointer that moves faster will eventually lap a slower pointer and they will meet.

What we are doing actually:

1. Use `slow` to move one step at a time.
2. Use `fast` to move two steps at a time.
3. If `fast` reaches `null`, there is no cycle.
4. If `slow` and `fast` ever point to the same node, a cycle exists.

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next; // Slow pointer moves one step.
            fast = fast.next.next; // Fast pointer moves two steps.

            if (slow == fast) { // Meeting means the fast pointer lapped the slow one.
                return true;
            }
        }

        return false; // Fast reached the end, so the list is acyclic.
    }
}
```

## Why This Works

If there is no cycle, `fast` keeps moving toward `null` and the loop ends.
If there is a cycle, both pointers eventually enter the cycle.
Inside the cycle, the distance between them changes by one node per step, so `fast` must eventually catch `slow`.

The key detail is that we compare node references, not node values.
Two different nodes can have the same value and still not mean there is a cycle.

## Dry Run

Consider `1 -> 2 -> 3 -> 4 -> 5`, where `5.next = 3`.

1. Start: `slow = 1`, `fast = 1`
2. Move: `slow = 2`, `fast = 3`
3. Move: `slow = 3`, `fast = 5`
4. Move: `slow = 4`, `fast = 4`

They meet at node `4`, so the list has a cycle.

## Common Mistakes

1. Forgetting to check both `fast != null` and `fast.next != null`
2. Comparing `slow.val == fast.val` instead of `slow == fast`
3. Returning `true` for a single-node list without a self-loop
4. Assuming the first meeting point is always the cycle start

## Debug Steps

Debug steps:

- print the values or identities of `slow` and `fast` each loop
- test an empty list and a one-node non-cycle list
- test a one-node self-cycle list
- test a cycle that starts in the middle, not only at the head

## Useful Extension: Find the Cycle Start

If the problem asks for the node where the cycle begins, do this after `slow` and `fast` meet:

1. Move one pointer back to `head`
2. Move both pointers one step at a time
3. The node where they meet again is the cycle entry

```java
ListNode detectCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow == fast) {
            ListNode start = head;

            while (start != slow) {
                start = start.next; // Move from head toward cycle entry.
                slow = slow.next; // Move from meeting point at same speed.
            }

            return start;
        }
    }

    return null;
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- Floyd cycle detection turns structure into pointer-speed reasoning
- `fast` hitting `null` proves there is no cycle
- `slow == fast` proves there is a cycle, but not necessarily at the entry node
