---
  layout: post
  author: Sandeep Bhardwaj
  title: Things To Do After Installing Elementary OS Freya
  published: true
  tags: [Elementary OS, Ubuntu]
  keywords: [Elementary Tweak, Google Chrome, RAR, uGet, Usb Indicator, Gnome, DropBox, Oracle JDK, Libre Office, Elementary, Plus, Thunderbird, Git, SmartGit, Meld, Jekyll, Ruby, NodeJS, Python, Ubuntu, Elementary OS]
  summary: "Enable laptop touchpad click, Enable Canonical Partners repository, Install Restricted Extra, Install Elementary Tweak, Install Google Chrome, Enable minimize button on google-chrome, Install RAR,Install uGet on Elementary Freya, Install Usb indicator on Elementary OS Freaya, Install Gnome System Monitor, Install DropBox on Elementary OS Freya, Install Oracle JDK on Ubuntu, Install Libre Office on Ubuntu, Install Elementary Plus on elementary os freya, Install Thunderbird on ubuntu using terminal, Improve Battery Life on ubunutu, Enable Colors In Terminal on ubuntu, Install Git on ubuntu, Setup Git on ubuntu, Setup Meld Diff Viewer for Git on ubuntu, Install SmartGit on ubuntu, Install Jekyll on ubuntu, Install Ruby on ubuntu, Install NodeJS on ubuntu, Install Python on ubuntu"
  date: 2015-10-23 22:05:00 +5:30
---

<ul>
  <li><a href="#enable-laptop-touchpad-click">Enable laptop touchpad click</a></li>
  <li><a href="#enable-canonical-partners-repository">Enable Canonical Partners repository</a></li>
  <li><a href="#install-restricted-extra">Install Restricted Extra</a></li>
  <li><a href="#install-elementary-tweak">Install Elementary Tweak</a></li>
  <li><a href="#install-google-chrome">Install Google Chrome</a></li>
  <li><a href="#enable-minimize-button-on-google-chrome">Enable minimize button on google-chrome</a></li>
  <li><a href="#install-rar">Install RAR</a></li>
  <li><a href="#install-gimp">Install GIMP</a></li>
  <li><a href="#install-uget-on-elementary-freya">Install uGet on Elementary Freya</a></li>
  <li><a href="#install-transmission">Install Transmission</a></li>
  <li><a href="#clip-grab-for-youtube">Clip Grab for YouTube</a></li>
  <li><a href="#install-banshee-music-player">Install Banshee Music Player</a></li>
  <li><a href="#install-covergloobus">Install Covergloobus</a></li>
  <li><a href="#install-usb-indicator">Install Usb indicator</a></li>
  <li><a href="#install-gnome-system-monitor">Install Gnome System Monitor</a></li>
  <li><a href="#install-dropbox">Install DropBox</a></li>
  <li><a href="#install-oracle-jdk">Install Oracle JDK</a></li>
  <li><a href="#install-libre-office">Install Libre Office</a></li>
  <li><a href="#install-elementary-plus">Install Elementary Plus</a></li>
  <li><a href="#install-thunderbird">Install Thunderbird</a></li>
  <li><a href="#improve-battery-life">Improve Battery Life</a></li>
  <li><a href="#install-samba">Install Samba</a></li>
  <li><a href="#enable-colors-in-terminal">Enable Colors In Terminal</a></li>
  <li><a href="#install-git">Install Git</a></li>
  <li><a href="#setup-git">Setup Git</a></li>
  <li><a href="#setup-meld-diff-viewer-for-git">Setup Meld Diff Viewer for Git</a></li>
  <li><a href="#install-smartgit">Install SmartGit</a></li>
  <li><a href="#install-jekyll">Install Jekyll</a>
    <ul>
      <li><a href="#install-ruby">Install Ruby</a></li>
      <li><a href="#install-nodejs">Install NodeJS</a></li>
      <li><a href="#install-python">Install Python</a></li>
      <li><a href="#install-jekyll">Install Jekyll</a></li>
    </ul>
  </li>
</ul>  

