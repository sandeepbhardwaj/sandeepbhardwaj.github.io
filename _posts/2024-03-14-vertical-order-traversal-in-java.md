---
title: "Vertical Order Traversal in Java"
date: '2024-03-14'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-tree
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Vertical Order Traversal in Java"
seo_description: "Understand Vertical Order Traversal in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Binary Tree Problems in Java
  show_overlay_excerpt: false
---
Vertical Order Traversal is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Vertical Order Traversal

Problem description:
We are given a problem around **Vertical Order Traversal** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat each node as the root of a smaller subproblem
2. compute or collect what the parent needs from the children
3. use hash-based lookup, queue-driven traversal, pointer or search-space narrowing, and recursion or subtree decomposition so subtree work composes cleanly
4. handle null nodes as an explicit base case instead of an afterthought

## Why This Problem Matters

- tree problems get easier when each subtree is treated as a complete subproblem with a return contract
- recursion depth, traversal order, and null handling decide correctness more than syntax does
- vertical order traversal is a strong example of thinking from node contract to whole-tree answer

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.TreeMap;

class TreeNode {
	int val;
	TreeNode left;
	TreeNode right;

	TreeNode(int val) {
		this.val = val;
	}

	TreeNode(int val, TreeNode left, TreeNode right) {
		this.val = val;
		this.left = left;
		this.right = right;
	}
}

public class VerticalOrderTraversal {

	/**
	 * Vertical order traversal using Level order + HasTable
	 *
	 * @param root
	 * @return
	 */
	public List<List<Integer>> verticalTraversal(TreeNode root) {
		List<List<Integer>> result = new ArrayList<>();
		if (root == null) {
			result.add(new ArrayList<>());
			return result;
		}

		//adding height and list of nodes as value
		TreeMap<Integer, List<Integer>> map = new TreeMap<>();

		Queue<QNode> queue = new LinkedList<>();

		queue.add(new QNode(root, 0));

		while (!queue.isEmpty()) {
			QNode qNode = queue.poll();

			List<Integer> list = map.getOrDefault(qNode.hd, new ArrayList<>());
			list.add(qNode.node.val);
			map.put(qNode.hd, list);

			if (qNode.node.left != null) queue.add(new QNode(qNode.node.left, qNode.hd - 1));
			if (qNode.node.right != null) queue.add(new QNode(qNode.node.right, qNode.hd + 1));
		}

		for (Map.Entry<Integer, List<Integer>> entry : map.entrySet()) {
			List<Integer> val = entry.getValue();
			result.add(val);
		}

		return result;
	}

	/**
	 * Class to store TreeNode and horizontal distance of node form root
	 */
	class QNode {
		TreeNode node;
		int hd;

		QNode(TreeNode node, int hd) {
			this.node = node;
			this.hd = hd;
		}
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Vertical Order Traversal on a small tree and state what each recursive call must return to its parent. That parent-child contract is the most important part of the solution.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- null root
- single-node tree
- highly skewed tree depth

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on hash-based lookup, queue-driven traversal, pointer or search-space narrowing, and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- draw the subtree result expected from each recursive call
- test null and single-node trees first
- compare preorder/inorder/postorder assumptions against the code
- watch for repeated subtree work that can be collapsed

## Key Takeaways

- Vertical Order Traversal becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
