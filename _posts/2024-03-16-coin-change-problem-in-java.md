---
title: "Coin Change Problem in Java"
date: '2024-03-16'
categories:
- DSA
- Java
tags:
- java
- dsa
- algorithms
- dynamic-programming
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: "Coin Change Problem in Java"
seo_description: "Understand Coin Change Problem in Java with a clean Java walkthrough, problem breakdown, and debugging notes."
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Dynamic Programming Problems in Java
  show_overlay_excerpt: false
---
Coin Change Problem is a good example of turning a small-looking problem into a precise invariant. The Java implementation below captures the core idea, so this post focuses on why the approach works, what it is really solving, and how to debug it when the first attempt goes wrong.

---

## Problem 1: Coin Change Problem

Problem description:
We are given a problem around **Coin Change Problem** and need a Java solution that is correct on both normal and edge-case inputs. The challenge is usually not writing a loop or recursion call; it is preserving the one invariant that makes the approach valid from start to finish.

What we are solving actually:
We are solving for correctness under the constraints that matter for this problem family. In practice, that means understanding which state must be remembered, what can be derived on the fly, and where a brute-force approach would waste work or break boundary conditions.

What we are doing actually:

1. define the state in words before filling code or a table
2. write the transition from smaller states to the current state
3. use table-based state transitions so repeated subproblems are not recomputed blindly
4. verify base cases first because one wrong seed poisons the whole DP

## Why This Problem Matters

- dynamic programming is easier when state and transition are named before code is written
- most DP mistakes come from weak base cases or double-counting transitions
- Coin Change Problem is useful because the recurrence becomes the real solution, not the loop syntax

## Implementation Context

This post is built around a Java implementation of the problem and keeps the solution shape close to the version I wanted to teach from. The goal is to preserve the underlying idea while making the reasoning easier to follow.

That keeps the article practical. Instead of presenting an overly polished answer detached from how these problems are usually solved, the explanation stays close to interview-style Java code and makes the invariants explicit.

## Java Solution

```java

/**
 * Given a total and coins of certain denominations find number of ways total
 * can be formed from coins assuming infinity supply of coins
 *
 * @author sandeep
 */
public class CoinChangeProblem {

	public static int changeCoin(int[] coins, int amount) {
		int numberOfCoins = coins.length;

		// array with numberOfCoins+1 and amount+1
		int[][] T = new int[numberOfCoins + 1][amount + 1];

		// loop through coins
		for (int i = 0; i <= numberOfCoins; i++) {
			// loop through amount
			for (int j = 0; j <= amount; j++) {

				// base condition
				if (i == 0) {
					if (j == 0) {
						T[i][j] = 1;
					}
					// to fill first row
					else {
						T[i][j] = 0;
					}
				} else {
					// if coin is greater than amount
					if (coins[i - 1] > j) {
						T[i][j] = T[i - 1][j];
					} else {
						// exclude the new + include the new (in same row)
						T[i][j] = T[i - 1][j] + T[i][j - coins[i - 1]];
					}
				}

			}
		}

		displayMatrix(numberOfCoins, amount, T);

		return T[numberOfCoins][amount];
	}

	private static void displayMatrix(int m, int n, int[][] T) {
		for (int i = 0; i <= m; i++) {
			for (int j = 0; j <= n; j++) {
				System.out.print(T[i][j] + " | ");
			}
			System.out.println();
		}
		System.out.println();
	}

	public static void main(String[] args) {
		int amount = 10;
		int[] v = {2, 5, 3, 6};
		System.out.println("By Dynamic Programming " + changeCoin(v, amount));
	}

}
```

## Why This Solution Works

The implementation works because it keeps the critical state small and meaningful. Instead of trying to remember every past possibility, it keeps only the information needed for the next step, and that is exactly what makes the solution easier to reason about than a brute-force version.

Another good thing to notice is that the code is direct. The data structure and control flow match the problem shape closely, which is what you want in DSA code: fewer moving parts, cleaner invariants, and a faster path to debugging.

## Dry Run

Dry-run Coin Change Problem by filling only the first few states or table cells by hand. If the first transitions are not obvious on paper, they will not become clearer in code.

If you can explain the dry run without hand-waving, the code usually stops feeling memorized and starts feeling mechanical. That is the point where interview pressure drops and implementation speed improves.

## Edge Cases To Test

- base state with amount or size zero
- state values that are unreachable
- table initialization that silently changes all later answers

These edge cases are worth testing before you trust the solution. Many DSA bugs do not come from the main idea; they come from assuming the input shape is always convenient.

## Performance Notes

The implementation leans on table-based state transitions. When you review or optimize it, focus first on how many full passes it makes over the input and what extra state it keeps alive, because those two choices dominate both speed and memory use more than small syntax tweaks do.

## Debug Steps

Debug steps:

- write the base row or base column on paper first
- print a tiny DP table for a small example
- check whether each transition reads from already valid states
- verify unreachable states are not treated as real answers

## Key Takeaways

- Coin Change Problem becomes easier once the central invariant is stated in plain language.
- This solution is useful because the control flow stays close to the data structure or recursion contract it depends on.
- If the implementation fails, debug the state transition first, not the syntax.
