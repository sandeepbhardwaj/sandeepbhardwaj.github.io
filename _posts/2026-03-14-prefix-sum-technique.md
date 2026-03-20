---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-14
seo_title: Prefix Sum Pattern in Java – Complete Guide for Backend Engineers
seo_description: Master Prefix Sum in Java with core templates, hashmap extensions,
  subarray problems, and production-grade reasoning.
tags:
- dsa
- java
- prefix-sum
- algorithms
- interview-preparation
- backend-engineering
title: Prefix Sum Pattern in Java — A Detailed Guide for Serious Engineers
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/prefix-sum-banner.svg"
  overlay_filter: 0.35
  caption: Cumulative Thinking for Linear-Time Range Queries
  show_overlay_excerpt: false
---
Prefix Sum is one of the highest-leverage DSA patterns.
It converts repeated range computations from repeated work into constant-time lookups after linear preprocessing.

---

## Why Prefix Sum Matters

Many problems repeatedly ask for:

- sum of subarray `[l..r]`
- count of values in ranges
- number of subarrays meeting a target condition

Naive range sum query:

```java
int sum = 0;
for (int i = l; i <= r; i++) {
    sum += nums[i];
}
```

One query is `O(n)`.  
If you have many queries, total cost becomes expensive.

Prefix sum preprocesses once in `O(n)` and answers each sum query in `O(1)`.

---

## Core Idea

Define prefix array:

`prefix[i] = nums[0] + nums[1] + ... + nums[i - 1]`

Note the indexing choice:

- `prefix[0] = 0`
- `prefix` length is `n + 1`

Then range sum:

`sum(l..r) = prefix[r + 1] - prefix[l]`

---

## Template 1: 1D Prefix Sum (Range Sum Queries)

What we are doing actually:

1. Build a cumulative array where each position stores the sum before that index.
2. Convert any range sum into subtraction of two prefix values.
3. Pay `O(n)` once so each query becomes `O(1)`.

```java
public class PrefixSum1D {
    private final long[] prefix; // use long to avoid overflow in large inputs

    public PrefixSum1D(int[] nums) {
        prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i]; // Sum of elements before index i + 1.
        }
    }

    public long rangeSum(int left, int right) {
        // Sum of nums[left..right] = prefix up to right minus prefix before left.
        return prefix[right + 1] - prefix[left];
    }
}
```

Time:

- Build: `O(n)`
- Query: `O(1)`

Space: `O(n)`

---

## Problem 1: Range Sum Query - Immutable

### Problem

Given array and multiple range queries, return sum in each range.

What we are solving actually:

The same array will be queried many times, so repeated looping over every requested range would waste work.

What we are doing actually:

1. Precompute prefix sums once in the constructor.
2. Keep those sums in an extra array of size `n + 1`.
3. Answer every query by subtracting two prefix positions.

### Java Implementation

```java
class NumArray {
    private final int[] prefix;

    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i]; // Build cumulative sum up to i.
        }
    }

    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left]; // Remove the prefix before left.
    }
}
```

Debug steps:

- print the full `prefix` array after construction
- test `sumRange(0, 0)`, `sumRange(0, n - 1)`, and a middle range
- verify the class uses `n + 1` positions, not `n`

---

## Prefix Sum + HashMap (Most Important Extension)

For subarray counting problems, direct range queries are not enough.
You need this identity:

If current prefix is `curr` and you need subarray sum = `k`, then:

`curr - previousPrefix = k`
`previousPrefix = curr - k`

So store frequencies of seen prefix sums in a map.

---

## Problem 2: Subarray Sum Equals K

### Problem

Count subarrays whose sum equals `k`.

What we are solving actually:

We need the count of all subarrays with sum `k`, not just one range query. That means we must detect how many earlier prefix sums can pair with the current prefix.

What we are doing actually:

1. Keep a running prefix sum.
2. For each position, ask how many times `prefix - k` has appeared before.
3. Add that count to the answer, then record the current prefix.

