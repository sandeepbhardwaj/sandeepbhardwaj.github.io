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
This problem is not about sorting.
It is about stable compaction.

We want all useful values packed at the front in their original order, and everything else pushed to the back.
Once you see it that way, the solution becomes a clean write-boundary problem.

## Quick Summary

| Signal | What it means |
| --- | --- |
| keep relative order of non-zero values | the compaction must be stable |
| in-place update required | no extra array should be necessary |
| zeros are just filler | treat non-zero values as the real payload |

The invariant is:
`nums[0..insertPos-1]` always contains the non-zero values seen so far, in their original order.

## Problem Statement

Given an integer array `nums`, move all zeroes to the end while preserving the relative order of the non-zero values.
Do the work in place.

## The Real Pattern

Think of the array as two logical regions:

- a finalized prefix containing the compacted non-zero values
- an unread suffix we are still scanning

`insertPos` marks the first slot where the next non-zero value should go.

That makes this a fast/slow compaction pattern:

- read from one side
- write compacted results to the front
- zero-fill whatever remains afterward

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

## Why This Works

Every non-zero value is copied forward exactly once, in encounter order.
So stability is preserved automatically.

After that first pass:

- the prefix `[0..insertPos-1]` is correct
- nothing to the right matters anymore

The second pass simply turns the leftover suffix into zeroes.

That separation is what makes the solution easy to reason about.

## Dry Run

Input:

```text
[0, 1, 0, 3, 12]
```

Start:

- `insertPos = 0`

Scan:

1. see `0` -> ignore it
2. see `1` -> write at `nums[0]`, now `insertPos = 1`
3. see `0` -> ignore it
4. see `3` -> write at `nums[1]`, now `insertPos = 2`
5. see `12` -> write at `nums[2]`, now `insertPos = 3`

Array after compaction phase:

```text
[1, 3, 12, 3, 12]
```

Now fill the remaining suffix with zeroes:

```text
[1, 3, 12, 0, 0]
```

That is the answer.

## Why It Is Stable

Suppose non-zero value `a` appears before non-zero value `b`.
The loop encounters `a` first and writes it first.
Then it encounters `b` and writes it later.

So their relative order is preserved.

That is the entire difference between this and a careless swap-heavy approach that might accidentally disturb order.

## A Valid Alternative

You can also solve this with explicit read and write pointers:

- `fast` scans every position
- `slow` marks the next non-zero destination

The current implementation compresses that idea into one write pointer because the element value itself is enough to drive the decision.

## Common Mistakes

1. Sorting the array.
   That moves zeroes, but it also destroys stable order.
2. Forgetting the zero-fill phase.
   Then stale values remain in the suffix.
3. Using an extra array when the problem explicitly allows in-place compaction.
4. Thinking this is about "move zeroes" instead of "keep non-zero values stable."

## Boundary Cases

- `[0, 0, 0]` -> unchanged
- `[1, 2, 3]` -> unchanged
- `[0]` -> unchanged
- `[4]` -> unchanged
- zeroes only at the front or only at the back -> still handled correctly

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Pattern Generalization

This same compaction mindset appears in:

- Remove Element
- Remove Duplicates from Sorted Array
- partition-style in-place rewrites

The general question is:
what should the finalized prefix represent after scanning the first `k` elements?

## Key Takeaways

- Move Zeroes is a stable in-place compaction problem.
- The write pointer marks the boundary of the correct non-zero prefix.
- Once the prefix is right, the rest of the array can simply be zero-filled.
