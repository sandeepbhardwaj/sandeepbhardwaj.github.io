---
  layout: post
  title: Delete saved SVN stored password from eclipse
  published: true
  tags: [Eclipse]
  date: 2011-05-25 00:05:00 +5:30
---
If you wanted to delete the stored subversion (svn) password from Eclipse IDE.

Then follow these steps :-

SVN stores the authentication in physical files. The easiest way is to delete those files physically from the directory.

On windows XP, these files are located in the following two folders:

<b>Step 1</b> : Delete keyring file from the location given below

``` bash
<Your eclipse installation path>\Eclipse\configuration\org.eclipse.core.runtime\.keyring
```

<b>Step 2</b> : Delete all file from the location given below :-

``` bash
C:\Documents and Settings\<your user name>\Application Data\Subversion\auth\svn.simple
```

<b>Step 3</b> : Restart your Eclipse IDE, now all saved password will gone and a new prompt dialoge box will open for asking new password.