<h2>Steps While Installing</h2>
While installing a fresh copy of Elementary OS Freya, <code>Install the updates</code> while installing otherwise you may face below issue.There are so many issue already listed on launchpad related to this issue.

<code>
grub-efi-amd64-signed package failed to install into /target/
</code>

To prevent this issue just install the updates while installing.

<h2>Post Installation Steps</h2>

For stable and better desktop environment i followed below steps whenever i installed fresh copy of my favorite Linux desktop Elementary OS Freya.

<h3><a id="enable-laptop-touchpad-click">Enable laptop touchpad click</a></h3>
<b>Note:</b> Follow only if your laptop touchpad not working (Click not working).

``` bash
sudo add-apt-repository ppa:hanipouspilot/focaltech-dkms
sudo apt-get update
sudo apt-get install focaltech-dkms
```

then enter the below two command.

``` bash
sudo modprobe -r psmouse
sudo modprobe psmouse proto=imps
```

Now touchpad click start working. The above two commands makes the touchpad working only for current session. To make it permanent create a file with below command you can use your favorite editor.

``` bash
sudo gedit /etc/modprobe.d/psmouse.conf
```

add this line to file <code>options psmouse proto=imps</code> and save the changes.

<h3><a id="enable-canonical-partners-repository">Enable Canonical Partners repository</a></h3>

<code> Software & Updates > Other Softwares > Canonical Partners </code>

<h3>Update the system</h3>
``` bash
sudo apt-get update
sudo apt-get dist-upgrade
```

