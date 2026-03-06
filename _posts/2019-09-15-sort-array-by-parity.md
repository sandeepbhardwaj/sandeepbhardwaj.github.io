---
title: Sort Array by Parity in Java
date: '2019-09-15'
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
seo_title: Sort Array by Parity in Java (LeetCode 905)
seo_description: Partition array in-place so even numbers come before odd numbers.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This guide explains the intuition, optimized approach, and Java implementation for sort array by parity in java, with practical tips for interviews and production coding standards.

## Problem

Reorder array so all even numbers come first, then odd numbers.

## Two Pointer Partition

- `left` moves until odd
- `right` moves until even
- swap and continue

## Java Solution

```java
class Solution {
    public int[] sortArrayByParity(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            while (left < right && nums[left] % 2 == 0) left++;
            while (left < right && nums[right] % 2 != 0) right--;

            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
        }

        return nums;
    }
}
```

## Dry Run

Input: `[3,1,2,4]`

- `left` stops at `3` (odd), `right` stops at `4` (even) -> swap -> `[4,1,2,3]`
- move pointers inward
- `left` stops at `1`, `right` stops at `2` -> swap -> `[4,2,1,3]`
- pointers cross -> done

Any valid even-first arrangement is acceptable.

## Invariant

During loop:

- all indices `< left` are even
- all indices `> right` are odd

Swaps gradually expand these verified regions.

## Common Mistakes

1. Forgetting `left < right` in inner while loops.
2. Expecting stable relative order from in-place two-pointer solution.
3. Using sort comparator (`O(n log n)`) when linear partition is enough.

## Stable Variant (Extra Space)

If you must preserve original relative order among evens/odds, use additional array/list:

1. append all evens in original order
2. append all odds in original order

This costs `O(n)` extra space.

## Testing Checklist

- all even array
- all odd array
- alternating parity
- single element
- already partitioned input

## Complexity

- Time: `O(n)`
- Space: `O(1)`

Output order inside even or odd groups is not required to be stable.

## Key Takeaways

- two-pointer partitioning solves parity segregation in one pass.
- in-place swaps keep space usage constant.
- correctness depends on advancing pointers only after handling current mismatch/match state.
