---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-19
seo_title: Heap and Priority Queue Pattern in Java – Complete Guide
seo_description: Master heap and priority queue patterns in Java for top-k, streaming
  median, scheduling, and greedy optimization.
tags:
- dsa
- java
- heap
- priority-queue
- algorithms
title: Heap and Priority Queue Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/heap-priority-queue-banner.svg"
  overlay_filter: 0.35
  caption: Efficient Access to Extreme Elements
  show_overlay_excerpt: false
---
Use heaps when you need repeated access to the smallest or largest element under updates.
Java provides this via `PriorityQueue`.

---

## Core Idea

- Min-heap: root is smallest
- Max-heap: simulate via reversed comparator

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
```

Core operation costs:

- `offer`: `O(log n)`
- `poll`: `O(log n)`
- `peek`: `O(1)`

---

## Pattern 1: Top K Elements

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
        pq.offer(new int[]{e.getKey(), e.getValue()});
        if (pq.size() > k) pq.poll();
    }

    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll()[0];
    return ans;
}
```

---

## Pattern 2: Two Heaps (Running Median)

```java
class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        if (low.isEmpty() || num <= low.peek()) low.offer(num);
        else high.offer(num);

        if (low.size() > high.size() + 1) high.offer(low.poll());
        else if (high.size() > low.size()) low.offer(high.poll());
    }

    public double findMedian() {
        if (low.size() == high.size()) return (low.peek() + high.peek()) / 2.0;
        return low.peek();
    }
}
```

---

## Problem 1: Kth Largest Element in an Array

```java
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> min = new PriorityQueue<>();
    for (int x : nums) {
        min.offer(x);
        if (min.size() > k) min.poll();
    }
    return min.peek();
}
```

---

## Problem 2: Merge K Sorted Lists

```java
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
    for (ListNode node : lists) if (node != null) pq.offer(node);

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode cur = pq.poll();
        tail.next = cur;
        tail = tail.next;
        if (cur.next != null) pq.offer(cur.next);
    }
    return dummy.next;
}
```

---

## Common Mistakes

1. Wrong heap type (min vs max)
2. Comparator bugs for custom objects
3. Forgetting to cap heap size in top-k problems
4. Assuming heap gives sorted iteration order

---

## Comparator Safety Note

Avoid subtraction-based comparators due to overflow risk:

Bad:

```java
(a, b) -> a.val - b.val
```

Better:

```java
Comparator.comparingInt(node -> node.val)
```

---

## Debug Checklist

When heap results are wrong:

1. print heap size changes after each offer/poll
2. verify comparator direction matches problem goal
3. verify cap logic (`if (pq.size() > k) pq.poll()`) executes correctly
4. assert non-empty heap before `peek/poll` in edge cases

Heaps fail silently when comparator semantics are inverted.

---

## Practice Set (Recommended Order)

1. Kth Largest Element in an Array (LC 215)  
   [LeetCode](https://leetcode.com/problems/kth-largest-element-in-an-array/)
2. Top K Frequent Elements (LC 347)  
   [LeetCode](https://leetcode.com/problems/top-k-frequent-elements/)
3. Find Median from Data Stream (LC 295)  
   [LeetCode](https://leetcode.com/problems/find-median-from-data-stream/)
4. Merge k Sorted Lists (LC 23)  
   [LeetCode](https://leetcode.com/problems/merge-k-sorted-lists/)
5. Task Scheduler (LC 621)  
   [LeetCode](https://leetcode.com/problems/task-scheduler/)
6. IPO (LC 502)  
   [LeetCode](https://leetcode.com/problems/ipo/)

---

## Key Takeaways

- Heaps optimize repeated extreme-element access.
- Size-capped heaps are a standard top-k tool.
- Two-heap balancing is the canonical streaming median pattern.
