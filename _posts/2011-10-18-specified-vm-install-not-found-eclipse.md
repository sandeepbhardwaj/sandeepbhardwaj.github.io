---
  layout: post
  title: Specified VM install not found:- Eclipse
  published: true
  tags: [Eclipse]
  date: 2011-10-18 13:30:00 +5:30
---

<h2>Specified VM install not found: type Standard VM, name jre6</h2>

Some times when we are trying to run build.xml using ant in eclipse it will gives an error "Specified VM install not found: type Standard VM, name jre6"

There is a simple solution for this just delete the launch file of that project.

<h4>Solution</h4>

Delete the file from the location given below

``` bash
"<Your eclipse workspace location>\.metadata\.plugins\org.eclipse.debug.core\.launches\<projectname>.xml.launch"
```

Finally restart your eclipse.

Hurray !!! now your problem solved. :)