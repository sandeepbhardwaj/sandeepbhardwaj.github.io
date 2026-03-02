---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-25
seo_title: Graph Traversal Pattern in Java – Complete Guide
seo_description: Learn graph traversal in Java using BFS and DFS with adjacency lists, connected components, and traversal safety.
tags:
- dsa
- java
- graph
- bfs
- dfs
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/graph-traversal-pattern/
title: Graph Traversal Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/graph-traversal-banner.svg
  overlay_filter: 0.35
  caption: "Systematic Exploration of Networked Data"
---

# Graph Traversal Pattern in Java — A Detailed Guide

Graph traversal is foundational for connectivity, reachability, and component analysis.
The two primary techniques are DFS and BFS.

---

## Graph Representation

```java
List<List<Integer>> g = new ArrayList<>();
for (int i = 0; i < n; i++) g.add(new ArrayList<>());
for (int[] e : edges) {
    g.get(e[0]).add(e[1]);
    g.get(e[1]).add(e[0]); // undirected
}
```

---

## DFS Template

```java
public void dfs(int u, List<List<Integer>> g, boolean[] vis) {
    vis[u] = true;
    for (int v : g.get(u)) {
        if (!vis[v]) dfs(v, g, vis);
    }
}
```

---

## BFS Template

```java
public void bfs(int src, List<List<Integer>> g, boolean[] vis) {
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(src);
    vis[src] = true;

    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : g.get(u)) {
            if (!vis[v]) {
                vis[v] = true;
                q.offer(v);
            }
        }
    }
}
```

---

## Problem 1: Number of Provinces

```java
public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    boolean[] vis = new boolean[n];
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            count++;
            dfsMatrix(i, isConnected, vis);
        }
    }
    return count;
}

private void dfsMatrix(int u, int[][] g, boolean[] vis) {
    vis[u] = true;
    for (int v = 0; v < g.length; v++) {
        if (g[u][v] == 1 && !vis[v]) dfsMatrix(v, g, vis);
    }
}
```

---

## Problem 2: Number of Islands

```java
public int numIslands(char[][] grid) {
    int m = grid.length, n = grid[0].length, islands = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                islands++;
                flood(grid, i, j);
            }
        }
    }
    return islands;
}

private void flood(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';
    flood(g, r + 1, c);
    flood(g, r - 1, c);
    flood(g, r, c + 1);
    flood(g, r, c - 1);
}
```

---

## Common Mistakes

1. Missing `visited` tracking in cyclic graphs
2. Stack overflow on deep recursive DFS
3. Wrong directed vs undirected edge construction
4. Mutating shared graph state unintentionally

---

## Practice Set (Recommended Order)

1. Find if Path Exists in Graph (LC 1971)  
   [LeetCode](https://leetcode.com/problems/find-if-path-exists-in-graph/)
2. Number of Provinces (LC 547)  
   [LeetCode](https://leetcode.com/problems/number-of-provinces/)
3. Number of Islands (LC 200)  
   [LeetCode](https://leetcode.com/problems/number-of-islands/)
4. Clone Graph (LC 133)  
   [LeetCode](https://leetcode.com/problems/clone-graph/)
5. Course Schedule (LC 207)  
   [LeetCode](https://leetcode.com/problems/course-schedule/)

---

## Key Takeaways

- DFS and BFS are the base for almost all graph algorithms.
- Correct representation and visited logic are critical.
- Traversal is often step one before shortest path, topological sort, or MST.
