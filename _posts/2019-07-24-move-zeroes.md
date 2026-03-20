---
title: Move Zeroes in Java (Stable In-Place)
date: '2019-07-24'
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
seo_title: Move Zeroes in Java (LeetCode 283)
seo_description: Move all zeroes to end while preserving relative order of non-zero
  values.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is a clean array-compaction problem.
The important requirement is not just "put zeroes at the end" but "keep the non-zero elements in the same order."

---

## Problem 1: Move Zeroes

Problem description:
Given an integer array `nums`, move all `0` values to the end while preserving the relative order of the non-zero values. Do this in place.

What we are solving actually:
Sorting would push zeroes around, but it would destroy the original order of the non-zero values. The real job is stable compaction: pack all useful values toward the front, then fill the rest with zeroes.

What we are doing actually:

1. Keep a write pointer `insertPos` for the next non-zero slot.
2. Scan the array from left to right.
3. Write each non-zero value at `insertPos` and advance it.
4. After all non-zero values are compacted, fill the remaining suffix with zeroes.

```java
class Solution {
    public void moveZeroes(int[] nums) {
        int insertPos = 0;

        for (int n : nums) {
            if (n != 0) {
                nums[insertPos++] = n; // Compact non-zero values toward the front in original order.
            }
        }

        while (insertPos < nums.length) {
            nums[insertPos++] = 0; // Everything after the compacted prefix must become zero.
        }
    }
}
```

Debug steps:

- print the array and `insertPos` after each non-zero write
- test `[0,1,0,3,12]`, `[0,0,0]`, and `[1,2,3]`
- verify the invariant that `nums[0..insertPos-1]` always contains the non-zero values seen so far in correct order

---

## Why This Is a Two-Pointer Problem

There are really two logical regions in the array:

- the cleaned prefix where non-zero values should end up
- the unread region we are still scanning

`insertPos` marks the boundary between those two regions.
Every time we see a non-zero element, we extend the cleaned prefix by one.

That is why this belongs to the two-pointers family, even though there is only one explicit index variable in the final code.

---

## Dry Run

Input: `[0,1,0,3,12]`

Pass 1: compact non-zero values

1. read `0` -> skip, `insertPos=0`
2. read `1` -> write at index `0`, array becomes `[1,1,0,3,12]`, `insertPos=1`
3. read `0` -> skip
4. read `3` -> write at index `1`, array becomes `[1,3,0,3,12]`, `insertPos=2`
5. read `12` -> write at index `2`, array becomes `[1,3,12,3,12]`, `insertPos=3`

Pass 2: fill remaining positions with zeroes

1. set index `3` to `0`
2. set index `4` to `0`

Final answer: `[1,3,12,0,0]`

Notice that `1`, `3`, and `12` stay in the same relative order.

---

## Why This Is Stable

We write non-zero values in exactly the order we encounter them.
So if `a` appeared before `b` in the original array and both are non-zero, `a` is written before `b` in the compacted prefix.

That is the key property the problem is testing.

---

## Swap-Based Alternative

Another common solution swaps `nums[i]` with `nums[insertPos]` when a non-zero value appears.
That version is also valid and often written like this:

- scan with `i`
- when `nums[i] != 0`, swap with `insertPos`

The two-pass compaction version is often easier to reason about because the phases are explicit:

- first collect non-zero values
- then zero-fill the rest

---

## Common Mistakes

1. sorting the array, which breaks stable order
2. using an extra array when in-place work is possible
3. forgetting the final zero-fill step after compaction
4. assuming the problem only asks for "all zeroes at the end" and ignoring relative order

---

## Boundary Cases

- all zeroes -> array stays all zeroes
- no zeroes -> array stays unchanged
- zeroes only at the front or only at the back -> still handled correctly
- single element -> either unchanged zero or unchanged non-zero

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- this problem is stable compaction, not sorting
- the write pointer tracks where the next non-zero value belongs
- once you understand the cleaned-prefix invariant, the implementation becomes very simple
