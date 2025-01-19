---
layout: post
title: Maximum Depth of Binary Tree
author: Sandeep Bhardwaj
published: true
date: 2019-07-22 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Binary Tree, Depth"
summary: "Maximum Depth of Binary Tree"
---

<h3>Maximum Depth of Binary Tree</h3>


``` java
/**
 * 104. Maximum Depth of Binary Tree
 * Given a binary tree, find its maximum depth.
 * <p>
 * The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
 * <p>
 * Note: A leaf is a node with no children.
 * <p>
 * Example:
 * <p>
 * Given binary tree [3,9,20,null,null,15,7],
 * return its depth = 3.
 */
public class MaximumDepthOfBTree {
	public int maxDepth(TreeNode root) {

		if(root==null)
		{
			return 0;
		}

		int left = maxDepth(root.left);
		int right = maxDepth(root.right);

		return Math.max(left,right)+1;
	}
}
```