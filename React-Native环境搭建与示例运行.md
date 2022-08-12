# React-Native环境搭建与示例运行

本文前提是假定你会使用 React。



<br>

**环境搭建分为以下几个步骤：**

1. 安装 react 基础环境
2. 安装 Android Studio
3. 安装 Java SE Development Kit (JDK)
4. 添加系统环境变量
5. 修改默认的 .gradle 下载源



**示例运行分为以下几个步骤：**

1. 安装 react-native
2. 创建一个项目
3. 开启真机USB调试
4. 开始项目调试



<br>

## 环境搭建

**第1步：安装 react 基础环境**

1. nodejs：版本要求 14+

2. npx：为了 npm 安装包速度，可以选择切换到淘宝源，当然不切换也是可以的

   ```
   npx nrm use taobao
   
   //若想切换回默认的 npm 源，请执行 npx nrm use npm
   ```

3. yarn：建议安装 yarn



**第2步：安装 Android Studio**

官网下载安装包：

https://developer.android.com/studio/

> 如果打不开官网，则自己在国内下载网站找安装包



<br>

注意：安装过程中，一定记得自己所选的安装目录。

例如我选择的安装目录为：D:\Program Files\Android

安装完成后，该目录下会有 2 个目录：Android Studio、Sdk



<br>

> 使用 React-Native 之所以需要安装 Android Studio 就是因为我们需要这个 Sdk 目录，至于 Android Studio 这个工具，我们可以选择忽略它，不使用它。



<br>

**第3步：安装 Java SE Development Kit (JDK)**

官网下载安装包：

https://adoptium.net/zh-CN/temurin/releases/?version=11

> JDK 版本为 11



<br>

**第4步：添加系统环境变量**

打开系统环境变量窗口

> 此电脑 > 右键 > 属性 > 高级系统设置 > 环境变量



<br>

`假设我刚才将 Android Studio 安装到了 D:\Program Files\Android`

在系统变量中，新建 并添加下面的内容：

变量名：ANDROID_SDK_ROOT

变量值：D:\Program Files\Android\Sdk



<br>

点中 `Path > 编辑` ，依次加入下面路径内容

1. %ANDROID_SDK_ROOT%\platform-tools
2. %ANDROID_SDK_ROOT%\emulator
3. %ANDROID_SDK_ROOT%\tools
4. %ANDROID_SDK_ROOT%\tools\bin



<br>

当然你也可以不选择添加 ANDROID_SDK_ROOT 变量，而是在 Path 中直接写固定路径：

```
1. D:\Program Files\Android\platform-tools
2. D:\Program Files\Android\emulator
3. D:\Program Files\Android\tools
4. D:\Program Files\Android\tools\bin
```



<br>

**第5步：修改默认的 .gradle 下载源**

打开当前系统用户的 `.gradle` 目录

> 例如假设当前用户为 administrator，那么打开 C:\Users\Administrator，在里面找到 .gradle 目录。

然后在该目录下创建一个名为 `init.gradle` 的文件，内容为：

```
allprojects{
    repositories {
        def ALIYUN_REPOSITORY_URL = 'https://maven.aliyun.com/repository/central/'
        def ALIYUN_JCENTER_URL = 'https://maven.aliyun.com/repository/public/'
        all { ArtifactRepository repo ->
            if(repo instanceof MavenArtifactRepository){
                def url = repo.url.toString()
                if (url.startsWith('https://repo1.maven.org/maven2') || url.startsWith('http://repo1.maven.org/maven2')) {
                    project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_REPOSITORY_URL."
                    remove repo
                }
                if (url.startsWith('https://jcenter.bintray.com/') || url.startsWith('http://jcenter.bintray.com/')) {
                    project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_JCENTER_URL."
                    remove repo
                }
            }
        }
        maven {
            url ALIYUN_REPOSITORY_URL
            url ALIYUN_JCENTER_URL
			url 'https://maven.aliyun.com/repository/google/'
			url 'https://maven.aliyun.com/repository/gradle-plugin/'
        }
    }
 
 
    buildscript{
        repositories {
            def ALIYUN_REPOSITORY_URL = 'https://maven.aliyun.com/repository/central/'
            def ALIYUN_JCENTER_URL = 'https://maven.aliyun.com/repository/public/'
            all { ArtifactRepository repo ->
                if(repo instanceof MavenArtifactRepository){
                    def url = repo.url.toString()
                    if (url.startsWith('https://repo1.maven.org/maven2') || url.startsWith('http://repo1.maven.org/maven2')) {
                        project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_REPOSITORY_URL."
                        remove repo
                    }
                    if (url.startsWith('https://jcenter.bintray.com/') || url.startsWith('http://jcenter.bintray.com/')) {
                        project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_JCENTER_URL."
                        remove repo
                    }
                }
            }
            maven {
                url ALIYUN_REPOSITORY_URL
                url ALIYUN_JCENTER_URL
				url 'https://maven.aliyun.com/repository/google/'
				url 'https://maven.aliyun.com/repository/gradle-plugin/'
            }
        }
    }
}
```



