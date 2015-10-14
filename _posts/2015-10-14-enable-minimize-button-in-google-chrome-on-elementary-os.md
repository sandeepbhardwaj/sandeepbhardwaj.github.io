---
  layout: post
  author: Sandeep Bhardwaj
  title: Enable minimize button in Google chrome on elementary os
  published: true
  tags: [Elementary OS]
  date: 2015-10-14 23:15:00 +5:30
---

By default Google chrome do not have minimize button on Elementary OS and we can't enable it by using Elementary tweak tool. But we can make it enable by modifying the gConfigurations. Just type the below line in terminal and its done.

{% highlight bash %}
gconftool-2 --set /apps/metacity/general/button_layout --type string ":minimize:maximize:close"
{% endhighlight %}