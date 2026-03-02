---
title: Find First and Last Position of Element in Sorted Array
date: '2019-07-13'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-search
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Find First and Last Position in Sorted Array - Java
seo_description: Use two binary searches to find leftmost and rightmost target index
  in sorted array.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Find First and Last Position of Element in Sorted Array

This guide explains the intuition, optimized approach, and Java implementation for find first and last position of element in sorted array, with practical tips for interviews and production coding standards.

## Problem

Given sorted array `nums`, return start and end indices of target. If missing, return `[-1, -1]`.

## Approach

Run binary search twice:

- First occurrence (`lower bound`)
- Last occurrence (`upper bound` style)

## Java Solution

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = firstIndex(nums, target);
        if (first == -1) return new int[]{-1, -1};
        int last = lastIndex(nums, target);
        return new int[]{first, last};
    }

    private int firstIndex(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) right = mid - 1;
            else left = mid + 1;
            if (nums[mid] == target) ans = mid;
        }
        return ans;
    }

    private int lastIndex(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) left = mid + 1;
            else right = mid - 1;
            if (nums[mid] == target) ans = mid;
        }
        return ans;
    }
}
```

## Complexity

- Time: `O(log n)`
- Space: `O(1)`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
