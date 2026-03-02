---
title: Container With Most Water in Java
date: '2019-07-09'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- two-pointers
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Container With Most Water in Java - Two Pointers
seo_description: Solve LeetCode 11 using two pointers with proof intuition and O(n)
  complexity.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Container With Most Water in Java

This guide explains the intuition, optimized approach, and Java implementation for container with most water in java, with practical tips for interviews and production coding standards.

## Problem

Given heights of vertical lines, find two lines forming a container with maximum water.

## Brute Force vs Optimal

- Brute force: check all pairs -> `O(n^2)`
- Optimal: two pointers from both ends -> `O(n)`

## Key Insight

Area = `min(height[left], height[right]) * (right - left)`.

Move the pointer with smaller height, because moving the taller one cannot increase the limiting height.

## Java Solution

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int best = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            best = Math.max(best, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
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
