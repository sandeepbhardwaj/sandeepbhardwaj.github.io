---
author_profile: true
categories:
- DSA
- Java
date: 2026-03-13
seo_title: Sliding Window Technique in Java – Complete Guide for Backend Engineers
seo_description: Master sliding window in Java with fixed and variable window templates,
  invariants, and production-grade examples.
tags:
- dsa
- java
- sliding-window
- algorithms
- interview-preparation
- backend-engineering
title: Sliding Window Technique in Java — A Detailed Guide for Serious Engineers
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/sliding-window-banner.svg"
  overlay_filter: 0.35
  caption: From Two Pointers to Window Invariants
  show_overlay_excerpt: false
---
Sliding Window is a focused form of the Two Pointers technique.
If Two Pointers teaches movement strategy, Sliding Window teaches *stateful range management*.

If you have not read the base pattern yet, start here:
[Two Pointers Technique in Java](/dsa/java/two-pointers-technique/)

---

## Why Sliding Window Matters

Many high-frequency backend tasks are range problems:

- rate limiting over recent requests
- anomaly detection on a rolling interval
- longest/shortest valid segment in logs
- stream analytics over fixed or dynamic windows

Brute-force usually checks every subarray/substring:

```java
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // evaluate range [i..j]
    }
}
```

Time complexity: `O(n^2)` or worse.

Sliding Window often reduces this to `O(n)` by:

- expanding with `right`
- shrinking with `left`
- maintaining only the state needed for the current window

---

## Core Idea (Invariant First)

Maintain a window `[left, right]` such that an invariant is always true.

Example invariants:

- no duplicate characters in current substring
- window sum is at most `target`
- number of distinct elements is at most `k`

As `right` expands, update state.
If invariant breaks, move `left` until valid again.

Every element is added and removed at most once in most variants, giving linear time.

---

## Types of Sliding Window

### 1) Fixed-Size Window

Window size stays constant (`k`).

Examples:

- maximum sum subarray of size `k`
- average over last `k` events
- count negatives in every window of size `k`

### 2) Variable-Size Window

Window size changes based on constraints.

Examples:

- longest substring without repeating characters
- minimum length subarray with sum >= `target`
- longest substring with at most `k` distinct characters

---

## Template 1: Fixed-Size Window (Java)

What we are doing actually:

1. Expand the window with `right`.
2. Remove the leftmost element only when the window becomes larger than `k`.
3. Evaluate the answer only when the window size is exactly `k`.

```java
public int fixedWindowTemplate(int[] nums, int k) {
    int n = nums.length;
    if (k > n) return -1;

    int windowSum = 0;
    int best = Integer.MIN_VALUE;
    int left = 0;

    for (int right = 0; right < n; right++) {
        windowSum += nums[right]; // Add incoming element to current window.

        // Shrink only when the window becomes too large.
        if (right - left + 1 > k) {
            windowSum -= nums[left]; // Remove outgoing element before moving left.
            left++;
        }

        // Exactly size k means this is a valid fixed window.
        if (right - left + 1 == k) {
            best = Math.max(best, windowSum);
        }
    }
    return best;
}
```

---

## Template 2: Variable-Size Window (Java)

What we are doing actually:

1. Expand the window by taking `s[right]`.
2. Update state so it reflects the current window.
3. While the window is invalid, keep shrinking from the left.
4. Once valid, evaluate the current answer.

