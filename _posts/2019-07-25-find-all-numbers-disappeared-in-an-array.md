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
This is a strong interview problem because it rewards one specific insight:
the input range already gives you an address system.

Once you see that value `v` can map to index `v - 1`, the array itself becomes the bookkeeping structure and the extra-space constraint stops feeling restrictive.

## Quick Summary

| Signal | What it tells you |
| --- | --- |
| values are guaranteed in `1..n` | each value can point to one valid index |
| constant extra space is desirable | use the input array as the visited marker |
| duplicates exist | repeated marking must be harmless |

The key invariant is:
if index `i` is negative after the marking pass, value `i + 1` appeared at least once.

## Problem Statement

Given an array `nums` of length `n` where each value is in the range `[1, n]`, some numbers appear twice and others are missing.
Return all numbers in the range `[1, n]` that do not appear in the array.

## Why the Value Range Changes Everything

Normally, missing-number questions suggest:

- a `HashSet`
- a boolean array
- sorting

This problem gives something stronger:
every value is already a legal index offset.

That means:

- value `1` maps to index `0`
- value `2` maps to index `1`
- ...
- value `n` maps to index `n - 1`

So the array can serve as both the input and the visited structure.

## Optimal Approach

1. iterate through the array
2. map each value `v` to index `v - 1`
3. mark that slot negative
4. in a second pass, any still-positive slot represents a missing value

```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }
        }

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                result.add(i + 1);
            }
        }

        return result;
    }
}
```

## In-Place Marking Idea

The sign is just a cheap "seen" flag:

- negative means the corresponding value appeared
- positive means it never got marked

That is the full trick.
Nothing more complicated is happening.

## Dry Run

Input: `[4,3,2,7,8,2,3,1]`

Marking phase:

1. value `4` -> mark index `3`
2. value `3` -> mark index `2`
3. value `2` -> mark index `1`
4. value `7` -> mark index `6`
5. value `8` -> mark index `7`
6. value `2` -> index `1` already negative
7. value `3` -> index `2` already negative
8. value `1` -> mark index `0`

After marking, indices `4` and `5` stay positive.
So the missing values are `5` and `6`.

## Why `Math.abs` Is Required

During marking, entries become negative.
But the magnitude still tells us which index to target.

If `nums[i]` is `-3`, it still means "value 3 was stored here."

That is why we compute:

```java
int idx = Math.abs(nums[i]) - 1;
```

Without `Math.abs`, the index calculation breaks as soon as earlier marks flip signs.

## Common Mistakes

1. forgetting `Math.abs` when reading the current value
2. adding `i` instead of `i + 1` to the result
3. expecting the input to remain unchanged
4. missing the range-based mapping and using extra memory unnecessarily

## Debug Checklist

- print the array after each marking step
- test `[4,3,2,7,8,2,3,1]` and confirm `[5,6]`
- test `[1,1]` and confirm `[2]`
- test `[1,2,3,4]` and confirm `[]`
- say the invariant out loud: positive means unseen, negative means seen

## Input Mutation Note

This algorithm mutates the input.
That is the trade-off that buys `O(1)` extra space.

If mutation is not allowed, use:

- a boolean array
- or a `HashSet`

Those are simpler, but they cost `O(n)` extra space.

## Pattern Generalization

This same value-to-index trick shows up in:

- first missing positive
- set mismatch
- duplicate-marking array problems

The recurring question is:
can the input range be turned into an in-place address system?

## Complexity

- Time: `O(n)`
- Space: `O(1)` extra, excluding the output list

## Key Takeaways

- The value range `1..n` is the real gift in this problem.
- Sign flipping is just a compact visited marker.
- If index `i` stays positive, value `i + 1` never appeared.
