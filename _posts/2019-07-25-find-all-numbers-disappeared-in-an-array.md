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

# Find All Numbers Disappeared in an Array in Java

Given an array `nums` of size `n` where values are in range `[1, n]`, some numbers appear twice and others are missing.
Return all missing numbers.

---

## In-Place Marking Idea

Use each value `v` as an index marker:

- map value `v` to index `v - 1`
- make `nums[v - 1]` negative to mark "seen"

After one pass, any index still positive means that value (`index + 1`) was never seen.

---

## Java Solution

```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int idx = Math.abs(nums[i]) - 1;
            if (nums[idx] > 0) {
                nums[idx] = -nums[idx];
            }
        }

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                result.add(i + 1);
            }
        }

        return result;
    }
}
```

---

## Dry Run

Input: `[4,3,2,7,8,2,3,1]`

Mark phase:

- `4` -> mark index `3`
- `3` -> mark index `2`
- `2` -> mark index `1`
- `7` -> mark index `6`
- `8` -> mark index `7`
- `2` -> index `1` already negative
- `3` -> index `2` already negative
- `1` -> mark index `0`

After marking, indices `4` and `5` remain positive.
So missing numbers are `[5, 6]`.

---

## Why `Math.abs` Is Required

During marking, values become negative.
We still need original magnitude to compute target index, so use `Math.abs(nums[i])`.

---

## Input Mutation Note

This approach mutates `nums` to achieve `O(1)` extra space.
If mutation is not allowed, use a boolean array or set (`O(n)` extra space).

---

## Common Mistakes

1. forgetting `Math.abs`, causing invalid index access
2. adding `i` instead of `i + 1` to output
3. assuming solution preserves original input order/sign

---

## Complexity

- Time: `O(n)`
- Space: `O(1)` extra (excluding output list)

---

## Key Takeaways

- value-to-index mapping is the key invariant.
- marking by negation gives linear time and constant extra space.
- be explicit when input mutation is acceptable.
