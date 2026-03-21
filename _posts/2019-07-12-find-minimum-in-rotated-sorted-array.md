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
This is one of the most useful "binary search on structure" problems.
We are not searching for a target value. We are searching for the boundary where sorted order breaks and the rotation starts.

---

## Problem 1: Find Minimum in Rotated Sorted Array

Problem description:
Given a sorted array that has been rotated some number of times, return the minimum element. All values are distinct.

What we are solving actually:
The array is not fully sorted anymore, so ordinary binary search for a target does not apply directly. But one powerful fact still remains: at least one side around `mid` is guaranteed to be sorted, and that lets us eliminate half the search range while keeping the true minimum inside it.

What we are doing actually:

1. Keep the search interval `[left, right]` such that the minimum is always inside it.
2. Compare `nums[mid]` with `nums[right]`.
3. If `nums[mid] > nums[right]`, the minimum must be to the right of `mid`.
4. Otherwise, the minimum is at `mid` or to its left, so keep `mid` in the range.

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1; // mid is in the larger left block, so minimum must be after it.
            } else {
                right = mid; // mid could itself be the minimum, so we must keep it.
            }
        }

        return nums[left];
    }
}
```

Debug steps:

- print `left`, `mid`, `right`, `nums[mid]`, and `nums[right]` on each loop
- test `[4,5,6,7,0,1,2]`, `[1,2,3,4,5]`, and `[2,1]`
- verify the invariant that the true minimum index always stays inside `[left, right]`

---

## Binary Search Insight

Comparing with `right` is the cleanest version for this problem.

Why?

Because `nums[right]` belongs to the rightmost sorted segment.
That creates two cases:

- `nums[mid] > nums[right]`
  then `mid` is definitely in the left rotated block, so the minimum must be on the right side

- `nums[mid] <= nums[right]`
  then the subarray from `mid` to `right` is sorted, so the minimum cannot be to the right of `mid` without also being at `mid`

That is why `right = mid`, not `mid - 1`.

---

## Dry Run

Input: `[4,5,6,7,0,1,2]`

1. `left=0`, `right=6`, `mid=3`
   `nums[mid]=7`, `nums[right]=2`
   `7 > 2`, so minimum is right of `mid`
   update `left=4`

2. `left=4`, `right=6`, `mid=5`
   `nums[mid]=1`, `nums[right]=2`
   `1 <= 2`, so minimum is at `mid` or left of it
   update `right=5`

3. `left=4`, `right=5`, `mid=4`
   `nums[mid]=0`, `nums[right]=1`
   `0 <= 1`
   update `right=4`

Now `left == right == 4`, so the answer is `nums[4] = 0`.

---

## Why `right = mid` Is Correct

This is the most common bug in this problem.

When `nums[mid] <= nums[right]`, many people write `right = mid - 1`.
That is wrong because `mid` itself might already be the minimum.

Example:

- array = `[3,4,5,1,2]`
- if `mid` lands on `1`, removing `mid` would throw away the answer

So the correct rule is:

- minimum definitely not at `mid` -> exclude `mid`
- minimum still could be at `mid` -> keep `mid`

---

## Boundary Cases

- no rotation like `[1,2,3,4]` -> answer is the first element
- smallest array size like `[2,1]` -> still works
- single element -> that element is the answer

These all fall out naturally from the same loop.

---

## Duplicate Variant Note

This post covers the distinct-values version.

For the duplicate-value variant:

- if `nums[mid] == nums[right]`, direction is ambiguous
- a common fallback is `right--`

That keeps correctness, but worst-case time can degrade from `O(log n)` to `O(n)`.

---

## Common Mistakes

1. using `right = mid - 1` when `mid` can still be the minimum
2. changing the loop to `left <= right` without adjusting return logic
3. mixing this version with the duplicate-values variant
4. forgetting that this is a boundary-search problem, not a target-search problem

---

## Complexity

- Time: `O(log n)` for distinct values
- Space: `O(1)`

---

## Key Takeaways

- compare `nums[mid]` with `nums[right]` to decide which half is guaranteed safe to discard
- keep `mid` when it can still be the minimum
- this is a strong example of binary search over structural information, not exact value matching
