---
title: Find Minimum in Rotated Sorted Array in Java
date: '2019-07-12'
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
seo_title: Find Minimum in Rotated Sorted Array in Java (LeetCode 153)
seo_description: Binary search approach to find minimum element in rotated sorted
  array.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Find Minimum in Rotated Sorted Array in Java

Given a rotated sorted array with distinct values, find the minimum element in `O(log n)`.

---

## Binary Search Insight

Use comparison with right boundary:

- if `nums[mid] > nums[right]`, minimum is in right half (excluding `mid`)
- else, minimum is in left half including `mid`

This keeps minimum index inside `[left, right]` at every step.

---

## Java Solution

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return nums[left];
    }
}
```

---

## Dry Run

Input: `[4,5,6,7,0,1,2]`

1. `left=0`, `right=6`, `mid=3`, `nums[mid]=7`, `nums[right]=2`  
   `7 > 2` -> minimum is right side, `left=4`
2. `left=4`, `right=6`, `mid=5`, `nums[mid]=1`, `nums[right]=2`  
   `1 <= 2` -> minimum is left side including `mid`, `right=5`
3. `left=4`, `right=5`, `mid=4`, `nums[mid]=0`, `nums[right]=1`  
   `0 <= 1` -> `right=4`

Now `left == right == 4`, answer is `nums[4] = 0`.

---

## Common Mistakes

1. using `right = mid - 1` in `else` branch (can remove true minimum at `mid`)
2. writing loop as `left <= right` and returning wrong boundary
3. mixing this logic with duplicate-value variant

---

## Duplicate Variant Note (LeetCode 154)

With duplicates, if `nums[mid] == nums[right]`, direction is ambiguous.
Fallback is typically `right--`, which can degrade worst-case to `O(n)`.

---

## Complexity

- Time: `O(log n)` for distinct values
- Space: `O(1)`

---

## Key Takeaways

- this is a boundary-elimination binary search problem.
- compare with `right` to decide which half is guaranteed sorted.
- always keep `mid` in range when it can still be the minimum.
