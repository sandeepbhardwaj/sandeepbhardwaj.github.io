---
  layout: post
  author: Sandeep Bhardwaj
  title: Renaming files using terminal on ubuntu
  published: true
  tags: [Ubuntu , Tips & Tricks]
  date: 2015-10-13 21:15:00 +5:30
---

Suppose we have lots of lots file in a directory and we need to rename of modify the extension of all the file, then renaming one by one is pain and not a good idea as well.

If we want to rename all the files in directory in one shot then we can use below command.

<b>Example</b>:- Renaming all file with extension html to md.

``` bash
find -L . -type f -name "*.html" -print0 | while IFS= read -r -d '' File_Name; do
    mv -- "$File_Name" "${File_Name%.html}.md"
done
```