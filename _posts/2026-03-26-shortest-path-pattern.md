---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-26
seo_title: Shortest Path Pattern in Java – Complete Guide
seo_description: Master shortest path algorithms in Java including BFS for unweighted graphs and Dijkstra for weighted graphs.
tags:
- dsa
- java
- shortest-path
- bfs
- dijkstra
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/shortest-path-pattern/
title: Shortest Path Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/shortest-path-banner.svg
  overlay_filter: 0.35
  caption: "Optimal Route Computation Across Graphs"
---

# Shortest Path Pattern in Java — A Detailed Guide

Choose shortest-path algorithm based on edge weights:

- unweighted: BFS
- non-negative weighted: Dijkstra
- negative edges: Bellman-Ford (advanced)

---

## Pattern 1: BFS Shortest Path (Unweighted)

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
        if (u == dst) return dist[u];

        for (int v : g.get(u)) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.offer(v);
            }
        }
    }
    return -1;
}
```

---

## Pattern 2: Dijkstra (Weighted, Non-negative)

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
        if (d != dist[u]) continue;

        for (int[] edge : g.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
```

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
