---
title: Find First and Last Position of Element in Sorted Array
date: '2019-07-13'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- binary-search
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Find First and Last Position in Sorted Array - Java
seo_description: Use two binary searches to find leftmost and rightmost target index
  in sorted array.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This problem looks like ordinary binary search, but one match is not enough.
We need the full boundary of the target block, so we intentionally bias one search left and another search right.

---

## Problem 1: Find First and Last Position of Element in Sorted Array

Problem description:
Given a sorted array `nums` and a target value, return the first and last indices where the target appears. If the target does not exist, return `[-1, -1]`.

What we are solving actually:
Normal binary search can tell us that the target exists, but it does not guarantee the leftmost or rightmost position. The hidden task is really two boundary queries: "where does the target block start?" and "where does it end?"

What we are doing actually:

1. Run one binary search that keeps searching left after a match to find the first index.
2. If the target is absent, return `[-1, -1]` immediately.
3. Run another binary search that keeps searching right after a match to find the last index.
4. Return both boundaries.

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = firstIndex(nums, target);
        if (first == -1) return new int[]{-1, -1};

        int last = lastIndex(nums, target);
        return new int[]{first, last};
    }

    private int firstIndex(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] >= target) {
                right = mid - 1; // Keep searching left because a boundary might exist earlier.
            } else {
                left = mid + 1;
            }

            if (nums[mid] == target) {
                ans = mid; // Record match, but do not stop; we still want the leftmost one.
            }
        }

        return ans;
    }

    private int lastIndex(int[] nums, int target) {
        int left = 0, right = nums.length - 1, ans = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] <= target) {
                left = mid + 1; // Keep searching right because a later boundary might exist.
            } else {
                right = mid - 1;
            }

            if (nums[mid] == target) {
                ans = mid; // Record match, but do not stop; we still want the rightmost one.
            }
        }

        return ans;
    }
}
```

Debug steps:

- print `left`, `mid`, `right`, and `ans` during both searches
- test `[5,7,7,8,8,10]` with targets `8` and `6`
- verify the invariant that `ans` stores the best boundary found so far while the search continues in the needed direction

---

## Why Two Binary Searches

A plain binary search stops as soon as it finds any matching index.
That is not enough here because duplicates create a whole block of equal values.

So we split the problem:

- first index search = left-biased search
- last index search = right-biased search

This separation keeps the logic clear and prevents tricky mixed-branch bugs.

---

## Dry Run

Input: `nums = [5,7,7,8,8,10]`, `target = 8`

First-index search:

1. `mid=2`, value `7` -> move right
2. `mid=4`, value `8` -> record `ans=4`, keep searching left
3. `mid=3`, value `8` -> record `ans=3`, keep searching left

First index = `3`

Last-index search:

1. `mid=2`, value `7` -> move right
2. `mid=4`, value `8` -> record `ans=4`, keep searching right
3. `mid=5`, value `10` -> move left

Last index = `4`

Answer: `[3, 4]`

---

## Why Not Stop on First Match

Stopping on the first match gives the wrong answer when duplicates exist.

Example:

- array: `[2,2,2,2]`
- target: `2`

Any random match is not enough.
We need the full range:

- first = `0`
- last = `3`

That is why the searches continue even after a match is found.

---

## Alternative Bound Formulation

Another common approach is:

- `left = lowerBound(target)`
- `right = lowerBound(target + 1) - 1`

That version is elegant and generalizes well.
The explicit first/last search approach is often easier to teach because the directional bias is visible in the code.

---

## Common Mistakes

1. returning immediately when `nums[mid] == target`
2. trying to reuse one generic binary-search function without clear boundary rules
3. forgetting to handle the target-absent case
4. mixing left-biased and right-biased updates incorrectly

---

## Boundary Cases

- empty array -> `[-1, -1]`
- target absent -> `[-1, -1]`
- one occurrence -> both indices are the same
- all elements equal to target -> answer is full array range
- target at first or last position -> still handled cleanly

---

## Complexity

- Time: `O(log n)`
- Space: `O(1)`

---

## Key Takeaways

- this is really two boundary binary searches, not one ordinary search
- after a match, keep searching in the boundary direction you care about
- duplicate-heavy tests are the best way to catch logic bugs here
