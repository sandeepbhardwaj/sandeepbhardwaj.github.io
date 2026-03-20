---
title: "Pow(x, n) in Java"
date: '2024-02-19'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- bit-manipulation
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Pow(x, n) in Java"
seo_description: "Understand pow(x, n) in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Bit Manipulation and Number Representation in Java
  show_overlay_excerpt: false
---
Pow(x, n) is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Pow(x, n)

Problem description:
We are given a problem around **Pow(x, n)** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. reduce the problem to binary representation rules
2. apply the relevant bit operation or arithmetic identity in one small step
3. use bit-level arithmetic so each update stays deterministic
4. verify edge cases such as zero, sign, overflow, or powers of two explicitly

## Why This Problem Matters

- bit problems reward understanding representation instead of memorizing isolated tricks
- small arithmetic mistakes here often survive tests until edge inputs arrive
- pow(x, n) is a compact way to practice binary reasoning with exact state updates

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * 50. Pow(x, n)
 * Implement pow(x, n), which calculates x raised to the power n (i.e., xn).
 * <p>
 * Example 1:
 * Input: x = 2.00000, n = 10
 * Output: 1024.00000
 * <p>
 * Example 2:
 * Input: x = 2.10000, n = 3
 * Output: 9.26100
 * <p>
 * Example 3:
 * Input: x = 2.00000, n = -2
 * Output: 0.25000
 * Explanation: 2-2 = 1/22 = 1/4 = 0.25
 */
public class Pow {
	public double myPow_1(double x, int n) {
		double ans = 1.0;

		for (int i = 0; i < Math.abs(n); i++) {
			ans = ans * x;
		}

		//if n is negative then divide 1/ans
		if (n < 0) ans = 1 / ans;
		return ans;
	}

	/**
	 * Using Binary Exponentiation
	 */
	public static double myPow(double x, int n) {
		double ans = 1.0;

		long temp_n = n;
		// make it positive
		if (temp_n < 0) temp_n = temp_n * -1;

		while (temp_n > 0) {
			if (temp_n % 2 == 1) {
				ans = ans * x;
				temp_n = temp_n - 1;
			} else {
				x = x * x;
				temp_n = temp_n / 2;
			}
		}

		if (n < 0) ans = 1.0 / ans;
		return ans;

	}

	public static void main(String[] args) {
		System.out.println(myPow(2, 4));

	}


}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Pow(x, n) on a tiny binary example and write the intermediate bit pattern after every operation. This prevents accidental trust in intuition when the real rule is about representation.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- zero or one as special binary values
- negative values or sign handling
- overflow or shift-width mistakes

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on bit-level arithmetic. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print the intermediate bit pattern or arithmetic state
- test zero, one, and the largest interesting input
- check sign handling separately from the happy path
- verify that every bit operation moves toward termination

## Key Takeaways

- Pow(x, n) becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
