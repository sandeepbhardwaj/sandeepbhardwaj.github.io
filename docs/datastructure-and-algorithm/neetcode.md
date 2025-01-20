# NeetCode 150

_NeedCode 150 problems._

---

## Arrays & Hashing

1. **[Valid Anagram](https://leetcode.com/problems/valid-anagram)**  
   _Sol 1: - sort the s1 and s2 and compare._  
   _Sol 2:- use HashMap as frequency map._  
   _Sol 3:- instead of HashMap use map as to store frequency of each characeter._ ASCII of `a` is 97

   ```java
   int[] freq = new int[26];

   for(char ch: s.toCharArray())
   {
   	freq[ch-97]++;  // or freq[ch-'a']++;
   }
   ```

1. **[Group Anagrams](https://leetcode.com/problems/group-anagrams/)**  
   _Sort all the strings and check if its same then add it map_  
   _key as sorted string and List of input strings as value_

   ```java
   result.putIfAbsent(sortedString, new ArrayList<String>());
   result.get(sortedString).add(str);
   ```

1. **Top K frequent elements**  
   _Solution 1 : Create frequency map and then use bucket sort_  
   _Solution 2 : Use heap_

1. **Encode and Decode Strings**  
   _Sol : add length of string along with a placeholder like str=hello 99 --> 5#hello2#99_

1. **[Products of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)**  
   _Calculate preFix and suffix multiplication of a number and multiply those to get result_  
   _`result[i] = pre[i] * suf[i]`_

   ```java
   pre[0] = 1;
   for (int i = 1; i < nums.length; i++) {
   	pre[i] = pre[i - 1] * nums[i - 1]; // (i-1) in case of prefix multiplication
   }

   suff[nums.length - 1] = 1;
   for (int i = nums.length - 2; i >= 0; i--) {
   	suff[i] = nums[i + 1] * suff[i + 1]; // (i+1) in case of suffix multiplication
   }
   ```

1. **[Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)**  
   _Create a hashSet one for column , one for row and one for 3\*3 block_  
   _"OR" crease single set and add some string explaining in which row it found_

   ```java
   //if char already exist
   if(!seen.add(number+" found in row "+row) ||
    !seen.add(number+" found in column "+col) ||
    !seen.add(number+" found in cell "+row/3+"-"+col/3)) {
   	return false;
   }
   ```

1. **[Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)**  
   _Step 1:- populate a set_  
   _Step 2:- check num+1 exist then `while(set(num+1)) running_count++`_  
   _Optimization :-_

   ```java
   // if num less than current num exit do nothing
   if (set.contains(num - 1)) {
   	continue;
   }
   ```

---

## Two Pointers

1. **[Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)**  
   _Just use two pointers_

1. **[3Sum](https://leetcode.com/problems/3sum/)**  
   _Sol 1: Use 2Sum - keep hold first number and then find next two using two sum and store those in set in sorted order_  
   _Sol 2: Sort the array and then use two pointer approach , keep `l++` or `r--` if last or next element is same to get rid of duplicate_

1. **Container With Most Water**  
   _Use two pointers l and r and calcaulte area using `Math.min(height[l], height[r]) * (r - l);`_  
   _(r-l) is width_  
   _then move r of l which one is smaller_

1. **[Trapping Rain Water [M.Imp]](https://leetcode.com/problems/trapping-rain-water/)**  
   _Sol 1: Do create pre processing array for leftMax and rightMax then `Min(leftMax,rightMax)-height of bar`_

   ```java
   for (int i = 1; i < n; ++i)
   	leftMax[i] = Math.max(height[i-1], leftMax[i-1]);
   for (int i = n-2; i >= 0; --i)
   	rightMax[i] = Math.max(height[i+1], rightMax[i+1]);

   for (int i = 0; i < n; ++i) {
   	int waterLevel = Math.min(leftMax[i], rightMax[i]);
   	if (waterLevel >= height[i]) ans += waterLevel - height[i];
   }
   ```

   _Sol 2: use leftMax and righMax variable and use two pointers and move till `(l<=right)`_

   ```java
   // check for left max using current height
   leftMax=Math.max(leftMax,height[l]);

   //check for right max using current height
   rightMax=Math.max(rightMax,height[r]);

   if(leftMax<rightMax){
   	totalWater+= leftMax-height[l];
   	l++;
   }
   else{
   	totalWater+= rightMax-height[r];
   	r--;
   }
   ```

---

## Sliding Window

1. **[Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)**  
   _Keep a Set to hold unique characters_

1. **[Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)**  
   _Sol 1: [Solution](https://leetcode.com/problems/longest-repeating-character-replacement/solutions/4420284/easy-java-solution-detailed-explanation-of-sliding-window-approach/)_

   ```java
   while (l <= r && r < s.length()) {
      freq[s.charAt(r) - 'A']++;

      int curr_max = Arrays.stream(freq).max().getAsInt();

      maxFreq = Math.max(maxFreq, curr_max);

      int windowSize = r - l + 1;
      // check the window size = r-l+1<=k
      if (windowSize - maxFreq <= k) {
         result = Math.max(result, r - l + 1);
         r++; // increase the window
      } else {
         freq[s.charAt(l) - 'A']--;
         l++;
         r++; // this need to be increase else duplicate r will be added again at line 11
      }
   }
   ```

1. **[Permutation In String](https://leetcode.com/problems/permutation-in-string/)**  
   _Sol 1:- keep a hashMap to store the s1 and s2 and compare the both when size of window met (size of window ==s1.length())_  
   _instead of HashMap we can keep a array of size 26 to store alphabets_  
   _Sol2: This can we done using single array **[solution](https://leetcode.com/problems/permutation-in-string/solutions/102588/java-solution-sliding-window/)**_

   ```java
   while (l <= r && r < s2.length()) {
   	freqMap_2[s2.charAt(r) - 97]++;

   	if (r - l + 1 == s1.length()) // window size met
   	{
   		if (Arrays.equals(freqMap_1, freqMap_2)) {
   			return true;
   		} else {
   			freqMap_2[s2.charAt(l) - 97]--;
   			l++; // decrease window size
   		}
   	}
   	r++;
   }
   ```

1. **[Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)**

---

## Stack
