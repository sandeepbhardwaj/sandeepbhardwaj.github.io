---
categories:
- DSA
- Java
date: 2026-03-18
seo_title: Monotonic Queue (Deque) Pattern in Java - Interview Preparation Guide
seo_description: Learn monotonic deque pattern in Java for sliding window extrema
  and constrained DP optimizations.
tags:
- dsa
- java
- monotonic-queue
- deque
- sliding-window
title: Monotonic Queue (Deque) Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/monotonic-queue-banner.svg"
  overlay_filter: 0.35
  caption: Window Extremes in Amortized O(1)
  show_overlay_excerpt: false
---
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

What we are doing actually:

1. Remove expired indices from the front.
2. Remove weaker candidates from the back.
3. Append the current index.
4. Once the first full window forms, read the answer from the front.

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || nums.length == 0 || k <= 0) return new int[0];
    if (k == 1) return Arrays.copyOf(nums, nums.length);
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    int idx = 0;

    for (int r = 0; r < n; r++) {
        while (!dq.isEmpty() && dq.peekFirst() <= r - k) dq.pollFirst(); // Remove out-of-window index.
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[r]) dq.pollLast(); // Remove smaller values.
        dq.offerLast(r); // Current index becomes a candidate maximum.
        if (r >= k - 1) ans[idx++] = nums[dq.peekFirst()]; // Front holds the max for this window.
    }
    return ans;
}
```

Debug steps:

- print deque as `(index:value)` after each iteration
- verify the front index is always inside the current window
- test increasing, decreasing, and duplicate-heavy arrays

---

## Problem 1: Sliding Window Maximum

Problem description:
For every contiguous window of size `k`, return the maximum element.

What we are doing actually:

1. Use the deque to keep only candidates that could still be the maximum.
2. Throw away expired indices and smaller values immediately.
3. Read the maximum in `O(1)` from the front once each full window is formed.

Use the template above directly. Time `O(n)`.

---

## Problem 2: Sliding Window Minimum

Problem description:
For every contiguous window of size `k`, return the minimum element.

What we are doing actually:

1. Keep the deque increasing instead of decreasing.
2. Remove larger values from the back because they can never become the minimum.
3. Read the minimum from the front.

```java
public int[] minSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] ans = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    int idx = 0;

    for (int r = 0; r < n; r++) {
        while (!dq.isEmpty() && dq.peekFirst() <= r - k) dq.pollFirst(); // Remove expired index.
        while (!dq.isEmpty() && nums[dq.peekLast()] >= nums[r]) dq.pollLast(); // Remove worse minimum candidates.
        dq.offerLast(r);
        if (r >= k - 1) ans[idx++] = nums[dq.peekFirst()]; // Front is minimum for current window.
    }
    return ans;
}
```

Debug steps:

- print deque state and current minimum after each step
- verify the comparator direction changed from max-window logic
- test same input against both max and min variants

---

## Problem 3: Shortest Subarray With Sum At Least K

This combines prefix sums + increasing deque.

Problem description:
Find the shortest subarray whose sum is at least `k`, even when negative numbers may exist.

What we are doing actually:

1. Build prefix sums so any subarray sum becomes a prefix difference.
2. Keep an increasing deque of prefix indices.
3. Pop from the front when the current prefix makes a valid subarray.
4. Pop from the back when the current prefix is better than older larger prefixes.

```java
public int shortestSubarray(int[] nums, int k) {
    int n = nums.length;
    long[] pre = new long[n + 1];
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i]; // Prefix sums for subarray differences.

    int best = n + 1;
    Deque<Integer> dq = new ArrayDeque<>();

    for (int i = 0; i <= n; i++) {
        while (!dq.isEmpty() && pre[i] - pre[dq.peekFirst()] >= k) {
            best = Math.min(best, i - dq.pollFirst()); // Found a valid candidate subarray.
        }
        while (!dq.isEmpty() && pre[i] <= pre[dq.peekLast()]) {
            dq.pollLast(); // Current prefix dominates older larger prefix.
        }
        dq.offerLast(i); // This prefix index may help future answers.
    }

    return best == n + 1 ? -1 : best;
}
```

Debug steps:

- print `i`, `pre[i]`, deque contents, and `best`
- verify the deque stays increasing by prefix value
- test a case with negative numbers to see why plain sliding window would fail

---

## Common Mistakes

1. Storing values instead of indices
2. Not removing out-of-window indices first
3. Wrong inequality direction when maintaining monotonicity
4. Treating deque operations as arbitrary instead of invariant-driven

---

## Debugging Deque State

When output is wrong, print deque as `(index:value)` at each step:

```text
r=5 in=9 dq=[3:7,4:8] -> popBack 4, popBack 3, push 5
```

Verify three operations happen in order:

1. remove expired front indices
2. enforce monotonicity at back
3. append current index

This order is crucial for correctness.

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
