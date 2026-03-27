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
Master DFS and BFS for connectivity, reachability, and component analysis.
Graph traversal is the foundation behind many interview topics, so the real skill is recognizing when the problem is "just traversal" and when traversal is only the first layer.

---

## 🚀 Pattern Summary Table

| Pattern | When to Use | Key Idea | Example |
|--------|------------|----------|--------|
| DFS | Explore components, detect structure, go deep first | Recursively or iteratively visit all reachable neighbors | Number of Provinces |
| BFS | Shortest path in unweighted graphs, layer expansion | Expand frontier level by level | Shortest Path / Path Exists |
| Flood Fill | Traverse a grid as an implicit graph | Mark connected cells once | Number of Islands |

---

## 🎯 Problem Statement

Traverse a graph or grid to determine connectivity, reachability, connected components, or shortest-layer answers.

Constraints to clarify:

- is the graph directed or undirected?
- is it represented explicitly with edges or implicitly as a grid?
- can cycles exist?
- do we need traversal order, distance, or only reachability?

> [!NOTE]
> Before coding, identify the graph model first. Many interview mistakes happen before traversal even starts.

---

## 🔍 Pattern Recognition Signals

- "connected components"
- "path exists"
- "number of islands"
- "explore all reachable nodes"
- "graph" or "grid"
- "shortest path in an unweighted graph"

Observations:

- nodes can be revisited through cycles unless we prevent it
- graph problems often reduce to "start somewhere and visit everything reachable"
- grids are usually just graphs with directional moves

> [!IMPORTANT]
> If you see "explore all connected or reachable nodes" -> think DFS or BFS.

---

## 🧪 Example

Graph:

```text
0 -- 1 -- 2
|         |
3 --------4
```

Adjacency list:

```text
0: [1,3]
1: [0,2]
2: [1,4]
3: [0,4]
4: [2,3]
```

If we start BFS from `0`:

1. queue `[0]`, visited = `{0}`
2. pop `0`, push `1` and `3`
3. queue becomes `[1,3]`
4. pop `1`, push `2`
5. pop `3`, push `4`
6. queue becomes `[2,4]`
7. continue until all reachable nodes are processed

The important idea is that visited tracking is part of correctness, not just optimization.

---

## 🐢 Brute Force Approach

### Idea

Try to answer reachability or component questions by repeatedly starting fresh traversals without a shared visited structure.

Examples:

- re-run search from every node
- revisit nodes through cycles again and again
- on grids, scan neighbors recursively without marking visited

### Complexity

This often degrades to repeated work such as `O(V * (V + E))`, and in cyclic graphs it can even loop forever if visited tracking is missing.

> [!WARNING]
> In graph problems, forgetting `visited` is not a small bug. It usually breaks both correctness and complexity.

---

## ⚡ Optimized Approach

### 💡 Key Insight

Use a graph representation plus a visited structure so each node is processed once per traversal.

### 🧠 Mental Model

Traversal invariant:

- every visited node has already been accounted for
- every unvisited neighbor represents new work

DFS answers:

- "go as deep as possible before backtracking"

BFS answers:

- "expand the frontier level by level"

### 🛠️ Steps

1. Build the graph representation.
2. Allocate `visited`.
3. Start DFS or BFS from each unvisited node when counting components.
4. Mark nodes early enough to avoid duplicate work.

### 💻 Code (Java)

Adjacency-list setup:

```java
List<List<Integer>> g = new ArrayList<>();
for (int i = 0; i < n; i++) g.add(new ArrayList<>());
for (int[] e : edges) {
    g.get(e[0]).add(e[1]);
    g.get(e[1]).add(e[0]); // undirected
}
```

DFS template:

```java
public void dfs(int u, List<List<Integer>> g, boolean[] vis) {
    vis[u] = true; // Mark on entry to avoid revisiting cycles.
    for (int v : g.get(u)) {
        if (!vis[v]) dfs(v, g, vis);
    }
}
```

BFS template:

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

### ⏱️ Complexity

With proper adjacency representation and visited tracking:

- time: `O(V + E)`
- space: `O(V + E)` for the graph plus traversal structures

> [!TIP]
> When an interviewer asks "DFS or BFS?", the real answer is usually based on what the question optimizes for: depth exploration, component coverage, or shortest unweighted distance.

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

Representation questions to settle early:

- adjacency list vs matrix
- directed vs undirected edges
- explicit graph vs implicit grid neighbors

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

## 🎨 Visual Intuition

Graph:

```text
0 -- 1 -- 2
|         |
3 --------4
```

DFS intuition:

```text
0 -> 1 -> 2 -> 4 -> 3
```

BFS intuition:

```text
0 -> (1,3) -> (2,4)
```

DFS dives down one branch.
BFS expands by distance layers.

---

## Iterative DFS for Deep Graphs

For very deep inputs, prefer an explicit stack to avoid recursion depth issues:

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

This keeps the same traversal idea but moves control from the call stack into an explicit data structure.

---

## ⚠️ Common Mistakes

> [!CAUTION]
> Traversal bugs usually come from representation mistakes or visited-state mistakes.

- not marking visited early enough
- infinite loops in cyclic graphs
- constructing undirected graphs as directed, or vice versa
- mutating shared graph or grid state unintentionally
- stack overflow on deep recursive DFS

---

## 🔁 Pattern Variations

- multi-source BFS
- cycle detection
- topological traversal in DAGs
- flood fill on grids
- shortest path in unweighted graphs

---

## 🔗 Pattern Composition (Advanced)

> [!IMPORTANT]
> Traversal is often the first layer of a more advanced graph pattern.

- BFS + distance -> shortest path in unweighted graphs
- DFS + recursion stack -> cycle detection in directed graphs
- DFS + ordering -> topological sort
- traversal + union/find thinking -> connectivity problems

Examples:

- `Course Schedule` builds on graph traversal plus cycle detection
- `Rotting Oranges` uses multi-source BFS
- shortest path on unweighted graphs is just BFS with distance layers

---

## 🧠 Key Takeaways

- DFS and BFS are the base patterns behind most graph interview problems
- always settle graph representation and visited rules before writing traversal code
- DFS is often better for deep exploration and component marking
- BFS is often better for shortest unweighted distance and layered reasoning

---

## 📌 Practice Problems

> [!TIP]
> Practice these until you can explain why the problem wants DFS, BFS, or either.

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
