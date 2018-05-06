---
  layout: post
  title: Comparing two list and removing duplicate elements
  published: true
  tags: [Java]
  date: 2011-03-08 20:55:00 +5:30
---
<h3>Comparing two list and removing duplicate elements.</h3>

``` java
import java.util.ArrayList;
import java.util.List;

public class CheckList
{

 public static void main(String[] args)
 {

  List<string> a = new ArrayList<string>();
  a.add("a");
  a.add("b");

  List<string> b = new ArrayList<string>();
  b.add("c");
  b.add("a");
  b.add("d");
  b.add("f");

  b.removeAll(a);

  for (String str : b)
  {
   System.out.println(str);
  }
 }
}
```