---
title: "String to Integer (atoi) in Java"
date: '2024-05-06'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- strings
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "String to Integer (atoi) in Java"
seo_description: "Understand String to Integer (atoi) in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: String Problems in Java
  show_overlay_excerpt: false
---
String to Integer (atoi) is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: String to Integer (atoi)

Problem description:
We are given a problem around **String to Integer (atoi)** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan characters with a clear rule for what state must be remembered
2. update counters, pointers, or builders only when the invariant changes
3. use pointer or search-space narrowing so character handling stays linear and predictable
4. re-check empty strings, repeated characters, and case sensitivity before returning

## Why This Problem Matters

- string problems often look simple until repeated characters and boundary cases pile up
- the main win usually comes from storing just enough state instead of rescanning substrings
- string to integer (atoi) is a good example of turning text manipulation into a controlled state machine

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer
 * (similar to C/C++'s atoi function).
 */
public class StringToInteger {
	public int myAtoi(String input) {
		int sign = 1;
		int result = 0;
		int index = 0;
		int n = input.length();

		// Discard all spaces from the beginning of the input string.
		while (index < n && input.charAt(index) == ' ') {
			index++;
		}

		// sign = +1, if it's positive number, otherwise sign = -1.
		if (index < n && input.charAt(index) == '+') {
			sign = 1;
			index++;
		} else if (index < n && input.charAt(index) == '-') {
			sign = -1;
			index++;
		}

		// Traverse next digits of input and stop if it is not a digit
		while (index < n && Character.isDigit(input.charAt(index))) {
			int digit = input.charAt(index) - '0';

			// Check overflow and underflow conditions.
			if ((result > Integer.MAX_VALUE / 10) ||
					(result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
				// If integer overflowed return 2^31-1, otherwise if underflowed return -2^31.
				return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
			}

			// Append current digit to the result.
			result = 10 * result + digit;
			index++;
		}

		// We have formed a valid number without any overflow/underflow.
		// Return it after multiplying it with its sign.
		return sign * result;
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run String to Integer (atoi) character by character and record the counters, pointers, or builder state after each update. That makes repeated-character edge cases much easier to reason about.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty string
- all characters identical
- case sensitivity or non-alphanumeric handling

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on pointer or search-space narrowing. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print pointer/counter state after each character
- test empty and repeated-character inputs
- check case sensitivity and character filtering rules
- verify substring boundaries before returning

## Key Takeaways

- String to Integer (atoi) becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
