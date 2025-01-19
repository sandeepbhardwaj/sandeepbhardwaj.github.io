---
layout: post
title: Detect a loop in LinkedList
author: Sandeep Bhardwaj
published: true
date: 2018-05-21 11:35:00 +5:30
category: Datastructure & Algorithms
tags: [Datastructure & Algorithms]
keywords: [LinkedList, Detect a loop]
summary: "Detect a loop in LinkedList"
---

Detect loop in a linked list.
<h3>Floyd’s Cycle-Finding Algorithm:</h3>
Traverse linked list using two pointers.  Move one pointer(slowPtr) by one and other pointer(fastPtr) by two.  If these pointers meet at some node then there is a loop.  If pointers do not meet then linked list doesn’t have loop.

<h3>LinkedList.java</h3>

``` java
public class LinkedList<E> {
	static class Node<E> {
		E data;
		Node<E> next;

		Node(E data, Node<E> next) {
			this.data = data;
			this.next = next;
		}
	}// end of node class

	private Node<E> head = null;

	Node<E> getHead() {
		return head;
	}

	public void add(E e) {
		Node<E> node = new Node<>(e, null);
		if (head == null) {
			head = node;
		} else {
			Node<E> current = head;
			while (current.next != null) {
				current = current.next;
			}
			current.next = node;
		}
	}

	public void display(Node<E> head) {
		Node<E> current = head;
		while (current != null) {
			System.out.print(current.data + "-> ");
			current = current.next;
		}
		System.out.print("NULL\n");
	}

	public boolean detectLoop(Node<E> head) {
		Node<E> slowPtr = head;
		Node<E> fastPtr = head;
		while (fastPtr != null && fastPtr.next != null) {
			slowPtr = slowPtr.next;
			fastPtr = fastPtr.next.next;
			if (slowPtr == fastPtr) {
				return true;
			}
		}
		return false;
	}

	/**
	 * <pre>
	 * 1 > 2 > 3 > 4
	 *     ^       ^
	 *     |_______|
	 *
	 * </pre>
	 *
	 * @author Sandeep Bhardwaj
	 *
	 */
	public static void main(String[] arg) {
		LinkedList<Integer> list = new LinkedList<>();
		list.add(1);
		list.add(2);
		list.add(3);
		list.add(4);
		Node<Integer> head = list.getHead();
		//create loop
		head.next.next.next = head.next;
		list.display(head);
	}
}

```
<h3>Output</h3>
``` bash
Loop found ...
```

<h3>Complexity</h3>
``` bash
Time Complexity: O(n)
Auxiliary Space: O(1)
```
