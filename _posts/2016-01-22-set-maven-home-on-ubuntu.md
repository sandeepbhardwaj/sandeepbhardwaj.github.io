---
title: Set Maven Home on Ubuntu
date: '2016-01-22'
categories:
- DevOps
tags:
- java
- ubuntu
- maven
author_profile: true
seo_title: Set M2_HOME and PATH for Maven on Ubuntu
seo_description: Configure Maven on Ubuntu by setting M2_HOME and PATH and verify
  with mvn -v.
header:
  overlay_image: "/assets/images/default-post-banner.svg"
  overlay_filter: 0.4
  caption: Engineering Notes and Practical Examples
toc: true
toc_label: In This Article
toc_icon: cog
---

# Set Maven Home on Ubuntu

Use this when Maven is installed manually (tar/zip) and not via `apt`.

## 1. Find Maven installation directory

Example:

```bash
/data/dev/tools/apache-maven-3.9.9
```

## 2. Configure environment variables

Edit profile file:

```bash
sudo nano /etc/profile
```

Add at the end:

```bash
M2_HOME=/data/dev/tools/apache-maven-3.9.9
PATH=$PATH:$M2_HOME/bin
export M2_HOME
export PATH
```

Load changes:

```bash
source /etc/profile
```

## 3. Verify

```bash
echo $M2_HOME
mvn -v
```

Expected output includes Maven home path and Java version.

## Optional: user-level config

If you do not want system-wide changes, add the same exports to `~/.bashrc` or `~/.zshrc`.

## Key Takeaways

- Keep configuration explicit and environment-specific.
- Verify setup with version and env checks immediately after changes.
- Automate these steps in shell profiles or project docs to avoid drift.
