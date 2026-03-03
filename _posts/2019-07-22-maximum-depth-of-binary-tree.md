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
  show_overlay_excerpt: false
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

## DFS vs BFS: When to Prefer Which

- DFS recursion: concise and easy to reason about.
- BFS: avoids deep recursion stack on skewed trees.

For very deep/skewed trees, iterative BFS (or iterative DFS with stack) is safer in Java.

## Dry Run

Tree:

```text
    3
   / \
  9  20
    /  \
   15   7
```

Depth levels:

1. `[3]`
2. `[9,20]`
3. `[15,7]`

Answer: `3`

## Common Mistakes

1. Counting edges instead of nodes (off by one).
2. Forgetting base case `root == null`.
3. Using recursive DFS on huge skewed trees without considering stack overflow.

## Iterative DFS Variant

```java
int maxDepthIterative(TreeNode root) {
    if (root == null) return 0;
    record NodeDepth(TreeNode node, int depth) {}
    Deque<NodeDepth> st = new ArrayDeque<>();
    st.push(new NodeDepth(root, 1));
    int best = 0;
    while (!st.isEmpty()) {
        NodeDepth p = st.pop();
        TreeNode node = p.node();
        int d = p.depth();
        best = Math.max(best, d);
        if (node.left != null) st.push(new NodeDepth(node.left, d + 1));
        if (node.right != null) st.push(new NodeDepth(node.right, d + 1));
    }
    return best;
}
```

## Testing Checklist

- empty tree
- single-node tree
- balanced tree
- completely skewed tree
- random large tree

## Complexity

- Time: `O(n)`
- Space: `O(h)` for DFS recursion or `O(w)` for BFS queue

## Key Takeaways

- tree depth can be solved via DFS recursion with `1 + max(leftDepth, rightDepth)`.
- base case (`null -> 0`) is the core that keeps recurrence correct.
- for very deep trees, iterative BFS/DFS avoids recursion stack overflow.
