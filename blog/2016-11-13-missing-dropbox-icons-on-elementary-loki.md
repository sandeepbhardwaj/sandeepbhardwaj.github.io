---
layout: post
title: Missing Dropbox icons on Elementary OS Loki
author: Sandeep Bhardwaj
published: true
date: 2016-11-13 13:00:00 +5:30
tags: [Elementary OS]
keywords: [Elementary OS, Loki , Dropbox, Missing Icon, Wingpanel]
summary: "Install Dropbox on Elementary OS Loki, Dropbox icon missing on elementary loki, How to install dropbox on Elementary OS loki official way"
---

After installing the Dropbox on latest <code>Elementary OS Loki</code> icons of dropbox is missing in wingpanel.

For fixing this issue you just need modify dropbox.desktop file.Open the <code>dropbox.desktop</code> file in your favourite editor.

``` bash
sandeep@koko:~$ sudo gedit /usr/share/applications/dropbox.desktop 
```

then replace the line with <code>Exec</code> with below line and then restart you machine.

``` bash
Exec=env XDG_CURRENT_DESKTOP=Unity QT_STYLE_OVERRIDE='' dropbox start -i
```

This solution worked for me and i hope it will work for you as well.


