---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-27
seo_title: Union-Find (Disjoint Set) Pattern in Java – Complete Guide
seo_description: Learn Union-Find in Java with path compression and union by rank for connectivity and dynamic component problems.
tags:
- dsa
- java
- union-find
- disjoint-set
- graph
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/union-find-pattern/
title: Union-Find (Disjoint Set) Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/union-find-banner.svg
  overlay_filter: 0.35
  caption: "Dynamic Connectivity with Near-Constant Operations"
  show_overlay_excerpt: false
---

# Union-Find (Disjoint Set) Pattern in Java — A Detailed Guide

Union-Find solves dynamic connectivity problems efficiently.
It supports two core operations:

- `find(x)` -> representative of component
- `union(a, b)` -> merge components

---

## DSU Template

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
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;

        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[rb] < rank[ra]) parent[rb] = ra;
        else {
            parent[rb] = ra;
            rank[ra]++;
        }
        return true;
    }
}
```

---

## Problem 1: Number of Connected Components

```java
public int countComponents(int n, int[][] edges) {
    DSU dsu = new DSU(n);
    int comps = n;
    for (int[] e : edges) {
        if (dsu.union(e[0], e[1])) comps--;
    }
    return comps;
}
```

---

## Problem 2: Redundant Connection

```java
public int[] findRedundantConnection(int[][] edges) {
    DSU dsu = new DSU(edges.length + 1);
    for (int[] e : edges) {
        if (!dsu.union(e[0], e[1])) return e;
    }
    return new int[0];
}
```

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
