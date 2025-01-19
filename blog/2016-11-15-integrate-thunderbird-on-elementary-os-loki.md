---
layout: post
title: Integrate Thunderbird on Elementary OS Loki
author: Sandeep Bhardwaj
published: true
date: 2016-11-15 19:30:00 +5:30
tags: [Elementary OS]
keywords: [Elementary OS Loki , GNotifier, MinimizeToTray, Stylish, enabling auto-hide]
summary: "Integrate Thunderbird on Elementary OS Loki, Thunderbird notification with Elementary OS loki, GNotifier, Thunderbird theme for Elementary OS"
---

Install Thunderbird using below command.

``` bash
sandeep@koko:~$ sudo apt install thunderbird 
```

then install 

``` bash
sandeep@koko:~$ sudo apt install thunderbird-gnome-support  ttf-lyx
```

After successful installation of thunderbird install below add-ons to make Thunderbird more integrated and beautiful.

<h3>Add-ons</h3>

1. **GNotifier** :- GNotifier integrates thunderbird's notifications with the native notification system.

2. **MinimizeToTray revived** :- Minimizes windows into the system trayMinTrayR.

3. **Stylish** :- Restyle the thunderbird css with Stylish, a user styles manager. and then install the below theme.

	* [https://userstyles.org/styles/76739/fedora-18-thunderbird-tweaks](https://userstyles.org/styles/76739/fedora-18-thunderbird-tweaks)

<h3>Change in thunderbird config</h3>

<code>Thunderbird Preferences</code> > <code>Advanced</code> > <code>General</code> > <code>Config Editor</code>
then set <code>mail.tabs.autoHide</code> to <code>true</code>.


