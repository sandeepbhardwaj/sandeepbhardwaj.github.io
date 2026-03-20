---
title: Find All Numbers Disappeared in an Array in Java
date: '2019-07-25'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- array
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Find All Numbers Disappeared in an Array in Java
seo_description: Use index marking via negation to find missing numbers in O(n) time.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is a good example of using the input array itself as bookkeeping space.
The numbers are constrained to `1..n`, which means each value can point to one meaningful index.

---

## Problem 1: Find All Numbers Disappeared in an Array

Problem description:
Given an array `nums` of length `n` where each value is in the range `[1, n]`, some numbers appear twice and others are missing. Return all numbers in the range `[1, n]` that do not appear in the array.

What we are solving actually:
The array already gives us a built-in mapping from value to index: value `v` corresponds to index `v - 1`. Instead of using a separate set or boolean array, we can mark seen values directly inside `nums`.

What we are doing actually:

1. For each value `v`, map it to index `v - 1`.
2. Mark that target index as negative to mean "this value exists."
3. Use `Math.abs` because earlier markings may already have changed signs.
4. In a second pass, any index still positive corresponds to a missing value.

```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] > 0) {
                nums[idx] = -nums[idx]; // Negative means the value (idx + 1) has been seen.
            }
        }

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                result.add(i + 1); // Positive means this value was never marked as seen.
            }
        }

        return result;
    }
}
```

Debug steps:

- print the array after each marking step to watch sign changes
- test `[4,3,2,7,8,2,3,1]`, `[1,1]`, and `[1,2,3,4]`
- verify the invariant that index `i` being negative means value `i + 1` appeared at least once

---

## In-Place Marking Idea

Because values are guaranteed to be in `[1, n]`:

- value `1` maps to index `0`
- value `2` maps to index `1`
- ...
- value `n` maps to index `n - 1`

So every value can "mark its own slot."
Negative sign becomes a cheap visited flag.

That is the whole trick.

---

## Dry Run

Input: `[4,3,2,7,8,2,3,1]`

Marking phase:

1. value `4` -> mark index `3`
2. value `3` -> mark index `2`
3. value `2` -> mark index `1`
4. value `7` -> mark index `6`
5. value `8` -> mark index `7`
6. value `2` -> index `1` already negative, so do nothing
7. value `3` -> index `2` already negative
8. value `1` -> mark index `0`

After marking, the array has positive values at indices:

- `4`
- `5`

So the missing numbers are:

- `5`
- `6`

---

## Why `Math.abs` Is Required

During marking, entries become negative.
But we still need the original magnitude to figure out which index to mark next.

Example:

- if `nums[i]` is `-3`
- it still represents value `3`

That is why we compute:

- `int idx = Math.abs(nums[i]) - 1`

Without `Math.abs`, the index calculation becomes wrong.

---

## Input Mutation Note

This algorithm mutates the input array.
That is the trade-off that buys `O(1)` extra space.

If mutation is not allowed:

- use a boolean array
- or use a `HashSet`

Those alternatives are simpler conceptually, but they use `O(n)` extra space.

---

## Common Mistakes

1. forgetting `Math.abs` when reading the current value
2. adding `i` instead of `i + 1` to the answer
3. expecting the original input signs to remain unchanged
4. using extra memory when the problem specifically asks for constant extra space

---

## Complexity

- Time: `O(n)`
- Space: `O(1)` extra, excluding the output list

---

## Key Takeaways

- value-to-index mapping is the whole invariant behind this solution
- sign flipping is just a compact "seen" marker
- if index `i` stays positive, then value `i + 1` is missing
