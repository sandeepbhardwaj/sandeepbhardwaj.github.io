---
title: Install Gradle on Ubuntu
date: '2016-01-30'
categories:
- DevOps
tags:
- java
- ubuntu
- gradle
author_profile: true
toc: true
toc_label: In This Article
toc_icon: cog
seo_title: Install Gradle on Ubuntu and Set GRADLE_HOME
seo_description: Step-by-step Gradle installation and environment configuration on
  Ubuntu.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
---

# Install Gradle on Ubuntu

This guide provides a clean, repeatable setup flow, verification steps, and common pitfalls to avoid in real environments.

## 1. Download and Extract

Download Gradle and extract it to your tools directory, for example:

```bash
/data/dev/tools/gradle-8.7
```

## 2. Set `GRADLE_HOME` and `PATH`

Edit profile:

```bash
sudo nano /etc/profile
```

Add:

```bash
GRADLE_HOME=/data/dev/tools/gradle-8.7
PATH=$PATH:$GRADLE_HOME/bin
export GRADLE_HOME
export PATH
```

Reload shell config:

```bash
source /etc/profile
```

## 3. Verify

```bash
echo $GRADLE_HOME
gradle -v
```

## 4. Optional: Set `GRADLE_USER_HOME`

Set custom Gradle cache/repository location:

```bash
export GRADLE_USER_HOME=/data/dev/repository/gradle
```

Add this line in profile to make it persistent.

## Key Takeaways

- Keep configuration explicit and environment-specific.
- Verify setup with version and env checks immediately after changes.
- Automate these steps in shell profiles or project docs to avoid drift.
