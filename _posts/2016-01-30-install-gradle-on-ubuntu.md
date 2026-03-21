---
title: Install Gradle on Ubuntu
date: '2016-01-30'
categories:
- DevOps
tags:
- java
- ubuntu
- gradle
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
  show_overlay_excerpt: false
---
This guide provides a clean, repeatable setup flow, verification steps, and common pitfalls to avoid in real environments.

## Problem description:

We want a predictable Gradle installation on Ubuntu so local shells and build tools resolve the intended Gradle version.

What we are solving actually:

We are solving environment consistency and version clarity.
Most Gradle setup issues come from PATH conflicts, shell reload confusion, or mixing global installation with project-wrapper expectations.

What we are doing actually:

1. Install Gradle into a known tools directory.
2. Export `GRADLE_HOME` and add its `bin` directory to `PATH`.
3. Verify the active binary and prefer the Gradle Wrapper for project builds.

## 1. Download and Extract

Download Gradle and extract it to your tools directory, for example:

```bash
/data/dev/tools/gradle-8.7
```

If this is only for one project, prefer using the Gradle Wrapper (`./gradlew`) committed with that project instead of relying on global installation.

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

## Better Practice: `/etc/profile.d` File

For system-wide setup, create a dedicated file:

```bash
sudo nano /etc/profile.d/gradle.sh
```

```bash
export GRADLE_HOME=/data/dev/tools/gradle-8.7
export PATH=$PATH:$GRADLE_HOME/bin
```

Then load it:

```bash
source /etc/profile.d/gradle.sh
```

This avoids modifying `/etc/profile` directly.

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

## Team-Friendly Recommendation: Use Gradle Wrapper

Even if Gradle is globally installed, execute builds using wrapper:

```bash
./gradlew clean test
```

Benefits:

- consistent Gradle version per repo
- fewer CI/local mismatch issues
- easier onboarding

## Common Troubleshooting

1. `gradle: command not found`: PATH not reloaded, run `source` again.
2. Wrong Gradle version: check `which gradle` for conflicting binaries.
3. Permission issues in cache: verify ownership of `GRADLE_USER_HOME`.
4. Corporate proxy failures: configure proxy in `~/.gradle/gradle.properties`.

Example proxy config:

```properties
systemProp.http.proxyHost=proxy.company.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
```

## Debug steps:

- run `which gradle` to verify the binary that shells actually resolve
- confirm `gradle -v` reports the version you intended to install
- prefer `./gradlew` for repo builds even after global installation succeeds
- separate global tool setup from project-specific cache or proxy issues

## Key Takeaways

- Keep configuration explicit and environment-specific.
- Verify setup with version and env checks immediately after changes.
- Automate these steps in shell profiles or project docs to avoid drift.
- Prefer `./gradlew` for reproducible builds across machines and CI.

---

## Practical Checkpoint

A short but valuable final check for install gradle on ubuntu is to write down the one misuse pattern most likely to appear during maintenance. That small note makes the article more useful when someone revisits it months later under pressure.

---

## Final Practical Note

Even for a small setup guide, the valuable habit is to capture one verification command and one rollback step next to the instructions. That tiny addition turns a one-time note into something safer to reuse when the environment is slightly different months later.
