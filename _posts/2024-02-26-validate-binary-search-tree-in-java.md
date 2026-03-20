---
title: "Validate Binary Search Tree in Java"
date: '2024-02-26'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-search-tree
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Validate Binary Search Tree in Java"
seo_description: "Understand validate binary search tree in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Binary Search Tree Problems in Java
  show_overlay_excerpt: false
---
Validate Binary Search Tree is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Validate Binary Search Tree

Problem description:
We are given a problem around **Validate Binary Search Tree** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. keep the BST ordering rule visible in every recursive or iterative step
2. move left or right based on the target comparison only
3. let recursion or subtree decomposition carry the main correctness invariant
4. re-check null handling and returned subtree links before finishing the operation

## Why This Problem Matters

- BST problems are a good test of whether ordering invariants are truly understood
- small pointer or recursion mistakes can silently corrupt the structure
- validate binary search tree is mostly about preserving the tree contract after each decision

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


/**
 * 98. Validate Binary Search Tree
 * <p>
 * Given the root of a binary tree, determine if it is a valid binary search tree (BST).
 * <p>
 * A valid BST is defined as follows:
 * <p>
 * The left subtree of a node contains only nodes with keys less than the node's key.
 * The right subtree of a node contains only nodes with keys greater than the node's key.
 * Both the left and right subtrees must also be binary search trees.
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

public class ValidateBST {
	public boolean isValidBST(TreeNode root) {
		return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
	}

	public boolean valid(TreeNode node, long minRange, long maxRange) {
		if (node == null)
			return true;

		if (node.val <= minRange || node.val >= maxRange) return false;

		return valid(node.left, minRange, node.val) && valid(node.right, node.val, maxRange);
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Validate Binary Search Tree on a small BST and say out loud why each move goes left or right. If you cannot justify the subtree choice in one sentence, the implementation usually hides a boundary mistake.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty tree
- inserting or searching at the root boundary
- duplicate-handling policy

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- log the current node value before each move
- test root-level insert/search cases separately
- verify returned child links are reattached correctly
- decide and test the duplicate policy explicitly

## Key Takeaways

- Validate Binary Search Tree becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
