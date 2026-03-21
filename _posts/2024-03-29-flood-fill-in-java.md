---
title: "Flood Fill in Java"
date: '2024-03-29'
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
seo_title: "Flood Fill in Java"
seo_description: "Understand flood fill in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Matrix and Grid Problems in Java
  show_overlay_excerpt: false
---
Flood Fill is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Flood Fill

Problem description:
We are given a problem around **Flood Fill** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

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
- flood fill is valuable because row and column movement must stay explicit

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java
import java.util.Arrays;



/**
 * 733. Flood Fill
 * An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.
 * <p>
 * You are also given three integers sr, sc, and newColor. You should perform a flood fill on the image starting from the
 * pixel image[sr][sc].
 * <p>
 * To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel
 * of the same color as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color),
 * and so on. Replace the color of all of the aforementioned pixels with newColor.
 * <p>
 * Return the modified image after performing the flood fill.
 * <p>
 * Example 2:
 * Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, newColor = 2
 * Output: [[2,2,2],[2,2,0],[2,0,1]]
 * Explanation: From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected
 * by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.
 * Note the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.
 * <p>
 * Example 2:
 * Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, newColor = 2
 * Output: [[2,2,2],[2,2,2]]
 */
public class FloodFill {
	public static int[][] floodFill(int[][] image, int sr, int sc, int newColor) {

		int color = image[sr][sc];
		if (color != newColor)
			dfs(image, sr, sc, color, newColor);
		return image;

	}

	public static void dfs(int[][] image, int row, int column, int color, int newColor) {
		if (row < 0 || row >= image.length || column < 0 || column >= image[0].length || image[row][column] != color) {
			return;
		}

		if (image[row][column] == color) {
			image[row][column] = newColor;
		}

		dfs(image, row - 1, column, color, newColor);
		dfs(image, row + 1, column, color, newColor);
		dfs(image, row, column - 1, color, newColor);
		dfs(image, row, column + 1, color, newColor);
	}


	private static void displayMatrix(int[][] matrix) {
		for (int[] row : matrix) {
			System.out.println(Arrays.toString(row));
		}
	}

	public static void main(String[] args) {
		int[][] image = new int[][]
				{
						{0, 0, 0},
						{1, 1, 0}
				};

		image = floodFill(image, 1, 0, 2);
		displayMatrix(image);
	}
}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Flood Fill on the smallest matrix that still exercises the boundary case you care about. Matrix problems often fail on the first or last row/column before they fail anywhere else.

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

- Flood Fill becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
