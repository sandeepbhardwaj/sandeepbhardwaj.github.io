---
title: Set Maven Home on Ubuntu
date: '2016-01-22'
categories:
- DevOps
tags:
- java
- ubuntu
- maven
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
Manual Maven setup on Ubuntu is rarely about memorizing `export` commands.
It is about making sure the correct `mvn` binary is visible everywhere you expect it to be, with the right Java version behind it.

That distinction matters because a Maven install can look fine in one terminal and still be wrong in CI helpers, IDE terminals, or a fresh login shell.

## Start With the Right Question

Do you need a global Maven install at all?

| Situation | Best choice | Why |
| --- | --- | --- |
| Building a specific project that already has a wrapper | `./mvnw` | version is pinned with the repo |
| Working across many Maven projects | global install plus wrapper | useful CLI, wrapper still gives reproducibility |
| CI builds | wrapper first | fewer environment surprises |
| One-off manual experimentation | global install is fine | convenience matters more here |

> [!important]
> Modern Maven does not strictly require `M2_HOME`.
> Many teams still set it for consistency, but `PATH` and correct binary resolution matter more than the variable itself.

## Recommended Setup Pattern

The clean pattern is:

1. install Maven into a versioned directory
2. expose its `bin` directory through `PATH`
3. optionally set `M2_HOME` for consistency
4. verify both Maven and Java immediately
5. prefer `./mvnw` for actual project builds

That separates machine-level convenience from project-level reproducibility.

## Step 1: Choose a Clear Installation Directory

Example:

```bash
/data/dev/tools/apache-maven-3.9.9
```

A versioned path is better than a vague directory name because it makes upgrades and rollbacks obvious.

If you later want a stable symlink or helper alias, add it deliberately.
Do not hide the real version on day one.

## Step 2: Export `M2_HOME` and Update `PATH`

For system-wide setup, prefer a dedicated file under `/etc/profile.d` instead of editing `/etc/profile` directly.

Create:

```bash
sudo nano /etc/profile.d/maven.sh
```

Add:

```bash
export M2_HOME=/data/dev/tools/apache-maven-3.9.9
export PATH=$PATH:$M2_HOME/bin
```

Reload:

```bash
source /etc/profile.d/maven.sh
```

Why this tends to be safer:

- easier to audit later
- easier to replace during upgrades
- less risk of breaking unrelated shell initialization
- clearer ownership of the Maven setup

If you only want this for your own user, put the exports in your shell profile such as `~/.bashrc` or `~/.zshrc`.

## Step 3: Verify Maven and Java Together

Do not stop after setting the variable.
Maven depends on Java, so a good verification step checks both.

Run:

```bash
echo $M2_HOME
which mvn
mvn -v
echo $JAVA_HOME
java -version
```

What you want to confirm:

- `M2_HOME` points to the intended directory
- `which mvn` resolves to the same install you configured
- `mvn -v` shows the Maven version you intended
- Maven is using the correct Java runtime

If Maven is right but Java is wrong, the setup is not done.

## Why `which mvn` Matters More Than People Think

The most common Maven setup bug is path precedence.
Another `mvn` from `apt`, SDKMAN, an older manual install, or some inherited shell configuration may be winning earlier in `PATH`.

If `mvn -v` surprises you, inspect the binary resolution first:

```bash
which mvn
type -a mvn
```

Reinstalling Maven usually does not solve a path-order problem.

## User-Level Setup vs System-Wide Setup

Pick one intentionally.

### Use user-level shell config when:

- the machine is personal
- only one user needs Maven
- you want low-risk changes

### Use `/etc/profile.d` when:

- the setup should be shared across users
- the machine is provisioned in a consistent way
- you want environment configuration to live in an obvious system location

The mistake to avoid is mixing both without documentation.
That creates confusing precedence later.

## When Maven Wrapper Is the Better Choice

If a repository includes `mvnw`, use it:

```bash
./mvnw test
```

The wrapper is usually the better choice for:

- team onboarding
- CI pipelines
- long-lived repositories
- repos that need exact Maven version alignment

The global `mvn` command is still useful, but it should not silently become the version source for every project.

## Multi-Version Workflow

If you work across projects that need different Maven versions, resist the urge to keep editing your shell by hand.

A better pattern is:

- store each Maven version in a tools directory
- use a project-specific env loader or `direnv`
- rely on `mvnw` where available

That is much cleaner than repeatedly changing `M2_HOME` globally.

## Failures You Will Actually See

### `mvn: command not found`

Usually means:

- the active shell did not load the file you edited
- `PATH` was not updated correctly
- the shell session needs reloading

Check the current shell and `PATH` before doing anything else.

### Wrong Maven Version

Usually means another `mvn` is earlier in `PATH`.
Fix precedence instead of piling on more exports.

### Correct Maven, Wrong Java

This is common and easy to miss.
Maven may start successfully but use a Java version that breaks compilation or plugins.

Always inspect both:

```bash
mvn -v
java -version
```

### Works in Terminal but Not in IDE

IDE terminals and build runners often inherit a different environment than your interactive shell.

That is not a Maven problem.
It is an environment propagation problem.

## Upgrade and Rollback Advice

A safe upgrade path:

1. install the new Maven version beside the old one
2. update `M2_HOME`
3. run `which mvn` and `mvn -v`
4. test a representative build
5. keep the old install until the new one proves stable

This costs almost nothing and makes rollback easy.

## Practical Recommendation

If you want the shortest reliable rule set, use this:

- install Maven in a versioned directory
- expose it through `/etc/profile.d` or your user shell profile
- verify binary resolution with `which mvn`
- verify runtime compatibility with `mvn -v`
- prefer `./mvnw` for actual project builds

That is the setup pattern most teams can live with for a long time.

## Final Checklist

- Is the Maven install path explicit and versioned?
- Does `which mvn` point to the binary you intended?
- Does `mvn -v` show the expected Maven and Java versions?
- Are you using `./mvnw` for repository builds where available?
- If something breaks later, do you know which file owns the environment change?

If yes, the setup is probably solid.
