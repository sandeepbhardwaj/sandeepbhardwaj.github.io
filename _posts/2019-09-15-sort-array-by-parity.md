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
---

# Sort Array by Parity in Java

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

## Complexity

- Time: `O(n)`
- Space: `O(1)`

Output order inside even or odd groups is not required to be stable.

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
