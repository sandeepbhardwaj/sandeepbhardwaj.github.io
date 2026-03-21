---
title: "Daily Temperatures in Java"
date: '2024-04-20'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- stack
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Daily Temperatures in Java"
seo_description: "Understand daily temperatures in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Stack Problems in Java
  show_overlay_excerpt: false
---
Daily Temperatures is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Daily Temperatures

Problem description:
We are given a problem around **Daily Temperatures** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. define what the stack should contain after each step
2. push or pop only when the current element changes that expectation
3. use LIFO state tracking to make the top-of-stack meaning obvious
4. finish by checking leftover state because many stack problems fail at the end condition

## Why This Problem Matters

- stack problems become easy when the top element has a single clear meaning
- leftover state at the end is often the hidden failure mode
- daily temperatures is a good test of whether push and pop rules are truly explicit

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.Arrays;
import java.util.Stack;

/**
 * 739. Daily Temperatures
 * <p>
 * Given an array of integers temperatures represents the daily temperatures, return an array answer such that
 * answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future
 * day for which this is possible, keep answer[i] == 0 instead.
 * <p>
 * Example 1:
 * Input: temperatures = [73,74,75,71,69,72,76,73]
 * Output: [1,1,4,2,1,1,0,0]
 * <p>
 * Example 2:
 * Input: temperatures = [30,40,50,60]
 * Output: [1,1,1,0]
 * <p>
 * Example 3:
 * Input: temperatures = [30,60,90]
 * Output: [1,1,0]
 */
public class DailyTemperature {
	public static int[] dailyTemperatures(int[] temperatures) {
		int[] result = new int[temperatures.length];
		Stack<Integer> stack = new Stack<>();

		Arrays.fill(result, 0);

		for (int i = 0; i < temperatures.length; i++) {
			while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
				int index = stack.pop();
				result[index] = i - index;
			}
			stack.push(i); //adding index of element
		}
		return result;
	}

	public static void main(String[] args) {
		int[] temperatures = new int[]{73, 74, 75, 71, 69, 72, 76, 73};
		Arrays.stream(dailyTemperatures(temperatures)).forEach(e -> System.out.print(e + ","));//[1,1,4,2,1,1,0,0]
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Daily Temperatures and write the stack contents after every push and pop. If the top-of-stack meaning is stable, the implementation is usually correct too.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- empty stack before a pop/peek
- leftover items after processing all input
- single-element stack behavior

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on LIFO state tracking. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print stack contents after every push/pop
- test the final cleanup path after input is exhausted
- check empty-stack guards before every pop/peek
- verify the top element always has one stable meaning

## Key Takeaways

- Daily Temperatures becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
