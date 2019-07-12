---
layout: post
title: Detect loop in linked list
author: Sandeep Bhardwaj
published: true
date: 2019-07-15 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Linked List, Loop"
summary: "Detect loop in linked list"
---

<h3>Detect loop in linked list</h3>


``` java
/**
 * 141. Linked List Cycle
 * <p>
 * Given a linked list, determine if it has a cycle in it.
 * <p>
 * To represent a cycle in the given linked list, we use an integer pos which represents the position (0-indexed) in the
 * linked list where tail connects to. If pos is -1, then there is no cycle in the linked list.
 * <p>
 * Example 1:
 * <p>
 * Input: head = [3,2,0,-4], pos = 1
 * Output: true
 * Explanation: There is a cycle in the linked list, where tail connects to the second node.
 */
public class LinkedListCycle {
	public boolean hasCycle(ListNode head) {

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

