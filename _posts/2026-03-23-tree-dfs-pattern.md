---
categories:
- DSA
- Java
date: 2026-03-23
seo_title: Tree DFS Pattern in Java - Interview Preparation Guide
seo_description: Master depth-first traversal patterns on binary trees in Java with
  recursion templates and path-based problems.
tags:
- dsa
- java
- tree
- dfs
- recursion
title: Tree DFS Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/tree-dfs-banner.svg"
  overlay_filter: 0.35
  caption: Depth-First Reasoning on Hierarchical Data
  show_overlay_excerpt: false
---
Master depth-first traversal for recursive reasoning, subtree properties, and path-based problems.
In interviews, Tree DFS is less about memorizing pre-order or post-order and more about clearly defining what each recursive call means.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| DFS (Tree) | Path, subtree, structure problems | Solve the node using child answers | Maximum Depth |
| DFS with Bounds | Validate global tree properties | Carry constraints through recursion | Validate BST |
| DFS with Path State | Root-to-leaf or path questions | Push state downward and evaluate at leaves | Path Sum |

---

## 🎯 Problem Statement

Traverse a tree using depth-first recursion to compute a property such as depth, validity, path feasibility, or a value derived from subtrees.

Constraints to clarify before coding:

- can the tree be empty?
- does the answer depend on a path, a subtree, or both?
- are we returning a value upward or mutating shared state?
- can integer bounds overflow when we carry limits?

> [!NOTE]
> The most important Tree DFS question is: "What exactly does my function return for a subtree rooted at this node?"

---

## 🔍 Pattern Recognition Signals

- "path sum"
- "maximum depth"
- "minimum depth" when recursion is still acceptable
- "validate tree property"
- "compute something for every subtree"
- "combine left and right answers"

Observations:

- the input already has recursive structure
- the answer for a node depends on its children
- a parent decision can be expressed using smaller subtree answers

> [!IMPORTANT]
> If you see "subtree dependency" or "root-to-leaf reasoning" -> think Tree DFS.

---

## 🧪 Example

Use `Path Sum` as the mental model.

Input tree:

```text
    5
   / \
  4   8
     / \
    13  4
```

Target:

```text
17
```

Output:

```text
true
```

Step-by-step:

1. At node `5`, the remaining target becomes `12`.
2. Explore left child `4`, so the remaining target becomes `8`.
3. This `4` is a leaf, but `8 != 4`, so that branch fails.
4. Backtrack and explore right child `8`, so the remaining target becomes `4`.
5. The `13` branch fails.
6. The rightmost `4` is a leaf and matches the remaining target, so the answer is `true`.

This is classic DFS thinking: each recursive call is responsible for solving the same question on a smaller subtree.

---

## 🐢 Brute Force Approach

### Idea

For each question, explicitly enumerate whole root-to-leaf paths or recompute subtree values multiple times.

Examples:

- for path problems, build every path and inspect them afterward
- for subtree metrics, recompute the same subtree answers again and again
- for validation, compare nodes locally instead of carrying the full recursive constraint

### Complexity

Depends on the problem, but brute force often becomes:

- repeated subtree work -> worse than `O(n)`
- full path materialization -> extra time and memory

> [!WARNING]
> Tree problems often look small enough to brute force, but repeated subtree recomputation is the common hidden inefficiency.

---

## ⚡ Optimized Approach

### 💡 Key Insight

Let each recursive call solve the problem for its own subtree exactly once.

### 🧠 Mental Model

A Tree DFS function should have a precise contract.

Examples:

- `maxDepth(node)` returns the maximum depth of the subtree rooted at `node`
- `validate(node, lo, hi)` returns whether the subtree rooted at `node` is a valid BST inside that range
- `hasPathSum(node, remain)` returns whether some root-to-leaf path in this subtree matches `remain`

Invariant:

- each call receives all the context needed to solve the subtree rooted at the current node

### 🛠️ Steps

1. Define the base case.
2. Define the return value or recursive contract.
3. Recurse into left and right children.
4. Combine results in the place that matches the traversal logic.

### 💻 Code (Java)

```java
public void dfs(TreeNode node) {
    if (node == null) return;

    // pre-order work happens before children
    dfs(node.left);
    // in-order work happens between left and right
    dfs(node.right);
    // post-order work happens after children
}
```

### ⏱️ Complexity

For standard Tree DFS where each node is processed once:

