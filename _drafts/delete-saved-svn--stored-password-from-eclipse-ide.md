---
  layout: post
  title: Enable laptop touch-pad on Elementary OS Freya
  published: false
  tags: [Eclipse]
  date: 2015-10-03 17:44:00 +5:30
---
If you wanted to delete the stored subversion (svn) password from Eclipse IDE.

Then follow these steps :-

SVN stores the authentication in physical files. The easiest way is to delete those files physically from the directory.

On windows XP, these files are located in the following two folders:

Step 1
Delete keyring file from the location given below

<Your eclipse installation path>\Eclipse\configuration\org.eclipse.core.runtime\.keyring


Step 2
Delete all file from the location given below:-

C:\Documents and Settings\<your user name>\Application Data\Subversion\auth\svn.simple


Step 3
Restart your Eclipse IDE, now all saved password will gone and a new prompt dialoge box will open for asking new password.