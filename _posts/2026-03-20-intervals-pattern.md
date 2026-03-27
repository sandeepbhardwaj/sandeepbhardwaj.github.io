---
categories:
- DSA
- Java
date: 2026-03-20
seo_title: Intervals Pattern in Java - Interview Preparation Guide
seo_description: Learn interval algorithms in Java including merge, insert, overlap
  detection, and meeting room scheduling.
tags:
- dsa
- java
- intervals
- sorting
- algorithms
title: Intervals Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/intervals-banner.svg"
  overlay_filter: 0.35
  caption: Sorting and Sweep Logic for Range Problems
  show_overlay_excerpt: false
---
Interval problems are the interview pattern for reasoning about overlap, ordering, and resource usage across ranges.
Once the intervals are sorted using the right key, many messy-looking problems collapse into one linear scan.

Strong candidates do not say "sort and merge" as a reflex.
They first clarify interval semantics, choose the correct sort key, and explain exactly when two ranges should be treated as overlapping versus merely touching.

> [!NOTE] Interview lens
> A strong interval explanation usually has four parts:
> 1. whether the intervals are closed or half-open,
> 2. what sort order makes the local decision correct,
> 3. what state summarizes the merged or active answer so far,
> 4. why each new interval can be handled by comparing against only that state.

---

## Pattern Summary Table

| Pattern | When to use | Key idea | Example problem |
| --- | --- | --- | --- |
| Merge overlaps | combine touching or overlapping ranges into disjoint output | sort by start and merge into the last output interval | Merge Intervals |
| Insert and merge | add one range into an already ordered non-overlapping set | process before, overlap, and after phases | Insert Interval |
| Greedy keep-by-end | maximize non-overlapping intervals or minimize removals | keep the interval that ends earliest | Non-overlapping Intervals |
| Active resource counting | count how many intervals overlap at once | sort starts and track active ends with a heap or sweep line | Meeting Rooms II |

## Problem Statement

Given intervals that may overlap, touch, or compete for the same resource, merge them, insert one more interval, remove conflicts, or count simultaneous activity.

Typical interview signals:

- each item has a start and end
- sorting seems unavoidable
- overlap semantics determine correctness
- the expected solution is `O(n log n)` because sorting dominates

## Pattern Recognition Signals

- Keywords in the problem:
  merge, overlap, insert interval, meeting rooms, non-overlapping, schedule, active intervals.
- Structural signals:
  once intervals are ordered, the next decision only depends on the last merged interval or the earliest finishing active one.
- Complexity signal:
  the core work after sorting is often a linear scan.

## Visual Intuition

1. Sort by start time.
2. Iterate and decide overlap vs non-overlap.
3. Merge/update state accordingly.

Always clarify interval semantics first:

- closed intervals: `[a, b]`
- half-open intervals: `[a, b)`

This changes overlap condition (`<` vs `<=`) in edge cases.

---

## Optimized Template: Merge Intervals

This is the base interval problem: given many ranges, combine every overlapping pair so the final answer contains only disjoint intervals.

What we are doing actually:

1. Sort by start time so related intervals come next to each other.
2. Keep one output list that represents the merged answer so far.
3. Compare the current interval only with the last merged interval.

```java
public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0])); // Process intervals from left to right.
    List<int[]> out = new ArrayList<>();

    for (int[] cur : intervals) {
        // If there is no previous merged interval, or the current interval starts after
        // the previous one ends, we must start a brand-new merged block.
        if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) {
            out.add(new int[]{cur[0], cur[1]}); // Copy values so output stays independent.
        } else {
            // Otherwise the two intervals overlap, so extend the previous block if needed.
            out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
        }
    }
    return out.toArray(new int[out.size()][]);
}
```

Debug steps:

- print the intervals after sorting to verify the scan order
- after every loop iteration, print the current `out` list
- test touching intervals like `[1,4]` and `[4,5]` to confirm your overlap rule

---

## Problem 1: Insert Interval

