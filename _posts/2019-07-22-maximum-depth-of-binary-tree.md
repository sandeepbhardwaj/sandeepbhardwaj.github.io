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
This is a foundational tree problem because it can be solved cleanly in both DFS and BFS style.
The recursive DFS version is the most compact, while BFS makes the level structure explicit.

---

## Problem 1: Maximum Depth of Binary Tree

Problem description:
Given the root of a binary tree, return the maximum depth of the tree, where depth is the number of nodes on the longest path from the root down to a leaf.

What we are solving actually:
We are not counting all nodes. We only care about the longest root-to-leaf path. That means every subtree can summarize itself with one number: its own maximum depth.

What we are doing actually:

1. If the node is `null`, its depth is `0`.
2. Recursively compute depth of the left subtree.
3. Recursively compute depth of the right subtree.
4. Return `1 + max(leftDepth, rightDepth)` for the current node.

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0; // Empty subtree contributes no depth.

        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return 1 + Math.max(leftDepth, rightDepth); // Count current node plus deeper child path.
    }
}
```

Debug steps:

- print the node value together with `leftDepth` and `rightDepth` after each recursive return
- test an empty tree, a single-node tree, and a skewed tree
- verify the invariant that each call returns the correct depth of its own subtree

---

## DFS View

Recursive DFS works naturally because a tree is already recursive:

- depth of a tree depends on depth of its children
- each child subtree solves the same smaller problem

That makes the recurrence almost unavoidable:

`depth(node) = 1 + max(depth(node.left), depth(node.right))`

The base case `null -> 0` is what anchors the whole solution.

---

## Dry Run

Tree:

```text
    3
   / \
  9  20
    /  \
   15   7
```

Bottom-up reasoning:

- depth of `9` = `1`
- depth of `15` = `1`
- depth of `7` = `1`
- depth of `20` = `1 + max(1, 1) = 2`
- depth of `3` = `1 + max(1, 2) = 3`

Answer: `3`

---

## BFS Alternative

BFS computes the same answer level by level:

```java
class SolutionBfs {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        int depth = 0;

        while (!queue.isEmpty()) {
            int size = queue.size(); // One full queue layer equals one tree level.

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            depth++; // Finished processing one whole level.
        }

        return depth;
    }
}
```

DFS and BFS both visit every node.
The difference is how they organize the traversal.

---

## DFS vs BFS

Use DFS when:

- you want the shortest and cleanest recursive solution

Use BFS when:

- you want explicit level handling
- you are worried about recursion depth on very skewed trees

In Java, a very deep skewed tree can cause stack overflow in recursive DFS, so iterative BFS or iterative DFS is safer in those cases.

---

## Common Mistakes

1. counting edges instead of nodes and ending up off by one
2. forgetting the base case `root == null`
3. using recursion blindly on extremely deep trees
4. incrementing BFS depth for every node instead of every level

---

## Boundary Cases

- empty tree -> depth `0`
- one node -> depth `1`
- balanced tree -> depth is shared across levels
- skewed tree -> depth equals number of nodes in the chain

---

## Complexity

- Time: `O(n)`
- Space: `O(h)` for recursive DFS or `O(w)` for BFS queue

Here:

- `h` = tree height
- `w` = maximum width of any level

---

## Key Takeaways

- the recursive recurrence is `1 + max(leftDepth, rightDepth)`
- `null -> 0` is the base case that keeps the recurrence correct
- BFS solves the same problem by counting levels instead of recursive returns