Difference between <code>sudo apt-get upgrade</code> and <code>sudo apt-get dist-upgrade</code> [here](http://askubuntu.com/questions/81585/what-is-dist-upgrade-and-why-does-it-upgrade-more-than-upgrade).

<h3><a id="install-restricted-extra">Install Restricted Extra</a></h3>
``` bash
sudo apt-get install ubuntu-restricted-extras
```

<h3><a id="install-elementary-tweak">Install Elementary Tweak</a></h3>
``` bash
sudo add-apt-repository ppa:mpstark/elementary-tweaks-daily
sudo apt-get update
sudo apt-get install elementary-tweaks
```

After installing elementary tweak enable minimize button

<code>System Settings > Tweaks > Window controls to <b>Windows</b></code>

<h3><a id="install-google-chrome">Install Google Chrome</a></h3>

Download [Google Chrome]( https://www.google.com/intl/en-US/chrome/browser/) <code>64 bit .deb (For Debian/Ubuntu)</code> and install it. After installation you found that there is no minimize button on chrome so follow below step.

<h3><a id="enable-minimize-button-on-google-chrome">Enable minimize button on google-chrome</a></h3>
``` bash
gconftool-2 --set /apps/metacity/general/button_layout --type string ":minimize:maximize:close"
```

<h3><a id="install-rar">Install RAR</a></h3>
``` bash
sudo apt-get install rar
```

<h3><a id="install-gimp">Install GIMP</a></h3>
``` bash
sudo add-apt-repository ppa:otto-kesselgulasch/gimp
sudo apt-get update
sudo apt-get install gimp
```

<h3><a id="install-uget-on-elementary-freya">Install uGet</a></h3>
As per my knowledge uGet is the best download manager.
``` bash
sudo add-apt-repository ppa:plushuang-tw/uget-stable
sudo apt update
sudo apt install uget
```

<h3><a id="install-transmission">Install Transmission</a></h3>
``` bash
sudo add-apt-repository ppa:transmissionbt/ppa
sudo apt-get update 
sudo apt-get install transmission
```

<h3><a id="clip-grab-for-youtube">Clip Grab for YouTube</a></h3>
``` bash
sudo add-apt-repository ppa:clipgrab-team/ppa
sudo apt-get update 
sudo apt-get install clipgrab
```

<h3><a id="install-banshee-music-player">Install Banshee Music Player</a></h3>
``` bash
sudo add-apt-repository ppa:banshee-team/ppa
sudo apt-get update
sudo apt-get install banshee
```

<h3><a id="install-covergloobus">Install Covergloobus</a></h3>
``` bash
sudo add-apt-repository ppa:gloobus-dev/covergloobus
sudo apt-get update
sudo apt-get install covergloobus
```

<h3><a id="install-usb-indicator">Install Usb indicator</a></h3>
``` bash
sudo add-apt-repository ppa:yunnxx/gnome3
sudo apt-get update
sudo apt-get install indicator-usb
```

<h3><a id="install-gnome-system-monitor">Install Gnome System Monitor</a></h3>
``` bash
sudo apt-get install gnome-system-monitor
```


<h3><a id="install-dropbox">Install DropBox</a></h3>

Follow this link [https://github.com/zant95/elementary-dropbox](https://github.com/zant95/elementary-dropbox) for installing the dropbox.

<h3><a id="install-oracle-jdk">Install Oracle JDK</a></h3>
For Installing Java on follow the [post]({% post_url 2015-10-03-install-oracle-jdk-on-ubuntu %}).

<h3><a id="install-libre-office">Install Libre Office</a></h3>

This will install latest libre office <code>(current version:- Libre Office 5)</code>.
``` bash
sudo add-apt-repository ppa:libreoffice/ppa  &&  sudo apt-get update  &&  sudo apt-get install libreoffice 
```

<h3><a id="install-elementary-plus">Install Elementary Plus</a></h3>
For additional icons for libreoffice, sublime text, vlc etc etc. 

``` bash
sudo add-apt-repository ppa:cybre/elementaryplus
sudo apt-get update
sudo apt-get install elementaryplus
```

<h3><a id="install-thunderbird">Install Thunderbird</a></h3>
``` bash
sudo add-apt-repository ppa:ubuntu-mozilla-security/ppa
sudo apt-get update
sudo apt-get install thunderbird
```

<h3><a id="improve-battery-life">Improve Battery Life</a></h3>
``` bash
sudo add-apt-repository ppa:linrunner/tlp
sudo apt-get update
sudo apt-get install tlp tlp-rdw
sudo tlp start
```

<h3><a id="install-samba">Install Samba</a></h3>
``` bash
sudo apt-get install samba samba-common system-config-samba python-glade2 gksu
```

<h3><a id="enable-colors-in-terminal">Enable Colors In Terminal</a></h3>
Go to home directory and make hidden files visible and then un-comment the below line in <code>.bashrc</code> file.
``` bash
force_color_prompt=yes
```

<h3><a id="install-git">Install Git</a></h3>
``` bash
sudo apt-get install git
```

<h3><a id="setup-git">Setup Git</a></h3>
``` bash
git config --global user.name "Your Name"
git config --global user.email "youremail@domain.com"
```

See all of the git configuration items:
``` bash
git config --list
```

<h3><a id="setup-meld-diff-viewer-for-git">Setup Meld Diff Viewer for Git</a></h3>
Follow the [link](http://www.wiredforcode.com/blog/2011/06/04/git-with-meld-diff-viewer-on-ubuntu).

<h3><a id="install-smartgit">Install SmartGit</a></h3>
Best tool for git and its free for non-commerical use as well.

Download the [SmartGit](http://www.syntevo.com/smartgit/download) deb package and install it.

<h3><a id="install-jekyll">Install Jekyll</a></h3>

Pre-requisites for jekyll are ruby, ruby gems, nodejs and python.

<h4><a id="install-ruby">Install Ruby</a></h4>
``` bash
sudo apt-get install ruby-full
```

<h4><a id="install-ruby">Install RubyGems</a></h4>
``` bash
sudo gem update --system
sudo gem install rubygems-update
sudo update_rubygems
```

<h4><a id="install-nodejs">Install NodeJS</a></h4>
``` bash
sudo apt-get install nodejs
```

<h4><a id="install-python">Install Python</a></h4>
Check python version. I hope its already installed on your system.

``` bash
python --version
```

On my machine the version is <code>Python 2.7.6</code>

<h4><a id="install-jekyll">Install Jekyll</a></h4>
Now, Finally install jekyll.

``` bash
sudo gem install jekyll
```

Install Jekyll Sitemap plugin.

``` bash
sudo gem install jekyll-sitemap
```

<br/>
I hope you like this post and it will be helpful for you. Please share your view and thoughts in comment as well. so that i can make this post more useful and more better.
