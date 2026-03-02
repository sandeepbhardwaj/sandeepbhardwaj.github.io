---
title: Remove Duplicates from Sorted Array in Java
date: '2019-07-20'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- two-pointers
- array
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove Duplicates from Sorted Array in Java (LeetCode 26)
seo_description: In-place two-pointer solution for sorted array deduplication.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Remove Duplicates from Sorted Array in Java

This guide explains the intuition, optimized approach, and Java implementation for remove duplicates from sorted array in java, with practical tips for interviews and production coding standards.

## Problem

Remove duplicates from sorted array in-place and return count of unique elements.

## Two Pointer Strategy

- `slow` tracks last unique index
- `fast` scans array
- when new value found, write at `slow + 1`

## Java Solution

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;

        int slow = 0;
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }

        return slow + 1;
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
