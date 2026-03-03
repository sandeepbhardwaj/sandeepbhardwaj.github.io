---
title: Longest Substring Without Repeating Characters in Java
date: '2019-07-16'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- sliding-window
- strings
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Longest Substring Without Repeating Characters in Java
seo_description: Sliding window solution with hashmap for LeetCode 3 in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Longest Substring Without Repeating Characters in Java

This guide explains the intuition, optimized approach, and Java implementation for longest substring without repeating characters in java, with practical tips for interviews and production coding standards.

## Problem

Return the length of the longest substring with all unique characters.

## Sliding Window Idea

Use two pointers:

- `left` = start of current valid window
- `right` = expanding pointer

Maintain last seen index for each character. If repeated char appears inside window, shift `left`.

## Java Solution

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c)) {
                left = Math.max(left, lastSeen.get(c) + 1);
            }
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }

        return best;
    }
}
```

## Dry Run (`"abcabcbb"`)

Window evolution:

1. `a` -> best `1`
2. `ab` -> best `2`
3. `abc` -> best `3`
4. next `a` repeats, move `left` to after previous `a`
5. continue similarly; max stays `3`

Answer: `3`

## Why `Math.max(left, lastSeen + 1)` Is Required

When a repeated character was seen before the current window, `left` must not move backward.
`Math.max` preserves monotonic left movement and avoids invalid window expansion.

## Common Mistakes

1. Setting `left = lastSeen.get(c) + 1` without `Math.max`.
2. Forgetting to update `lastSeen` for every character.
3. Using substring reconstruction each step (extra `O(n)` overhead).

## ASCII Optimization Variant

For ASCII-only input, use `int[128]` instead of `HashMap` for faster constant factors.

```java
int[] last = new int[128];
Arrays.fill(last, -1);
```

This keeps same complexity but improves runtime in many cases.

## Testing Checklist

- empty string
- all unique chars
- all same chars
- repeated blocks (`abcabcbb`)
- tricky case (`abba`) where `left` must not move backward

## Complexity

- Time: `O(n)`
- Space: `O(min(n, charset))`

## Key Takeaways

- sliding window keeps a no-duplicate substring in linear time.
- update left boundary carefully when a repeated character is seen.
- use index map for O(1) duplicate-position lookup and stable performance.
