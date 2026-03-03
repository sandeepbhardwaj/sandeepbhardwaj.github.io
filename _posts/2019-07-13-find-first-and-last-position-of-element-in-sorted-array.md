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

## Why Two Binary Searches

A standard binary search can find one matching index, but not guaranteed boundaries.
Boundary queries need directional bias:

- first index: continue searching left even after match
- last index: continue searching right even after match

That is why two focused searches are cleaner and safer.

## Dry Run

`nums = [5,7,7,8,8,10]`, `target = 8`

- first search returns `3`
- last search returns `4`

Output: `[3,4]`

For `target = 6`, first search returns `-1`, so output is `[-1,-1]`.

## Common Mistakes

1. Stopping immediately when target is found (misses boundaries).
2. Reusing one binary-search function without boundary-specific logic.
3. Forgetting to handle empty input.
4. Off-by-one errors in `left/right` updates.

## Alternative Bound-Based Formulation

You can compute:

- `left = lowerBound(target)`
- `right = lowerBound(target + 1) - 1`

Then validate `left` is in range and equals target.

This approach is concise and generalizes to frequency queries.

## Testing Checklist

- empty array
- target absent
- single occurrence target
- all elements equal to target
- target at first index and last index

## Complexity

- Time: `O(log n)`
- Space: `O(1)`

## Key Takeaways

- find first and last positions using two boundary-focused binary searches.
- lower-bound and upper-bound logic should be implemented separately for clarity.
- boundary bugs are common, so verify with absent target and duplicate-heavy cases.
