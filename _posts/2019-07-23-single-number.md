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
Given an integer array where every value appears exactly twice except one value, return the value that appears once.

---

## Problem Example

Input: `[4, 1, 2, 1, 2]`  
Output: `4`

---

## Why XOR Solves It

XOR properties:

- `a ^ a = 0`
- `a ^ 0 = a`
- XOR is associative and commutative

So all duplicate pairs cancel out, and only the unique number remains.

---

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

---

## Dry Run

Input: `[4, 1, 2, 1, 2]`

- start: `result = 0`
- `result ^= 4` -> `4`
- `result ^= 1` -> `5`
- `result ^= 2` -> `7`
- `result ^= 1` -> `6`
- `result ^= 2` -> `4`

Final answer: `4`

---

## Why Order Does Not Matter

Because XOR is commutative and associative, duplicates cancel regardless of position.
That is why we can solve in one pass without sorting.

---

## Edge Cases

- single element array: `[x]` returns `x`
- negative numbers are handled correctly (XOR works on bit patterns)
- `0` values are also safe (`0 ^ x = x`)

---

## Common Mistakes

1. Sorting first (`O(n log n)`), which is unnecessary.
2. Using frequency map (`O(n)` extra space) when `O(1)` is possible.
3. Applying this approach to wrong variant (for "appears three times" use bit counting).

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- XOR cancellation is the full invariant behind the solution.
- this is one of the cleanest examples of bit manipulation removing extra memory.
- always verify problem variant before applying this pattern.