### Java Implementation

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1); // empty prefix

    int prefix = 0;
    int count = 0;

    for (int x : nums) {
        prefix += x; // Prefix sum up to current index.
        count += freq.getOrDefault(prefix - k, 0); // Earlier prefixes that form sum k.
        freq.put(prefix, freq.getOrDefault(prefix, 0) + 1); // Record current prefix for future subarrays.
    }
    return count;
}
```

Time: `O(n)`  
Space: `O(n)`

Why `freq.put(0,1)`:

- handles subarrays starting at index `0`

Debug steps:

- print `prefix`, `prefix - k`, `count`, and `freq` on each iteration
- confirm counting happens before incrementing the current prefix frequency
- test an array where multiple subarrays end at the same index

---

## Problem 3: Count Number of Nice Subarrays (Exactly K Odd Numbers)

Transform the problem:

- odd -> `1`
- even -> `0`

Now it becomes “count subarrays with sum = `k`”.

What we are solving actually:

We convert the original odd/even condition into a simpler counting problem that prefix sum already knows how to solve.

What we are doing actually:

1. Map odd numbers to `1` and even numbers to `0`.
2. Build a running prefix of odd counts.
3. Reuse the same prefix-plus-frequency logic from subarray sum equals `k`.

```java
public int numberOfSubarrays(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);

    int prefix = 0;
    int count = 0;

    for (int x : nums) {
        prefix += (x % 2 != 0) ? 1 : 0; // Odd contributes 1, even contributes 0.
        count += freq.getOrDefault(prefix - k, 0); // Count earlier prefixes that create exactly k odds.
        freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);
    }
    return count;
}
```

Debug steps:

- first write down the transformed 0/1 array for one sample input
- trace the running `prefix` and matching `prefix - k`
- verify that evens still matter because they extend valid ranges without changing the prefix

---

## Problem 4: Find Pivot Index

`pivot` is index where left sum equals right sum.

Using prefix sum:

- `left = prefix[i]`
- `right = total - prefix[i + 1]`

What we are solving actually:

We want one index where the sum on the left equals the sum on the right, but we do not want to recompute left and right sums for every position.

What we are doing actually:

1. Compute the total array sum once.
2. Maintain a running left sum while scanning.
3. Derive the right sum from `total - left - nums[i]`.

```java
public int pivotIndex(int[] nums) {
    int total = 0;
    for (int x : nums) total += x; // Total sum of entire array.

    int left = 0;
    for (int i = 0; i < nums.length; i++) {
        int right = total - left - nums[i]; // Everything except current value and left side.
        if (left == right) return i; // Current index balances both sides.
        left += nums[i]; // Include current value in left sum for next iteration.
    }
    return -1;
}
```

Debug steps:

- print `i`, `left`, `nums[i]`, and `right` at each step
- test pivot at the beginning, in the middle, and no pivot
- verify `left` updates after the equality check, not before

---

## Template 2: 2D Prefix Sum (Matrix Range Queries)

For matrix rectangle sum queries:

```java
public class PrefixSum2D {
    private final int[][] pre; // (m+1) x (n+1)

    public PrefixSum2D(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        pre = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                pre[i][j] = matrix[i - 1][j - 1]
                        + pre[i - 1][j]
                        + pre[i][j - 1]
                        - pre[i - 1][j - 1];
            }
        }
    }

    public int sumRegion(int r1, int c1, int r2, int c2) {
        return pre[r2 + 1][c2 + 1]
                - pre[r1][c2 + 1]
                - pre[r2 + 1][c1]
                + pre[r1][c1];
    }
}
```

---

## Difference Array vs Prefix Sum

These two are frequently paired:

- Prefix Sum: fast range query, point update expensive
- Difference Array: fast range update, final reconstruction via prefix

Use Prefix Sum when queries dominate.
Use Difference Array when bulk range updates dominate.

---

## Common Mistakes

1. Wrong prefix indexing (`n` vs `n + 1` array)
2. Missing `freq.put(0, 1)` in hashmap variant
3. Integer overflow when sums can exceed `int`
4. Mixing inclusive/exclusive boundaries in range formulas
5. Using sliding window where negatives exist and prefix-map is required

---

## Debug Checklist for Prefix + HashMap

When counts are off by one, verify these in order:

1. seed map with `freq.put(0, 1)`
2. update `count` before incrementing current prefix frequency
3. confirm `prefix - k` lookup (not `k - prefix`)
4. inspect first few iterations with printed `(prefix, count, freq)` state

Most bugs in this pattern come from update ordering.

---

## Modular Prefix Variant (Quick Mention)

Some problems use modulo equality:

`(prefix[j] - prefix[i]) % m == 0`  
`=> prefix[j] % m == prefix[i] % m`

Then store first/frequency of remainders instead of raw sums.
This is the core trick behind problems like “continuous subarray sum”.

---

## Production Perspective (Backend Systems)

Prefix sum concepts appear in backend systems more often than they seem:

- cumulative metrics (requests, failures, bytes) over time slices
- fast interval aggregation in analytics APIs
- event-stream feature engineering for scoring pipelines

The core value is the same:

- convert repeated recomputation into constant-time lookups
- shift cost to a one-time preprocessing phase

---

## Practice Set (Recommended Order)

1. Range Sum Query - Immutable (LC 303)  
   [LeetCode](https://leetcode.com/problems/range-sum-query-immutable/)
2. Find Pivot Index (LC 724)  
   [LeetCode](https://leetcode.com/problems/find-pivot-index/)
3. Subarray Sum Equals K (LC 560)  
   [LeetCode](https://leetcode.com/problems/subarray-sum-equals-k/)
4. Continuous Subarray Sum (LC 523)  
   [LeetCode](https://leetcode.com/problems/continuous-subarray-sum/)
5. Count Number of Nice Subarrays (LC 1248)  
   [LeetCode](https://leetcode.com/problems/count-number-of-nice-subarrays/)
6. Range Sum Query 2D - Immutable (LC 304)  
   [LeetCode](https://leetcode.com/problems/range-sum-query-2d-immutable/)

---

## Key Takeaways

- Prefix Sum is the default pattern for repeated range aggregation.
- Prefix + HashMap unlocks linear-time subarray counting problems.
- Index discipline and invariant clarity prevent most bugs.
- This is a practical backend optimization tool, not just interview prep.
