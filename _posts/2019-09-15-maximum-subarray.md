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
---

# Maximum Subarray in Java (Kadane Algorithm)

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

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
