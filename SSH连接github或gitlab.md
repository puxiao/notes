# SSH连接github或gitlab



以下是基于 win10 系统的操作配置步骤。



<br>

首先说一下，SSH 连接 github 或 gitlab 的步骤几乎是完全相同的，所以本文只以 github 为例。

当然你也可以参考 github 官方帮助：

https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys



<br>

#### SSH连接github

1. 打开本机当前用户的目录 `C:\Users\your-name\.ssh\` 

   > 如果没有 .ssh 这个目录，那么你手工创建一下

2. 检查当前 .ssh 目录里的是否存在文件，这里假定你是空白的

3. 按着 shift 的同时 点击鼠标右键，点击 “Git Bash Here”

   > 注意必须是 Git Bash Here，其他的命令窗口不行，包括 Powershell

4. 输入并执行 `ssh-keygen -t ed25519 -C "your_email@example.com"`

   > 你需要将上述命令中的 `your_email@example.com` 替换成你在 github.com 上的邮箱地址

   > 上述命令中的 ed25519 的含义为 “使用 ed25519(扭曲爱德华曲线)” 作为数字签名的加密方式
   >
   > ed25519 是目前比较主流的数字签名加密方式，例如 github.com、coding.net 都推荐采的方式

   > 与之对应的是 rsa 加密方式，即 `ssh-keygen -t rsa -C "your_email@example.com"`
   >
   > 不过这种方式逐渐不被主流推荐使用

5. 敲回车后，会有第一个询问：`Enter file in which to save the key :` 意思是让你输入要生成的秘钥文件名，例如你可以输入：`id_github`，然后摁回车

   > 当然你写成 `github` 或者其他都是可以的，下面讲解中都假定你输入的是 `id_github`

   > 如果你什么都不输入，而是直接摁回车，那么它会默认要生成的 2 个文件名为 `id_ed25519` 和`id_ed25519.pub`

6. 接着会有第二个询问：`Enter passphrase(empty for no passphrase):` 意思是让你输入以后每次使用此秘钥时需要的密码，个人建议什么都不要输入(省得以后每次提交代码都需要输密码)，直接摁回车

7. 接着是第三个询问：`Enter same passphrase again:` 意思是让你再次确认密码，直接摁回车

8. 最终命令执行完成后，会在 .ssh/ 目录下 生成 `id_github` 和 `id_github.pub` 这 2 个文件

   > 其中 id_github 为私钥、id_github.pub 为公钥

9. 使用记事本打开 `id_github.pub` 这个文件，复制里面全部的内容

10. 浏览器打开 https://github.com/settings/keys ，点击页面中的 “New SSH key” 按钮

11. 在新页面中，在 `Title` 中输入当前准备生成的 SSH key 的标题(最好是英文)

    > 如果没有想好填写什么，可以直接写成自己的邮箱地址

12. 将从 id_github.pub 中复制出来的文本，粘贴到 `Key` 输入框内，并点击下面的 “Add SSH key” 按钮

13. 当提示创建成功后，至此完成了全部的步骤



<br>

拉取 github.com 上的仓库，使用 ssh 方式，不再使用 https 方式。

以后在 VSCode 中向 github.com 仓库提交代码，则它默认就会先去读取 .ssh/ 目录中的 key，无需再做其他 git 账户密码配置，即可完成账户认证，可以顺利提交代码了。



<br>

**这样，就实现了在 VSCode 中以向 github 提交代码。**



<br>

注：SSH 验证，你无需配置修改本机的 git config user.name 和 git config user.email



<br>

**特别说明：腾讯云 coading.net 平台**

coading.net 平台也支持这种方式，但是按照官方文档的介绍，默认配置好的 SSH 秘钥只有拉取代码的权限，如果想有推送代码的权限，还需要在后台设置出对应勾选推送权限。

具体可查看：https://coding.net/help/docs/repo/ssh/config.html



