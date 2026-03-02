---
title: Binary Search in Java (Iterative and Recursive)
date: '2019-07-08'
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
seo_title: Binary Search in Java - Iterative and Recursive
seo_description: Binary search in Java with iterative and recursive implementations
  and edge-case handling.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Binary Search in Java (Iterative and Recursive)

This guide explains the intuition, optimized approach, and Java implementation for binary search in java (iterative and recursive), with practical tips for interviews and production coding standards.

## Problem

Search for a target in a sorted array. Return index if found, else `-1`.

## Why Binary Search

Binary search cuts search space in half at every step, reducing `O(n)` scan to `O(log n)`.

## Iterative Solution (Recommended)

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }

        return -1;
    }
}
```

## Recursive Version

```java
int searchRec(int[] nums, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return searchRec(nums, target, mid + 1, right);
    return searchRec(nums, target, left, mid - 1);
}
```

## Complexity

- Time: `O(log n)`
- Space: Iterative `O(1)`, Recursive `O(log n)`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
