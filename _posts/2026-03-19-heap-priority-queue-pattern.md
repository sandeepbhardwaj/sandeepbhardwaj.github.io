---
categories:
- DSA
- Java
date: 2026-03-19
seo_title: Heap and Priority Queue Pattern in Java - Interview Preparation Guide
seo_description: Master heap and priority queue patterns in Java for top-k, streaming
  median, scheduling, and greedy optimization.
tags:
- dsa
- java
- heap
- priority-queue
- algorithms
title: Heap and Priority Queue Pattern in Java - Interview Preparation Guide
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

What we are solving actually:

We only care about the best `k` items, not a full sorted result, so keeping a small heap is cheaper than sorting everything.

What we are doing actually:

1. Count frequencies first.
2. Keep a min-heap of size at most `k`.
3. If the heap grows too large, remove the smallest frequency.

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
        pq.offer(new int[]{e.getKey(), e.getValue()}); // Candidate top-k item.
        if (pq.size() > k) pq.poll(); // Remove the weakest candidate so far.
    }

    int[] ans = new int[k];
    for (int i = k - 1; i >= 0; i--) ans[i] = pq.poll()[0]; // Extract from smallest to largest frequency.
    return ans;
}
```

Debug steps:

- print heap contents after each offer/poll
- verify the heap comparator keeps the smallest frequency at the top
- test `k = 1`, `k = uniqueCount`, and repeated frequencies

---

## Pattern 2: Two Heaps (Running Median)

What we are solving actually:

We need a structure that supports repeated inserts and median queries without resorting the whole stream every time.

What we are doing actually:

1. Keep the smaller half in a max-heap.
2. Keep the larger half in a min-heap.
3. Rebalance after each insert so their sizes differ by at most one.

```java
class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        if (low.isEmpty() || num <= low.peek()) low.offer(num); // Belongs to lower half.
        else high.offer(num); // Belongs to upper half.

        if (low.size() > high.size() + 1) high.offer(low.poll()); // Rebalance if low is too large.
        else if (high.size() > low.size()) low.offer(high.poll()); // Rebalance if high is larger.
    }

    public double findMedian() {
        if (low.size() == high.size()) return (low.peek() + high.peek()) / 2.0; // Even count.
        return low.peek(); // Odd count: low keeps one extra element.
    }
}
```

Debug steps:

- print both heaps after each insertion
- verify every value in `low` is `<=` every value in `high`
- test odd and even stream lengths separately

---

## Problem 1: Kth Largest Element in an Array

Problem description:
Return the kth largest element without fully sorting the entire array.

What we are doing actually:

1. Keep a min-heap that stores only the current top `k` elements.
2. Push every number into the heap.
3. If the heap grows beyond `k`, remove the smallest element.
4. The heap root is then the kth largest overall.

```java
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> min = new PriorityQueue<>();
    for (int x : nums) {
        min.offer(x); // Candidate for the top-k set.
        if (min.size() > k) min.poll(); // Remove the smallest so only k largest remain.
    }
    return min.peek(); // Smallest among the top k = kth largest overall.
}
```

Debug steps:

- print the heap after processing each number
- verify the heap never grows beyond size `k`
- compare the result with a fully sorted version on a small sample

---

## Problem 2: Merge K Sorted Lists

Problem description:
Given `k` sorted linked lists, merge them into one globally sorted linked list.

What we are doing actually:

1. Put the head of each non-empty list into a min-heap.
2. Repeatedly remove the smallest node.
3. Append that node to the answer and push its next node if it exists.

```java
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
    for (ListNode node : lists) if (node != null) pq.offer(node); // Seed heap with list heads.

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode cur = pq.poll(); // Smallest current node across all list heads.
        tail.next = cur; // Append to merged list.
        tail = tail.next;
        if (cur.next != null) pq.offer(cur.next); // Next node from same list becomes a candidate.
    }
    return dummy.next;
}
```

Debug steps:

- print the heap head before each poll
- trace which list contributed the next node
- test empty lists, one list, and multiple uneven list lengths

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
