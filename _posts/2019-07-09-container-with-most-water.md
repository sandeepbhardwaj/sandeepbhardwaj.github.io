---
title: Container With Most Water in Java
date: '2019-07-09'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- two-pointers
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Container With Most Water in Java - Two Pointers
seo_description: Solve LeetCode 11 using two pointers with proof intuition and O(n)
  complexity.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Given an array `height`, pick two indices `i` and `j` to form a container.
Maximize area:

`area = min(height[i], height[j]) * (j - i)`

---

## Two-Pointer Insight

Start with widest container:

- `left = 0`
- `right = n - 1`

At each step:

- compute area
- move pointer at shorter height

Why: shorter side limits area. Moving taller side cannot improve limiting height and always reduces width.

---

## Java Solution

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            best = Math.max(best, h * w);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return best;
    }
}
```

---

## Dry Run

Input: `[1,8,6,2,5,4,8,3,7]`

1. `left=0 (1)`, `right=8 (7)` -> area `1*8=8`, move `left`
2. `left=1 (8)`, `right=8 (7)` -> area `7*7=49`, best `49`, move `right`
3. `left=1 (8)`, `right=7 (3)` -> area `3*6=18`, move `right`
4. keep moving inward by shorter side; no area beats `49`

Answer: `49`

---

## Common Mistakes

1. moving both pointers each iteration
2. moving taller side by default
3. using `while (left <= right)` and processing zero width
4. not considering integer overflow in larger constraints (`long` if needed)

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- width shrinks every step, so pointer movement must target potential height gain.
- moving the shorter boundary is the only rational move.
- this is a classic example of two-pointers guided by a monotonic argument.