<br>

为什么要添加 `init.gradle` 文件？

由于第一次编译 react-native 时需要联网下载一些第三方 .jar 包，例如会下载 fastutil-8.4.0.jar、kotlin-compiler-embeddable-1.6.10.jar 这两个文件的默认下载源相当的慢，半个小时未必能够下载完成，哪怕你开了代理也是非常慢。

所以需要将默认的国外源修改为 阿里云 提供的下载源。

> 请注意这里下载的是 .jar 文件，不是 npm 包，所以跟修不修改 npm 源无关。



<br>

至此，安装运行 react-native 环境已经配置好了。



<br>

## 示例运行

 **第1步：安装 react-native**

全局安装 react-native

```
yarn global add react-native
```



<br>

> 特别说明：很早之前还需要安装 react-native-cli，但是这个早都废弃，目前根本不需要安装它，因为它已经内置到 react-native 中了。



<br>

**第2步：创建一个项目**

特别强调：对于 react-native 项目目录名

1. 不要包含中文
2. 不可以使用大写
3. 不可以使用 中划线 `-` 或其他特殊字符
4. 只允许使用小写字母+数字



<br>

> 假设我们在 E盘创建了一个 react-native 的目录，我们先需要进入该目录
>
> ```
> cd e:/react-native
> ```



假设我们要创建一个名为 test 的 react-native 项目，那么执行：

```
npx react-native init test
```

如果你想使用 TypeScript，那么可以添加参数：

```
npx react-native init test --template react-native-template-typescript
```



<br>

安装完成后，我们用 VSCode 打开这个项目，就会看到默认的 react-native 文件目录结构。

我们先不做任何修改。

> 哪怕里面可能会有 eslint 警告信息



<br>

**第3步：开启真机USB调试**

用 USB 数据线连接手机，并打开手机的 USB 调试。

> 不同型号手机开启 USB 调试模式的方式各不相同，这里不做过多讲述

> 一定要打开 `USB 调试` 中的 `USB 安装`



<br>

一切准备就绪，那么开始真机调试。

**第4步：开始项目调试**

打开项目的 package.json 文件，可以看到：

```
"scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
},
```



<br>

react-native 默认会启用 8081 端口，如果这个端口被占用，或想启用其他端口，则可以通过下面方式修改：

```
"android": "react-native run-android --port 8088",
```



<br>

由于我是安卓手机，那么我在命令面板中执行：

```
yarn android
```

接下来如果一切顺利，就会将默认的 react-native 示例打包成 安卓应用，并在手机上进行安装。



<br>

> 我这边第一次看到手机上成功运行，内心是非常激动的，感觉打开了一个神奇大门。



<br>

**特别补充：**

1. 如果是第一次执行，因为要下载一些第三方 .jar 所以会慢一些，不过好在我们之前配置过 `init.gradle`，所以下载速度应该还比较快
2. 在 USB 调试期间一定保持 手机不要处于 锁屏状态
3. 我的小米手机可以正常调试安装，但是在 鸿蒙 手机中由于安全性过高，不允许安装签名异常的 安卓应用，所以会出现无法安装的情况。



<br>

至此，react-native 从安装到运行的流程已经讲解完毕。

那么接下来，就该是慢慢的逐渐去学习 react-native 各个 API 和一些第三方 相关 npm 包了。