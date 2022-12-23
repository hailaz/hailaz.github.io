---
layout: post
title: MGR
tags: [mysql]
---


### mysql的安装

参考：[windows同时安装多个mysql8.0服务 - levenx - CSDN博客](https://blog.csdn.net/m0_37890289/article/details/80003994)

下载zip版本的mysql：[MySQL :: Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/) 

```cmd
// 初始化
mysqld --defaults-file=D:\hailaz\mysql\mysql1\my.ini --initialize --console
// 安装服务
mysqld install MySQL1 --defaults-file="D:\hailaz\mysql\mysql1\my.ini"

// 启动服务
net start MySQL1
// 停止服务
net stop MySQL1
// 删除服务
sc delete MySQL1
```

使用install脚本可一键创建多个mysql服务

### mysql配置文件

```ini
server-id=3
gtid-mode=on
enforce-gtid-consistency=on
master-info-repository=TABLE
relay-log-info-repository=TABLE
binlog-checksum=none
log-slave-updates=on
log-bin=binlog
binlog-format=ROW
 
transaction-write-set-extraction=XXHASH64
loose-group_replication_group_name='ce9be252-2b71-11e6-b8f4-00212844f856'
loose-group_replication_start_on_boot=off
loose-group_replication_local_address='127.0.0.1:33071'
loose-group_replication_group_seeds='127.0.0.1:33071,127.0.0.1:33072,127.0.0.1:33073'
loose-group_replication_bootstrap_group=off
loose-group_replication_single_primary_mode=off
loose-group_replication_enforce_update_everywhere_checks=ON
```

### mgr准备

```mysql
create user 'repl'@'%' identified with mysql_native_password by 'xiao3.top';
GRANT REPLICATION SLAVE ON *.* TO repl@'%';
flush privileges;
install plugin group_replication soname 'group_replication.dll';
CHANGE MASTER TO MASTER_USER='repl',MASTER_PASSWORD='xiao3.top' FOR CHANNEL 'group_replication_recovery';
```

### mgr

其中一台

```mysql
set persist group_replication_single_primary_mode=off;
SET GLOBAL group_replication_bootstrap_group=ON;
start group_replication;
SET GLOBAL group_replication_bootstrap_group=OFF; 
select * from  performance_schema.replication_group_members;
```

从机

```mysql
set persist group_replication_single_primary_mode=off;
START GROUP_REPLICATION;
select * from performance_schema.replication_group_members;
```

停止

```mysql
stop GROUP_REPLICATION;
select * from performance_schema.replication_group_members;
```

失败时

```mysql
reset master;
start group_replication;
select * from performance_schema.replication_group_members;
```

#### install.bat
```cmd
::需要管理员权限运行cmd，并到指定目录运行。
@echo off
setlocal enabledelayedexpansion

>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' EQU '0' (
	goto main
) else (
    echo 请使用管理员身份运行
	goto end
)

:main
set basePath=%cd%
set sourcePath=%basePath%\mysql
for /l %%i in (1,1,5) do (
set cMySQL=mysql%%i
set cMySQLName=MySQL%%i
set cMySQLPath=%basePath%\!cMySQL!

echo !cMySQL!
::判断路径是否存在
if exist !cMySQLPath! (

xcopy %sourcePath% !cMySQLPath! /S /E /Y /D

echo 进入目录!cMySQLPath!
cd !cMySQLPath!


if not exist !cMySQLPath!\data (
echo data目录不存在，创建data目录
md !cMySQLPath!\data
)

if not exist !cMySQLPath!\log (
echo log目录不存在，创建log目录
md !cMySQLPath!\log
)
echo 生成配置文件

echo #auto creat> my.ini
echo [mysql]>> my.ini
echo default-character-set=utf8>> my.ini
echo [mysqld]>> my.ini
echo port = 3306%%i>> my.ini
echo basedir=!cMySQLPath!>> my.ini
echo datadir=!cMySQLPath!\data>> my.ini
echo sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES>> my.ini
echo character-set-server = utf8mb4>> my.ini
echo performance_schema_max_table_instances = 600>> my.ini
echo table_definition_cache = 400>> my.ini
echo table_open_cache = 256>> my.ini
echo log-error=!cMySQLPath!\log\log-error.txt>> my.ini

echo 安装服务
cd !cMySQLPath!\bin
mysqld --defaults-file=!cMySQLPath!\my.ini --initialize --console
mysqld install !cMySQLName! --defaults-file="!cMySQLPath!\my.ini"

)

)


:end
pause
```

#### restart.bat
```cmd
::需要管理员权限运行cmd，并到指定目录运行。
@echo off
setlocal enabledelayedexpansion

>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' EQU '0' (
	goto main
) else (
    echo 请使用管理员身份运行
	goto end
)

:main
set basePath=%cd%
for /l %%i in (1,1,5) do (
set cMySQL=mysql%%i
set cMySQLName=MySQL%%i
set cMySQLPath=%basePath%\!cMySQL!
::判断路径是否存在
if exist !cMySQLPath! (
echo 停止!cMySQLName!服务-----------------------------
net stop !cMySQLName!
echo 启动!cMySQLName!服务-----------------------------
net start !cMySQLName!
)

)


:end
pause
```

#### uninstall.bat

```cmd
::需要管理员权限运行cmd，并到指定目录运行。
@echo off
setlocal enabledelayedexpansion

>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' EQU '0' (
	goto main
) else (
    echo 请使用管理员身份运行
	goto end
)

:main
set basePath=%cd%
for /l %%i in (1,1,5) do (
set cMySQL=mysql%%i
set cMySQLName=MySQL%%i
set cMySQLPath=%basePath%\!cMySQL!
::判断路径是否存在
if exist !cMySQLPath! (
echo 停止!cMySQLName!服务-----------------------------
net stop !cMySQLName!
echo 删除!cMySQLName!服务-------------
sc delete !cMySQLName!
)

)


:end
pause
```

#### my.ini

```ini
#auto creat
[mysql]
default-character-set=utf8
[mysqld]
port = 33061
basedir=D:\hailaz\mysql\mysql1
datadir=D:\hailaz\mysql\mysql1\data
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
character-set-server = utf8mb4
performance_schema_max_table_instances = 600
table_definition_cache = 400
table_open_cache = 256
log-error=D:\hailaz\mysql\mysql1\log\log-error.txt

server-id=1
gtid-mode=on
enforce-gtid-consistency=on
master-info-repository=TABLE
relay-log-info-repository=TABLE
binlog-checksum=none
log-slave-updates=on
log-bin=binlog
binlog-format=ROW
 
transaction-write-set-extraction=XXHASH64
loose-group_replication_group_name='ce9be252-2b71-11e6-b8f4-00212844f856'
loose-group_replication_start_on_boot=off
loose-group_replication_local_address='localhost:33071'
loose-group_replication_group_seeds='localhost:33071,localhost:33072,localhost:33073'
loose-group_replication_bootstrap_group=off
loose-group_replication_single_primary_mode=off
loose-group_replication_enforce_update_everywhere_checks=ON
```

