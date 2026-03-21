---
title: "Diameter of Binary Tree in Java"
date: '2024-03-03'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-tree
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Diameter of Binary Tree in Java"
seo_description: "Understand diameter of binary tree in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Binary Tree Problems in Java
  show_overlay_excerpt: false
---
Diameter of Binary Tree is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Diameter of Binary Tree

Problem description:
We are given a problem around **Diameter of Binary Tree** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat each node as the root of a smaller subproblem
2. compute or collect what the parent needs from the children
3. use recursion or subtree decomposition so subtree work composes cleanly
4. handle null nodes as an explicit base case instead of an afterthought

## Why This Problem Matters

- tree problems get easier when each subtree is treated as a complete subproblem with a return contract
- recursion depth, traversal order, and null handling decide correctness more than syntax does
- diameter of binary tree is a strong example of thinking from node contract to whole-tree answer

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


/**
 * 543. Diameter of Binary Tree
 * <p>
 * Given the root of a binary tree, return the length of the diameter of the tree.
 * <p>
 * The diameter of a binary tree is the length of the longest path between any two nodes in a tree.
 * This path may or may not pass through the root.
 * <p>
 * The length of a path between two nodes is represented by the number of edges between them.
 */
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

public class DiameterOfBTree {
	private int diameter = 0;

	public int diameterOfBinaryTree(TreeNode root) {
		maxDepth(root);
		return diameter;
	}

	private int maxDepth(TreeNode root) {
		if (root == null) return 0;

		int leftDepth = maxDepth(root.left);
		int rightDepth = maxDepth(root.right);
		diameter = Math.max(diameter, leftDepth + rightDepth);

		return 1 + Math.max(leftDepth, rightDepth);
	}
}
```

## Why This Solution Works

The implementation works because each recursive call returns one piece of information to its parent: the height of the current subtree. While those heights flow upward, the code also updates a shared `diameter` field with the best left-height plus right-height combination seen so far.

That makes the solution a true single traversal. We do not recompute subtree heights from scratch for every node, so the time complexity stays `O(n)` instead of drifting toward `O(n^2)` on skewed trees.

## Dry Run

Dry-run Diameter of Binary Tree on a small tree and state what each recursive call must return to its parent. That parent-child contract is the most important part of the solution.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- null root
- single-node tree
- highly skewed tree depth

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

This version performs one depth-first traversal, so the time complexity is `O(n)` and the space complexity is `O(h)` for recursion depth, where `h` is the height of the tree.

## Debug Steps

Debug steps:

- draw the subtree result expected from each recursive call
- test null and single-node trees first
- compare preorder/inorder/postorder assumptions against the code
- watch for repeated subtree work that can be collapsed

## Key Takeaways

- Diameter of Binary Tree becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
