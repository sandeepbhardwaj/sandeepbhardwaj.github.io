---
title: First Missing Positive in Java
date: '2019-07-14'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- array
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: First Missing Positive in Java (LeetCode 41)
seo_description: Find smallest missing positive integer in O(n) time and O(1) extra
  space.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# First Missing Positive in Java

This guide explains the intuition, optimized approach, and Java implementation for first missing positive in java, with practical tips for interviews and production coding standards.

## Problem

Given an unsorted integer array, find the smallest missing positive integer.

## Constraint

Desired complexity: `O(n)` time and `O(1)` extra space.

## Approach (Index Placement)

Place each value `x` (1 <= x <= n) at index `x - 1` using swaps.

After rearrangement, first index `i` where `nums[i] != i + 1` gives answer `i + 1`.

## Java Solution

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int correct = nums[i] - 1;
                int temp = nums[i];
                nums[i] = nums[correct];
                nums[correct] = temp;
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }

        return n + 1;
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