```java
public int variableWindowTemplate(String s) {
    int left = 0, best = 0;
    Map<Character, Integer> freq = new HashMap<>();

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        freq.put(ch, freq.getOrDefault(ch, 0) + 1); // Include incoming character.

        // Shrink until the window becomes valid again.
        while (!isValid(freq)) {
            char out = s.charAt(left++);
            freq.put(out, freq.get(out) - 1);
            if (freq.get(out) == 0) freq.remove(out);
        }

        // The invariant holds here, so this window can be considered.
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

Replace `isValid(...)` with your problem-specific rule.

---

## Problem 1: Maximum Sum Subarray of Size K (Fixed Window)

### Problem

Given an integer array and `k`, return the maximum sum among all subarrays of size `k`.

What we are solving actually:

We need to evaluate every subarray of size `k`, but we do not want to recompute the full sum for each one from scratch.

What we are doing actually:

1. Grow the window by adding `nums[right]`.
2. If the window becomes larger than `k`, remove `nums[left]`.
3. When the window size reaches `k`, update the best sum.

### Java Solution

```java
public int maxSumSubarrayOfSizeK(int[] nums, int k) {
    if (nums == null || nums.length < k || k <= 0) return -1;

    int left = 0;
    int windowSum = 0;
    int best = Integer.MIN_VALUE;

    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right]; // Expand window to the right.

        if (right - left + 1 > k) {
            windowSum -= nums[left++]; // Drop outgoing element to restore size k.
        }

        if (right - left + 1 == k) {
            best = Math.max(best, windowSum); // Valid fixed-size window.
        }
    }
    return best;
}
```

Time: `O(n)`  
Space: `O(1)`

Debug steps:

- print `left`, `right`, `windowSum`, and `best` after each iteration
- verify the window size formula is always `right - left + 1`
- test `k = 1`, `k = nums.length`, and a normal middle case

---

## Problem 2: Longest Substring Without Repeating Characters (Variable Window)

### Problem

Return length of the longest substring with all unique characters.

What we are solving actually:

We want the longest valid substring, so we keep one moving window and repair it whenever a repeated character would make it invalid.

What we are doing actually:

1. Track the last seen position of each character.
2. When we see a duplicate inside the current window, jump `left` forward.
3. Update the best window length after each step.

### Java Solution

```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0, best = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c)) {
            left = Math.max(left, lastSeen.get(c) + 1); // Keep left moving forward only.
        }
        lastSeen.put(c, right); // Most recent index of this character.
        best = Math.max(best, right - left + 1); // Current valid window length.
    }
    return best;
}
```

Time: `O(n)`  
Space: `O(min(n, charset))`

Debug steps:

- print `left`, `right`, current character, and `lastSeen`
- test `"abba"` to confirm `left` never moves backward
- trace the exact window whenever `best` changes

---

## Problem 3: Minimum Size Subarray Sum >= Target (Variable Window)

### Problem

Given positive integers and `target`, return minimum length of a subarray whose sum is at least `target`.

What we are solving actually:

We want the shortest valid window, so every time the running sum becomes large enough, we should shrink aggressively to see how small the window can become.

What we are doing actually:

1. Expand the window until the sum reaches or exceeds `target`.
2. Record the current window length as a candidate answer.
3. Shrink from the left while the window is still valid.

### Java Solution

```java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0;
    int sum = 0;
    int best = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right]; // Expand until the window becomes valid.

        while (sum >= target) {
            best = Math.min(best, right - left + 1); // Current window satisfies the target.
            sum -= nums[left++]; // Try to make the valid window smaller.
        }
    }

    return best == Integer.MAX_VALUE ? 0 : best;
}
```

Important precondition:

- This direct pattern assumes all numbers are positive.
- If negatives exist, the monotonic shrink rule breaks.

Debug steps:

- print `left`, `right`, `sum`, and `best` whenever the inner `while` runs
- test one case with no valid subarray to verify the `0` return path
- remember this pattern is wrong if negative numbers are allowed

---

## Problem 4: Longest Substring with At Most K Distinct Characters

### Java Solution

```java
public int lengthOfLongestSubstringKDistinct(String s, int k) {
    if (k <= 0) return 0;

    Map<Character, Integer> freq = new HashMap<>();
    int left = 0, best = 0;

    for (int right = 0; right < s.length(); right++) {
        char in = s.charAt(right);
        freq.put(in, freq.getOrDefault(in, 0) + 1);

        while (freq.size() > k) {
            char out = s.charAt(left++);
            freq.put(out, freq.get(out) - 1);
            if (freq.get(out) == 0) freq.remove(out);
        }

        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

Time: `O(n)`  
Space: `O(k)` to `O(charset)`

---

## Advanced Pattern: Monotonic Deque + Sliding Window Maximum

Some window problems need max/min for every window in `O(1)` amortized updates.

Classic problem: maximum in each subarray of size `k`.

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || nums.length == 0 || k <= 0) return new int[0];

    Deque<Integer> dq = new ArrayDeque<>(); // stores indices, values decreasing
    int[] ans = new int[nums.length - k + 1];
    int idx = 0;

    for (int right = 0; right < nums.length; right++) {
        // remove out-of-window index
        while (!dq.isEmpty() && dq.peekFirst() <= right - k) {
            dq.pollFirst();
        }

        // maintain decreasing deque
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[right]) {
            dq.pollLast();
        }
        dq.offerLast(right);

        // record answer after first full window
        if (right >= k - 1) {
            ans[idx++] = nums[dq.peekFirst()];
        }
    }
    return ans;
}
```

Time: `O(n)`  
Space: `O(k)`

---

## How Sliding Window Relates to Two Pointers

From the Two Pointers article:

- pointers move with strict progress rules
- invariants are non-negotiable

Sliding Window adds:

- explicit *window state* (sum/frequency/deque)
- condition-based shrinking
- full control of subarray/substring constraints in linear scans

Think of it as “Two Pointers + Stateful Invariant”.

---

## Common Mistakes

1. Updating answer before restoring validity
2. Shrinking with `if` when `while` is required
3. Forgetting to remove zero-frequency keys from map
4. Using this pattern with negative numbers where monotonic behavior is required
5. Off-by-one on window size: `right - left + 1`

---

## Debug Workflow for Window Bugs

When a solution fails, print this per-step state:

- `left`, `right`
- current window size
- current state object (`sum`, `freq`, deque head)
- whether invariant is valid

Example log shape:

```text
r=7 l=3 size=5 sum=19 valid=false -> shrink
```

This quickly reveals missed `while` loops and stale state cleanup.

---

## When Not to Use Sliding Window

Avoid defaulting to sliding window when:

- constraints are non-local (depend on future elements)
- values include negatives and your logic assumes monotonic sum behavior
- problem requires arbitrary range queries better solved by prefix sums/segment trees

Pattern selection is as important as implementation.

---

## Production Perspective (Backend Systems)

Sliding windows appear everywhere in backend engineering:

- rolling error-rate calculation over the last `N` events
- per-user request limits in moving time ranges
- near-real-time fraud detection over recent transactions
- stream partition metrics with bounded memory

Benefits:

- linear runtime
- bounded memory
- predictable performance under load

---

## Practice Set (Recommended Order)

1. Maximum Average Subarray I (LC 643)  
   [LeetCode](https://leetcode.com/problems/maximum-average-subarray-i/)
2. Longest Substring Without Repeating Characters (LC 3)  
   [LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
3. Minimum Size Subarray Sum (LC 209)  
   [LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum/)
4. Permutation in String (LC 567)  
   [LeetCode](https://leetcode.com/problems/permutation-in-string/)
5. Longest Repeating Character Replacement (LC 424)  
   [LeetCode](https://leetcode.com/problems/longest-repeating-character-replacement/)
6. Sliding Window Maximum (LC 239)  
   [LeetCode](https://leetcode.com/problems/sliding-window-maximum/)

---

## Key Takeaways

- Sliding Window is a specialized, high-value Two Pointers pattern.
- Fixed-size windows track exact ranges; variable-size windows enforce constraints.
- Invariant-first thinking is the difference between fragile code and reliable linear-time solutions.
- For backend engineers, this is a practical optimization technique, not just interview prep.
