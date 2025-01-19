---
  layout: post
  author: Sandeep Bhardwaj
  title: Enable minimize button in Google chrome on Elementary OS
  published: true
  tags: [Elementary OS, Ubuntu]
  date: 2015-10-14 23:15:00 +5:30
  keywords: "Google Chrome , minimize button, Elementary OS, Ubuntu"
  summary: "Enable minimize button in Google chrome on Elementary OS, Enable minimize button in Google chrome on Ubuntu, Configure button layout in Ubuntu"
---

By default Google chrome do not have minimize button on Elementary OS and we can't enable it by using Elementary tweak tool. But we can make it enable by modifying the gConfigurations. Just type the below line in terminal and its done.

``` bash
gconftool-2 --set /apps/metacity/general/button_layout --type string ":minimize:maximize:close"
```