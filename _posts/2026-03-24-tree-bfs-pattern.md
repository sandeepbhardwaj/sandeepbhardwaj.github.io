---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-24
seo_title: Tree BFS Pattern in Java – Complete Guide
seo_description: Learn tree BFS in Java using queue-based level traversal, shortest depth, and level-order transformations.
tags:
- dsa
- java
- tree
- bfs
- queue
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/tree-bfs-pattern/
title: Tree BFS Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/tree-bfs-banner.svg
  overlay_filter: 0.35
  caption: "Level-Order Exploration with Queues"
  show_overlay_excerpt: false
---

# Tree BFS Pattern in Java — A Detailed Guide

BFS traverses trees level by level.
It is ideal for shortest-level decisions and level-grouped output.

---

## Core Idea

Use queue and process nodes by level size.

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> ans = new ArrayList<>();
    if (root == null) return ans;

    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);

    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();

        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        ans.add(level);
    }
    return ans;
}
```

---

## Problem 1: Binary Tree Level Order Traversal

Same as template above.

---

## Problem 2: Minimum Depth of Binary Tree

```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;

    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    int depth = 1;

    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (node.left == null && node.right == null) return depth;
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        depth++;
    }
    return depth;
}
```

---

## Problem 3: Right Side View

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> ans = new ArrayList<>();
    if (root == null) return ans;

    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);

    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
            if (i == size - 1) ans.add(node.val);
        }
    }
    return ans;
}
```

---

## Common Mistakes

1. Not snapshotting level size before loop
2. Mixing current-level and next-level processing
3. Using DFS where BFS gives direct shortest-level answer
4. Forgetting null root edge case

---

## Practice Set (Recommended Order)

1. Binary Tree Level Order Traversal (LC 102)  
   [LeetCode](https://leetcode.com/problems/binary-tree-level-order-traversal/)
2. Average of Levels in Binary Tree (LC 637)  
   [LeetCode](https://leetcode.com/problems/average-of-levels-in-binary-tree/)
3. Minimum Depth of Binary Tree (LC 111)  
   [LeetCode](https://leetcode.com/problems/minimum-depth-of-binary-tree/)
4. Binary Tree Right Side View (LC 199)  
   [LeetCode](https://leetcode.com/problems/binary-tree-right-side-view/)
5. Binary Tree Zigzag Level Order Traversal (LC 103)  
   [LeetCode](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

---

## Key Takeaways

- BFS is the cleanest way to reason about tree levels.
- Queue + level-size loop is the canonical template.
- Prefer BFS for first/shortest level conditions.
