---
title: First Missing Positive in Java
date: '2019-07-14'
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
seo_title: First Missing Positive in Java (LeetCode 41)
seo_description: Find smallest missing positive integer in O(n) time and O(1) extra
  space.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is one of the most famous index-placement problems.
The hard part is not the swap itself, but recognizing that the answer must lie in the range `1..n+1` for an array of length `n`.

---

## Problem 1: First Missing Positive

Problem description:
Given an unsorted integer array, return the smallest missing positive integer using `O(n)` time and `O(1)` extra space.

What we are solving actually:
Most values in the array do not matter. Negatives, zero, and values larger than `n` can never be the first missing positive for an array of length `n`. The real trick is to use the array itself like a hash structure by placing each useful value `x` at index `x - 1`.

What we are doing actually:

1. For each index, keep swapping until the current value is either invalid or in its correct position.
2. A value `x` belongs at index `x - 1`.
3. Ignore values outside `1..n`.
4. After placement, scan for the first index where `nums[i] != i + 1`.

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int correct = nums[i] - 1;

                int temp = nums[i];
                nums[i] = nums[correct];
                nums[correct] = temp; // Place the current value into the slot where it belongs.
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1; // First broken position reveals the smallest missing positive.
            }
        }

        return n + 1; // If 1..n are all present, the answer is the next positive.
    }
}
```

Debug steps:

- print the array after every swap to see values move toward their target indices
- test `[3,4,-1,1]`, `[1,2,0]`, and `[1,1]`
- verify the invariant that once a value is placed correctly, it never needs to move again

---

## Why Only `1..n` Matters

For an array of length `n`, the smallest missing positive must be in:

- `1`
- `2`
- ...
- `n`
- or `n + 1`

So values like:

- `0`
- `-5`
- `100`

cannot be the answer if we are only looking for the first missing positive.

That is what makes the in-place placement trick possible.

---

## Dry Run

Input: `[3,4,-1,1]`, `n = 4`

Placement phase:

1. `i=0`, value `3`
   correct index is `2`
   swap -> `[-1,4,3,1]`

2. `i=1`, value `4`
   correct index is `3`
   swap -> `[-1,1,3,4]`

3. still `i=1`, value `1`
   correct index is `0`
   swap -> `[1,-1,3,4]`

4. remaining values are already correct or irrelevant

Scan phase:

- index `0` has `1` -> correct
- index `1` has `-1` -> expected `2`

Answer: `2`

---

## Why the `while` Loop Is Required

One swap may bring a new valid value into the same index.

Example:

- current position has `4`
- after swapping, it may now contain `1`
- that `1` may also need to move

So one `if` is not enough.
We must keep placing until the current index becomes stable.

---

## The Duplicate Guard

This condition matters:

`nums[nums[i] - 1] != nums[i]`

Without it, duplicates can create an infinite loop.

Example:

- array = `[1,1]`
- both values want index `0`

If we keep swapping equal values, nothing changes.
The guard stops that immediately.

---

## Common Mistakes

1. forgetting the bounds check before using `nums[i] - 1` as an index
2. replacing the `while` with one `if`
3. missing the duplicate guard and causing endless swaps
4. using extra hash structures and violating the space requirement

---

## Boundary Cases

- empty array -> answer `1`
- all negatives -> answer `1`
- `[1,2,3]` -> answer `4`
- duplicates like `[1,1]` -> answer `2`
- large out-of-range values -> ignore them

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- this problem uses the array itself as an in-place index map
- only values in `1..n` matter for the answer
- the first index that breaks `nums[i] == i + 1` reveals the missing positive
