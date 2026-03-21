---
title: "Spiral Matrix in Java"
date: '2024-04-05'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- matrix
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Spiral Matrix in Java"
seo_description: "Understand spiral matrix in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Matrix and Grid Problems in Java
  show_overlay_excerpt: false
---
Spiral Matrix is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Spiral Matrix

Problem description:
We are given a problem around **Spiral Matrix** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat row and column boundaries as first-class correctness checks
2. visit or update only the cells allowed by the current invariant
3. use pointer or search-space narrowing and table-based state transitions to avoid uncontrolled repeated scanning
4. double-check index movement because most matrix bugs come from boundary drift

## Why This Problem Matters

- matrix and grid problems punish sloppy boundary handling immediately
- these problems often combine traversal logic with in-place mutation or visited-state management
- spiral matrix is valuable because row and column movement must stay explicit

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

import java.util.ArrayList;
import java.util.List;

/**
 * 54. Spiral Matrix
 * Given an m x n matrix, return all elements of the matrix in spiral order.
 * <p>
 * https://leetcode.com/problems/spiral-matrix/discuss/388871/Simple-Recursion-Solution
 */
public class SpiralMatrix {
	public static List<Integer> spiralOrder(int[][] matrix) {
		int row = matrix.length;
		int column = matrix[0].length;

		//directions
		int left = 0, right = column - 1, top = 0, bottom = row - 1;

		List<Integer> result = new ArrayList<>();

		while (left <= right && top <= bottom) {
			//left to right -- top fixed
			for (int i = left; i <= right; i++) {
				result.add(matrix[top][i]);
			}
			top++;

			//top to bottom -- right fixed
			for (int i = top; i <= bottom; i++) {
				result.add(matrix[i][right]);
			}
			right--;

			//right to left -- bottom fixed
			// important if check
			if (top <= bottom) {
				for (int i = right; i >= left; i--) {
					result.add(matrix[bottom][i]);
				}
			}
			bottom--;

			//bottom to up -- left fixed
			if (left <= right) {
				for (int i = bottom; i >= top; i--) {
					result.add(matrix[i][left]);
				}
			}
			left++;

		}
		return result;
	}

	public static void main(String[] args) {
		int[][] matrix = new int[][]
				{
						{1, 2, 3, 4},
						{5, 6, 7, 8},
						{9, 10, 11, 12}
				};

		//Expected: [1,2,3,4,8,12,11,10,9,5,6,7]

		System.out.println(spiralOrder(matrix));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Spiral Matrix on the smallest matrix that still exercises the boundary case you care about. Matrix problems often fail on the first or last row/column before they fail anywhere else.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- one-row or one-column matrices
- in-place update side effects
- index movement at all four boundaries

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on pointer or search-space narrowing and table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print row and column indices during movement
- test 1xN and Nx1 matrices
- check whether in-place updates corrupt later reads
- verify the stopping condition on boundary transitions

## Key Takeaways

- Spiral Matrix becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
