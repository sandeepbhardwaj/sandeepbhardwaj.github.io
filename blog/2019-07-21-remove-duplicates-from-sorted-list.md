---
layout: post
title: Remove Duplicates from Sorted List
author: Sandeep Bhardwaj
published: true
date: 2019-07-21 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Linked List, Sorted List"
summary: "Remove Duplicates from Sorted List"
---

<h3>Remove Duplicates from Sorted List</h3>


``` java
/**
 * 83. Remove Duplicates from Sorted List
 * <p>
 * Given a sorted linked list, delete all duplicates such that each element appear only once.
 * <p>
 * Example 1:
 * <p>
 * Input: 1->1->2
 * Output: 1->2
 * Example 2:
 * <p>
 * Input: 1->1->2->3->3
 * Output: 1->2->3
 */
public class RemoveDuplicatesFromSortedList {
	public ListNode deleteDuplicates(ListNode head) {
		ListNode current = head;
		while (current != null) {
			if (current.next == null)
				break;

			if (current.val == current.next.val) {
				//removing duplicate breaking the link
				current.next = current.next.next;
			} else {
				current = current.next;
			}

		}
		return head;
	}
}
```