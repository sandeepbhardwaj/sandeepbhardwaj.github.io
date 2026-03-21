---
categories:
- DSA
- Java
date: 2026-03-29
seo_title: Trie Pattern in Java - Interview Preparation Guide
seo_description: Learn Trie in Java for prefix search, autocomplete, and dictionary-based
  backtracking problems.
tags:
- dsa
- java
- trie
- prefix-tree
- strings
title: Trie Pattern in Java - Interview Preparation Guide
toc: true
toc_icon: cog
toc_label: In This Article
header:
  overlay_image: "/assets/images/trie-banner.svg"
  overlay_filter: 0.35
  caption: Efficient Prefix-Based String Search
  show_overlay_excerpt: false
---
Trie (prefix tree) is optimized for prefix operations on string sets.
It is widely used in dictionaries, autocomplete, and word-search style problems.

---

## Core Trie Node

```java
class TrieNode {
    TrieNode[] next = new TrieNode[26];
    boolean isWord;
}
```

---

## Basic Trie Implementation

What we are doing actually:

1. Walk character by character from the root.
2. Create missing nodes during insert.
3. Distinguish “path exists” from “complete word exists” using `isWord`.

```java
class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode cur = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (cur.next[i] == null) cur.next[i] = new TrieNode(); // Create missing prefix node.
            cur = cur.next[i];
        }
        cur.isWord = true; // Mark only the full word end.
    }

    public boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isWord; // Full word must end here.
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null; // Prefix existence is enough.
    }

    private TrieNode walk(String s) {
        TrieNode cur = root;
        for (char ch : s.toCharArray()) {
            int i = ch - 'a';
            if (cur.next[i] == null) return null; // Prefix path breaks here.
            cur = cur.next[i];
        }
        return cur;
    }
}
```

Debug steps:

- print traversed characters during insert and search
- verify `search("ca")` and `startsWith("ca")` return different results when appropriate
- test inserting one word that is also a prefix of another

---

## Dry Run (Insert + Search)

Insert words: `"cat"`, `"car"`

Structure after insert:

- root -> `c` -> `a`
  - branch `t` (`isWord=true`)
  - branch `r` (`isWord=true`)

`search("ca")` -> reaches node but `isWord=false` => false  
`startsWith("ca")` -> node exists => true  
`search("car")` -> node exists and `isWord=true` => true

This separation between path existence and word completion is key.

---

## Problem 1: Implement Trie

Problem description:
Support `insert`, `search`, and `startsWith` efficiently on a growing word set.

What we are doing actually:

1. Reuse the template above directly.
2. Store structure in shared prefix nodes.
3. Use `isWord` to mark only complete words.

---

## Problem 2: Word Dictionary (Wildcard Search)

Use trie + DFS where `.` branches across children.

Problem description:
Support word insertion plus search where `.` can match any single character.

What we are doing actually:

1. Insert works like a normal trie.
2. Search becomes DFS because `.` may branch to many children.
3. Stop early as soon as one branch succeeds.

```java
class WordDictionary {
    private final TrieNode root = new TrieNode();

    public void addWord(String word) {
        TrieNode cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) cur.next[i] = new TrieNode(); // Build missing path.
            cur = cur.next[i];
        }
        cur.isWord = true;
    }

    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String w, int idx, TrieNode node) {
        if (node == null) return false;
        if (idx == w.length()) return node.isWord; // Reached end of pattern.

        char c = w.charAt(idx);
        if (c == '.') {
            for (TrieNode child : node.next) {
                if (dfs(w, idx + 1, child)) return true; // Any matching child is enough.
            }
            return false;
        }
        return dfs(w, idx + 1, node.next[c - 'a']); // Continue deterministic branch.
    }
}
```

Debug steps:

- print `idx` and current character during DFS
- test exact-match search and wildcard search separately
- verify `.` explores all children, not just the first non-null one

---

## Problem 3: Word Search II

Build trie of dictionary words and DFS on board; prune paths missing trie children.

---

## Common Mistakes

1. Forgetting end-of-word marker
2. Not pruning DFS when trie path is null
3. Hardcoding character set assumptions unintentionally
4. High memory usage without cleanup in large dictionaries

---

## Memory Optimization Note

For sparse dictionaries, `Map<Character, TrieNode>` children can reduce memory versus fixed `TrieNode[26]`.
Trade-off: more overhead per access.

Choose based on character set size and dictionary scale.

---

## Debug Checklist

1. verify `isWord` is set only at full-word end
2. print traversed chars during failed search
3. for wildcard search, ensure all children are explored on `.`
4. in board DFS problems, confirm visited rollback and trie-pruning both happen

Most trie bugs come from word-end handling or missing prune conditions.

---

## Practice Set (Recommended Order)

1. Implement Trie (Prefix Tree) (LC 208)  
   [LeetCode](https://leetcode.com/problems/implement-trie-prefix-tree/)
2. Design Add and Search Words Data Structure (LC 211)  
   [LeetCode](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
3. Word Search II (LC 212)  
   [LeetCode](https://leetcode.com/problems/word-search-ii/)
4. Replace Words (LC 648)  
   [LeetCode](https://leetcode.com/problems/replace-words/)
5. Longest Word in Dictionary (LC 720)  
   [LeetCode](https://leetcode.com/problems/longest-word-in-dictionary/)

---

## Key Takeaways

- Trie is the right tool for repeated prefix queries.
- Trie + DFS is powerful for grid/dictionary search problems.
- Memory tradeoff is the cost for fast prefix operations.
