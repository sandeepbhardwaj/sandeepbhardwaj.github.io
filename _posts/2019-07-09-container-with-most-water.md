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
This is a classic two-pointer optimization problem.
The key challenge is not computing the area, but knowing which boundary can be safely moved without missing the optimal answer.

---

## Problem 1: Container With Most Water

Problem description:
Given an array `height`, choose two indices `i` and `j` to form a container. The amount of water it can hold is `min(height[i], height[j]) * (j - i)`. Return the maximum possible area.

What we are solving actually:
Brute force checks every pair of lines, which is quadratic. The real insight is that width always shrinks when we move inward, so the only hope of improving the area is to increase the limiting height.

What we are doing actually:

1. Start with the widest possible container using the leftmost and rightmost lines.
2. Compute the current area.
3. Move the pointer at the shorter height because that side limits the area.
4. Keep the best area seen during the inward scan.

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;

        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            best = Math.max(best, h * w); // Current container area.

            if (height[left] < height[right]) {
                left++; // Only a taller left side can offset the lost width.
            } else {
                right--; // Only a taller right side can offset the lost width.
            }
        }

        return best;
    }
}
```

Debug steps:

- print `left`, `right`, the two heights, and the computed area each iteration
- test `[1,8,6,2,5,4,8,3,7]` and a tiny case like `[1,1]`
- verify the invariant that every discarded shorter boundary cannot lead to a better answer with the current opposite boundary

---

## Why Moving the Shorter Side Is Correct

Suppose:

- left height = `2`
- right height = `10`

The container height is limited by `2`, not `10`.
If we move the taller side inward:

- width becomes smaller
- limiting height is still at most `2`

So the area cannot improve from that move.

That is the entire greedy argument:

- width always decreases
- therefore we only move the side that might let the limiting height increase

---

## Dry Run

Input: `[1,8,6,2,5,4,8,3,7]`

1. `left=0 (1)`, `right=8 (7)`
   area = `min(1,7) * 8 = 8`
   move `left` because `1` is the shorter side

2. `left=1 (8)`, `right=8 (7)`
   area = `min(8,7) * 7 = 49`
   best = `49`
   move `right` because `7` is the shorter side

3. `left=1 (8)`, `right=7 (3)`
   area = `3 * 6 = 18`
   move `right`

4. continue inward

No later area beats `49`, so the answer is `49`.

---

## Why Brute Force Is Wasteful

Brute force considers every pair `(i, j)`.
But once we know one side is shorter, many of those pairs are obviously dominated.

Example:

- fixed left height = `2`
- moving the right pointer inward only reduces width

If the left side stays at `2`, none of those narrower containers can beat a wider one with the same limiting side.

That is why the two-pointer scan can safely prune so much work.

---

## Common Mistakes

1. moving both pointers every iteration
2. always moving the taller side
3. using `while (left <= right)` and processing zero-width containers
4. overcomplicating the proof instead of focusing on the limiting-height argument

---

## Boundary Cases

- two elements -> that single pair is the answer
- all equal heights -> best comes from widest pair
- strictly increasing or decreasing heights -> pointer movement still works naturally

---

## Complexity

- Time: `O(n)`
- Space: `O(1)`

---

## Key Takeaways

- this is a two-pointer problem driven by a pruning argument
- the shorter boundary is the only rational pointer to move
- width shrinks every step, so future improvement can only come from a taller limiting side
