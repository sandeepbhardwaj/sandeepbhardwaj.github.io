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

## Dry Run

Input: `[0,1,0,3,12]`

Pass 1 (copy non-zero):

- write `1` at index `0`
- write `3` at index `1`
- write `12` at index `2`

Array interim: `[1,3,12,3,12]`, `insertPos=3`

Pass 2 (fill zeros):

- set index `3` to `0`
- set index `4` to `0`

Final: `[1,3,12,0,0]`

## Why This Is Stable

Non-zero elements are written in the same order they are encountered.
So relative ordering among non-zero elements is preserved.

## Swap-Based Alternative

Another common approach swaps current non-zero with `insertPos`.
It can reduce writes when there are few zeros, but this two-pass version is simpler and clear.

## Common Mistakes

1. Sorting array (breaks relative order).
2. Using extra array unnecessarily (`O(n)` extra space).
3. Forgetting to zero-fill remainder after compaction.

## Testing Checklist

- all zeros
- no zeros
- zeros only at beginning/end
- alternating zero/non-zero
- single-element array

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- keep non-zero values compacted at the front, then fill rest with zeros.
- maintain relative order of non-zero elements for stable output.
- in-place two-pointer compaction gives linear time and constant extra memory.
