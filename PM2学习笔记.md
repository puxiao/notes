# PM2 学习笔记

### 安装 pm2

#### 全局安装代码

```
npm i -g pm2
```

> 我的服务器中 nodejs 安装目录为 /software/nodejs

安装过程中的代码：

```
[root@VM_0_8_centos ~]# npm i -g pm2
/software/nodejs/bin/pm2 -> /software/nodejs/lib/node_modules/pm2/bin/pm2
/software/nodejs/bin/pm2-dev -> /software/nodejs/lib/node_modules/pm2/bin/pm2-dev
/software/nodejs/bin/pm2-docker -> /software/nodejs/lib/node_modules/pm2/bin/pm2-docker
/software/nodejs/bin/pm2-runtime -> /software/nodejs/lib/node_modules/pm2/bin/pm2-runtime
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules/pm2/node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ pm2@4.4.0
added 185 packages from 191 contributors in 71.334s

```

> 请特别留意第一行提示代码
>
> ```
> /software/nodejs/bin/pm2 -> /software/nodejs/lib/node_modules/pm2/bin/pm2
> ```
>
> `/software/nodejs/bin/pm2` 表示 pm2 的快捷图标位置、`/software/nodejs/lib/node_modules/pm2/bin/pm2` 表示 pm2 的实际文件位置

默认windows系统下安装之后自动将 pm2 添加到全局环境路径中，但是在 Centos 中需要额外手工创建全局软连接。



#### CentOS7 中创建 pm2 软连接

```
ln -s /software/nodejs/bin/pm2 /usr/local/bin/pm2
```

或

```
ln -s /software/nodejs/lib/node_modules/pm2/bin/pm2 /usr/local/bin/pm2
```

> 你需要将 `/software/nodejs` 修改成你服务器上对应 nodejs 的安装目录



### pm2 命令参数

#### 更新版本

| 命令       | 说明                |
| ---------- | ------------------- |
| pm2 update | 将pm2升级到最新版本 |

#### 启动项目

| 命令             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| pm2 start app.js | 启动运行  app.js ，默认使用 fork 形式，且只启动 1 个线程<br />(例如启动nodejs项目 pm2 start /mykoa/mymood/app.js) |

#### 启动参数

