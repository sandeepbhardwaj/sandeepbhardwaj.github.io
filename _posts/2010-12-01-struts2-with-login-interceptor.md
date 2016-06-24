---
  layout: post
  title: Struts2 with login interceptor
  published: true
  tags: [Java , Struts2 ]
  date: 2010-12-01 19:55:00 +5:30
  keywords: "Struts2, Interceptor, login application"
  summary: "Example of Struts2 Interceptor, Complete example of Struts2 Interceptor, Download Struts2 Interceptor example, How to use interceptor in login application, How to create complete login application using struts2"
---

Hi All,

This is my first blog and this blog is for those who are not beginners because I am not going to explain HelloWorld application here. So if you are a beginner of Struts2 then follow the [link](http://www.mkyong.com/).

<h3>About application</h3>

It’s an application of Struts 2 with LoginInterceptor this will perform these tasks:-


1. Check user exist in session or not.
2. Runs before every action to check .If some one try to access direct url of welcome page and not present in session then it will redirect towards login page.
3. If user already in session then call the action called by user.
4. If session time out and user clicks on any link, then also redirect towards login page.


<h3>Package Structure</h3>

![Package Structure]({{ site.url }}/assets/post-images/FolderStrucure.PNG)

<h3>jar required</h3>

![Package Structure]({{ site.url }}/assets/post-images/JarNeeded.PNG)

<h3>web.xml</h3>

web.xml with struts2 configuration and defining session time out 1 min.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/WebContent/WEB-INF/web.xml"></script>

<h3>struts.xml</h3>

Here we configure our custom interceptor named LoginInterceptor defining loginStack as default stack.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/src/struts.xml"></script>


<h3>LoginInterceptor.java</h3>

LoginInterceptor class extends AbstractInterceptor and checking user present in session or not.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/src/org/refcard/blog/struts/interceptor/LoginInterceptor.java"></script>


<h3>LoginAction.java</h3>

LoginAction class with simple bussiness logic you can login with any username and password but cannot left blank the mandatory fields.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/src/org/refcard/blog/struts/action/LoginAction.java"></script>


<h3>LogoutAction.java</h3>

LogutAction class calls when user click on logout link.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/src/org/refcard/blog/struts/action/LogoutAction.java"></script>

<h3>ProfileAction.java</h3>

ProfileAction executes when we click on profile link on welcome page. If we tried to call the profile action without login then login interceptor redirect user to login page. This is the whole purpose of using the login interceptor.

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/src/org/refcard/blog/struts/action/ProfileAction.java"></script>


<h3>Login.jsp</h3>

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/WebContent/login.jsp"></script>

<h3>welcome.jsp</h3>

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/WebContent/WEB-INF/pages/welcome.jsp"></script>

<h3>profile.jsp</h3>

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/WebContent/WEB-INF/pages/profile.jsp"></script>

<h3>style.css</h3>

<script src="http://gist-it.appspot.com/https://github.com/sandeepbhardwaj01/code-repo/blob/master/login-app/WebContent/css/style.css"></script>

Now paste these files according to package structure and run it by typing [http://localhost:8080/LoginApp](http://localhost:8080/LoginApp).

If you tries to hit direct url without login like [http://localhost:8080/LoginApp/loginAuthenticaion](http://localhost:8080/LoginApp/loginAuthenticaion) then it will redirect towards login page.

Next time, i will try to write some more interesting you can also give me some suggestion about new topics.

Thanks,
Have a great day !!!



