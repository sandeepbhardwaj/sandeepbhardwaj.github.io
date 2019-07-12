---
layout: post
title: Find the smallest missing positive integer
author: Sandeep Bhardwaj
published: true
date: 2019-07-14 01:00:00 +5:30
category: Datastructure & Algorithms
tags: [Leetcode, Datastructure & Algorithms]
keywords: "Array, Unsorted Array"
summary: "Find the smallest missing positive integer in Unsorted Array"
---

<h3>Find the smallest missing positive integer</h3>


``` java
/**
 * 41. First Missing Positive
 * <p>
 * Given an unsorted integer array, find the smallest missing positive integer.
 * <p>
 * Example 1:
 * <p>
 * Input: [1,2,0]
 * Output: 3
 * Example 2:
 * <p>
 * Input: [3,4,-1,1]
 * Output: 2
 * Example 3:
 * <p>
 * Input: [7,8,9,11,12]
 * Output: 1
 */
public class FirstMissingSmallestPositiveInteger {

	public static void main(String[] args) {
		int[] arr = new int[]{3, 4, -1, 1};

		System.out.println(firstMissingPositive(arr));
	}

	public static int firstMissingPositive(int[] nums) {

		int dummy = nums.length + 2;
		int size = nums.length;

		//for negative and numbers larger than length
		for (int i = 0; i < size; i++) {
			if (nums[i] <= 0 || nums[i] > size) {
				nums[i] = dummy;
			}
		}

		for (int i = 0; i < size; i++) {
			if (nums[i] == dummy || nums[i] == -dummy) {
				continue;
			}
			int val = Math.abs(nums[i]);
			nums[val - 1] = -Math.abs(nums[val - 1]);
		}

		for (int i = 0; i < size; i++) {
			if (nums[i] >= 0)
				return i + 1;
		}

		return size + 1;
	}
}
```

