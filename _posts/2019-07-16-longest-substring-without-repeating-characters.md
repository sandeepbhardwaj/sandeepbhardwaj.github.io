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

## Complexity

- Time: `O(n)`
- Space: `O(min(n, charset))`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
