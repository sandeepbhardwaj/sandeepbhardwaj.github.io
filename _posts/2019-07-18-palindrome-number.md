---
title: Palindrome Number in Java (Without String Conversion)
date: '2019-07-18'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- math
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Palindrome Number in Java Without Converting to String
seo_description: Check if integer is palindrome by reversing only half the number.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Palindrome Number in Java (Without String Conversion)

This guide explains the intuition, optimized approach, and Java implementation for palindrome number in java (without string conversion), with practical tips for interviews and production coding standards.

## Problem

Determine if integer `x` is palindrome.

## Better Approach

Instead of reversing full number (risk overflow), reverse only half and compare.

## Java Solution

```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;

        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }

        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

## Complexity

- Time: `O(log10 n)`
- Space: `O(1)`

## Edge Cases

- Negative numbers -> false
- `0` -> true
- Numbers ending with `0` (except `0`) -> false

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
