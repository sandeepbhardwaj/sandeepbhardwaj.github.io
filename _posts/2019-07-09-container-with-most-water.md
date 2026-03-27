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
This is a classic two-pointer optimization problem.
The difficulty is not computing an area.
It is proving which boundary can be discarded without missing the optimal answer.

## Quick Summary

| Signal | What it tells you |
| --- | --- |
| answer depends on two ends of a range | think opposite-direction pointers |
| area uses `min(leftHeight, rightHeight)` | the shorter wall is the bottleneck |
| width shrinks every move | any future improvement must come from height |

The key invariant is:
once one wall is the shorter side, keeping that same wall while shrinking width cannot produce a better answer.

## Problem Statement

Given an array `height`, choose two indices `i` and `j` to form a container.
The amount of water it holds is:

`min(height[i], height[j]) * (j - i)`

Return the maximum possible area.

## Why Brute Force Misses the Pattern

Brute force checks every pair of lines, which is `O(n^2)`.
That works, but it ignores the structure of the formula.

Area depends on two things:

- width: `j - i`
- limiting height: `min(height[i], height[j])`

When we move inward, width always gets smaller.
So if a later container is going to be better, the limiting height must improve enough to offset that lost width.

That is the whole reason a linear scan becomes possible.

## Optimal Approach

1. start with the widest possible container: leftmost and rightmost walls
2. compute its area
3. move the pointer at the shorter wall
4. keep the best area seen so far

Why move the shorter wall?
Because it is the current bottleneck.
Moving the taller wall keeps the same limiting height while shrinking width, so that move cannot help.

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
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

## Why Moving the Shorter Side Is Correct

Suppose:

- left height = `2`
- right height = `10`

The current water height is limited by `2`.
If we move the right wall inward:

- width gets smaller
- the limiting height is still at most `2`

So that move cannot improve the answer.

The only rational hope is to move the shorter wall and search for a taller bottleneck.

## Dry Run

Input: `[1,8,6,2,5,4,8,3,7]`

1. `left=0 (1)`, `right=8 (7)`
   area = `1 * 8 = 8`
   move `left`
2. `left=1 (8)`, `right=8 (7)`
   area = `7 * 7 = 49`
   best = `49`
   move `right`
3. `left=1 (8)`, `right=7 (3)`
   area = `3 * 6 = 18`
   move `right`
4. continue inward

No later container beats `49`, so the answer is `49`.

## Visual Intuition

```text
left                             right
  v                                v
[ 1, 8, 6, 2, 5, 4, 8, 3, 7 ]

Current area is limited by the shorter wall.
If that shorter wall stays the same and width shrinks, the area cannot improve.
```

That is why the shorter wall is the only side worth discarding.

## Common Mistakes

1. moving both pointers every round
2. moving the taller wall by default
3. using `left <= right` and evaluating zero-width containers
4. memorizing the rule without understanding the limiting-height argument

## Debug Checklist

- print `left`, `right`, both heights, and area each iteration
- test `[1,1]` to confirm the smallest valid case
- test `[1,8,6,2,5,4,8,3,7]` and confirm the answer is `49`
- say the invariant out loud: the shorter wall is the only useful side to move

## Pattern Generalization

This belongs to the same family as:

- `Two Sum II`
- `Valid Palindrome`
- `3Sum` after sorting

The common question is:
which move safely discards impossible candidates without losing the optimum?

## Complexity

- Time: `O(n)`
- Space: `O(1)`

## Key Takeaways

- This is a pruning argument disguised as a two-pointer problem.
- The shorter wall is the current bottleneck, so it is the only side worth moving.
- Width always decreases, so later improvement can only come from a better limiting height.
