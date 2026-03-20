---
title: Maximum Subarray in Java (Kadane Algorithm)
date: '2019-09-15'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- dynamic-programming
- array
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Maximum Subarray in Java Using Kadane Algorithm
seo_description: Kadane algorithm explanation with intuition and Java implementation
  for LeetCode 53.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Kadane's algorithm is one of the best examples of dynamic programming hidden inside a very small loop.
The trick is to track the best subarray ending at the current position, not every possible subarray.

---

## Problem 1: Maximum Subarray

Problem description:
Given an integer array `nums`, find the contiguous subarray with the largest possible sum and return that sum.

What we are solving actually:
Brute force tries every start and end pair, which is too slow. The real insight is that when a running sum becomes harmful, we should drop it immediately and start fresh from the current element.

What we are doing actually:

1. Track `current`, the best subarray sum ending exactly at the current index.
2. Track `best`, the best sum seen anywhere so far.
3. For each new value, decide whether to extend the previous subarray or start a new one.
4. Update the global best after each step.

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int best = nums[0];

        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]); // Either start fresh here or extend the old run.
            best = Math.max(best, current); // Keep the strongest subarray sum seen so far.
        }

        return best;
    }
}
```

Debug steps:

- print `nums[i]`, `current`, and `best` after each iteration
- test `[-2,1,-3,4,-1,2,1,-5,4]`, `[-3,-2,-5]`, and `[5]`
- verify the invariant that `current` is always the best subarray sum ending at the current index

---

## Kadane Intuition

At each index `i`, there are only two meaningful choices:

- start a brand-new subarray at `nums[i]`
- extend the best subarray that ended at `i - 1`

So the recurrence is:

`current = max(nums[i], current + nums[i])`

If the old running sum hurts more than it helps, discard it.
That local decision is enough to reach the global optimum.

---

## Dry Run

Input: `[-2,1,-3,4,-1,2,1,-5,4]`

1. start: `current=-2`, `best=-2`
2. read `1` -> `current=max(1,-1)=1`, `best=1`
3. read `-3` -> `current=max(-3,-2)=-2`, `best=1`
4. read `4` -> `current=max(4,2)=4`, `best=4`
5. read `-1` -> `current=max(-1,3)=3`, `best=4`
6. read `2` -> `current=max(2,5)=5`, `best=5`
7. read `1` -> `current=max(1,6)=6`, `best=6`
8. read `-5` -> `current=max(-5,1)=1`, `best=6`
9. read `4` -> `current=max(4,5)=5`, `best=6`

Final answer: `6`

The winning subarray is `[4,-1,2,1]`.

---

## Why This Works

Suppose the best subarray ending at index `i - 1` has sum `current`.
When we process `nums[i]`, any optimal subarray ending at `i` must be one of these:

- `nums[i]` alone
- that previous best-ending-at-`i-1` plus `nums[i]`

There is no third useful option.
That is why one small recurrence is enough.

This is the key DP interpretation:

- `current` = best answer for subarrays ending here
- `best` = best answer over all endings seen so far

---

## Important Initialization Rule

Do not initialize `current` and `best` to `0`.

Why?

Because arrays can contain only negative numbers.

Example:

- input: `[-3, -2, -5]`
- correct answer: `-2`

If you start from `0`, you incorrectly return `0`, which is not even a subarray sum here.

So initialize from `nums[0]`.

---

## Boundary Cases

- single element -> answer is that element
- all positive -> answer is the full array sum
- all negative -> answer is the least negative value
- best subarray in the middle -> still handled naturally

---

## Common Mistakes

1. initializing `current` and `best` to `0`
2. thinking Kadane works only when there are positive numbers
3. using a quadratic brute-force prefix-sum approach unnecessarily
4. forgetting that the subarray must be contiguous

---

## Variant: Return the Subarray Itself

If the problem asks for indices or the actual subarray:

- track a candidate start index when you restart at `nums[i]`
- update best range whenever `best` improves

The same Kadane decision still drives the solution.
You just store a little more metadata.

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- Kadane's algorithm is dynamic programming in constant space
- `current` means "best subarray ending here," which is the whole mental model
- initialize from the first element so all-negative arrays are handled correctly
