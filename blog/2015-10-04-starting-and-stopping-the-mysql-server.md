---
  layout: post
  title: Starting and Stopping the MySQL Server
  published: true
  tags: [Ubuntu , MySql]
  date: 2015-10-04 13:30:00 +5:30
---

By Default MySQL server is started automatically after installation. Wd can check/verify the status of the MySQL server with the following command:

``` bash
sudo service mysql status
```

Stop the MySQL server with the following command:
``` bash
sudo service mysql stop
```

To restart the MySQL server, use the following command:

``` bash
sudo service mysql start
```