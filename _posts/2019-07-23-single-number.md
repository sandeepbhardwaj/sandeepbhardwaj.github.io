---
title: Single Number in Java Using XOR
date: '2019-07-23'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- bit-manipulation
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Single Number in Java Using XOR (LeetCode 136)
seo_description: Find unique element in array where all others appear twice using
  XOR.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Single Number in Java Using XOR

This guide explains the intuition, optimized approach, and Java implementation for single number in java using xor, with practical tips for interviews and production coding standards.

## Problem

Every element appears twice except one. Find that one.

## Why XOR Works

- `a ^ a = 0`
- `a ^ 0 = a`
- XOR is commutative and associative

Pair values cancel out, unique value remains.

## Java Solution

```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int n : nums) {
            result ^= n;
        }
        return result;
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
