---
title: Binary Search in Java (Iterative and Recursive)
date: '2019-07-08'
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
seo_title: Binary Search in Java - Iterative and Recursive
seo_description: Binary search in Java with iterative and recursive implementations
  and edge-case handling.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Binary Search in Java (Iterative and Recursive)

This guide explains the intuition, optimized approach, and Java implementation for binary search in java (iterative and recursive), with practical tips for interviews and production coding standards.

## Problem

Search for a target in a sorted array. Return index if found, else `-1`.

## Why Binary Search

Binary search cuts search space in half at every step, reducing `O(n)` scan to `O(log n)`.

## Iterative Solution (Recommended)

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }

        return -1;
    }
}
```

## Recursive Version

```java
int searchRec(int[] nums, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return searchRec(nums, target, mid + 1, right);
    return searchRec(nums, target, left, mid - 1);
}
```

## Invariant You Should Track

Maintain this invariant through every loop:

- if target exists, it is always inside `[left, right]`

When `nums[mid] < target`, discard left half by moving `left = mid + 1`.
When `nums[mid] > target`, discard right half by moving `right = mid - 1`.

This invariant is the reason binary search is correct.

## Dry Run

Array: `[1, 3, 5, 7, 9, 11]`, target: `7`

1. `left=0`, `right=5`, `mid=2` (`5`) -> move `left=3`
2. `left=3`, `right=5`, `mid=4` (`9`) -> move `right=3`
3. `left=3`, `right=3`, `mid=3` (`7`) -> found

## Common Variants

- first occurrence of target (lower bound)
- last occurrence of target (upper bound - 1)
- insertion position for target
- binary search on answer space (minimum feasible value)

Master these variants by adjusting boundary updates, not by rewriting from scratch.

## Common Mistakes

1. Using `while (left < right)` with wrong boundary updates.
2. Mid overflow in languages with fixed int range (`(l + r) / 2` risk).
3. Returning wrong pointer when target is absent in bound variants.
4. Applying binary search to unsorted data.

## Testing Checklist

- empty array
- one-element present and absent cases
- target at first and last index
- absent target between existing values
- duplicate-heavy arrays for first/last occurrence variants

## Complexity

- Time: `O(log n)`
- Space: Iterative `O(1)`, Recursive `O(log n)`

## Key Takeaways

- binary search correctness comes from maintaining a valid search interval invariant.
- boundary updates (`left = mid + 1`, `right = mid - 1`) must match loop condition to avoid off-by-one bugs.
- master lower/upper bound variants by changing interval rules, not by rewriting the entire algorithm.
