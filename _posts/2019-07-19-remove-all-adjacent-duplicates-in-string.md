---
title: Remove All Adjacent Duplicates in String (Java)
date: '2019-07-19'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- stack
- strings
- leetcode
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Remove All Adjacent Duplicates in String in Java
seo_description: Stack-based linear solution for removing adjacent duplicates repeatedly.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---

# Remove All Adjacent Duplicates in String (Java)

This guide explains the intuition, optimized approach, and Java implementation for remove all adjacent duplicates in string (java), with practical tips for interviews and production coding standards.

## Problem

Repeatedly remove adjacent equal characters until no such pair exists.

## Approach

Use stack behavior:

- If current char equals stack top, pop
- Otherwise push

This naturally handles repeated chain removals.

## Java Solution

```java
class Solution {
    public String removeDuplicates(String s) {
        StringBuilder stack = new StringBuilder();

        for (char c : s.toCharArray()) {
            int len = stack.length();
            if (len > 0 && stack.charAt(len - 1) == c) {
                stack.deleteCharAt(len - 1);
            } else {
                stack.append(c);
            }
        }

        return stack.toString();
    }
}
```

## Complexity

- Time: `O(n)`
- Space: `O(n)`

## Key Takeaways

- Start from the brute-force idea, then derive the optimized invariant.
- Use clean pointer/index boundaries to avoid off-by-one bugs.
- Validate against edge cases (empty input, single element, duplicates, extreme values).
