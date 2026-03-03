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

# Remove Duplicates from Sorted Array in Java

Given a sorted array, remove duplicates in-place so each unique value appears once.
Return the number of unique elements.

---

## Two-Pointer Invariant

- `slow` marks last unique element position
- `fast` scans from left to right
- when `nums[fast] != nums[slow]`, move `slow` forward and copy value

Because array is sorted, duplicates are adjacent, so this one pass is enough.

---

## Java Solution

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
                nums[slow] = nums[fast];
            }
        }

        return slow + 1;
    }
}
```

---

## Dry Run

Input: `[0,0,1,1,1,2,2,3,3,4]`

- start: `slow=0` (`0` is first unique)
- `fast=1` value `0` equals `nums[slow]`, skip
- `fast=2` value `1` differs, `slow=1`, write `nums[1]=1`
- `fast=3,4` both `1`, skip
- `fast=5` value `2` differs, `slow=2`, write `nums[2]=2`
- `fast=7` value `3` differs, `slow=3`, write `nums[3]=3`
- `fast=9` value `4` differs, `slow=4`, write `nums[4]=4`

Return `slow + 1 = 5`.
Valid prefix becomes `[0,1,2,3,4]`.

---

## Important Note About Output Array

Only first `k` positions are meaningful after operation.
Elements beyond `k` can contain old values and should be ignored.

---

## Common Mistakes

1. forgetting empty-array check
2. comparing with `nums[fast - 1]` after in-place writes
3. assuming full array is cleaned instead of only prefix `[0..k-1]`

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- sorted order makes adjacent duplicate compaction possible.
- `slow` always points to end of unique prefix.
- two pointers give in-place deduplication in linear time.
