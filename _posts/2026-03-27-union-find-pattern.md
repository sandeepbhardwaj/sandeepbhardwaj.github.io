---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-27
seo_title: Union-Find (Disjoint Set) Pattern in Java – Complete Guide
seo_description: Learn Union-Find in Java with path compression and union by rank
  for connectivity and dynamic component problems.
tags:
- dsa
- java
- union-find
- disjoint-set
- graph
title: Union-Find (Disjoint Set) Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/union-find-banner.svg"
  overlay_filter: 0.35
  caption: Dynamic Connectivity with Near-Constant Operations
  show_overlay_excerpt: false
---
Union-Find solves dynamic connectivity problems efficiently.
It supports two core operations:

- `find(x)` -> representative of component
- `union(a, b)` -> merge components

---

## DSU Template

What we are doing actually:

1. Start with every node as its own parent.
2. `find` compresses paths so future lookups are faster.
3. `union` merges two roots and keeps the tree shallow with rank.

```java
class DSU {
    int[] parent;
    int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // Path compression.
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        if (rank[ra] < rank[rb]) parent[ra] = rb; // Attach shallower tree under deeper tree.
        else if (rank[rb] < rank[ra]) parent[rb] = ra;
        else {
            parent[rb] = ra;
            rank[ra]++;
        }
        return true;
    }
}
```

Debug steps:

- print `parent` and `rank` after each union
- verify `find` flattens paths after repeated lookups
- test union on already-connected nodes

---

## Problem 1: Number of Connected Components

Problem description:
Count how many connected components remain after processing all undirected edges.

What we are doing actually:

1. Start with `n` separate components.
2. For each edge, try to union its endpoints.
3. Decrement the component count only when the union actually merges two roots.

```java
public int countComponents(int n, int[][] edges) {
    DSU dsu = new DSU(n);
    int comps = n;
    for (int[] e : edges) {
        if (dsu.union(e[0], e[1])) comps--; // Successful merge reduces component count.
    }
    return comps;
}
```

Debug steps:

- print the roots before and after each edge union
- verify repeated edges do not decrement `comps`
- test no edges, one component, and multiple components

---

## Problem 2: Redundant Connection

Problem description:
Find the extra edge that creates a cycle in an otherwise tree-like graph.

What we are doing actually:

1. Process edges in order.
2. If both endpoints already share the same root, this edge is redundant.
3. Otherwise union them and continue.

```java
public int[] findRedundantConnection(int[][] edges) {
    DSU dsu = new DSU(edges.length + 1);
    for (int[] e : edges) {
        if (!dsu.union(e[0], e[1])) return e; // This edge connects nodes already in same component.
    }
    return new int[0];
}
```

Debug steps:

- print roots of both endpoints before each union
- verify the first failed union is the returned answer
- watch indexing carefully because this problem is 1-based

---

## Dry Run (Connected Components)

`n = 5`, edges: `[0-1], [1-2], [3-4]`

Initial components: `5`

1. union(0,1) succeeds -> components `4`
2. union(1,2) succeeds -> components `3`
3. union(3,4) succeeds -> components `2`

Final answer: `2` connected components.

Union only decreases component count when roots were different.

---

## Problem 3: Accounts Merge

Use DSU to connect emails belonging to same user account, then group by root.

---

## Common Mistakes

1. Missing path compression
2. Forgetting union by rank/size
3. 1-based vs 0-based indexing errors
4. Assuming DSU handles directed semantics directly

---

## Debug Checklist

When DSU output is wrong:

1. print root of each node after all unions
2. verify index normalization (especially 1-based inputs)
3. confirm `union` returns false when already connected
4. ensure component count decrements only on successful union

Most DSU bugs are indexing or incorrect decrement logic.

---

## Practice Set (Recommended Order)

1. Redundant Connection (LC 684)  
   [LeetCode](https://leetcode.com/problems/redundant-connection/)
2. Number of Connected Components in an Undirected Graph (LC 323)  
   [LeetCode](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
3. Accounts Merge (LC 721)  
   [LeetCode](https://leetcode.com/problems/accounts-merge/)
4. Most Stones Removed with Same Row or Column (LC 947)  
   [LeetCode](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)
5. Satisfiability of Equality Equations (LC 990)  
   [LeetCode](https://leetcode.com/problems/satisfiability-of-equality-equations/)

---

## Key Takeaways

- DSU is the standard for dynamic connectivity.
- Path compression + rank/size is mandatory for performance.
- It simplifies many graph problems that don't need full traversal logic.
