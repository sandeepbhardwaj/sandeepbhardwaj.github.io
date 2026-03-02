---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-18
seo_title: Monotonic Queue (Deque) Pattern in Java – Complete Guide
seo_description: Learn monotonic deque pattern in Java for sliding window extrema and constrained DP optimizations.
tags:
- dsa
- java
- monotonic-queue
- deque
- sliding-window
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/monotonic-queue-deque-pattern/
title: Monotonic Queue (Deque) Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/monotonic-queue-banner.svg
  overlay_filter: 0.35
  caption: "Window Extremes in Amortized O(1)"
  show_overlay_excerpt: false
---

# Monotonic Queue (Deque) Pattern in Java — A Detailed Guide

Monotonic deque extends monotonic-stack thinking to moving windows.
It gives fast max/min queries while the window slides.

---

## Core Idea

Maintain deque of indices with monotonic values.

For window maximum:

- front always stores index of maximum
- pop front if out of window
- pop back while incoming value is larger

---

## Template: Sliding Window Maximum

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    int idx = 0;

    for (int r = 0; r < n; r++) {
        while (!dq.isEmpty() && dq.peekFirst() <= r - k) dq.pollFirst();
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[r]) dq.pollLast();
        dq.offerLast(r);
        if (r >= k - 1) ans[idx++] = nums[dq.peekFirst()];
    }
    return ans;
}
```

---

## Problem 1: Sliding Window Maximum

Same as template above. Time `O(n)`.

---

## Problem 2: Sliding Window Minimum

```java
public int[] minSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    int idx = 0;

    for (int r = 0; r < n; r++) {
        while (!dq.isEmpty() && dq.peekFirst() <= r - k) dq.pollFirst();
        while (!dq.isEmpty() && nums[dq.peekLast()] >= nums[r]) dq.pollLast();
        dq.offerLast(r);
        if (r >= k - 1) ans[idx++] = nums[dq.peekFirst()];
    }
    return ans;
}
```

---

## Problem 3: Shortest Subarray With Sum At Least K

This combines prefix sums + increasing deque.

```java
public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    long[] pre = new long[n + 1];
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];

    int best = n + 1;
    Deque<Integer> dq = new ArrayDeque<>();

    for (int i = 0; i <= n; i++) {
        while (!dq.isEmpty() && pre[i] - pre[dq.peekFirst()] >= k) {
            best = Math.min(best, i - dq.pollFirst());
        }
        while (!dq.isEmpty() && pre[i] <= pre[dq.peekLast()]) {
            dq.pollLast();
        }
        dq.offerLast(i);
    }

    return best == n + 1 ? -1 : best;
}
```

---

## Common Mistakes

1. Storing values instead of indices
2. Not removing out-of-window indices first
3. Wrong inequality direction when maintaining monotonicity
4. Treating deque operations as arbitrary instead of invariant-driven

---

## Practice Set (Recommended Order)

1. Sliding Window Maximum (LC 239)  
   [LeetCode](https://leetcode.com/problems/sliding-window-maximum/)
2. Shortest Subarray with Sum at Least K (LC 862)  
   [LeetCode](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)
3. Constrained Subsequence Sum (LC 1425)  
   [LeetCode](https://leetcode.com/problems/constrained-subsequence-sum/)
4. Jump Game VI (LC 1696)  
   [LeetCode](https://leetcode.com/problems/jump-game-vi/)
5. Longest Continuous Subarray with Absolute Diff <= Limit (LC 1438)  
   [LeetCode](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)

---

## Key Takeaways

- Monotonic deque is the standard for window extrema in linear time.
- The deque invariant guarantees correctness and amortized `O(1)` updates.
- It is a critical pattern for advanced sliding-window and DP problems.
