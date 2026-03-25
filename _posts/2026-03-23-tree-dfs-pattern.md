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

Master depth-first traversal for recursive reasoning, subtree properties, and path-based problems. Focus on contracts, invariants, and interview clarity.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| DFS (Tree) | Path, subtree, structure | Solve recursively via children | Path Sum |
| BFS (Tree) | Level / shortest depth | Layer-by-layer traversal | Min Depth |

---

## 🎯 Problem Statement

Traverse a tree using depth-first recursion to compute properties like depth, validity, or path constraints.

> [!NOTE]
Always define recursion contract before coding.

---

## 🔍 Pattern Recognition Signals

- "path sum"
- "max/min depth"
- "validate tree property"
- "subtree computation"

> [!IMPORTANT]
If you see **recursive structure or subtree dependency → think DFS**

---

Tree DFS explores nodes depth-first and is ideal for path, subtree, and structural properties.

---

## Core DFS Traversals

- pre-order: node -> left -> right
- in-order: left -> node -> right
- post-order: left -> right -> node

---

## Template: Recursive DFS

What we are doing actually:

1. Stop on `null`.
2. Decide where the logic belongs: pre-order, in-order, or post-order.
3. Recurse into left and right subtrees with a clear contract.

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

Debug steps:

- print node values as you enter and leave recursion
- trace one tiny tree to see exactly when each traversal position runs
- test `root = null` first

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

## Dry Run (Path Sum)

Tree:

```text
    5
   / \
  4   8
     / \
    13  4
```

Target = `17`

DFS flow:

- at `5`, remaining target becomes `12`
- explore left `4`, remaining becomes `8` (leaf and not equal) -> false
- explore right `8`, remaining becomes `4`
  - `13` branch fails
  - `4` leaf matches remaining `4` -> true

Any true branch short-circuits overall result to true.

---

## Common Mistakes

1. Missing base cases
2. Using global state when return-value recursion is cleaner
3. Forgetting path rollback in path-collection problems
4. Integer overflow in boundary-based BST validation

---

## Recursion Contract Tip

Define function contract in one line before coding:

- “returns whether subtree satisfies X”
- “returns max depth of subtree”
- “returns gain contributed upward”

Clear contracts prevent mixing traversal logic with mutable global flags.

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

---

## 🐢 Brute Force Approach

### Idea  
Simulate all root-to-leaf paths explicitly  

### Complexity  
Exponential in worst case  

> [!WARNING]
Redundant computation across overlapping subtrees

---

## ⚡ Optimized Approach

### 💡 Key Insight  
Each subtree solves the same problem → reuse recursion  

### 🧠 Mental Model  
Invariant:
- Function returns correct result for subtree rooted at node  

### 🛠️ Steps  
1. Define base case  
2. Define return value  
3. Combine left/right results  

### ⏱️ Complexity  
O(N)

> [!TIP]
Each node processed once → optimal

---

## 🎨 Visual Intuition

DFS traversal:

        5
      /   \
     4     8
          / \
         13  4

Flow:
- Go deep (left)
- Backtrack
- Explore right

---

## ⚠️ Common Mistakes

> [!CAUTION]
- Weak base cases  
- Mixing global state with return recursion  
- Not defining clear contract  
- Overflow in BST bounds  

---

## 🔁 Pattern Variations

- Backtracking (path collection)  
- Divide & Conquer (tree DP)  
- DFS with state propagation  

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
- DFS + backtracking → path problems  
- DFS + global max → tree DP  
- DFS + bounds → BST validation  

---

## 🧠 Key Takeaways

- DFS = recursion + contract  
- Always define return meaning  
- Structure mirrors tree  

---

## 📌 Practice Problems

> [!TIP]
Repeat until recursion becomes natural

1. Maximum Depth of Binary Tree (LC 104)  
   https://leetcode.com/problems/maximum-depth-of-binary-tree/
2. Same Tree (LC 100)  
   https://leetcode.com/problems/same-tree/
3. Validate Binary Search Tree (LC 98)  
   https://leetcode.com/problems/validate-binary-search-tree/
4. Path Sum (LC 112)  
   https://leetcode.com/problems/path-sum/
5. Lowest Common Ancestor of BST (LC 235)  
   https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
6. Binary Tree Maximum Path Sum (LC 124)  
   https://leetcode.com/problems/binary-tree-maximum-path-sum/
