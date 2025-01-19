---
layout: post
title: Remove Linked List Elements
author: Sandeep Bhardwaj
published: true
date: 2019-07-11 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: [Linked List, Remove elements"
summary: "Remove Linked List Elements iteratively and recursively"
---

<h3>Remove Linked List Elements</h3>


``` java
/**
 * 203. Remove Linked List Elements
 * Remove all elements from a linked list of integers that have value val.
 * <p>
 * Example:
 * <p>
 * Input:  1->2->6->3->4->5->6, val = 6
 * Output: 1->2->3->4->5
 */
public class RemoveLinkedListElements {
	/**
	 * Remove elements iteratively
	 *
	 * @param head
	 * @param val
	 * @return head
	 */
	public ListNode removeElements(ListNode head, int val) {
		if (head == null)
			return head;

		ListNode current = head;
		//check current.next to so we can remove next
		while (current.next != null) {
			if (current.next.val == val) {
				current.next = current.next.next;
			} else {
				current = current.next;
			}

		}

		if (head.val == val)
			head = head.next;

		return head;
	}

	/**
	 * Remove elements recursively
	 *
	 * @param head
	 * @param val
	 * @return head
	 */
	public ListNode removeElementsRecursively(ListNode head, int val) {
		if (head == null) {
			return null;
		}

		ListNode next = removeElementsRecursively(head.next, val);
		if (head.val == val) {
			return next;
		}
		head.next = next;
		return head;
	}
}
```

