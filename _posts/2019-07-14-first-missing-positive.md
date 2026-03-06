---
title: First Missing Positive in Java
date: '2019-07-14'
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
seo_title: First Missing Positive in Java (LeetCode 41)
seo_description: Find smallest missing positive integer in O(n) time and O(1) extra
  space.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This guide explains the intuition, optimized approach, and Java implementation for first missing positive in java, with practical tips for interviews and production coding standards.

## Problem

Given an unsorted integer array, find the smallest missing positive integer.

## Constraint

Desired complexity: `O(n)` time and `O(1)` extra space.

## Approach (Index Placement)

Place each value `x` (1 <= x <= n) at index `x - 1` using swaps.

After rearrangement, first index `i` where `nums[i] != i + 1` gives answer `i + 1`.

## Java Solution

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int correct = nums[i] - 1;
                int temp = nums[i];
                nums[i] = nums[correct];
                nums[correct] = temp;
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }

        return n + 1;
    }
}
```

## Dry Run

Input: `[3,4,-1,1]`, `n=4`

Placement phase:

1. `i=0`, value `3` should be at index `2` -> swap => `[-1,4,3,1]`
2. `i=1`, value `4` should be at index `3` -> swap => `[-1,1,3,4]`
3. `i=1`, value `1` should be at index `0` -> swap => `[1,-1,3,4]`
4. remaining values either in place or invalid

Scan phase:

- index `0` has `1` (ok)
- index `1` has `-1` (expected `2`) -> answer is `2`

## Why the `while` Loop Is Required

One swap may bring another valid number into the same index.
`while` keeps placing until current index is stable.

Using only one `if` swap per index can leave array partially arranged and produce wrong answer.

## Common Mistakes

1. Forgetting bounds check (`1 <= nums[i] <= n`) before indexing.
2. Infinite loops when duplicates exist (missing `nums[nums[i]-1] != nums[i]` guard).
3. Using extra array/hash set, violating `O(1)` extra-space requirement.

## Testing Checklist

- empty array -> `1`
- all negatives -> `1`
- contiguous positives starting from 1 -> `n + 1`
- duplicates (for example `[1,1]`) -> `2`
- mixed large values (outside `1..n`)

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- index placement (`nums[i]` should be at `nums[i]-1`) gives linear-time missing positive search.
- ignore out-of-range values; only `[1..n]` affects the answer.
- cyclic placement requires careful swap conditions to avoid infinite loops.