| 参数                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| --name xxx                            | 设置进程名字为 xxx                                           |
| --watch                               | 对文件进行监控，若发现修改则立即重启服务                     |
| --watch --ignore-watch="node_modules" | 对文件进行监控，但是忽略 node_modules 目录中文件的改变       |
| --max-memory-restart 200MB            | 若程序内存占用超过 200MB 则重启该程序<br />(系统每隔30秒检查一次，因此若中间达到 200MB 时可能需要等一段时间后才会重启) |
| --log xxxx                            | 存放日志的路径                                               |
| --error xxxx                          | 存放错误日志的路径                                           |
| -- arg1 arg2 arg3                     | 添加其他参数                                                 |
| --restart-delay 2000                  | 延迟重启的毫秒数，效果等同于--exp-backoff-restart-delay=2000 |
| --exp-backoff-restart-delay=100       | 延迟重启的毫秒数<br />(确保不会马上立即重启，给系统一些缓冲时间) |
| --time                                | 写日志时加上日期                                             |
| --cron <cron_pattern>                 | 强制重启时指定 cron <br />(cron 是一种时间表达语法规则，例如`0 0 23 * * ?`表示每天 23点 执行一次) |
| --kill-timeout 3000                   | 超时延长至 3000 毫秒                                         |
| --wait-ready                          | 等待要启动的程序向系统进程发送 ready 信号<br />(例如 nodejs 创建http服务完成后，执行 process.send('ready')) |
| --listen-timeout 3000                 | 设置 wait-ready 监听超时时间为 3000毫秒                      |
| --shutdown-with-message               | 是否允许pm2向系统进程发送关闭信号<br />(Nodejs可以通过 process.on('message',function (msg) { if(msg==='shutdown') }) 来做出响应处理 |
| --no-autorestart                      | 不自动重启服务                                               |
| --no-vizion                           | 不使用视图模式                                               |
| --no-daemon                           | 附加到应用程序日志<br />(daemon 为守护进程)                  |

#### 查看pm2是否启动

| 命令     | 说明                                     |
| -------- | ---------------------------------------- |
| pm2 ping | 若系统回复：{ msg: 'pong' } 则表示已启动 |

#### 其他

| 命令                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| pm2 reset <process/>          | 重新设置<br />(暂时不明白具体用法)                           |
| pm2 updatePM2                 | 更新<br />(暂时不明白具体用法，难道下次重启pm2时更新pm2版本？) |
| pm2 sendSignal SIGUSR2 my-app | 发送一个系统信号到某进程<br />(暂时不明白具体用法)           |

#### 启用多线程

| 命令                  | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| pm2 start app.js -i 0 | 以本机最大CPU核数为基准数，同时启动多个线程<br />(例如本机为4核CPU，则启动4个线程) |
| pm2 scale app +3      | 新增 3 个 app服务的 线程<br />(前提是系统还有足够空闲CPU核数) |
| pm2 scale app 2       | 控制 app服务的 线程数 只能为 2个<br />(在现有线程数的基础上增加或减少，最终只保证有2个线程) |

#### 管理进程

| 命令                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| pm2 restart app_name | 重启 app_name<br />(注意：app_name是进程名，而不是进程对应的文件app.js) |
| pm2 reload app_name  | 重新加载 app_name                                            |
| pm2 stop app_name    | 暂停 app_name                                                |
| pm2 delect app_name  | 删除 app_name                                                |
| app_name 改为 all    | 则表示 对所有进程的操作                                      |
| app_name 改为 0      | 则表示 对 pm2 list 中 id为 0 的进程的操作                    |

#### 查看进程状态

| 命令                         | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| pm2 list、pm2 ls、pm2 status | 用表格形式列出当前所有 pm2 启动运行的进程<br />(仅列出简要信息) |
| pm2 jlist                    | 用JSON形式列出当前所有 pm2 启动运行的进程详情<br />(JSON字符串粘连在一起，基本无法阅读) |
| pm2 prettylist               | 用美化、格式化后的JSON形式列出当前所有 pm2 启动运行的进程详情<br />(JSON字符可读性强) |

#### 查看进程信息

| 命令           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| pm2 describe 0 | 显示某个 id 进程的所有信息<br />(默认pm2 启动的第一个程序 id 为 0，id 数字值往后依次递增) |
| pm2 monit      | 以表格形式，显示多个进程的所有信息<br />显示出来的4个表格，分别为：<br />进程列表(左上)、进程日志(右上)、运行指标(左下)、元数据(右下)<br />界面操作方式：左右键切换表格、上下键滚动表格、ctrl + c 退出界面 |

#### 查看日志

| 命令                 | 说明                                                   |
| -------------------- | ------------------------------------------------------ |
| pm2 logs             | 显示全部日志                                           |
| pm2 logs xxx         | 仅仅显示 进程名为xxx 的日志<br />(例如 pm2 logs myapp) |
| pm2 logs --format    | 格式化显示日志                                         |
| pm2 logs --lines 200 | 只显示最近 200 行日志                                  |
| pm2 reloadLogs       | 重新加载，显示全部日志                                 |
| pm2 flush            | 清空全部日志                                           |

## 以配置文件方式启动

#### 第1步：生成配置文件

执行命令：

```
pm2 ecosystem
```

上述代码执行后，会显示以下文字：

```
File /usr/local/bin/ecosystem.config.js generated
```

#### 第2步：编修修改配置文件

用代码编辑工具，编辑  `/usr/local/bin/ecosystem.config.js` 该文件，添加或修改配置文件中的属性值。

```
module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

```

> 上述配置文件中 apps为一个数组，里面可以存放多条配置信息
> deploy(配置)选项，用来配置 git 相关的属性值

#### 第3步：启动项目 并使用该配置文件

```
pm2 [start|restart|stop|delete] ecosystem.config.js
```



### 配置开发或测试环境变量

#### 配置文件设置环境变量

只能在配置文件中才可以设置 开发(development) 或 测试(production) 环境变量。
例如，在 ecosystem.config.js 中设置：

```
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```

#### 添加以哪种环境启动

以配置文件形式启动 pm2，同时添加 --env xxx 来明确以哪种环境启动：

```
pm2 start ecosystem.config.js --env production
```

#### Nodejs获取环境变量

例如获取环境变量中 POST 的值：

```
process.env.PORT
```



## PM2与Nodejs通信

#### PM2 监听 Nodejs 创建http服务成功

**pm2 启动时参数代码：**

```
pm2 start app.js --wait-ready
```

**当然也可以设置 监听 wait-ready 超时时间：**

```
pm2 start app.js --wait-ready --listen-timeout 3000
```

**Nodejs 创建http服务完成后，通过 process 向系统发送 ready 信号：**

```
var http = require('http');

var app = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('hey');
})

var listener = app.listen(0, function() {
  console.log('Listening on port ' + listener.address().port);
  // Here we send the ready signal to PM2
  process.send('ready');
});
```



#### Nodejs 监听 PM2 发送关闭信号

**pm2 启动时添加参数，允许 pm2 向系统进程发送关闭信号：**

```
pm2 start app.js --shutdown-with-message
```

**Nodejs 监听 系统进度 中的信号：**

```
process.on('message', function(msg) {
  if (msg == 'shutdown') {
    console.log('Closing all connections...');
    setTimeout(function() {
      console.log('Finished closing connections');
      process.exit(0);
    }, 1500);
  }
});
```



## 开机自动启动 pm2 服务

#### 第1步：保存当前状态

```
pm2 save
```

执行后会得到以下信息：

```
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
```

#### 第2步：创建启动文件

```
pm2 startup
```

执行后会得到以下信息：

```
[PM2] Init System found: systemd
Platform systemd
Template
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
After=network.target

...

Target path
/etc/systemd/system/pm2-root.service
Command list
[ 'systemctl enable pm2-root' ]
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] Making script booting at startup...
[PM2] [-] Executing: systemctl enable pm2-root...
Created symlink from /etc/systemd/system/multi-user.target.wants/pm2-root.service to /etc/systemd/system/pm2-root.service.
[PM2] [v] Command successfully executed.
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup systemd
```

#### 停止开启自动重启

```
pm2 unstartup
```

执行后会得到以下信息：

```
[root@VM_0_8_centos ~]# pm2 unstartup
[PM2] Init System found: systemd
Removed symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service.

Removed symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service.

[PM2] Init file disabled.
```



# 使用 pm.io

#### 第1步：注册 pm.io 账户

访问 https://pm2.io/ , 创建一个账户

> 注册时选择"personal use (个人版)"，不要选择 ”professional use (专业版)“

#### 第2步：创建Bucket(统计表)

个人版可免费创建4个项目的统计表。
例如本次演示，创建一个名为 mymood 的统计表。

#### 第3步：获取对应地址

每个 bucket(统计表) 对应专属的 link

```
pm2 link xvey2h2d24wghi2 wp1gdptcfrtqpfp
```

#### 第4步：在服务器中启动 pm.io

在服务器中执行：

```
pm2 plus
```

若首次使用，则需要登录 pm2.io 账户验证，验证成功后则会列出该账户下的统计表项目。

```
[root@VM_0_8_centos bin]# pm2 plus
[PM2 I/O] Using non-browser authentication.
[PM2 I/O] Do you have a pm2.io account? (y/n) y
[PM2 I/O] Your username or email: puxiao
[PM2 I/O] Your password: ********

[PM2 I/O] Authenticating ...
[PM2 I/O] Successfully authenticated
[PM2 I/O] Successfully validated
┌─────────────┬───────────┐
│ Bucket name │ Plan type │
├─────────────┼───────────┤
│ mymood      │ free_v4   │
└─────────────┴───────────┘
[PM2 I/O] If you don't want to connect to a bucket, type 'none'
[PM2 I/O] Type the name of the bucket you want to connect to : 
```

#### 第5步：连接 xxx 统计表

在第4步验证成功后，输入需要连接的统计表名字：mymood，即可连接该统计表。
此时在 https://app.pm2.io/ 项目后台，即可实时看到 服务器上的数据统计分析表。

#### 断开 pm2.io 服务

若要断开 pm2.io 统计分析服务，则执行：

```
pm2 logout
```

