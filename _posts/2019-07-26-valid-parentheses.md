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
The real trick is not "count brackets."
It is tracking which closing bracket must appear next.

That is why this problem shows up so often in interviews.
It tests whether you recognize a last-in, first-out invariant early instead of brute-forcing string structure.

## Quick Summary

| Signal | What it means |
| --- | --- |
| nested structure | the latest opener must close first |
| local validation with future expectations | a stack is the natural fit |
| multiple bracket types | matching order matters more than raw counts |
| invalid string can fail early | we should return on first mismatch |

The best invariant for this problem is:
the stack always contains the closing brackets required to finish the prefix processed so far.

## Problem Statement

Given a string containing only `(`, `)`, `{`, `}`, `[` and `]`, return `true` if the brackets are properly matched and nested; otherwise return `false`.

This is not a counting problem.
`"([)]"` has balanced counts and is still invalid.
The ordering of openers and closers is the real constraint.

## The Mental Model

Every opening bracket creates a promise about the future:

- `(` means we must later see `)`
- `[` means we must later see `]`
- `{` means we must later see `}`

When brackets are nested, the most recent promise must be fulfilled first.
That is exactly stack behavior.

Example:

```text
Read: { [ (
Need: ) ] }
```

The next valid closer is `)`, not `]` and not `}`.

## The Cleanest Stack Trick

One good implementation pushes the opening bracket and maps it later.
The cleaner version is usually to push the closing bracket we expect.

That gives us a direct validation rule:

- opening bracket -> push expected closer
- closing bracket -> it must equal `stack.pop()`

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

## Why This Works

At every step, the stack stores the exact closing characters required to complete the prefix seen so far.

When we read an opener:

- we are adding one more future requirement
- so we push the closer that will satisfy it

When we read a closer:

- it must satisfy the most recent still-open requirement
- if the stack is empty, there was no matching opener
- if the popped closer differs, the nesting order is wrong

If the whole scan finishes and the stack is empty, every requirement was matched in the correct order.

## Dry Run

Input:

```text
{[()]}
```

Step by step:

1. read `{` -> push `}`
2. read `[` -> push `]`
3. read `(` -> push `)`
4. read `)` -> pop `)`, match
5. read `]` -> pop `]`, match
6. read `}` -> pop `}`, match

The stack ends empty, so the string is valid.

Now the failure case:

```text
([)]
```

1. read `(` -> push `)`
2. read `[` -> push `]`
3. read `)` -> top of stack is `]`, mismatch

We can return `false` immediately.

## Common Mistakes

### Checking only counts

Balanced counts do not imply valid nesting.
That is the whole reason `"([)]"` fails.

### Popping before checking emptiness

If the string starts with a closing bracket, the stack is empty and the answer should fail immediately.

### Forgetting the final empty-stack check

`"((("` never mismatches during scanning, but it is still invalid because some openers were never closed.

### Using `Stack` instead of `ArrayDeque`

For interview-quality Java, `ArrayDeque` is usually the better stack implementation.

## Boundary Cases Worth Testing

- `""` -> valid
- `"()"` -> valid
- `"]"` -> invalid
- `"([)]"` -> invalid
- `"{[]}"` -> valid
- `"((("` -> invalid

These cases separate correct stack reasoning from superficial happy-path logic.

## Complexity

- Time: `O(n)`
- Space: `O(n)` in the worst case when every character is an opener

## What This Pattern Generalizes To

This problem is the smallest useful example of a broader pattern:
use a stack when the newest unresolved structure must be completed first.

The same idea shows up in:

- expression parsing
- path simplification
- monotonic stack problems
- undo/backtracking style state management

So this is not only a bracket problem.
It is a clean introduction to "store unresolved expectations and resolve them in reverse order."

## Key Takeaways

- Valid Parentheses is a stack problem because nesting is LIFO.
- The best invariant is that the stack stores the closers still required by the processed prefix.
- Pushing expected closers makes the mismatch check short and clear.
- A string is valid only if every closer matches in order and the stack is empty at the end.
