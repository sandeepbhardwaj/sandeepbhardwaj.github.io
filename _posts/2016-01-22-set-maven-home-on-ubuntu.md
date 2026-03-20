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
  show_overlay_excerpt: false
toc: true
toc_label: In This Article
toc_icon: cog
---
Use this when Maven is installed manually (tar/zip) and not via `apt`.

Note: modern Maven does not strictly require `M2_HOME`, but many teams still set it for consistency.

## Problem description:

We want a reliable shell configuration so the correct Maven binary is available on Ubuntu sessions and tools.

What we are solving actually:

We are solving environment consistency.
The issue is rarely “how do I type the export command”; it is making sure the right Maven version is discoverable in shells, scripts, and IDE terminals without ambiguous PATH behavior.

What we are doing actually:

1. Point `M2_HOME` at the intended manual Maven install.
2. Add its `bin` directory to `PATH`.
3. Verify the active Maven and Java versions immediately after configuration.

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

## Better Practice: `/etc/profile.d` Script

Instead of editing `/etc/profile` directly, create a dedicated file:

```bash
sudo nano /etc/profile.d/maven.sh
```

```bash
export M2_HOME=/data/dev/tools/apache-maven-3.9.9
export PATH=$PATH:$M2_HOME/bin
```

Then reload:

```bash
source /etc/profile.d/maven.sh
```

This keeps system configuration cleaner and easier to maintain.

## 3. Verify

```bash
echo $M2_HOME
mvn -v
```

Expected output includes Maven home path and Java version.

Also confirm Java setup, since Maven depends on JDK:

```bash
echo $JAVA_HOME
java -version
```

## Optional: user-level config

If you do not want system-wide changes, add the same exports to `~/.bashrc` or `~/.zshrc`.

## Multi-Version Workflow (Optional)

If you use different Maven versions per project:

- keep each version under a tool directory (for example `/opt/tools/maven/`)
- point `M2_HOME` to the required version in a project-specific shell script
- load per-project env with `direnv` or a small `source ./env.sh` convention

This avoids global version conflicts.

## Common Troubleshooting

1. `mvn: command not found`: PATH not loaded in current shell (`source` profile again).
2. Wrong Maven version: another `mvn` appears earlier in PATH (`which mvn`).
3. Java mismatch errors: `JAVA_HOME` points to incompatible JDK.
4. Works in terminal but not IDE: configure IDE terminal/environment separately.

## Debug steps:

- run `which mvn` before and after changes to confirm PATH precedence
- verify `mvn -v` shows the intended Maven home and Java home
- prefer `/etc/profile.d` or shell-specific files over ad hoc per-session exports
- use the Maven Wrapper when project-level reproducibility matters more than global install convenience

## Key Takeaways

- Keep configuration explicit and environment-specific.
- Verify setup with version and env checks immediately after changes.
- Automate these steps in shell profiles or project docs to avoid drift.
- Prefer `/etc/profile.d` for maintainable system-wide setup.

---

## Practical Checkpoint

A short but valuable final check for set maven home on ubuntu is to write down the one misuse pattern most likely to appear during maintenance. That small note makes the article more useful when someone revisits it months later under pressure.

---

## Final Practical Note

Even for a small setup guide, the valuable habit is to capture one verification command and one rollback step next to the instructions. That tiny addition turns a one-time note into something safer to reuse when the environment is slightly different months later.
