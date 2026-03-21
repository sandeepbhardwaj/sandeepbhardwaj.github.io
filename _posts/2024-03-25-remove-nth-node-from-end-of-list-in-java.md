---
title: "Remove Nth Node From End of List in Java"
date: '2024-03-25'
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
seo_title: "Remove Nth Node From End of List in Java"
seo_description: "Understand Remove Nth Node From End of List in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Linked List Problems in Java
  show_overlay_excerpt: false
---
Remove Nth Node From End of List is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Remove Nth Node From End of List

Problem description:
We are given a problem around **Remove Nth Node From End of List** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

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
- Remove Nth Node From End of List is a good pointer-discipline exercise because every link matters

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


/**
 * Given a linked list, remove the n-th node from the end of list and return its
 * head.
 * <p>
 * Example:
 * <p>
 * Given linked list: 1->2->3->4->5, and n = 2.
 * <p>
 * After removing the second node from the end, the linked list becomes
 * 1->2->3->5. Note:
 * <p>
 * Given n will always be valid.
 * <p>
 * Follow up:
 * <p>
 * Could you do this in one pass?
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

public class RemoveNthFromEnd {
	public ListNode removeNthFromEnd(ListNode head, int n) {

		ListNode slowPtr = head;
		ListNode fastPtr = head;

		while (n > 0) {
			fastPtr = fastPtr.next;
			n--;
		}

		// The head need to be removed, do it.
		if (fastPtr == null) {
			head = head.next;
			return head;
		}

		while (fastPtr.next != null) {
			fastPtr = fastPtr.next;
			slowPtr = slowPtr.next;
		}

		slowPtr.next = slowPtr.next.next; // the one after the h1 need to be removed

		return head;
	}

	public ListNode removeNthFromEndUsingFakeHead(ListNode head, int n) {
		ListNode fakeHead = new ListNode(0);
		fakeHead.next = head;

		ListNode slowPtr = fakeHead;
		ListNode fastPtr = fakeHead;

		while (n > 0) {
			fastPtr = fastPtr.next;
			n--;
		}
		while (fastPtr.next != null) {
			fastPtr = fastPtr.next;
			slowPtr = slowPtr.next;
		}
		slowPtr.next = slowPtr.next.next;
		return fakeHead.next;
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Remove Nth Node From End of List with 3 to 5 nodes and explicitly draw the `next` links before and after each pointer update. That is the fastest way to catch lost-node bugs.

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

- Remove Nth Node From End of List becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
