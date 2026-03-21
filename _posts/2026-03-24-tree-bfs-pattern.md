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
BFS traverses trees level by level.
It is ideal for shortest-level decisions and level-grouped output.

---

## Core Idea

Use queue and process nodes by level size.

What we are doing actually:

1. Put the root in a queue.
2. Snapshot the current queue size before each level.
3. Process exactly that many nodes to keep levels separated.
4. Enqueue children for the next round.

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

Debug steps:

- print queue contents before each level starts
- verify `size` is captured before the inner loop
- test a single-node tree and an uneven tree

---

## Problem 1: Binary Tree Level Order Traversal

Problem description:
Return the nodes level by level from top to bottom.

What we are doing actually:

1. Use the template above directly.
2. Treat each queue-size snapshot as one level boundary.
3. Collect each level into its own list before moving on.

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

## Dry Run (Level Order)

Tree:

```text
    1
   / \
  2   3
 /     \
4       5
```

Queue/levels:

1. start `[1]` -> level `[1]`, enqueue `2,3`
2. queue `[2,3]` -> level `[2,3]`, enqueue `4,5`
3. queue `[4,5]` -> level `[4,5]`

Result: `[[1],[2,3],[4,5]]`

The level-size snapshot is what cleanly separates each layer.

---

## Common Mistakes

1. Not snapshotting level size before loop
2. Mixing current-level and next-level processing
3. Using DFS where BFS gives direct shortest-level answer
4. Forgetting null root edge case

---

## BFS vs DFS Heuristic

Use BFS when question asks:

- minimum/first level satisfying a condition
- per-level grouping/output
- nearest node in unweighted tree levels

Use DFS when question is naturally subtree/path-recursive.

Choosing correct traversal first usually simplifies implementation drastically.

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
