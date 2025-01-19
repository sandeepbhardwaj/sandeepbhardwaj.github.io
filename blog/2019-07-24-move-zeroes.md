---
layout: post
title: Move Zeroes
author: Sandeep Bhardwaj
published: true
date: 2019-07-24 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: [Array, Zeroes]
summary: "write a function to move all 0's to the end of it while maintaining the relative order of the non-zero elements"
---

<h3>Move Zeroes</h3>


``` java
/**
 * 283. Move Zeroes
 * <p>
 * Given an array nums, write a function to move all 0's to the end of it while maintaining the relative order of the
 * non-zero elements.
 * <p>
 * Example:
 * <p>
 * Input: [0,1,0,3,12]
 * Output: [1,3,12,0,0]
 * Note:
 * <p>
 * You must do this in-place without making a copy of the array.
 * Minimize the total number of operations.
 */
public class MoveZeroes {
	public void moveZeroes(int[] nums) {
		int left = 0;
		int right = 0;

		while (left <= right && right < nums.length) {
			if (nums[left] == 0 && nums[right] == 0) {
				right++;
				continue;
			}

			if (nums[left] == 0) {
				int temp = nums[right];
				nums[right] = nums[left];
				nums[left] = temp;

				left++;
				right++;
				continue;
			}

			//if left is not zero
			left++;
			right++;
		}

	}
}
```