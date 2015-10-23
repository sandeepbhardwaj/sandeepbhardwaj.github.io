---
  layout: post
  author: Sandeep Bhardwaj
  title: Things To Do After Installing Elementary OS Freya
  published: true
  tags: [Elementary OS, Ubuntu]
  summary: "Enable laptop touchpad click, Enable Canonical Partners repository, Install Restricted Extra, Install Elementary Tweak, Install Google Chrome, Enable minimize button on google-chrome, Install RAR, Improve Battery Life on linux"
  keywords: "elementary, tweak, google, chrome, rar, usb, indicator, dropbox, libre, office, thunderbird, git, meld, smartgit, jekyll, ruby, nodejs, python"
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
  <li><a href="#install-usb-indicator">Install Usb indicator</a></li>
  <li><a href="#install-dropbox">Install DropBox</a></li>
  <li><a href="#install-oracle-jdk">Install Oracle JDK</a></li>
  <li><a href="#install-libre-office">Install Libre Office</a></li>
  <li><a href="#install-elementary-plus">Install Elementary Plus</a></li>
  <li><a href="#install-thunderbird">Install Thunderbird</a></li>
  <li><a href="#improve-battery-life">Improve Battery Life</a></li>
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

<h3><a name="enable-laptop-touchpad-click">Enable laptop touchpad click</a></h3>
<b>Note:</b> Follow only if your laptop touchpad not working (Click not working).

{% highlight bash %}
sudo add-apt-repository ppa:hanipouspilot/focaltech-dkms
sudo apt-get update
sudo apt-get install focaltech-dkms
{% endhighlight %}

then enter the below two command.

{% highlight bash %}
sudo modprobe -r psmouse
sudo modprobe psmouse proto=imps
{% endhighlight %}

Now touchpad click start working. The above two commands makes the touchpad working only for current session. To make it permanent create a file with below command you can use your favorite editor.

{% highlight bash %}
sudo scratch-text-editor /etc/modprobe.d/psmouse.conf
{% endhighlight %}

add this line to file <code>options psmouse proto=imps</code> and save the changes.

<h3><a name="enable-canonical-partners-repository">Enable Canonical Partners repository</a></h3>

<code> Software & Updates > Other Softwares > Canonical Partners </code>

<h3>Update the system</h3>
{% highlight bash %}
sudo apt-get update
sudo apt-get dist-upgrade
{% endhighlight %}

