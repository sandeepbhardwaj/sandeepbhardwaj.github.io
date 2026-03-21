---
title: "Binary Tree Iterative Traversal in Java"
date: '2024-03-01'
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
seo_title: "Binary Tree Iterative Traversal in Java"
seo_description: "Understand binary tree iterative traversal in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Binary Tree Problems in Java
  show_overlay_excerpt: false
---
Binary Tree Iterative Traversal is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Binary Tree Iterative Traversal

Problem description:
We are given a problem around **Binary Tree Iterative Traversal** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat each node as the root of a smaller subproblem
2. compute or collect what the parent needs from the children
3. use LIFO state tracking, pointer or search-space narrowing, and recursion or subtree decomposition so subtree work composes cleanly
4. handle null nodes as an explicit base case instead of an afterthought

## Why This Problem Matters

- tree problems get easier when each subtree is treated as a complete subproblem with a return contract
- recursion depth, traversal order, and null handling decide correctness more than syntax does
- binary tree iterative traversal is a strong example of thinking from node contract to whole-tree answer

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java


import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

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

public class BinaryTreeIterativeTraversal {

	public List<Integer> preorderTraversal(TreeNode root) {
		List<Integer> result = new ArrayList<>();
		if (root == null)
			return result;

		Stack<TreeNode> stack = new Stack<>();
		stack.push(root);

		while (!stack.isEmpty()) {
			//pop root element
			TreeNode node = stack.pop();
			result.add(node.val);

			if (node.right != null) stack.push(node.right);
			if (node.left != null) stack.push(node.left);
		}
		return result;
	}


	public List<Integer> inorderTraversal(TreeNode root) {
		List<Integer> result = new ArrayList<>();

		if (root == null)
			return result;

		Stack<TreeNode> stack = new Stack<>();
		TreeNode current = root;

		while (!stack.isEmpty() || current != null) {
			//loop to go extreme left
			while (current != null) {
				stack.add(current);
				current = current.left;
			}

			//get the element from stack
			TreeNode node = stack.pop();
			result.add(node.val);

			//get the right of node if its null the above loop will not execute
			//and we will pop the element from stack
			current = node.right;
		}

		return result;
	}


	/**
	 * Simple solution
	 *
	 * @param root
	 * @return
	 */
	public List<Integer> postorderTraversalUsingTwoStack(TreeNode root) {
		List<Integer> result = new ArrayList<>();
		if (root == null)
			return result;

		Stack<TreeNode> stack1 = new Stack<>();
		Stack<TreeNode> stack2 = new Stack<>();

		//add root to stack1
		stack1.add(root);

		while (!stack1.isEmpty()) {
			TreeNode node = stack1.pop();

			//add node to stack2
			stack2.add(node);

			//add left first and then right
			if (node.left != null) stack1.add(node.left);
			if (node.right != null) stack1.add(node.right);

		}

		//stack2 holds the result;
		while (!stack2.isEmpty()) {
			result.add(stack2.pop().val);
		}

		return result;
	}

	/**
	 * Using single stack
	 * @param root
	 * @return
	 */
	public List<Integer> postorderTraversal(TreeNode root) {
		List<Integer> result = new ArrayList<>();
		if (root == null)
			return result;

		Stack<TreeNode> stack = new Stack<>();

		//add root to stack
		stack.add(root);

		while (!stack.isEmpty()) {
			TreeNode node = stack.pop();

			//add node value to front
			result.add(0, node.val);

			//add left first and then right
			if (node.left != null) stack.add(node.left);
			if (node.right != null) stack.add(node.right);
		}
		return result;
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Binary Tree Iterative Traversal on a small tree and state what each recursive call must return to its parent. That parent-child contract is the most important part of the solution.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- null root
- single-node tree
- highly skewed tree depth

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on LIFO state tracking, pointer or search-space narrowing, and recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- draw the subtree result expected from each recursive call
- test null and single-node trees first
- compare preorder/inorder/postorder assumptions against the code
- watch for repeated subtree work that can be collapsed

## Key Takeaways

- Binary Tree Iterative Traversal becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
