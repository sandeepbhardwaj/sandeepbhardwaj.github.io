---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-16
seo_title: Binary Search Pattern in Java – Complete Guide
seo_description: Master binary search in Java including index search, first/last occurrence, and answer-space binary search.
tags:
- dsa
- java
- binary-search
- algorithms
- interview-preparation
canonical_url: https://sandeepbhardwaj.github.io/dsa/java/binary-search-pattern/
title: Binary Search Pattern in Java — A Detailed Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: /assets/images/binary-search-banner.svg
  overlay_filter: 0.35
  caption: "Log-Time Decisions on Monotonic Spaces"
---

# Binary Search Pattern in Java — A Detailed Guide

Binary search is not just for finding a value in a sorted array.
It is a decision pattern over monotonic spaces.

---

## Core Idea

Maintain search range `[lo, hi]` and shrink by half based on a monotonic condition.

```java
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (condition(mid)) {
        hi = mid - 1; // or lo = mid + 1 based on variant
    } else {
        lo = mid + 1;
    }
}
```

---

## Pattern 1: Exact Match

```java
public int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

---

## Pattern 2: First True / Lower Bound

```java
public int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length; // half-open
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

---

## Pattern 3: Search on Answer

When answer is numeric and feasibility is monotonic.

Example: minimum eating speed (Koko).

```java
public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = Arrays.stream(piles).max().orElse(1);

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, h, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canFinish(int[] piles, int h, int k) {
    long hours = 0;
    for (int p : piles) {
        hours += (p + k - 1) / k;
    }
    return hours <= h;
}
```

---

## Common Mistakes

1. Infinite loops from wrong boundary updates
2. Mid overflow from `(lo + hi) / 2`
3. Mixing closed `[lo, hi]` and half-open `[lo, hi)` styles
4. Not proving monotonicity in answer-space problems

---

## Practice Set (Recommended Order)

1. Binary Search (LC 704)  
   [LeetCode](https://leetcode.com/problems/binary-search/)
2. First Bad Version (LC 278)  
   [LeetCode](https://leetcode.com/problems/first-bad-version/)
3. Search Insert Position (LC 35)  
   [LeetCode](https://leetcode.com/problems/search-insert-position/)
4. Find First and Last Position (LC 34)  
   [LeetCode](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
5. Koko Eating Bananas (LC 875)  
   [LeetCode](https://leetcode.com/problems/koko-eating-bananas/)
6. Capacity To Ship Packages (LC 1011)  
   [LeetCode](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

---

## Key Takeaways

- Binary search is a monotonic decision framework.
- Choose one interval convention and stay consistent.
- Answer-space binary search is a high-value interview and production pattern.