Difference between <code>sudo apt-get upgrade</code> and <code>sudo apt-get dist-upgrade</code> [here](http://askubuntu.com/questions/81585/what-is-dist-upgrade-and-why-does-it-upgrade-more-than-upgrade).

<h3><a name="install-restricted-extra">Install Restricted Extra</a></h3>
{% highlight bash %}
sudo apt-get install ubuntu-restricted-extras
{% endhighlight %}

<h3><a name="install-elementary-tweak">Install Elementary Tweak</a></h3>
{% highlight bash %}
sudo add-apt-repository ppa:mpstark/elementary-tweaks-daily
sudo apt-get update
sudo apt-get install elementary-tweaks
{% endhighlight %}

After installing elementary tweak enable minimize button

<code>System Settings > Tweaks > Window controls to <b>Windows</b></code>

<h3><a name="install-google-chrome">Install Google Chrome</a></h3>

Download [Google Chrome]( https://www.google.com/intl/en-US/chrome/browser/) <code>64 bit .deb (For Debian/Ubuntu)</code> and install it. After installation you found that there is no minimize button on chrome so follow below step.

<h3><a name="enable-minimize-button-on-google-chrome">Enable minimize button on google-chrome</a></h3>
{% highlight bash %}
gconftool-2 --set /apps/metacity/general/button_layout --type string ":minimize:maximize:close"
{% endhighlight %}

<h3><a name="install-rar">Install RAR</a></h3>
{% highlight bash %}
sudo apt-get install rar
{% endhighlight %}

<h3><a name="install-usb-indicator">Install Usb indicator</a></h3>
{% highlight bash %}
sudo add-apt-repository ppa:yunnxx/gnome3
sudo apt-get update
sudo apt-get install indicator-usb
{% endhighlight %}

<h3>Gnome System Monitor</h3>
{% highlight bash %}
sudo apt-get install gnome-system-monitor
{% endhighlight %}


<h3><a name="install-dropbox">Install DropBox</a></h3>

Follow this link [https://github.com/nathandyer/elementary-dropbox-mods](https://github.com/nathandyer/elementary-dropbox-mods) for installing the dropbox.

<b>Note</b>:- You may found out that after reboot there is no dropbox icon on wingpanel and no icon on slingshot as well at least in my case i faced this issue.

To fix this just download the dropbox for ubuntu from dropbox site and install it and then every thing start working fine.

<h3><a name="install-oracle-jdk">Install Oracle JDK</a></h3>
For Installing Java on follow the [post]({% post_url 2015-10-03-install-oracle-jdk-on-ubuntu %}).

<h3><a name="install-libre-office">Install Libre Office</a></h3>

This will install latest libre office <code>(current version:- Libre Office 5)</code>.
{% highlight bash %}
sudo add-apt-repository ppa:libreoffice/ppa  &&  sudo apt-get update  &&  sudo apt-get install libreoffice 
{% endhighlight %}

<h3><a name="install-elementary-plus">Install Elementary Plus</a></h3>
For additional icons for libreoffice, sublime text, vlc etc etc. 

{% highlight bash %}
sudo add-apt-repository ppa:cybre/elementaryplus
sudo apt-get update
sudo apt-get upgrade && sudo apt-get install elementaryplus
{% endhighlight %}

<h3><a name="install-thunderbird">Install Thunderbird</a></h3>
{% highlight bash %}
sudo add-apt-repository ppa:ubuntu-mozilla-security/ppa
sudo apt-get update
sudo apt-get install thunderbird
{% endhighlight %}

<h3><a name="improve-battery-life">Improve Battery Life</a></h3>
{% highlight bash %}
sudo add-apt-repository ppa:linrunner/tlp
sudo apt-get update
sudo apt-get install tlp tlp-rdw
sudo tlp start
{% endhighlight %}

<h3><a name="install-git">Install Git</a></h3>
{% highlight bash %}
sudo apt-get install git
{% endhighlight %}

<h3><a name="setup-git">Setup Git</a></h3>
{% highlight bash %}
git config --global user.name "Your Name"
git config --global user.email "youremail@domain.com"
{% endhighlight %}

See all of the git configuration items:
{% highlight bash %}
git config --list
{% endhighlight %}

<h3><a name="setup-meld-diff-viewer-for-git">Setup Meld Diff Viewer for Git</a></h3>
Follow the [link](http://www.wiredforcode.com/blog/2011/06/04/git-with-meld-diff-viewer-on-ubuntu).

<h3><a name="install-smartgit">Install SmartGit</a></h3>
Best tool for git and its free for non-commerical use as well.

Download the [SmartGit](http://www.syntevo.com/smartgit/download) deb package and install it.

<h3><a name="install-jekyll">Install Jekyll</a></h3>

Pre-requisites for jekyll are ruby, ruby gems, nodejs and python.

<h4><a name="install-ruby">Install Ruby</a></h4>
{% highlight bash %}
sudo apt-get install ruby-full
{% endhighlight %}

<h4><a name="install-ruby">Install RubyGems</h4>
{% highlight bash %}
sudo gem update --system
sudo gem install rubygems-update
sudo update_rubygems
{% endhighlight %}

<h4><a name="install-nodejs">Install NodeJS</a></h4>
{% highlight bash %}
sudo apt-get install nodejs
{% endhighlight %}

<h4><a name="install-python">Install Python</a></h4>
Check python version. I hope its already installed on your system.

{% highlight bash %}
python --version
{% endhighlight %}

On my machine the version is <code>Python 2.7.6</code>

<h4><a name="install-jekyll">Install Jekyll</a></h4>
Now, Finally install jekyll.

{% highlight bash %}
sudo gem install jekyll
{% endhighlight %}

Install Jekyll Sitemap plugin.

{% highlight bash %}
sudo gem install jekyll-sitemap
{% endhighlight %}

<br/>
I hope you like this post and i will be helpful for you. Please share your view and thoughts in comment as well. so that i can make this post more useful and more better.



