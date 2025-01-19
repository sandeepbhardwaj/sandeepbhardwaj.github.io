---
layout: post
title: Reverse LinkedList Iteratively
author: Sandeep Bhardwaj
published: true
date: 2018-05-19 17:50:00 +5:30
category: Datastructure & Algorithms
tags: [Datastructure & Algorithms]
keywords: "LinkedList , Reverse"
summary: "Reverse LinkedList Iteratively"
---

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

	public Node<E> reverseIteratively(Node<E> head) {
		Node<E> prev = null;
		Node<E> current = head;

		while (current != null) {
			Node<E> next = current.next; // getting the next Node
			current.next = prev; // reverse the list
			prev = current; // prev holds the reversed list
			current = next;
		}
		return prev;
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
		head = list.reverseIteratively(head);
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
