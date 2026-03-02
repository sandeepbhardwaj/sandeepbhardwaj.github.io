---
title: Valid Parentheses in Java
date: '2019-07-26'
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
seo_title: Valid Parentheses in Java (LeetCode 20)
seo_description: Stack-based validation for bracket matching problems in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Valid Parentheses in Java

This guide explains the intuition, optimized approach, and Java implementation for valid parentheses in java, with practical tips for interviews and production coding standards.

## Problem

Validate whether brackets in string are properly opened and closed in order.

## Stack Approach

- Push expected closing bracket when opening bracket appears.
- On closing bracket, it must match top of stack.
- End with empty stack.

## Java Solution

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else {
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }

        return stack.isEmpty();
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
