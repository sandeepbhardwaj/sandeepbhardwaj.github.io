---
categories:
- DSA
- Java
date: 2026-03-26
seo_title: Shortest Path Pattern in Java - Interview Preparation Guide
seo_description: Master shortest path algorithms in Java including BFS for unweighted
  graphs and Dijkstra for weighted graphs.
tags:
- dsa
- java
- shortest-path
- bfs
- dijkstra
title: Shortest Path Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/shortest-path-banner.svg"
  overlay_filter: 0.35
  caption: Optimal Route Computation Across Graphs
  show_overlay_excerpt: false
---
Choose shortest-path algorithm based on edge weights:

- unweighted: BFS
- non-negative weighted: Dijkstra
- negative edges: Bellman-Ford (advanced)

---

## Pattern 1: BFS Shortest Path (Unweighted)

Problem description:
Find the shortest number of edges from `src` to `dst` in an unweighted graph.

What we are doing actually:

1. BFS explores nodes in increasing distance order.
2. Store the first distance assigned to each node.
3. The first time we reach `dst`, that distance is optimal.

```java
public int shortestPathUnweighted(List<List<Integer>> g, int src, int dst) {
    int n = g.size();
    int[] dist = new int[n];
    Arrays.fill(dist, -1);

    Queue<Integer> q = new ArrayDeque<>();
    q.offer(src);
    dist[src] = 0;

    while (!q.isEmpty()) {
        int u = q.poll();
        if (u == dst) return dist[u]; // BFS guarantees first arrival is shortest.

        for (int v : g.get(u)) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1; // One more edge than current node.
                q.offer(v);
            }
        }
    }
    return -1;
}
```

Debug steps:

- print queue contents and `dist` array after each expansion
- verify every node gets a distance only once
- test unreachable destination to confirm `-1`

---

## Pattern 2: Dijkstra (Weighted, Non-negative)

Problem description:
Find shortest distances from a source in a graph with non-negative edge weights.

What we are doing actually:

1. Keep the best known distance for every node.
2. Pop the currently cheapest node from the heap.
3. Relax outgoing edges and update neighbors if we found a shorter path.
4. Skip stale heap entries that no longer match `dist[u]`.

```java
public int[] dijkstra(List<List<int[]>> g, int src) {
    int n = g.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    pq.offer(new int[]{src, 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0], d = cur[1];
        if (d != dist[u]) continue; // Ignore stale entry with outdated distance.

        for (int[] edge : g.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w; // Better path found through u.
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
```

Debug steps:

- print `(node, distance)` when polling from the heap
- trace every successful relaxation `u -> v`
- verify stale entries are skipped instead of processed

---

## Dry Run (Dijkstra)

Graph edges:

- `0 -> 1 (4)`
- `0 -> 2 (1)`
- `2 -> 1 (2)`

Start `src=0`:

1. `dist=[0,INF,INF]`, pq=`(0,0)`
2. pop `0`: relax `1=4`, `2=1`
3. pop `2`: relax `1=min(4,1+2)=3`
4. pop stale `(1,4)` skipped, pop `(1,3)` processed

Final shortest distance to `1` is `3`.

This illustrates why stale-entry skipping is required.

---

## Problem 1: Network Delay Time

Dijkstra with source `k`; answer is max distance if all nodes reachable.

---

## Problem 2: Path With Minimum Effort

Model as weighted graph where edge cost is height difference.
Use Dijkstra with relaxation on max-edge-so-far metric.

---

## Common Mistakes

1. Using Dijkstra with negative weights
2. Missing stale-entry skip (`if (d != dist[u]) continue`)
3. Overflow on distance addition
4. Wrong graph indexing (1-based vs 0-based)

---

## Path Reconstruction Tip

If problem asks actual route, maintain `parent[]` during relax:

```java
if (newDist < dist[v]) {
    dist[v] = newDist;
    parent[v] = u;
}
```

Then reconstruct by walking from destination to source through `parent`.

---

## Practice Set (Recommended Order)

1. Shortest Path in Binary Matrix (LC 1091)  
   [LeetCode](https://leetcode.com/problems/shortest-path-in-binary-matrix/)
2. Network Delay Time (LC 743)  
   [LeetCode](https://leetcode.com/problems/network-delay-time/)
3. Path With Minimum Effort (LC 1631)  
   [LeetCode](https://leetcode.com/problems/path-with-minimum-effort/)
4. Cheapest Flights Within K Stops (LC 787)  
   [LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
5. Swim in Rising Water (LC 778)  
   [LeetCode](https://leetcode.com/problems/swim-in-rising-water/)

---

## Key Takeaways

- Match algorithm to weight model first.
- BFS and Dijkstra cover most real shortest-path interview cases.
- Priority queue discipline and relaxation logic drive correctness.
