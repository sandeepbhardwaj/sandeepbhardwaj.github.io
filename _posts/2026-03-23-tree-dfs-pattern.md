---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-23
seo_title: Tree DFS Pattern in Java – Complete Guide
seo_description: Master depth-first traversal patterns on binary trees in Java with recursion templates and path-based problems.
tags:
- dsa
- java
- tree
- dfs
- recursion
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/tree-dfs-pattern/
title: Tree DFS Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/tree-dfs-banner.svg
  overlay_filter: 0.35
  caption: "Depth-First Reasoning on Hierarchical Data"
  show_overlay_excerpt: false
---

# Tree DFS Pattern in Java — A Detailed Guide

Tree DFS explores nodes depth-first and is ideal for path, subtree, and structural properties.

---

## Core DFS Traversals

- pre-order: node -> left -> right
- in-order: left -> node -> right
- post-order: left -> right -> node

---

## Template: Recursive DFS

```java
public void dfs(TreeNode node) {
    if (node == null) return;

    // pre-order work
    dfs(node.left);
    // in-order work
    dfs(node.right);
    // post-order work
}
```

---

## Problem 1: Maximum Depth of Binary Tree

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

---

## Problem 2: Validate Binary Search Tree

```java
public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
}
```

---

## Problem 3: Path Sum

```java
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return targetSum == root.val;
    return hasPathSum(root.left, targetSum - root.val)
            || hasPathSum(root.right, targetSum - root.val);
}
```

---

## Common Mistakes

1. Missing base cases
2. Using global state when return-value recursion is cleaner
3. Forgetting path rollback in path-collection problems
4. Integer overflow in boundary-based BST validation

---

## Practice Set (Recommended Order)

1. Maximum Depth of Binary Tree (LC 104)  
   [LeetCode](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
2. Same Tree (LC 100)  
   [LeetCode](https://leetcode.com/problems/same-tree/)
3. Validate Binary Search Tree (LC 98)  
   [LeetCode](https://leetcode.com/problems/validate-binary-search-tree/)
4. Path Sum (LC 112)  
   [LeetCode](https://leetcode.com/problems/path-sum/)
5. Lowest Common Ancestor of BST (LC 235)  
   [LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
6. Binary Tree Maximum Path Sum (LC 124)  
   [LeetCode](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

---

## Key Takeaways

- DFS is the default for recursive tree property computation.
- Traversal choice depends on where the logic naturally belongs.
- Strong base cases and return contracts keep recursion correct.
