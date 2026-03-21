---
title: "Valid Palindrome in Java"
date: '2024-05-09'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- strings
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Valid Palindrome in Java"
seo_description: "Understand valid palindrome in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: String Problems in Java
  show_overlay_excerpt: false
---
Valid Palindrome is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Valid Palindrome

Problem description:
We are given a problem around **Valid Palindrome** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan characters with a clear rule for what state must be remembered
2. update counters, pointers, or builders only when the invariant changes
3. use character-level scanning so character handling stays linear and predictable
4. re-check empty strings, repeated characters, and case sensitivity before returning

## Why This Problem Matters

- string problems often look simple until repeated characters and boundary cases pile up
- the main win usually comes from storing just enough state instead of rescanning substrings
- valid palindrome is a good example of turning text manipulation into a controlled state machine

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * 125. Valid Palindrome
 * Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.
 * <p>
 * Example 1:
 * Input: s = "A man, a plan, a canal: Panama"
 * Output: true
 * Explanation: "amanaplanacanalpanama" is a palindrome.
 * <p>
 * Example 2:
 * Input: s = "race a car"
 * Output: false
 * Explanation: "raceacar" is not a palindrome.
 */
public class ValidPalindrome {
	public static boolean isPalindrome(String s) {
		char[] c_arr = s.toCharArray();

		for (int i = 0, j = c_arr.length - 1; i < j; ) {
			if (!Character.isLetterOrDigit(c_arr[i])) {
				i++;
			} else if (!Character.isLetterOrDigit(c_arr[j])) {
				j--;
			} else if (Character.toLowerCase(c_arr[i++]) != Character.toLowerCase(c_arr[j--])) {
				return false;
			}
		}
		return true;
	}

	public static void main(String[] args) {
		String s = "A man, a plan, a canal: Panama";
		System.out.println(isPalindrome(s));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Valid Palindrome character by character and record the counters, pointers, or builder state after each update. That makes repeated-character edge cases much easier to reason about.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty string
- all characters identical
- case sensitivity or non-alphanumeric handling

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on character-level scanning. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print pointer/counter state after each character
- test empty and repeated-character inputs
- check case sensitivity and character filtering rules
- verify substring boundaries before returning

## Key Takeaways

- Valid Palindrome becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
