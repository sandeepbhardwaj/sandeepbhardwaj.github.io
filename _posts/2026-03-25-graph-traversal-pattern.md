---
categories:
- DSA
- Java
date: 2026-03-25
seo_title: Graph Traversal Pattern in Java - Interview Preparation Guide
seo_description: Learn graph traversal in Java using BFS and DFS with adjacency lists,
  connected components, and traversal safety.
tags:
- dsa
- java
- graph
- bfs
- dfs
title: Graph Traversal Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/graph-traversal-banner.svg"
  overlay_filter: 0.35
  caption: Systematic Exploration of Networked Data
  show_overlay_excerpt: false
---

Master DFS & BFS for connectivity, reachability, and component analysis. This guide enhances intuition, invariants, and interview articulation.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| DFS | Explore components, paths | Go deep before backtracking | Provinces |
| BFS | Shortest path, level traversal | Expand layer by layer | Shortest path |

---

## 🎯 Problem Statement

Traverse a graph/grid to determine connectivity, components, or reachability.

> [!NOTE]
Understand constraints: graph size, recursion depth, cycles.

---

## 🔍 Pattern Recognition Signals

- "connected components"
- "islands"
- "path exists"
- grid/graph traversal

> [!IMPORTANT]
If you see **explore all connected nodes → DFS/BFS**

---

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

What we are doing actually:

1. Mark the current node as visited as soon as we enter it.
2. Explore every unvisited neighbor recursively.
3. Let recursion finish one branch fully before moving to the next.

```java
public void dfs(int u, List<List<Integer>> g, boolean[] vis) {
    vis[u] = true; // Mark on entry to avoid revisiting cycles.
    for (int v : g.get(u)) {
        if (!vis[v]) dfs(v, g, vis);
    }
}
```

Debug steps:

- print `u` when entering DFS
- verify `vis[u]` is set before recursing to neighbors
- test a cyclic graph to confirm nodes are not revisited

---

## BFS Template

What we are doing actually:

1. Start from the source node.
2. Mark it visited before enqueueing neighbors.
3. Process nodes in queue order so exploration happens layer by layer.

```java
public void bfs(int src, List<List<Integer>> g, boolean[] vis) {
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(src);
    vis[src] = true;

    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : g.get(u)) {
            if (!vis[v]) {
                vis[v] = true; // Mark before enqueue to avoid duplicates.
                q.offer(v);
            }
        }
    }
}
```

Debug steps:

- print queue contents after each poll
- verify nodes are marked visited before enqueue, not after dequeue
- compare DFS order and BFS order on the same small graph

---

## Problem 1: Number of Provinces

Problem description:
Count how many connected components exist in the adjacency-matrix graph.

What we are doing actually:

1. Scan every city.
2. When we find an unvisited city, it starts a new province.
3. DFS marks the entire province so it is not counted again.

```java
public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    boolean[] vis = new boolean[n];
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            count++; // Found a new connected component.
            dfsMatrix(i, isConnected, vis);
        }
    }
    return count;
}

private void dfsMatrix(int u, int[][] g, boolean[] vis) {
    vis[u] = true;
    for (int v = 0; v < g.length; v++) {
        if (g[u][v] == 1 && !vis[v]) dfsMatrix(v, g, vis); // Visit directly connected city.
    }
}
```

Debug steps:

- print which city starts each new province
- trace all cities visited from that starting city
- verify diagonal `g[u][u]` values do not inflate the count

---

## Problem 2: Number of Islands

Problem description:
Count how many disconnected land regions exist in the grid.

What we are doing actually:

1. Scan the grid cell by cell.
2. When we hit land, count one island.
3. Flood-fill the whole island to mark it visited.

```java
public int numIslands(char[][] grid) {
    int m = grid.length, n = grid[0].length, islands = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                islands++; // New island discovered.
                flood(grid, i, j);
            }
        }
    }
    return islands;
}

private void flood(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0'; // Mark visited so this land is not counted again.
    flood(g, r + 1, c);
    flood(g, r - 1, c);
    flood(g, r, c + 1);
    flood(g, r, c - 1);
}
```

Debug steps:

- print the grid coordinates where each island starts
- trace one flood-fill to confirm all connected land turns to water
- test isolated single-cell islands and one large island

---

## Dry Run (BFS Traversal)

Graph:

```text
0 -- 1 -- 2
|         |
3 --------4
```

Start BFS from `0`:

1. queue `[0]`, visit `0`
2. pop `0`, push neighbors `1,3`
3. pop `1`, push `2`
4. pop `3`, push `4` (if not visited)
5. pop `2`, `4` already queued/visited
6. pop `4`, done

Visited order depends on adjacency order, but reachability set is deterministic.

---

## Common Mistakes

1. Missing `visited` tracking in cyclic graphs
2. Stack overflow on deep recursive DFS
3. Wrong directed vs undirected edge construction
4. Mutating shared graph state unintentionally

---

## Iterative DFS for Deep Graphs

For very deep inputs, prefer explicit stack to avoid recursion depth issues:

```java
Deque<Integer> st = new ArrayDeque<>();
st.push(src);
while (!st.isEmpty()) {
    int u = st.pop();
    if (vis[u]) continue;
    vis[u] = true;
    for (int v : g.get(u)) if (!vis[v]) st.push(v);
}
```

This is safer for large production-like graph depths.

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

---

## 🐢 Brute Force Approach

### Idea  
Re-run traversal from every node without visited tracking  

### Complexity  
O(N² / exponential)

> [!WARNING]
Repeated work + infinite loops in cyclic graphs

---

## ⚡ Optimized Approach

### 💡 Key Insight  
Use visited array to ensure each node is processed once  

### 🧠 Mental Model  
Invariant: each node is visited exactly once  

### 🛠️ Steps  
1. Initialize visited  
2. Traverse all nodes  
3. Start DFS/BFS if unvisited  

### ⏱️ Complexity  
O(V + E)

> [!TIP]
Linear traversal → optimal

---

## 🎨 Visual Intuition

DFS (deep):
0 → 1 → 2  
        ↓  
        4  

BFS (level):
0 → (1,3) → (2,4)

---

## ⚠️ Common Mistakes

> [!CAUTION]
- Not marking visited early
- Infinite loops in cycles
- Stack overflow in DFS

---

## 🔁 Pattern Variations

- Multi-source BFS  
- Cycle detection  
- Topological sort  

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
- BFS + distance → shortest path  
- DFS + recursion stack → cycle detection  
- DFS + ordering → topo sort  

---

## 🧠 Key Takeaways

- Traversal is foundation of graphs  
- Always track visited  
- DFS vs BFS depends on requirement  

---

## 📌 Practice Problems

> [!TIP]
Repeat for mastery

1. Find if Path Exists in Graph (LC 1971)  
   https://leetcode.com/problems/find-if-path-exists-in-graph/
2. Number of Provinces (LC 547)  
   https://leetcode.com/problems/number-of-provinces/
3. Number of Islands (LC 200)  
   https://leetcode.com/problems/number-of-islands/
4. Clone Graph (LC 133)  
   https://leetcode.com/problems/clone-graph/
5. Course Schedule (LC 207)  
   https://leetcode.com/problems/course-schedule/
