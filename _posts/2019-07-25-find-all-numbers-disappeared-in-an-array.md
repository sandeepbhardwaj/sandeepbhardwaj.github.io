---
title: Find All Numbers Disappeared in an Array in Java
date: '2019-07-25'
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
seo_title: Find All Numbers Disappeared in an Array in Java
seo_description: Use index marking via negation to find missing numbers in O(n) time.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Find All Numbers Disappeared in an Array in Java

This guide explains the intuition, optimized approach, and Java implementation for find all numbers disappeared in an array in java, with practical tips for interviews and production coding standards.

## Problem

Array contains numbers in range `[1, n]`, with duplicates. Return numbers missing from this range.

## Approach (Index Marking)

For each value `v`, mark index `abs(v)-1` as negative.

After marking, indices that remain positive correspond to missing numbers.

## Java Solution

```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] > 0) nums[idx] = -nums[idx];
        }

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) result.add(i + 1);
        }

        return result;
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(1)` extra (excluding output)

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
