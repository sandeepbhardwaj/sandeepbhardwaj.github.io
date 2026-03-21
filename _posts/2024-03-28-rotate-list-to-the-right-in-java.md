---
title: "Rotate List to the Right in Java"
date: '2024-03-28'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- linked-list
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Rotate List to the Right in Java"
seo_description: "Understand Rotate List to the Right in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Linked List Problems in Java
  show_overlay_excerpt: false
---
Rotate List to the Right is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Rotate List to the Right

Problem description:
We are given a problem around **Rotate List to the Right** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. name the current, previous, and next pointer responsibilities clearly
2. rewire pointers in a safe order so no node is lost accidentally
3. rely on pointer or search-space narrowing and recursion or subtree decomposition instead of value-copy shortcuts
4. finish by reconnecting the surrounding list boundaries if the head changes

## Why This Problem Matters

- linked list problems expose whether pointer ownership is really clear in your head
- many implementations fail not because the idea is wrong but because reconnection order is unsafe
- rotate list to the right is a good pointer-discipline exercise because every link matters

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


/**
 * 61. Rotate List
 * <p>
 * Given the head of a linked list, rotate the list to the right by k places.
 * <p>
 * Example 1:
 * Input: head = [1,2,3,4,5], k = 2
 * Output: [4,5,1,2,3]
 * <p>
 * Example 2:
 * Input: head = [0,1,2], k = 4
 * Output: [2,0,1]
 */
class ListNode {
	int val;
	ListNode next;

	ListNode(int val) {
		this.val = val;
	}

	ListNode(int val, ListNode next) {
		this.val = val;
		this.next = next;
	}
}

public class RotateListToRight {
	public ListNode rotateRight(ListNode head, int k) {

		if (head == null || head.next == null) {
			return head;
		}

		//calculate k if list size is 10 and k is 100 then no need to rotate
		k = k % size(head); //is used for reminder

		if (k == 0) return head;

		//Use two pointer approach
		ListNode slowPtr = head;
		ListNode fastPtr = head;

		//move fastPtr to k nodes
		//1->2->3, k=2 :=> fastPtr on 3 after loop completion
		//1->2->3->4->5 :=> fastPtr on 3 after loop completion
		while (fastPtr.next != null && k > 0) {
			fastPtr = fastPtr.next;
			k--;
		}

		//Now move both the pointers
		//1->2->3->4->5 :=> fastPtr on 5 and slowPtr on 3 after loop completion
		while (fastPtr.next != null) {
			fastPtr = fastPtr.next;
			slowPtr = slowPtr.next;
		}

		//Now rotate
		//1->2->3->4->5 :=> fastPtr on 5 and slowPtr on 3 after loop completion
		ListNode newHead = slowPtr.next; // 3->4 : 4 becomes new head
		slowPtr.next = null; //break the link 1->2->3  4->5
		fastPtr.next = head; // 4->5->1->2->3
		return newHead;
	}

	private int size(ListNode head) {
		int count = 0;
		ListNode current = head;
		while (current != null) {
			current = current.next;
			count++;
		}
		return count;
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Rotate List to the Right with 3 to 5 nodes and explicitly draw the `next` links before and after each pointer update. That is the fastest way to catch lost-node bugs.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty list
- head node changes after the operation
- tail reconnection after pointer rewiring

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on pointer or search-space narrowing and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- draw node links before and after each pointer rewrite
- save `next` before overwriting any link
- test empty, one-node, and two-node lists
- verify the returned head is the true new head

## Key Takeaways

- Rotate List to the Right becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