- time: `O(n)`
- space: `O(h)` recursion stack, where `h` is tree height

> [!TIP]
> A strong interview answer says not just "DFS", but also "this function returns X for the subtree rooted at the current node."

---

## Core DFS Traversals

- pre-order: node -> left -> right
- in-order: left -> node -> right
- post-order: left -> right -> node

Use pre-order when you want to pass state downward, post-order when you need child answers first, and in-order when the ordering itself matters, like BST traversal.

---

## Problem 1: Maximum Depth of Binary Tree

Problem description:
Return the maximum number of nodes on any root-to-leaf path.

What we are doing actually:

1. Ask each subtree for its own maximum depth.
2. Take the larger of the two answers.
3. Add `1` for the current node.

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); // Current node + deeper subtree.
}
```

Debug steps:

- print node value and returned depth during unwinding
- verify the base case returns `0`, not `1`
- test a skewed tree and a balanced tree

---

## Problem 2: Validate Binary Search Tree

Problem description:
Check whether every node respects BST ordering rules across the whole subtree, not just its direct children.

What we are doing actually:

1. Carry an allowed `(lo, hi)` range down the recursion.
2. Reject immediately if the current value violates the range.
3. Narrow the range when moving left or right.

```java
public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false; // Violates BST contract.
    return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
}
```

Debug steps:

- print `node.val`, `lo`, and `hi` at each recursive call
- test a tree where a deep node breaks BST rules
- use `long` bounds to avoid edge issues around `Integer.MIN_VALUE` and `Integer.MAX_VALUE`

---

## Problem 3: Path Sum

Problem description:
Return whether some root-to-leaf path adds up to the target sum.

What we are doing actually:

1. Subtract the current node value from the remaining target.
2. If we reach a leaf, compare the remaining target with that leaf value.
3. Return true if either subtree finds a valid path.

```java
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return targetSum == root.val; // Leaf decides final match.
    return hasPathSum(root.left, targetSum - root.val)
            || hasPathSum(root.right, targetSum - root.val); // Remaining target passed down.
}
```

Debug steps:

- print current node and remaining target before recursive calls
- verify only root-to-leaf paths count, not partial paths
- test one case where the left branch fails but the right branch succeeds

---

## 🎨 Visual Intuition

Tree:

```text
        5
      /   \
     4     8
          / \
         13  4
```

DFS reasoning:

- go deep into one branch
- let recursion return an answer for that subtree
- combine or compare that answer at the parent

Traversal positions:

```text
pre-order  -> decide before children
in-order   -> decide between children
post-order -> decide after children
```

For `Path Sum`, the state moves downward.
For `Maximum Depth`, the answer comes back upward.

---

## ⚠️ Common Mistakes

> [!CAUTION]
> Tree DFS usually fails because the recursion contract is fuzzy.

- weak or incorrect base cases
- mixing global state with return-value recursion when a return value is cleaner
- forgetting whether the problem is root-to-leaf or any-path
- validating BST using only parent-child comparisons instead of full bounds
- overflow when using `int` bounds for BST validation

---

## Recursion Contract Tip

Before coding, write one sentence:

- "returns whether subtree satisfies X"
- "returns max depth of subtree"
- "returns the gain contributed upward"

That one sentence usually determines the entire solution shape.

---

## 🔁 Pattern Variations

- DFS returning a scalar answer: depth, height, count
- DFS returning boolean validity: BST checks, path existence
- DFS with downward state propagation: remaining sum, bounds, current path
- DFS with post-order aggregation: subtree sums, diameter, max path style problems

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
> Tree DFS often combines with another idea that clarifies what flows down and what flows up.

- DFS + backtracking -> path collection problems
- DFS + global max -> diameter / maximum path style problems
- DFS + bounds -> BST validation
- DFS + dynamic programming on trees -> compute and combine subtree states

Examples:

- `Path Sum II` uses DFS plus path rollback
- `Binary Tree Maximum Path Sum` uses DFS plus upward gain and global answer
- `Lowest Common Ancestor` uses DFS plus subtree presence logic

---

## 🧠 Key Takeaways

- Tree DFS is the default when the answer depends on recursive structure
- the recursion contract matters more than traversal buzzwords
- pre-order, in-order, and post-order are just different placements for the same recursive skeleton
- if you can clearly explain what the function returns for a subtree, you usually already have the solution

---

## 📌 Practice Problems

> [!TIP]
> Practice these until you can state the recursive contract before writing code.

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
