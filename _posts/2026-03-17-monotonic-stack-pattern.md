---
title: Monotonic Stack Pattern in Java - Interview Preparation Guide
date: 2026-03-17
categories:
- DSA
- Java
tags:
- dsa
- java
- monotonic-stack
- stack
- algorithms
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Monotonic Stack Pattern in Java - Interview Preparation Guide
seo_description: Learn monotonic stack in Java for next greater/smaller problems,
  range contributions, and linear-time scans.
header:
  overlay_image: "/assets/images/monotonic-stack-banner.svg"
  overlay_filter: 0.35
  caption: Linear-Time Neighbor Discovery
  show_overlay_excerpt: false
---
Monotonic stack is the interview pattern for nearest-greater, nearest-smaller, and range-boundary problems that would otherwise keep rescanning left or right.
It replaces repeated local searches with one disciplined push-pop invariant.

Strong candidates do not describe it as "a stack that stays sorted."
They explain what unresolved indices are waiting for, what condition triggers a pop, and why each index is pushed and popped at most once.

> [!NOTE] Interview lens
> A strong monotonic-stack explanation usually has four parts:
> 1. what each stack entry is still waiting to discover,
> 2. whether the stack must be increasing or decreasing,
> 3. why the current value resolves one or more older indices,
> 4. how the final flush or sentinel handles still-unresolved elements.

---

## Pattern Summary Table

| Pattern | When to use | Key idea | Example problem |
| --- | --- | --- | --- |
| Next greater to the right | find the next strictly larger value after each position | keep a decreasing stack of unresolved indices | Daily Temperatures |
| Next smaller to the right | find the next smaller boundary for each position | keep an increasing stack of unresolved indices | Sum of Subarray Minimums |
| Circular next greater | array wraps around and unresolved positions may be answered after the end | simulate two passes while pushing each index once | Next Greater Element II |
| Range boundary contribution | every element contributes across a maximal span | previous/next smaller or greater boundaries determine width | Largest Rectangle in Histogram |

## Problem Statement

Given an array, find the nearest greater or smaller element, or compute the maximal range where a value remains dominant.

Typical interview signals:

- brute force keeps scanning left or right from every index
- each index only needs one nearest boundary
- the expected solution is `O(n)`
- widths, spans, and contribution counts matter more than a full sorted structure

## Pattern Recognition Signals

- Keywords in the problem:
  next greater, next smaller, previous greater, previous smaller, nearest warmer day, span, boundary, rectangle width.
- Structural signals:
  each position waits for the first future or past value that breaks a comparison rule.
- Complexity signal:
  nested scans are too slow, but the answer for one index can be finalized permanently once a stronger boundary appears.

## Visual Intuition

Store indices in a stack with monotonic order of values.

- decreasing stack -> next greater queries
- increasing stack -> next smaller queries

Each index is pushed and popped at most once.

---

## Optimized Template: Next Greater Element to the Right

What we are doing actually:

1. Keep indices in a stack whose values are still waiting for an answer.
2. When a bigger value arrives, resolve as many waiting indices as possible.
3. Push the current index because it may become the answer for future elements.

```java
public int[] nextGreaterRight(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> st = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
            ans[st.pop()] = nums[i]; // Current value is the next greater element.
        }
        st.push(i); // Current index now waits for its own next greater value.
    }
    return ans;
}
```

Debug steps:

- print the stack as indices and values after each iteration
- verify each index is pushed once and popped once
- test increasing, decreasing, and equal-value inputs

---

## Problem 1: Daily Temperatures

Problem description:
For each day, return how many days you must wait until a warmer temperature appears.

What we are doing actually:

1. Keep unresolved day indices in a decreasing stack of temperatures.
2. When a warmer day arrives, pop older colder days.
3. The distance between indices gives the waiting days.

```java
public int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && t[i] > t[st.peek()]) {
            int j = st.pop();
            ans[j] = i - j; // Current day is the next warmer day for j.
        }
        st.push(i); // This day now waits for a warmer future day.
    }
    return ans;
}
```

Debug steps:

- print `i`, `t[i]`, and the stack before/after pops
- verify the stack remains decreasing by temperature
- test strictly decreasing temperatures where all answers stay `0`

---

## Problem 2: Next Greater Element II (Circular)

Problem description:
Find the next greater element for each position when the array wraps around circularly.

What we are doing actually:

1. Simulate two passes over the array using modulo indexing.
2. Use the first pass to push indices into the stack.
3. Use the second pass only to resolve waiting indices.

```java
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i < 2 * n; i++) {
        int idx = i % n;
        while (!st.isEmpty() && nums[idx] > nums[st.peek()]) {
            ans[st.pop()] = nums[idx]; // Wrapped value resolves earlier index.
        }
        if (i < n) st.push(idx); // Push each index only once.
    }
    return ans;
}
```

Debug steps:

- print `i`, `idx`, and current stack during both passes
- verify indices are only pushed while `i < n`
- test arrays where the next greater element appears only after wrapping

---

## Problem 3: Largest Rectangle in Histogram

Problem description:
Given bar heights, find the largest rectangle area that can be formed in the histogram.

What we are doing actually:

1. Keep indices of increasing heights in the stack.
2. When a lower height appears, pop taller bars because their right boundary is now known.
3. Compute width using the current index as right boundary and the new stack top as left boundary.

```java
public int largestRectangleArea(int[] h) {
    int n = h.length, best = 0;
    Deque<Integer> st = new ArrayDeque<>();

    for (int i = 0; i <= n; i++) {
        int curr = (i == n) ? 0 : h[i]; // Sentinel 0 flushes remaining bars at the end.
        while (!st.isEmpty() && curr < h[st.peek()]) {
            int height = h[st.pop()];
            int left = st.isEmpty() ? -1 : st.peek();
            int width = i - left - 1;
            best = Math.max(best, height * width); // Max rectangle using popped bar as height.
        }
        st.push(i); // Current bar may extend future rectangles.
    }
    return best;
}
```

Debug steps:

- print popped `height`, computed `width`, and `best`
- verify the sentinel iteration `i == n` happens
- test increasing bars, decreasing bars, and a single bar

---

## Common Mistakes

1. Storing values instead of indices when distance is required
2. Choosing wrong monotonic direction
3. Forgetting final flush pass
4. Handling duplicates inconsistently (`<` vs `<=`)

---

## Duplicate Tie-Breaking Rule

For contribution-count problems (like subarray minimums), duplicate handling must be asymmetric:

- one side uses strict comparison (`<`)
- other side uses non-strict (`<=`)

Without this, equal values may be double-counted or under-counted.

Document your tie rule before coding.

---

## Debug Template

During development, log stack indices and values:

```text
i=5 val=7 stack=[4(6),2(3)] -> pop 4, answer[4]=7
```

If results are wrong, inspect:

- whether pops occur at correct comparator condition
- whether unresolved indices are handled in final flush

Most monotonic stack bugs are comparator or flush mistakes.

---

## Practice Problems

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
