---
title: Move Zeroes in Java (Stable In-Place)
date: '2019-07-24'
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
seo_title: Move Zeroes in Java (LeetCode 283)
seo_description: Move all zeroes to end while preserving relative order of non-zero
  values.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Move Zeroes in Java (Stable In-Place)

This guide explains the intuition, optimized approach, and Java implementation for move zeroes in java (stable in-place), with practical tips for interviews and production coding standards.

## Problem

Move all `0`s to end while preserving non-zero order.

## Approach

Use write index `insertPos` for next non-zero value.

1. Copy non-zero values forward.
2. Fill remaining positions with zero.

## Java Solution

```java
class Solution {
    public void moveZeroes(int[] nums) {
        int insertPos = 0;

        for (int n : nums) {
            if (n != 0) {
                nums[insertPos++] = n;
            }
        }

        while (insertPos < nums.length) {
            nums[insertPos++] = 0;
        }
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
