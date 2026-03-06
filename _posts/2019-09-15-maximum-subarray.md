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
This guide explains the intuition, optimized approach, and Java implementation for maximum subarray in java (kadane algorithm), with practical tips for interviews and production coding standards.

## Problem

Find contiguous subarray with largest sum.

## Kadane Intuition

For each index, decide:

- Start new subarray at current value
- Extend previous best ending here

Recurrence: `current = max(nums[i], current + nums[i])`

## Java Solution

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int best = nums[0];

        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }

        return best;
    }
}
```

## Dry Run

Input: `[-2,1,-3,4,-1,2,1,-5,4]`

- start: `current=-2`, `best=-2`
- `1`: `current=max(1,-1)=1`, `best=1`
- `-3`: `current=max(-3,-2)=-2`, `best=1`
- `4`: `current=4`, `best=4`
- `-1`: `current=3`, `best=4`
- `2`: `current=5`, `best=5`
- `1`: `current=6`, `best=6`
- `-5`: `current=1`, `best=6`
- `4`: `current=5`, `best=6`

Answer: `6` (`[4,-1,2,1]`)

## Why This Works

If `current + nums[i]` is worse than `nums[i]` itself, any subarray ending at `i-1` is harmful.
So the optimal subarray ending at `i` either:

- extends previous optimal ending at `i-1`, or
- starts fresh at `i`

This local choice leads to global optimum in one pass.

## Common Mistakes

1. Initializing `current` and `best` to `0` (fails on all-negative arrays).
2. Using prefix-sum brute force (`O(n^2)`) for this problem.
3. Forgetting to handle single-element input.

## Variant: Return Subarray Indices

Track start candidate and best range while applying Kadane updates.
Useful when problem asks for the actual subarray, not just sum.

## Testing Checklist

- all positive values
- all negative values
- mix with best subarray in middle
- single element
- large random arrays

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- Kadane tracks best subarray ending at current index, then upgrades global best.
- initialize from first element, not zero, to correctly handle all-negative arrays.
- this is a one-pass dynamic programming pattern with constant extra space.
