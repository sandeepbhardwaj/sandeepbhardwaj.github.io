---
title: "Set Matrix Zeroes in Java"
date: '2024-04-03'
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
seo_title: "Set Matrix Zeroes in Java"
seo_description: "Understand set matrix zeroes in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Matrix and Grid Problems in Java
  show_overlay_excerpt: false
---
Set Matrix Zeroes is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Set Matrix Zeroes

Problem description:
We are given a problem around **Set Matrix Zeroes** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat row and column boundaries as first-class correctness checks
2. visit or update only the cells allowed by the current invariant
3. use table-based state transitions to avoid uncontrolled repeated scanning
4. double-check index movement because most matrix bugs come from boundary drift

## Why This Problem Matters

- matrix and grid problems punish sloppy boundary handling immediately
- these problems often combine traversal logic with in-place mutation or visited-state management
- set matrix zeroes is valuable because row and column movement must stay explicit

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

{% raw %}
```java

import java.util.Arrays;

/**
 * 73. Set Matrix Zeroes
 * Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.
 * <p>
 * Example 1:
 * Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
 * Output: [[1,0,1],[0,0,0],[1,0,1]]
 * <p>
 * Example 2:
 * Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
 * Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
 */
public class SetMatrixZeroes {

	//Brute force solution will work only for +ve numbers, Assuming all the elements in the matrix are non-negative
	public static void setZeroesBruteForce(int[][] matrix) {
		int row = matrix.length;
		int col = matrix[0].length;

		for (int i = 0; i < row; i++) {
			for (int j = 0; j < col; j++) {

				// if value is zero then set entire row  to -1
				if (matrix[i][j] == 0) {

					//mark the current cell to -1
					matrix[i][j] = -1;

					//set entire row to -1, keep row constant and move col index
					int tempCol = 0;
					while (tempCol < col) {
						if (matrix[i][tempCol] != 0) {
							matrix[i][tempCol] = -1;
						}
						tempCol++;
					}


					//set entire col to -1, keep col constant and move row index
					int tempRow = 0;
					while (tempRow < row) {
						if (matrix[tempRow][j] != 0) {
							matrix[tempRow][j] = -1;
						}
						tempRow++;
					}

				}

			}
		}

		for (int i = 0; i < row; i++) {
			for (int j = 0; j < col; j++) {
				if (matrix[i][j] <= 0) {
					matrix[i][j] = 0;
				}
			}
		}

	}

	//optimized approach
	public static void setZeroes(int[][] matrix) {
		int row = matrix.length;
		int col = matrix[0].length;

		//dummy array
		int[] rows_arr = new int[row];
		int[] col_arr = new int[col];

		Arrays.fill(rows_arr, -1);
		Arrays.fill(col_arr, -1);

		for (int i = 0; i < row; i++) {
			for (int j = 0; j < col; j++) {

				if (matrix[i][j] == 0) {
					rows_arr[i] = 0;
					col_arr[j] = 0;
				}
			}
		}

		for (int i = 0; i < row; i++) {
			for (int j = 0; j < col; j++) {
				if (rows_arr[i] == 0 || col_arr[j] == 0) {
					matrix[i][j] = 0;
				}
			}
		}

	}

	public static void main(String args[]) {
		int arr[][] = {{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}};
		setZeroes(arr);
		System.out.println("The Final Matrix is ");
		for (int i = 0; i < arr.length; i++) {
			for (int j = 0; j < arr[0].length; j++) {
				System.out.print(arr[i][j] + " ");
			}
			System.out.println();
		}
	}
}
```
{% endraw %}

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Set Matrix Zeroes on the smallest matrix that still exercises the boundary case you care about. Matrix problems often fail on the first or last row/column before they fail anywhere else.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- one-row or one-column matrices
- in-place update side effects
- index movement at all four boundaries

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print row and column indices during movement
- test 1xN and Nx1 matrices
- check whether in-place updates corrupt later reads
- verify the stopping condition on boundary transitions

## Key Takeaways

- Set Matrix Zeroes becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
