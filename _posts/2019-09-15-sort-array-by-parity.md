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
This problem sounds like sorting, but the real job is partitioning.
We do not need the even numbers in ascending order or the odd numbers in ascending order.
We only need the array divided into two groups: evens first, odds after.

Once you notice that, the problem becomes a clean two-pointer partition instead of an unnecessary full sort.

## Quick Summary

| Signal | What it means |
| --- | --- |
| "Any valid arrangement" | relative order inside each group does not matter |
| in-place output | we should mutate the array instead of building another one |
| even vs odd classification | every element belongs to one of two buckets |

The core invariant is:
everything before `left` is already in the even region, and everything after `right` is already in the odd region.

## Problem Statement

Given an integer array `nums`, reorder it in place so that all even numbers appear before all odd numbers.
Any valid arrangement is acceptable.

That last sentence matters a lot.
It removes the need for stability and removes the need for real sorting.

## The Right Mental Model

Think of the array as three regions:

```text
[ confirmed evens | unknown region | confirmed odds ]
         left                        right
```

`left` moves forward looking for the first odd value that does not belong in the even prefix.
`right` moves backward looking for the first even value that does not belong in the odd suffix.
When both pointers stop, those two values are misplaced relative to the partition, so we swap them.

That is the same pattern behind many in-place partition problems:

- move all negatives to one side
- partition around a pivot
- group values by a binary property

## Java Solution

```java
class Solution {
    public int[] sortArrayByParity(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            while (left < right && nums[left] % 2 == 0) {
                left++;
            }

            while (left < right && nums[right] % 2 != 0) {
                right--;
            }

            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
        }

        return nums;
    }
}
```

## Why This Works

When `nums[left]` is even, it already belongs in the left partition, so moving `left` forward is always safe.

When `nums[right]` is odd, it already belongs in the right partition, so moving `right` backward is always safe.

When both loops stop:

- `nums[left]` is odd and sitting too far left
- `nums[right]` is even and sitting too far right

Swapping them fixes both mistakes at once.

Every iteration shrinks the unknown region.
That is why the algorithm finishes in linear time.

## Dry Run

Input:

```text
[3, 1, 2, 4]
```

Initial state:

- `left = 0`
- `right = 3`

Step 1:

- `nums[left] = 3`, so `left` stops immediately
- `nums[right] = 4`, so `right` stops immediately
- swap indices `0` and `3`

Array becomes:

```text
[4, 1, 2, 3]
```

Step 2:

- `left` moves from index `0` to `1` because `4` is already even
- `nums[left] = 1`, so `left` stops
- `right` moves from index `3` to `2` because `3` is already odd
- `nums[right] = 2`, so `right` stops
- swap indices `1` and `2`

Array becomes:

```text
[4, 2, 1, 3]
```

Now `left` and `right` cross, so we stop.
This is a valid answer because every even number is before every odd number.

## Common Mistakes

### Treating it like a real sort

If you call a general sorting API with a parity-based comparator, you are solving a simpler problem with a heavier tool.
The partition solution is both faster and easier to explain.

### Forgetting the inner `left < right` guards

Without those guards, one pointer can run past the other and cause unnecessary swaps or index mistakes.

### Assuming stability

This in-place partition does not preserve the original order among evens or among odds.
That is fine here because the problem does not require it.

### Not naming the invariant

If you only say "use two pointers," the solution sounds memorized.
A stronger explanation is:
"Everything before `left` is already valid even-region output, and everything after `right` is already valid odd-region output."

## Stable Variant

If the requirement changed to:
"keep the original order of evens and keep the original order of odds,"
then this in-place approach is no longer the best fit.

A simple stable version is:

1. collect evens in order
2. collect odds in order
3. write them back

That uses `O(n)` extra space, but it preserves order and keeps the reasoning simple.

This tradeoff appears often in interviews:
in-place partition is great when order does not matter, but stability usually costs extra memory or more complex rotation logic.

## Boundary Cases

- all even: array stays valid with no meaningful swaps
- all odd: array stays valid with no meaningful swaps
- one element: already partitioned
- alternating parity: pointers will perform multiple swaps, but still only linear work overall

## Complexity

- Time: `O(n)`
- Space: `O(1)`

Each element is examined at most a small constant number of times.
No auxiliary array is needed.

## What This Pattern Generalizes To

This is one example of a broader interview pattern:
binary partition with two pointers.

The same reasoning helps with:

- partitioning values around a pivot
- moving zeroes or negatives into a target region
- grouping values by a yes/no predicate

The reusable lesson is:
once each element belongs to one of two regions, opposite-direction pointers are often enough.

## Key Takeaways

- The word "sort" is misleading here. This is a partition problem.
- The invariant is more important than the code: even prefix on the left, odd suffix on the right.
- In-place partition is optimal when stability is not required.
- If order inside each group matters, use a different approach instead of forcing stability into the swap-based version.
