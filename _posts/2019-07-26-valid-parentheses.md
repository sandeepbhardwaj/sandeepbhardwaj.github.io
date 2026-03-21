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
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Valid Parentheses in Java (LeetCode 20)
seo_description: Stack-based validation for bracket matching problems in Java.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
  show_overlay_excerpt: false
---
This is a classic stack-matching problem.
The key idea is that every opening bracket creates a future expectation about which closing bracket must appear next.

---

## Problem 1: Valid Parentheses

Problem description:
Given a string containing only the characters `(`, `)`, `{`, `}`, `[` and `]`, return `true` if the brackets are properly matched and nested; otherwise return `false`.

What we are solving actually:
We are not just checking that the counts of opening and closing brackets match. The order matters. The most recently opened bracket must be the first one to close, which is exactly LIFO behavior.

What we are doing actually:

1. Scan the string from left to right.
2. When we see an opening bracket, push the closing bracket we expect later.
3. When we see a closing bracket, it must match the top expectation on the stack.
4. At the end, the stack must be empty.

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(')'); // Record exactly which closer must appear for this opener.
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else {
                if (stack.isEmpty() || stack.pop() != c) {
                    return false; // Wrong closer, or no opener exists for it.
                }
            }
        }

        return stack.isEmpty(); // Leftover expectations mean some opener was never closed.
    }
}
```

Debug steps:

- print the stack after each character to see current closing expectations
- test `"()[]{}"`, `"([)]"`, and `"{[]}"` to separate valid nesting from invalid ordering
- verify the invariant that the stack always contains the closers required for currently open brackets

---

## Why a Stack Fits Perfectly

Suppose we read:

- `{`
- `[`
- `(`

The next closer must be:

- `)`

not `]` or `}`.

That is why the most recent opener must be handled first.
This is exactly last-in, first-out behavior, so a stack is the natural data structure.

---

## Dry Run

Input: `"{[()]}"`

1. read `{` -> push `}`
2. read `[` -> push `]`
3. read `(` -> push `)`
4. read `)` -> pop `)`, match
5. read `]` -> pop `]`, match
6. read `}` -> pop `}`, match

Stack ends empty, so the string is valid.

Invalid example: `"([)]"`

1. read `(` -> expect `)`
2. read `[` -> expect `]` on top
3. read `)` -> top expectation is `]`, mismatch

So the string is invalid.

---

## Why Push Expected Closers

Another implementation pushes opening brackets and maps them later.
Pushing the expected closing bracket is often cleaner because the closing step becomes one direct comparison:

- `stack.pop() == currentChar`

That removes extra mapping logic in the mismatch branch.

---

## Common Mistakes

1. checking only counts of brackets instead of nesting order
2. popping without first checking whether the stack is empty
3. forgetting to verify the stack is empty after the scan
4. using legacy `Stack` instead of `ArrayDeque`

---

## Boundary Cases

- empty string -> valid
- starts with closing bracket -> invalid immediately
- leftover openers at the end -> invalid
- correctly nested mixed types -> valid

---

## Complexity

- Time: `O(n)`
- Space: `O(n)`

---

## Key Takeaways

- matching brackets is a stack problem because nesting is LIFO
- storing expected closers makes the validation logic compact
- a valid answer needs both correct local matches and an empty stack at the end

---

## Pattern Extension

One good review question for valid parentheses in java is whether the same invariant still holds when the input becomes degenerate: empty arrays, repeated values, already-sorted data, or the smallest possible string. That quick pressure test usually reveals whether we truly understood the pattern or only copied the happy path.
