---
title: Maximum Depth of Binary Tree in Java
date: '2019-07-22'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- trees
- dfs
- bfs
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Maximum Depth of Binary Tree in Java (DFS and BFS)
seo_description: Solve binary tree maximum depth using recursive DFS and iterative
  BFS approaches.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Maximum Depth of Binary Tree in Java

This guide explains the intuition, optimized approach, and Java implementation for maximum depth of binary tree in java, with practical tips for interviews and production coding standards.

## Problem

Find number of nodes along longest path from root to leaf.

## DFS (Recursive) Solution

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

## BFS (Level Order) Solution

```java
class SolutionBfs {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int depth = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            depth++;
        }

        return depth;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(h)` for DFS recursion or `O(w)` for BFS queue

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
