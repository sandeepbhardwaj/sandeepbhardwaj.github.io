---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-17
seo_title: Monotonic Stack Pattern in Java – Complete Guide
seo_description: Learn monotonic stack in Java for next greater/smaller problems, range contributions, and linear-time scans.
tags:
- dsa
- java
- monotonic-stack
- stack
- algorithms
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/monotonic-stack-pattern/
title: Monotonic Stack Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/monotonic-stack-banner.svg
  overlay_filter: 0.35
  caption: "Linear-Time Neighbor Discovery"
  show_overlay_excerpt: false
---

# Monotonic Stack Pattern in Java — A Detailed Guide

Monotonic stack helps find next/previous greater or smaller elements in linear time.
It avoids repeated backward or forward scans.

---

## Core Idea

Store indices in a stack with monotonic order of values.

- decreasing stack -> next greater queries
- increasing stack -> next smaller queries

Each index is pushed and popped at most once.

---

## Template: Next Greater Element (Right)

```java
public int[] nextGreaterRight(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> st = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
            ans[st.pop()] = nums[i];
        }
        st.push(i);
    }
    return ans;
}
```

---

## Problem 1: Daily Temperatures

```java
public int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && t[i] > t[st.peek()]) {
            int j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}
```

---

## Problem 2: Next Greater Element II (Circular)

```java
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;
        while (!st.isEmpty() && nums[idx] > nums[st.peek()]) {
            ans[st.pop()] = nums[idx];
        }
        if (i < n) st.push(idx);
    }
    return ans;
}
```

---

## Problem 3: Largest Rectangle in Histogram

```java
public int largestRectangleArea(int[] h) {
    int n = h.length, best = 0;
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i <= n; i++) {
        int curr = (i == n) ? 0 : h[i];
        while (!st.isEmpty() && curr < h[st.peek()]) {
            int height = h[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            int width = i - left - 1;
            best = Math.max(best, height * width);
        }
        st.push(i);
    }
    return best;
}
```

---

## Common Mistakes

1. Storing values instead of indices when distance is required
2. Choosing wrong monotonic direction
3. Forgetting final flush pass
4. Handling duplicates inconsistently (`<` vs `<=`)

---

## Practice Set (Recommended Order)

1. Next Greater Element I (LC 496)  
   [LeetCode](https://leetcode.com/problems/next-greater-element-i/)
2. Daily Temperatures (LC 739)  
   [LeetCode](https://leetcode.com/problems/daily-temperatures/)
3. Next Greater Element II (LC 503)  
   [LeetCode](https://leetcode.com/problems/next-greater-element-ii/)
4. Largest Rectangle in Histogram (LC 84)  
   [LeetCode](https://leetcode.com/problems/largest-rectangle-in-histogram/)
5. Maximal Rectangle (LC 85)  
   [LeetCode](https://leetcode.com/problems/maximal-rectangle/)
6. Sum of Subarray Minimums (LC 907)  
   [LeetCode](https://leetcode.com/problems/sum-of-subarray-minimums/)

---

## Key Takeaways

- Monotonic stacks solve neighbor/range-boundary queries in `O(n)`.
- Index storage is usually required for width/distance calculations.
- The push-pop invariant is the core correctness argument.
