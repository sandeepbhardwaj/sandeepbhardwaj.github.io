---
layout: post
title: Reverse LinkedList Recursively
author: Sandeep Bhardwaj
published: true
date: 2018-05-20 10:00:00 +5:30
category: Datastructure & Algorithms
tags: [Datastructure & Algorithms]
keywords: [LinkedList, Reverse]
summary: "Reverse LinkedList Recursively"
---

Reverse a linked list recursively.
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

	/**
	 * Reverse a list recursively
	 *
	 * @param head
	 * @return head of reversed list
	 */
	public Node<E> reverseRecursively(Node<E> head) {
		// base condition
		if (head == null || head.next == null) {
			return head;
		}

		Node<E> current = head;
		head = reverseRecursively(current.next);
		current.next.next = current; // reverse list
		current.next = null; // remove link
		return head;
	}

	public static void main(String[] arg) {
		LinkedList<Integer> list = new LinkedList<>();
		list.add(1);
		list.add(2);
		list.add(3);
		list.add(4);
		Node<Integer> head = list.getHead();
		System.out.println("List before reverse");
		list.display(head);
		System.out.println("\nList after reverse");
		head = list.reverseRecursively(head);
		list.display(head);
	}
}

```
<h3>Output</h3>
``` bash
List before reverse
1-> 2-> 3-> 4-> NULL

List after reverse
4-> 3-> 2-> 1-> NULL
```
