---
  layout: post
  title: Enable laptop touch-pad on Elementary OS Freya
  published: true
  tags: [Linux , Elementary OS]
  date: 2015-10-03 17:44:00 +5:30
---

Yesterday, i installed fresh copy of <b>Elementary OS Freya</b> on my Samsung laptop. But after installing i faced a weired problem that my touch-pad of laptop not working but every thing just working fine with external mouse.

So, i search on Google and find out so many solution but only the below one works for me. 


{% highlight scss %}

sudo add-apt-repository ppa:hanipouspilot/focaltech-dkms
sudo apt-get update
sudo apt-get install focaltech-dkms
sudo modprobe -r psmouse 
sudo modprobe psmouse

{% endhighlight %}

I hope this will work for you as well if you are also facing the same issue.