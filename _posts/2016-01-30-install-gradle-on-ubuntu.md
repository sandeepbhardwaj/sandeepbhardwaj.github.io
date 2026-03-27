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
Installing Gradle on Ubuntu is usually easy.
Keeping the right Gradle version visible across shells, editors, CI helpers, and multiple projects is the part teams get wrong.

The most important decision comes first:
do you actually need a global Gradle install, or do you only need the Gradle Wrapper for one repository?

## Quick Decision Guide

| Situation | Best choice | Why |
| --- | --- | --- |
| Building one specific repository | `./gradlew` | version is pinned by the project |
| Working across many Gradle repos | global install plus wrapper | convenient CLI, still use wrapper for builds |
| CI or shared build automation | wrapper first | reduces version drift |
| You need a custom cache location or proxy setup | global install plus explicit env | easier to standardize across machines |

> [!important]
> A global Gradle install is a convenience tool.
> The Gradle Wrapper is the reproducibility tool.
> Do not confuse the two.

## Recommended Installation Model

For most Ubuntu machines, the cleanest manual install looks like this:

1. unpack Gradle into a versioned tools directory
2. expose that version through `PATH`
3. verify the resolved binary immediately
4. still run project builds with `./gradlew`

That keeps global setup explicit without turning it into the source of truth for every project.

## Step 1: Pick a Versioned Install Directory

Install Gradle into a directory whose path includes the version:

```bash
/data/dev/tools/gradle-8.7
```

That small habit helps more than people expect.
It makes upgrades, rollbacks, and debugging much easier than using a vague path like `/opt/gradle/current`.

If you want a stable alias later, add it deliberately.
Do not hide the real version during the first install.

## Step 2: Export `GRADLE_HOME` and Update `PATH`

You can edit `/etc/profile`, but for system-wide setup, a dedicated file under `/etc/profile.d` is usually cleaner.

Create:

```bash
sudo nano /etc/profile.d/gradle.sh
```

Add:

```bash
export GRADLE_HOME=/data/dev/tools/gradle-8.7
export PATH=$PATH:$GRADLE_HOME/bin
```

Load it in the current shell:

```bash
source /etc/profile.d/gradle.sh
```

Why this is usually better than editing `/etc/profile` directly:

- easier to review later
- lower risk of accidentally breaking unrelated shell setup
- simpler to replace during upgrades
- clearer for teammates and future you

If you only want the change for your own user, put the same exports in `~/.bashrc`, `~/.zshrc`, or another shell-specific profile instead.

## Step 3: Verify the Actual Binary, Not Just the Environment Variable

The most common failure mode is thinking the change worked because `GRADLE_HOME` is set, while the shell is still resolving a different `gradle`.

Run all three checks:

```bash
echo $GRADLE_HOME
which gradle
gradle -v
```

What you want to confirm:

- `GRADLE_HOME` points at the intended directory
- `which gradle` resolves to `$GRADLE_HOME/bin/gradle`
- `gradle -v` reports the version you meant to install

If one of those is wrong, stop there.
Do not move on and assume builds will be fine.

## Step 4: Keep Project Builds on the Wrapper

Even after global setup succeeds, prefer:

```bash
./gradlew clean test
```

Why:

- the repository controls the Gradle version
- new team members do not need matching global installs
- CI and local builds behave more predictably
- upgrades happen in the project, not in tribal knowledge

Use the global `gradle` command mostly for:

- quick version inspection
- generating or bootstrapping wrapper files in a new project
- local experiments outside a pinned repository

## Optional: Set `GRADLE_USER_HOME`

If you want Gradle caches somewhere other than the default location, set:

```bash
export GRADLE_USER_HOME=/data/dev/repository/gradle
```

This is useful when:

- your home directory is small
- you want faster storage for caches
- you want easier cleanup of build tooling state
- your organization standardizes cache locations

After setting it, verify permissions carefully.
Cache ownership issues often look like Gradle problems when they are really filesystem problems.

## Proxy and Enterprise Network Notes

On corporate networks, installs often fail for reasons unrelated to Gradle itself.
If dependency resolution or distribution downloads hang behind a proxy, add settings in:

```properties
~/.gradle/gradle.properties
```

Example:

```properties
systemProp.http.proxyHost=proxy.company.com
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
```

Treat proxy configuration as separate from install configuration.
Otherwise, troubleshooting becomes muddy very quickly.

## Troubleshooting the Failures That Show Up Most Often

### `gradle: command not found`

Usually means one of these:

- the shell profile was not reloaded
- the exports were added to the wrong file for the active shell
- `PATH` was updated incorrectly

Check:

```bash
echo $SHELL
echo $PATH
```

### Wrong Gradle Version

This usually means another binary comes earlier in `PATH`.

Check:

```bash
which gradle
type -a gradle
```

If you see multiple locations, fix the path order instead of reinstalling Gradle again.

### Works in One Shell but Not Another

That is often a profile-loading issue.
For example:

- interactive shell loads `~/.zshrc`
- login shell loads `~/.profile` or `/etc/profile`
- IDE terminal may inherit a different environment

The fix is to decide where the configuration belongs and keep it there consistently.

### Permission Problems in the Cache

If `GRADLE_USER_HOME` or `~/.gradle` was created by another user or with `sudo`, builds may fail with confusing cache errors.

Check ownership before touching Gradle settings again.

## Upgrade and Rollback Strategy

A safe upgrade pattern looks like this:

1. install new version beside the old one
2. update `GRADLE_HOME`
3. run `gradle -v`
4. test one or two representative builds
5. keep the old directory until the new setup is stable

That is much safer than replacing the old install in place and discovering later that a helper script depended on the earlier version.

## Practical Recommendation

If you want the shortest sane rule set, use this:

- install Gradle in a versioned directory
- expose it through `/etc/profile.d` or your shell profile
- verify with `which gradle` and `gradle -v`
- use `./gradlew` for actual repository builds

That gives you convenience without sacrificing reproducibility.

## Final Checklist

- Is the install path versioned and explicit?
- Does `which gradle` point where you expect?
- Does `gradle -v` show the intended version?
- Are project builds still using `./gradlew`?
- If something breaks later, do you know which profile file owns the configuration?

If you can answer yes to all five, the setup is probably in good shape.
