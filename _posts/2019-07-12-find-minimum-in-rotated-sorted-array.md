---
title: Find Minimum in Rotated Sorted Array in Java
date: '2019-07-12'
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
seo_title: Find Minimum in Rotated Sorted Array in Java (LeetCode 153)
seo_description: Binary search approach to find minimum element in rotated sorted
  array.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Find Minimum in Rotated Sorted Array in Java

This guide explains the intuition, optimized approach, and Java implementation for find minimum in rotated sorted array in java, with practical tips for interviews and production coding standards.

## Problem

Array is sorted then rotated. Find the minimum value in `O(log n)`.

## Insight

Compare `nums[mid]` with `nums[right]`:

- If `nums[mid] > nums[right]`, minimum is in right half
- Else, minimum is in left half including `mid`

## Java Solution

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return nums[left];
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
