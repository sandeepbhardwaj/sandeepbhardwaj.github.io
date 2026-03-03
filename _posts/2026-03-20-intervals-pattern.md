---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-20
seo_title: Intervals Pattern in Java – Complete Guide
seo_description: Learn interval algorithms in Java including merge, insert, overlap detection, and meeting room scheduling.
tags:
- dsa
- java
- intervals
- sorting
- algorithms
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/intervals-pattern/
title: Intervals Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/intervals-banner.svg
  overlay_filter: 0.35
  caption: "Sorting and Sweep Logic for Range Problems"
  show_overlay_excerpt: false
---

# Intervals Pattern in Java — A Detailed Guide

Intervals problems are mostly about ordering and overlap rules.
Once sorted, many become simple linear scans.

---

## Core Idea

1. Sort by start time.
2. Iterate and decide overlap vs non-overlap.
3. Merge/update state accordingly.

Always clarify interval semantics first:

- closed intervals: `[a, b]`
- half-open intervals: `[a, b)`

This changes overlap condition (`<` vs `<=`) in edge cases.

---

## Template: Merge Intervals

```java
public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    List<int[]> out = new ArrayList<>();

    for (int[] cur : intervals) {
        if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) {
            out.add(new int[]{cur[0], cur[1]});
        } else {
            out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
        }
    }
    return out.toArray(new int[out.size()][]);
}
```

---

## Problem 1: Insert Interval

```java
public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> ans = new ArrayList<>();
    int i = 0, n = intervals.length;

    while (i < n && intervals[i][1] < newInterval[0]) ans.add(intervals[i++]);

    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    ans.add(newInterval);

    while (i < n) ans.add(intervals[i++]);

    return ans.toArray(new int[ans.size()][]);
}
```

---

## Problem 2: Non-overlapping Intervals (Min Removals)

```java
public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
    int removals = 0;
    int end = Integer.MIN_VALUE;

    for (int[] in : intervals) {
        if (in[0] >= end) {
            end = in[1];
        } else {
            removals++;
        }
    }
    return removals;
}
```

---

## Problem 3: Meeting Rooms II

```java
public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // end times

    for (int[] in : intervals) {
        if (!pq.isEmpty() && pq.peek() <= in[0]) pq.poll();
        pq.offer(in[1]);
    }
    return pq.size();
}
```

---

## Common Mistakes

1. Forgetting to sort first
2. Wrong overlap condition (`<` vs `<=`)
3. Mutating input intervals without intent
4. Choosing wrong greedy key (start vs end)

---

## Sweep-Line Alternative

For concurrency/counting style interval problems, sweep-line events are often cleaner:

1. create start event `+1`, end event `-1`
2. sort events by time (with tie-breaking rule)
3. scan prefix count to get max overlaps

This is an alternative to heap-based solutions for meeting-room style tasks.

---

## Debug Checklist

- print sorted intervals before processing
- trace current active interval/window after each step
- validate overlap rule on touching boundaries (e.g., `[1,2]` and `[2,3]`)

Most interval bugs are boundary definition bugs, not algorithm bugs.

---

## Practice Set (Recommended Order)

1. Merge Intervals (LC 56)  
   [LeetCode](https://leetcode.com/problems/merge-intervals/)
2. Insert Interval (LC 57)  
   [LeetCode](https://leetcode.com/problems/insert-interval/)
3. Non-overlapping Intervals (LC 435)  
   [LeetCode](https://leetcode.com/problems/non-overlapping-intervals/)
4. Meeting Rooms II (LC 253)  
   [LeetCode](https://leetcode.com/problems/meeting-rooms-ii/)
5. Minimum Number of Arrows to Burst Balloons (LC 452)  
   [LeetCode](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

---

## Key Takeaways

- Sort-first is the default strategy for interval problems.
- Greedy correctness depends on exact overlap definitions.
- Linear scans after sorting solve most interval tasks efficiently.
