---
title: "Max Area of Island - Depth-First Search (Recursive) in Java"
date: '2024-03-30'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- matrix
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Max Area of Island - Depth-First Search (Recursive) in Java"
seo_description: "Understand max area of island - depth-first search (recursive) in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Matrix and Grid Problems in Java
  show_overlay_excerpt: false
---
Max Area of Island - Depth-First Search (Recursive) is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Max Area of Island - Depth-First Search (Recursive)

Problem description:
We are given a problem around **Max Area of Island - Depth-First Search (Recursive)** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. treat row and column boundaries as first-class correctness checks
2. visit or update only the cells allowed by the current invariant
3. use recursion or subtree decomposition and table-based state transitions to avoid uncontrolled repeated scanning
4. double-check index movement because most matrix bugs come from boundary drift

## Why This Problem Matters

- matrix and grid problems punish sloppy boundary handling immediately
- these problems often combine traversal logic with in-place mutation or visited-state management
- max area of island - depth-first search (recursive) is valuable because row and column movement must stay explicit

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * 695. Max Area of Island - Depth-First Search (Recursive)
 * <p>
 * You are given an m x n binary matrix grid. An island is a group of 1's (representing land) connected 4-directionally
 * (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.
 * <p>
 * The area of an island is the number of cells with a value 1 on the island.
 * <p>
 * Return the maximum area of an island in grid. If there is no island, return 0.
 * <p>
 * Input: grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],
 * [0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],
 * [0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]
 * Output: 6
 * Explanation: The answer is not 11, because the island must be connected 4-directionally.
 * Example 2:
 * <p>
 * Input: grid = [[0,0,0,0,0,0,0,0]]
 * Output: 0
 */
public class MaxAreaOfIsland {

	public static int maxAreaOfIsland(int[][] grid) {

		int max_area = 0;

		int row = grid.length;
		int column = grid[0].length;

		for (int i = 0; i < row; i++) {
			for (int j = 0; j < column; j++) {
				max_area = Math.max(max_area, area(i, j, grid));
			}
		}
		return max_area;
	}

	/**
	 * recursive method to call all the adjacent cells
	 *
	 * @param row
	 * @param column
	 * @param grid
	 * @return
	 */
	private static int area(int row, int column, int[][] grid) {
		//overflow cases
		// if grid is covered with water aka 0
		if (row < 0 || row >= grid.length || column < 0 || column >= grid[0].length || grid[row][column] == 0) {
			return 0;
		}

		//mark visited cell to zero
		grid[row][column] = 0;

		//call up , down , left and right cell for area.
		return 1 + area(row - 1, column, grid)
				+ area(row + 1, column, grid)
				+ area(row, column - 1, grid)
				+ area(row, column + 1, grid);
	}

	public static void main(String[] args) {
		int[][] grid = new int[][]
				{
						{0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
						{0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
						{0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0},
						{0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0},
						{0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0},
						{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
						{0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
						{0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0}
				};

		System.out.println(maxAreaOfIsland(grid));
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Max Area of Island - Depth-First Search (Recursive) on the smallest matrix that still exercises the boundary case you care about. Matrix problems often fail on the first or last row/column before they fail anywhere else.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- one-row or one-column matrices
- in-place update side effects
- index movement at all four boundaries

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on recursion or subtree decomposition and table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- print row and column indices during movement
- test 1xN and Nx1 matrices
- check whether in-place updates corrupt later reads
- verify the stopping condition on boundary transitions

## Key Takeaways

- Max Area of Island - Depth-First Search (Recursive) becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
