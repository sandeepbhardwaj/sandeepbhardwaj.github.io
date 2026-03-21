---
categories:
- DSA
- Java
date: 2026-03-14
seo_title: Prefix Sum Pattern in Java - Interview Preparation Guide
seo_description: Master the Prefix Sum pattern in Java with interview-ready
  recognition signals, range-query templates, prefix-plus-hashmap counting, 2D
  extensions, and practical intuition.
tags:
- dsa
- java
- prefix-sum
- algorithms
- interview-preparation
- backend-engineering
title: Prefix Sum Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/prefix-sum-banner.svg"
  overlay_filter: 0.35
  caption: Cumulative Thinking for Linear-Time Range Queries
  show_overlay_excerpt: false
---
Prefix sum is the interview pattern for shifting repeated aggregation work into one preprocessing pass.
Once we maintain the invariant `prefix[i] = sum of the first i elements`, many range and subarray problems collapse into subtraction between checkpoints.

## 🚀 Pattern Summary Table

| Pattern name | When to use | Key idea | Example |
| --- | --- | --- | --- |
| 1D Prefix Sum | repeated range sum queries on an immutable array | precompute cumulative sums once, answer each query by subtraction | Range Sum Query - Immutable |
| Prefix Sum + HashMap | count subarrays with exact target sum, especially with negative numbers | if `currentPrefix - previousPrefix = k`, then `previousPrefix = currentPrefix - k` | Subarray Sum Equals K |
| Running Prefix Balance | compare left and right aggregates while scanning once | maintain left sum, derive right sum from total | Find Pivot Index |
| 2D Prefix Sum | repeated rectangle sum queries in a matrix | extend prefix accumulation with inclusion-exclusion | Range Sum Query 2D - Immutable |
| Modular Prefix | divisibility or remainder-based subarray conditions | equal remainders imply divisible difference | Continuous Subarray Sum |

## 🎯 Problem Statement

Given an array or matrix, answer repeated range-aggregation queries efficiently, or count subarrays that satisfy a sum-based condition.

Typical interview constraints:

- `1 <= n, q <= 10^5`
- values may be positive, zero, or negative
- multiple queries or all-subarray checks make repeated rescanning too expensive
- expected solution is usually `O(n + q)` or `O(n)`

> [!NOTE]
> Always inspect the constraints before coding. If the input is large and the prompt asks for many range sums or exact subarray counts, brute force is almost certainly too slow.

## 🔍 How to Recognize This Pattern

- Keywords in the problem:
  range sum, cumulative, prefix, subarray sum equals `k`, pivot, region sum, divisible, remainder.
- Input size and constraints:
  large arrays, many queries, or a requirement better than `O(n^2)`.
- Observations:
  the sum of a range can be expressed as the difference between two cumulative sums.
- Another strong signal:
  negative numbers are allowed, so a sliding-window sum approach is no longer reliably monotonic.

> [!IMPORTANT]
> The strongest signals are:
> 1. repeated range aggregation,
> 2. exact-sum subarray counting,
> 3. negative values that break two-pointer or sliding-window monotonicity,
> 4. a natural "sum up to this point" interpretation.

## 🧪 Example

Input:

```text
nums = [3, 1, 4, 2]
query = [1, 3]
```

Output:

```text
7
```

Explanation:

- Build prefix array: `prefix = [0, 3, 4, 8, 10]`
- `prefix[i]` stores the sum of elements in the half-open range `[0, i)`
- Sum of `nums[1..3] = prefix[4] - prefix[1] = 10 - 3 = 7`

The important shift is this:
we stop recomputing the middle of the range and instead subtract two precomputed boundaries.

## 🐢 Brute Force Approach

Idea:

- For each query `[left, right]`, iterate from `left` to `right` and compute the sum directly.
- For subarray-count problems, try every start index and every end index.

```java
int sum = 0;
for (int i = left; i <= right; i++) {
    sum += nums[i];
}
```

Complexity:

- Range queries: `O(qn)` in the worst case
- All-subarray checks: `O(n^2)` or even `O(n^3)` if each subarray sum is recomputed from scratch
- Space: `O(1)`

> [!WARNING]
> This fails when the array is large or the number of queries is high. The repeated work is the problem: neighboring queries or subarrays heavily overlap, but brute force recalculates the same sums again and again.

## ⚡ Optimized Approach

### 💡 Key Insight

We optimize by reducing repeated summation into one cumulative pass.

If we define:

`prefix[i] = nums[0] + nums[1] + ... + nums[i - 1]`

then:

`sum(left..right) = prefix[right + 1] - prefix[left]`

For counting problems, the same logic becomes:

`currentPrefix - previousPrefix = target`

So instead of searching every subarray explicitly, we look up whether the needed earlier prefix has already appeared.

### 🧠 Mental Model

Think of the prefix array as a ledger of work already paid for.
Each range query becomes "take the larger checkpoint and subtract the smaller checkpoint."

For prefix plus hashmap, the mental model is:
the current index asks the past, "How many earlier prefixes would make my current total land exactly on the target?"

### 🛠️ Steps

Core 1D prefix sum:

1. Create a prefix array of length `n + 1`
2. Set `prefix[0] = 0`
3. Build the invariant:
   `prefix[i + 1] = prefix[i] + nums[i]`
4. Answer any range sum `[left, right]` with:
   `prefix[right + 1] - prefix[left]`

Prefix plus hashmap for exact-sum subarrays:

