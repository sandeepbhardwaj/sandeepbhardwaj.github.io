---
  layout: post
  title: Struts2 with login interceptor
  published: true
  tags: [Java , Struts2 ]
  date: 2010-12-01 21:15:00 +5:30
---

Hi All,

This is my first blog and this blog is for those who are not beginners because I am not going to explain HelloWorld application here. So if you are a beginner of Struts2 then follow the [link](http://www.mkyong.com/).

<u><b>About application</b></u>

It’s an application of Struts 2 with LoginInterceptor this will perform these tasks:-

<ol>
<li>Check user exist in session or not.</li>
<li>Runs before every action to check .If some one try to access direct url of welcome page and not present in session then it will redirect towards login page.</li>
<li>If user already in session then call the action called by user.</li>
<li>If session time out and user clicks on any link, then also redirect towards login page.</li>
</ol>

<u><b>Package Structure</b></u><br />

(/images/FolderStrucure.PNG)

<u><b>jar required</b></u><br />
<div class="separator" style="clear: both; text-align: left;">
<a href="http://1.bp.blogspot.com/-ZFN5Wd8ISwE/VatTcknc7OI/AAAAAAAABMs/kfdTRxZrDQM/s1600/JarNeeded.PNG" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" src="http://1.bp.blogspot.com/-ZFN5Wd8ISwE/VatTcknc7OI/AAAAAAAABMs/kfdTRxZrDQM/s1600/JarNeeded.PNG" /></a></div>
<br />
<u><b>web.xml</b></u>
<br />
web.xml with struts2 configuration and defining session time out 1 min.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/WebContent/WEB-INF/web.xml"></script>

<u><b>struts.xml</b></u>
<br />
Here we configure our custom interceptor named LoginInterceptor defining
loginStack as default stack.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/src/struts.xml"></script>


<u><b>LoginInterceptor.java</b></u>
<br />
LoginInterceptor class extends AbstractInterceptor&nbsp; and checking
user present in session or not.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/src/org/refcard/blog/struts/interceptor/LoginInterceptor.java"></script>


<u><b>LoginAction.java</b></u>
<br />
LoginAction class with simple bussiness logic you can login with any
username and password but cannot left blank the mandatory fields.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/src/org/refcard/blog/struts/action/LoginAction.java"></script>


<u><b>LogoutAction.java</b></u>
<br />
LogutAction class calls when user click on logout link.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/src/org/refcard/blog/struts/action/LogoutAction.java"></script>

<u><b>ProfileAction.java</b></u>
<br />
ProfileAction executes when we click on profile link on welcome page. If we tried to call the profile action without login then login interceptor
redirect user to login page. This is the whole purpose of using the login interceptor.
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/src/org/refcard/blog/struts/action/ProfileAction.java"></script>


<u><b>Login.jsp</b></u>
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/WebContent/login.jsp"></script>


<u><b>welcome.jsp</b></u>
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/WebContent/WEB-INF/pages/welcome.jsp"></script>

<u><b>profile.jsp</b></u>
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/WebContent/WEB-INF/pages/profile.jsp"></script>


<u><b>style.css</b></u>
<br />
<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/struts2-login-application/blob/master/LoginApp/WebContent/css/style.css"></script>



Now paste these files according to package structure and run it by
typing
<a href="http://localhost:8080/LoginApp">http://localhost:8080/LoginApp</a>
<br />
If you tries to hit direct url without login like&nbsp;
<a href="http://localhost:8080/LoginApp/loginAuthenticaion">http://localhost:8080/LoginApp/loginAuthenticaion</a>
then it will redirect towards login page.
<br />
Next time, i will try to write some more interesting you can also give me
some suggestion about new topics.
<br />
Thanks,
<br />
Have a great day !!!
<br />
<br />
<br />


