---
title: Remove Duplicates from Sorted Array in Java
date: '2019-07-20'
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
seo_title: Remove Duplicates from Sorted Array in Java (LeetCode 26)
seo_description: In-place two-pointer solution for sorted array deduplication.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is the array version of sorted duplicate compaction.
Because the input is sorted, duplicates appear in blocks, which makes one-pass in-place deduplication possible.

---

## Problem 1: Remove Duplicates from Sorted Array

Problem description:
Given a sorted array `nums`, remove the duplicates in place so that each unique value appears only once, and return the number of unique elements.

What we are solving actually:
We are not cleaning the whole array in the sense of physically shrinking it. We are building a valid unique prefix at the front. Only the first `k` positions matter after the operation.

What we are doing actually:

1. Let `slow` mark the end of the unique prefix.
2. Let `fast` scan the array from left to right.
3. When `nums[fast]` is a new value, grow the unique prefix and copy it there.
4. Return the length of that prefix as `slow + 1`.

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        int slow = 0;
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast]; // Write the next unique value at the end of the unique prefix.
            }
        }

        return slow + 1;
    }
}
```

Debug steps:

- print `slow`, `fast`, and the prefix `nums[0..slow]` after each unique write
- test `[]`, `[1,1,1]`, and `[0,0,1,1,1,2,2,3,3,4]`
- verify the invariant that `nums[0..slow]` always contains the unique values seen so far in sorted order

---

## Why Sorted Order Makes This Easy

If the array were unsorted, duplicates could appear anywhere and we would need a set or sorting first.

Because the array is sorted:

- all equal values are adjacent
- once `fast` moves past a value block, we never need to revisit it

That turns the problem into simple compaction:

- keep one copy
- skip the rest

---

## Dry Run

Input: `[0,0,1,1,1,2,2,3,3,4]`

1. start: `slow=0` and unique prefix is `[0]`
2. `fast=1`, value `0` -> duplicate, skip
3. `fast=2`, value `1` -> new value
   increment `slow` to `1`
   write `nums[1] = 1`
4. `fast=3,4`, values `1` -> duplicates, skip
5. `fast=5`, value `2` -> new value
   write at next unique slot
6. continue similarly

Final unique prefix:

- `[0,1,2,3,4]`

Return value:

- `5`

---

## Important Output Rule

After the function returns `k`:

- only indices `0..k-1` are guaranteed meaningful

The rest of the array may still contain old values.
That is normal and allowed by the problem.

---

## Common Mistakes

1. forgetting the empty-array check
2. expecting the entire array after `k` to be cleaned
3. comparing with `nums[fast - 1]` after in-place writes instead of with the confirmed unique boundary
4. not recognizing that this is prefix compaction

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- sorted order turns deduplication into one-pass prefix compaction
- `slow` marks the end of the unique prefix
- the answer is the new prefix length, not a resized array

---

## Pattern Extension

One good review question for remove duplicates from sorted array in java is whether the same invariant still holds when the input becomes degenerate: empty arrays, repeated values, already-sorted data, or the smallest possible string. That quick pressure test usually reveals whether we truly understood the pattern or only copied the happy path.
