---
title: Binary Search in Java (Iterative and Recursive)
date: '2019-07-08'
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
seo_title: Binary Search in Java - Iterative and Recursive
seo_description: Binary search in Java with iterative and recursive implementations
  and edge-case handling.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
Binary search is one of the most reused patterns in algorithms, but it is also one of the easiest to get subtly wrong.
Most bugs come from not being clear about the search interval invariant.

---

## Problem 1: Search in a Sorted Array

Problem description:
Given a sorted array `nums` and a target value, return the index of the target if it exists; otherwise return `-1`.

What we are solving actually:
We are not just "checking the middle repeatedly." We are maintaining a search interval that is guaranteed to contain the target if the target exists. Every comparison must shrink that interval without accidentally throwing the target away.

What we are doing actually:

1. Start with the full search interval `[left, right]`.
2. Compute `mid` safely.
3. If `nums[mid]` matches the target, return it.
4. Otherwise discard exactly one half while keeping the target's possible range valid.

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2; // Avoid overflow from (left + right) / 2.

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1; // Target can only be in the strictly right half now.
            } else {
                right = mid - 1; // Target can only be in the strictly left half now.
            }
        }

        return -1;
    }
}
```

Debug steps:

- print `left`, `mid`, `right`, and `nums[mid]` each loop
- test empty array, one-element present/absent, and target at first/last index
- verify the invariant that if the target exists, it is always inside `[left, right]`

---

## The Core Invariant

The cleanest way to reason about binary search is:

- before each loop, if the target exists, it is inside `[left, right]`

Then each branch must preserve that statement.

If `nums[mid] < target`:

- everything at or left of `mid` is too small
- so the target cannot be there
- update `left = mid + 1`

If `nums[mid] > target`:

- everything at or right of `mid` is too large
- so the target cannot be there
- update `right = mid - 1`

That is the whole correctness argument.

---

## Dry Run

Array: `[1, 3, 5, 7, 9, 11]`, target: `7`

1. `left=0`, `right=5`, `mid=2`, `nums[mid]=5`
   `5 < 7`, so discard left half including `mid`
   update `left=3`

2. `left=3`, `right=5`, `mid=4`, `nums[mid]=9`
   `9 > 7`, so discard right half including `mid`
   update `right=3`

3. `left=3`, `right=3`, `mid=3`, `nums[mid]=7`
   found target

Answer: index `3`

---

## Recursive Version

The same logic can be written recursively:

```java
int searchRec(int[] nums, int target, int left, int right) {
    if (left > right) return -1; // Empty interval means target does not exist.

    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) return searchRec(nums, target, mid + 1, right);
    return searchRec(nums, target, left, mid - 1);
}
```

The iterative version is usually preferred in interviews and production code because it avoids recursion overhead and is easier to debug.

---

## Why `left <= right` Matters

This version uses a closed interval:

- left boundary included
- right boundary included

That is why the loop condition is `left <= right`.

If you change the loop to `left < right`, you are switching interval semantics and must also change the boundary updates and return logic.
Many off-by-one bugs come from mixing these styles.

---

## Common Variants

Once the core invariant is clear, many related problems become small adjustments:

- first occurrence of target
- last occurrence of target
- insertion position
- first value greater than or equal to target
- binary search on answer space

The goal is not to memorize many separate solutions.
It is to learn how interval rules change from one variant to another.

---

## Common Mistakes

1. using interval updates that do not match the loop condition
2. computing `mid` as `(left + right) / 2` in languages where overflow matters
3. returning the wrong pointer in lower-bound or upper-bound variants
4. applying binary search to unsorted data

---

## Boundary Cases

- empty array -> return `-1`
- single element equal to target -> return `0`
- single element not equal to target -> return `-1`
- target smaller than all elements -> return `-1`
- target larger than all elements -> return `-1`

These are exactly the cases that expose interval bugs fastest.

---

## Complexity

- Time: `O(log n)`
- Space: iterative `O(1)`, recursive `O(log n)`

---

## Key Takeaways

- binary search is really about preserving a correct search interval invariant
- loop condition and boundary updates must match the chosen interval style
- once the invariant is clear, many harder binary-search variants become much easier
