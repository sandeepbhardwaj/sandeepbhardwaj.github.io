---
title: "Multiply Strings in Java"
date: '2024-01-15'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- arrays
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Multiply Strings in Java"
seo_description: "Understand multiply strings in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Arrays, Hashing, and Pointer Problems in Java
  show_overlay_excerpt: false
---
Multiply Strings is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Multiply Strings

Problem description:
We are given a problem around **Multiply Strings** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. scan the input while keeping the main invariant explicit
2. use the right supporting structure only when it removes repeated work
3. lean on recursion or subtree decomposition rather than nested brute-force checks
4. return the result only after boundary cases like duplicates or empty input are accounted for

## Why This Problem Matters

- array problems teach when indexing alone is enough and when hashing or sorting changes the cost model
- many interview and production debugging tasks hide simple boundary bugs inside otherwise small loops
- multiply strings is a good example of trading brute force for a more intentional invariant

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * 43. Multiply Strings
 * <p>
 * Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also
 * represented as a string.
 * <p>
 * Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.
 * <p>
 * Example 1:
 * Input: num1 = "2", num2 = "3"
 * Output: "6"
 * <p>
 * Example 2:
 * Input: num1 = "123", num2 = "456"
 * Output: "56088"
 */
public class MultiplyStrings {
	/*
            8   9
            6   4
       -----------------
	             3  6
	          5  4
	          3  2
	       4  8
       -----------------
           5  6  9  6
    */
	public static String multiply(String num1, String num2) {
		int m = num1.length();
		int n = num2.length();

		int[] result = new int[n + m]; //array is 0 indexed

		//reverse loop we do multiply from right to left
		for (int i = m - 1; i >= 0; i--) {
			for (int j = n - 1; j >= 0; j--) {
				int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');

				int sum = result[i + j + 1] + mul; // i+j+1 refer to last index

				result[i + j + 1] = sum % 10; //store at last index
				result[i + j] = result[i + j] + sum / 10; // store at second last index
			}
		}

		StringBuilder sb = new StringBuilder();

		for (int num : result) {
			//Not to add leading zeros
			if (sb.length() != 0 || num != 0)
				sb.append(num);
		}

		return sb.length() == 0 ? "0" : sb.toString();
	}

	public static void main(String[] args) {
		System.out.println(multiply("3", "3"));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run one small input and keep track of the exact index, accumulator, or lookup structure after each step. Multiply Strings usually becomes easy once you can explain why each element is processed only once or why a second pass is still necessary.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty or single-element input
- duplicates that change lookup behavior
- already sorted or reverse-ordered input

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the running index and any lookup structure after each iteration
- re-run with duplicates and smallest valid input
- check whether the algorithm accidentally reuses the same element twice
- verify what happens before the first successful match

## Key Takeaways

- Multiply Strings becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
