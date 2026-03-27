---
categories:
- DSA
- Java
date: 2026-03-24
seo_title: Tree BFS Pattern in Java - Interview Preparation Guide
seo_description: Learn tree BFS in Java using queue-based level traversal, shortest
  depth, and level-order transformations.
tags:
- dsa
- java
- tree
- bfs
- queue
title: Tree BFS Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/tree-bfs-banner.svg"
  overlay_filter: 0.35
  caption: Level-Order Exploration with Queues
  show_overlay_excerpt: false
---
Master level-order traversal using BFS for shortest-depth reasoning, level grouping, and interview clarity.
When a tree question is really about layers rather than subtrees, BFS usually gives the cleanest explanation and the most natural code.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| BFS (Tree) | Level traversal, shortest depth | Process nodes layer by layer with a queue | Level Order |
| BFS with Early Exit | First valid level answer | The first leaf or first match is optimal | Minimum Depth |
| BFS with Level State | Per-level aggregation | Snapshot queue size to isolate one layer | Right Side View |

---

## 🎯 Problem Statement

Traverse a tree level by level to compute level-based output, shortest-level answers, or visibility from one side.

Constraints to clarify:

- can the root be `null`?
- do we need full level output or only one value per level?
- can we return early once the first valid level is reached?
- is the answer about structural depth or path content?

> [!NOTE]
> In BFS tree problems, the queue is not just storage. It represents the frontier of the current level.

---

## 🔍 Pattern Recognition Signals

- "level order"
- "minimum depth"
- "right side view"
- "group nodes by level"
- "average of each level"
- "first leaf" or "nearest level"

Observations:

- all nodes at one depth should be processed together
- the answer depends on level boundaries
- the first valid level is automatically optimal

> [!IMPORTANT]
> If you see "level-wise processing" or "shortest level answer" -> think Tree BFS.

---

## 🧪 Example

Input tree:

```text
    1
   / \
  2   3
 /     \
4       5
```

Output for level order:

```text
[[1], [2,3], [4,5]]
```

Step-by-step:

1. Start with queue `[1]`.
2. The queue size is `1`, so the first level contains only node `1`.
3. Process `1`, enqueue `2` and `3`.
4. The queue is now `[2,3]`, so the second level has exactly two nodes.
5. Process `2` and `3`, enqueue their children `4` and `5`.
6. The queue becomes `[4,5]`, which is the third level.

The key invariant is that before processing a level, the queue contains exactly the nodes from that level.

---

## 🐢 Brute Force Approach

### Idea

Use DFS and manually keep track of levels in lists or maps.

This can work, but it makes the reasoning heavier for problems that are naturally level-based.

### Complexity

Usually still `O(n)` in time, but with more bookkeeping and less direct reasoning than BFS.

> [!WARNING]
> For problems like minimum depth, DFS often works but fights the structure of the question. BFS gives the shortest-level answer directly.

---

## ⚡ Optimized Approach

### 💡 Key Insight

A queue already gives us level order if we process nodes in FIFO order and snapshot the queue size before each level.

### 🧠 Mental Model

Invariant:

- at the start of each outer loop iteration, the queue contains exactly one level

### 🛠️ Steps

1. Push the root into the queue.
2. Capture `size = q.size()` before processing the level.
3. Process exactly `size` nodes.
4. Enqueue children for the next level.
5. Repeat until the queue is empty.

### 💻 Code (Java)

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
            level.add(node.val); // Current node belongs to this level.
            if (node.left != null) q.offer(node.left); // Children belong to next level.
            if (node.right != null) q.offer(node.right);
        }
        ans.add(level); // One complete level finished.
    }
    return ans;
}
```

### ⏱️ Complexity

- time: `O(n)`
- space: `O(w)`, where `w` is the maximum width of the tree

> [!TIP]
> In interviews, explicitly say that `size` creates the level boundary. That is usually the conceptual step the interviewer wants to hear.

---

## Core Idea

Use a queue and process nodes by level size.

What we are doing actually:

1. Put the root in a queue.
2. Snapshot the current queue size before each level.
3. Process exactly that many nodes to keep levels separated.
4. Enqueue children for the next round.

Debug steps:

- print queue contents before each level starts
- verify `size` is captured before the inner loop
- test a single-node tree and an uneven tree

---

## Problem 1: Binary Tree Level Order Traversal

Problem description:
Return the nodes level by level from top to bottom.

What we are doing actually:

1. Use the BFS template directly.
2. Treat each queue-size snapshot as one level boundary.
3. Collect each level into its own list before moving on.

This is the reference problem for the pattern.

---

## Problem 2: Minimum Depth of Binary Tree

Problem description:
Return the number of nodes in the shortest root-to-leaf path.

What we are doing actually:

1. BFS explores shallower levels before deeper ones.
2. The first leaf we encounter must be at minimum depth.
3. Return immediately when that leaf appears.

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
            if (node.left == null && node.right == null) return depth; // First leaf gives minimum depth.
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        depth++;
    }
    return depth;
}
```

Debug steps:

- print queue nodes along with current `depth`
- verify you return on the first leaf, not after scanning the whole tree
- test a tree where the shallowest leaf is not on the leftmost branch

---

## Problem 3: Right Side View

Problem description:
Return the value visible from the right side at each tree level.

What we are doing actually:

1. Traverse level by level with BFS.
2. Process all nodes in the current level.
3. Record the last node processed in that level.

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
            if (i == size - 1) ans.add(node.val); // Last node in this level is rightmost in this traversal order.
        }
    }
    return ans;
}
```

Debug steps:

- print each level and mark which node gets added to `ans`
- verify `i == size - 1` is checked inside the inner loop
- test a left-skewed tree and a mixed tree

---

## 🎨 Visual Intuition

```text
        1
      /   \
     2     3
    /       \
   4         5

Levels:
[1]
[2,3]
[4,5]
```

Queue flow:

1. `[1]`
2. `[2,3]`
3. `[4,5]`

The queue grows with the next level while we consume the current one.

---

## ⚠️ Common Mistakes

> [!CAUTION]
> Most BFS bugs come from losing track of level boundaries.

- not capturing queue size before the inner loop
- mixing current-level nodes with next-level nodes
- forgetting the `null` root edge case
- solving minimum depth with a full traversal when BFS could return early
- assuming the first child processed is the right view instead of the last node in the level

---

## BFS vs DFS Heuristic

Use BFS when the problem asks for:

- minimum or first level satisfying a condition
- per-level grouping or aggregation
- nearest node in an unweighted tree

Use DFS when the question is naturally about:

- subtree properties
- recursive structural constraints
- path state passed downward

---

## 🔁 Pattern Variations

- zigzag level order
- left view / right view
- average, max, or sum per level
- multi-source BFS once we move from trees to graphs

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
> BFS becomes more powerful when we attach extra state to each layer or node.

- BFS + early exit -> shortest-level answers
- BFS + indexing -> vertical order and width-style problems
- BFS + state packaging -> richer traversal transforms

Examples:

- `Binary Tree Zigzag Level Order Traversal` adds level-direction logic
- graph shortest path uses the same queue frontier idea
- top view / vertical order variants often combine BFS with column indices

---

## 🧠 Key Takeaways

- Tree BFS is the default for level-based questions
- queue size defines the current level boundary
- early exit is the reason BFS is so strong for minimum-depth style problems
- if the question sounds like layers, BFS is usually the cleaner explanation than DFS

---

## 📌 Practice Problems

> [!TIP]
> Practice these until "queue + level size" becomes automatic.

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
