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
This is a partition problem, not a sorting problem.
We do not care about the exact order inside the even group or the odd group, only that all even numbers come first.

---

## Problem 1: Sort Array by Parity

Problem description:
Given an integer array `nums`, reorder it in place so that all even numbers appear before all odd numbers. Any valid arrangement is acceptable.

What we are solving actually:
The word "sort" is misleading here. We are not asked to fully order the array. We just need to partition it into two groups. That means a linear-time two-pointer partition is enough.

What we are doing actually:

1. Move `left` forward until it finds an odd number in the wrong region.
2. Move `right` backward until it finds an even number in the wrong region.
3. Swap those two misplaced values.
4. Continue until the pointers cross.

```java
class Solution {
    public int[] sortArrayByParity(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            while (left < right && nums[left] % 2 == 0) {
                left++; // This value already belongs to the even prefix.
            }

            while (left < right && nums[right] % 2 != 0) {
                right--; // This value already belongs to the odd suffix.
            }

            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp; // Swap the misplaced odd/even pair into correct regions.
        }

        return nums;
    }
}
```

Debug steps:

- print `left`, `right`, and the array after each swap
- test `[3,1,2,4]`, `[2,4,6]`, and `[1,3,5]`
- verify the invariant that all indices `< left` are even and all indices `> right` are odd

---

## Two-Pointer Partition Idea

The array gradually splits into three regions:

- confirmed evens on the left
- unknown values in the middle
- confirmed odds on the right

`left` and `right` shrink the unknown region until nothing remains.
This is exactly the same partition style used in many quicksort-like and array-rearrangement problems.

---

## Dry Run

Input: `[3,1,2,4]`

1. `left` stops at `3` because it is odd
2. `right` stops at `4` because it is even
3. swap -> array becomes `[4,1,2,3]`

Continue:

4. `left` stops at `1`
5. `right` stops at `2`
6. swap -> array becomes `[4,2,1,3]`

Pointers cross, so we stop.

Any even-first arrangement is valid, so `[4,2,1,3]` is a correct answer.

---

## Why This Is Not Stable

This in-place partition does not preserve original relative order.

Example:

- input evens: `2, 4`
- output may still contain `2, 4`, but stability is not guaranteed in general

That is fine because the problem does not require stability.
If stable order is required, extra space is usually the simpler solution.

---

## Stable Variant

For a stable version:

1. collect all evens in original order
2. collect all odds in original order
3. write them back

That costs `O(n)` extra space, but preserves the original order inside each group.

---

## Common Mistakes

1. expecting the in-place partition to be stable
2. forgetting `left < right` in the inner loops
3. using full sorting with a comparator when partitioning is enough
4. not recognizing that this is closer to partition than to sorting

---

## Boundary Cases

- all even -> unchanged
- all odd -> unchanged
- alternating parity -> several swaps
- single element -> unchanged

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- this is an in-place partition problem, not a full sorting problem
- the invariant is: even prefix on the left, odd suffix on the right
- if stable order matters, use extra space instead of forcing it into the partition version