1. Maintain a running prefix sum `prefix`
2. Maintain a frequency map `freq` of prefix sums seen so far
3. Seed `freq.put(0, 1)` so subarrays starting at index `0` are counted
4. At each element, add `freq.getOrDefault(prefix - k, 0)` to the answer
5. Record the current prefix for future positions

Invariant:

- In the range-query version, `prefix[i]` always equals the sum of `[0, i)`
- In the hashmap version, `freq` contains counts of prefix sums seen strictly before the current position

### 💻 Code (Java)

Range-query template:

```java
public final class PrefixSum1D {
    private final long[] prefix;

    public PrefixSum1D(int[] nums) {
        prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public long rangeSum(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}
```

Most important interview extension: subarray sum equals `k`

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);

    int prefix = 0;
    int count = 0;

    for (int x : nums) {
        prefix += x;
        count += freq.getOrDefault(prefix - k, 0);
        freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);
    }

    return count;
}
```

### ⏱️ Complexity

Core 1D prefix sum:

- Build: `O(n)`
- Each query: `O(1)`
- Space: `O(n)`

Prefix plus hashmap:

- Time: `O(n)`
- Space: `O(n)`

> [!TIP]
> This is optimal for immutable range-sum queries because every query is reduced to constant-time subtraction after one linear preprocessing pass. For exact-sum subarray counting, the hashmap extension is usually the interview-optimal answer, especially when negative numbers are present.

## 🎨 Visual Intuition

```text
nums:    [ 3, 1, 4, 2 ]
index:     0  1  2  3

prefix: [ 0, 3, 4, 8, 10 ]
index:    0  1  2  3   4

Query: sum(1..3)

Take everything up to index 3:      prefix[4] = 10
Remove everything before index 1: - prefix[1] = 3
                                    -------------
Result:                             7
```

For subarray counting:

```text
If currentPrefix = 12 and target = 5,
we need an earlier prefix of 7.

Why?
12 - 7 = 5
```

That is the whole pattern:
convert a subarray condition into a relation between two prefix states.

## ⚠️ Common Mistakes

- Using a prefix array of size `n` instead of `n + 1`
- Mixing inclusive and exclusive boundaries in `prefix[right + 1] - prefix[left]`
- Forgetting `freq.put(0, 1)` in the hashmap variant
- Updating prefix frequency before counting matches for the current position
- Using `int` when the running sum may overflow
- Forcing sliding window on target-sum problems with negative numbers

> [!CAUTION]
> The two most common bugs are boundary mistakes and update-order mistakes. If your answer is off by one, inspect the indexing. If your count is wrong, inspect the order of "count first, then store current prefix."

## 🔁 Pattern Variations

### Range Sum Query - Immutable

The purest prefix-sum problem.
Precompute once, answer many queries in `O(1)`.

### Subarray Sum Equals K

The most important extension.
You combine prefix sum with a hashmap of seen prefix frequencies.

### Count Number of Nice Subarrays

Transform the array first:

- odd -> `1`
- even -> `0`

Then the problem becomes:
"count subarrays with sum exactly `k`."

### Find Pivot Index

You do not need a full prefix array.
A running left sum plus total sum is enough.

```java
public int pivotIndex(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;

    int left = 0;
    for (int i = 0; i < nums.length; i++) {
        int right = total - left - nums[i];
        if (left == right) return i;
        left += nums[i];
    }
    return -1;
}
```

### 2D Prefix Sum

For rectangle queries in a matrix, extend the same idea with inclusion-exclusion:

```java
public final class PrefixSum2D {
    private final int[][] pre;

    public PrefixSum2D(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
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

### Modular Prefix

Some problems care about divisibility rather than an exact sum.
Then equal remainders become the signal:

`(prefix[j] - prefix[i]) % m == 0`

which means:

`prefix[j] % m == prefix[i] % m`

## 🔗 Pattern Composition (Advanced)

- Prefix Sum + HashMap:
  the standard composition for exact-sum subarray counting
- Prefix Sum + Transformation:
  convert the input first, such as odd/even to `1/0`, then reuse the same logic
- Prefix Sum + Modulo Arithmetic:
  useful for divisibility and remainder-based problems
- Prefix Sum + Inclusion-Exclusion:
  this is what makes 2D prefix sums work
- Prefix Sum + Difference Array:
  prefix sum makes range queries fast, while difference arrays make range updates fast

Difference array vs prefix sum:

- Prefix Sum:
  preprocess once, answer range queries fast
- Difference Array:
  apply many range updates fast, then reconstruct with a prefix pass

> [!IMPORTANT]
> Prefix sum is rarely an isolated trick. In harder interview problems, it often acts as the accounting layer underneath another pattern such as hashmap counting, matrix inclusion-exclusion, modulo reasoning, or transformed-state modeling.

## 🧠 Key Takeaways

- Prefix sum is the default pattern when repeated range aggregation is the bottleneck.
- We maintain the invariant that each prefix entry summarizes all work up to that boundary.
- Prefix plus hashmap is the go-to extension for exact-sum subarray counting.
- Negative numbers are a strong hint that prefix-sum reasoning may beat sliding window.
- Most bugs come from indexing mistakes, update order, or forgetting the empty-prefix base case.

## 📌 Practice Problems

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

> [!TIP]
> Do not practice these as unrelated problems. Solve them in this order and say the invariant out loud each time. Prefix-sum mastery comes from recognizing the same accounting idea in several different shapes.