Problem description:
We are given sorted, non-overlapping intervals and one new interval. We need to insert the new interval in the correct position and merge only the ranges that overlap with it.

What we are doing actually:

1. Add all intervals that are fully before the new interval.
2. Merge every interval that touches the new interval into one bigger interval.
3. Add the remaining intervals that come after it.

```java
public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> ans = new ArrayList<>();
    int i = 0, n = intervals.length;
    int[] mergedInterval = new int[]{newInterval[0], newInterval[1]}; // Avoid mutating caller input.

    // These intervals end before the new interval starts, so they stay unchanged.
    while (i < n && intervals[i][1] < mergedInterval[0]) {
        ans.add(intervals[i]);
        i++;
    }

    // These intervals overlap with the new interval, so merge them into one range.
    while (i < n && intervals[i][0] <= mergedInterval[1]) {
        mergedInterval[0] = Math.min(mergedInterval[0], intervals[i][0]); // Expand left boundary.
        mergedInterval[1] = Math.max(mergedInterval[1], intervals[i][1]); // Expand right boundary.
        i++;
    }
    ans.add(mergedInterval); // Add the merged result exactly once.

    // These intervals start after the merged interval ends, so append them as-is.
    while (i < n) {
        ans.add(intervals[i]);
        i++;
    }

    return ans.toArray(new int[ans.size()][]);
}
```

Debug steps:

- print `mergedInterval` every time it expands to see exactly which overlap changed it
- log which phase each interval entered: before, overlapping, or after
- test three cases separately: insert at beginning, insert in middle with merge, insert at end

---

## Problem 2: Non-overlapping Intervals (Min Removals)

Problem description:
We want the minimum number of intervals to remove so that the remaining intervals do not overlap.

What we are doing actually:

1. Sort by end time, not start time.
2. Greedily keep the interval that finishes earliest because it leaves the most room for future intervals.
3. If the next interval overlaps, remove it and keep the earlier-ending one.

```java
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) {
        return 0;
    }

    Arrays.sort(intervals, Comparator.comparingInt(a -> a[1])); // Greedy choice: earliest end first.
    int removals = 0;
    int end = intervals[0][1]; // End time of the last interval we decided to keep.

    for (int i = 1; i < intervals.length; i++) {
        // Overlap means the current interval starts before the kept interval ends.
        if (intervals[i][0] < end) {
            removals++; // Remove current interval; the kept one already ends earlier.
        } else {
            end = intervals[i][1]; // No overlap, so keep current interval and move forward.
        }
    }
    return removals;
}
```

Debug steps:

- print intervals after sorting by end time to verify the greedy order
- for each interval, log: current start/end, previous `end`, and whether you kept or removed it
- test `[1,2],[2,3]` and `[1,2],[1,3]` to see the difference between touching and overlapping

---

## Problem 3: Meeting Rooms II

Problem description:
Each interval is a meeting with a start and end time. We need the minimum number of rooms required so that all meetings can happen without conflict.

What we are doing actually:

1. Sort meetings by start time.
2. Use a min-heap to store end times of meetings that are currently using rooms.
3. Remove every meeting that has already finished before the current one starts.
4. The largest heap size seen during the scan is the answer.

```java
public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(a -> a[0])); // Process meetings in start-time order.
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // Min-heap of active meeting end times.
    int maxRooms = 0;

    for (int[] in : intervals) {
        // Free every room whose meeting ended before this meeting starts.
        while (!pq.isEmpty() && pq.peek() <= in[0]) {
            pq.poll();
        }

        pq.offer(in[1]); // Current meeting now occupies one room.
        maxRooms = Math.max(maxRooms, pq.size()); // Peak active meetings = minimum rooms needed.
    }
    return maxRooms;
}
```

Debug steps:

- print meetings after sorting by start time
- before and after each iteration, print the heap to see which rooms got freed and reused
- test one fully overlapping case and one chain case like `[1,2],[2,3],[3,4]`

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

## Practice Problems

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
