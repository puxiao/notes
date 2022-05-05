# SSH连接github或gitlab



以下是基于 win10 系统的操作配置步骤。



<br>

首先说一下，SSH 连接 github 或 gitlab 的步骤几乎是完全相同的。

具体可以参考 github 官方帮助：

https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys



<br>

#### SSH连接github

1. 打开本机当前用户的目录 `C:\Users\your-name\.ssh\` 

   > 如果没有 .ssh 这个目录，那么你手工创建一下

2. 检查当前 .ssh 目录里的是否存在文件，这里假定你是空白的

3. 按着 shift 的同时 点击鼠标右键，点击 “Git Bash Here”

   > 注意必须是 Git Bash Here，其他的命令窗口不行，包括 Powershell

4. 输入并执行 `ssh-keygen -t ed25519 -C "your_email@example.com"`

   > 你需要将上述命令中的 "your_email@..." 替换成你在 github.com 上的邮箱地址

   > 上述命令中的 ed25519 会作为将来秘钥的文件名中的一部分

5. 敲回车后，会有询问，大致为询问你是否确定，以及是否要设置密码，这里无需理会，直接摁回车即可

   > 应该一共需要摁 3 次回车

6. 最终命令执行完成后，会在 .ssh/ 目录下 生成 `id_ed25519` 和 `id_ed25519.pub` 这 2 个文件

   > 其中 id_ed25519 为私钥、id_ed25519.pub 为公钥

7. 使用记事本打开 id_ed25519.pub 这个文件，复制里面的内容

8. 浏览器打开 https://github.com/settings/keys，点击页面中的 “New SSH key” 按钮

9. 在新页面中，在 `Title` 中输入当前准备生成的 SSH key 的标题(最好是英文)

   > 如果没有想好填写什么，可以直接写成自己的邮箱地址

10. 将从 id_ed25519.pub 中复制出来的文本，粘贴到 `Key` 输入框内，并点击下面的 “Add SSH key” 按钮

11. 当提示创建成功后，至此完成了全部的步骤



以后在 VSCode 中向 github.com 仓库提交代码，则它默认就会先去读取 .ssh/ 目录中的 key，无需再做其他 git 账户密码配置，即可完成账户认证，可以顺利提交代码了。

<br>

注意：若要拉取 github.com 上的仓库，则建议都使用 ssh 方式，不再使用 https 方式。



<br>

#### SSH连接gitlab

> 特别说明：这里说的 gitlab 是指公司自己内部搭建的 gitlab

1. 前 3 步骤 和上面连接  github 的一模一样

2. 在 Git Bash Here 打开的命令窗口中，输入并执行 `ssh-keygen -o -t rsa -b 4096 -C "email@example.com"`

   > 同样需要将上述邮箱替换成你在 gitlab 上的邮箱

   > 注意，上述命令中 `-t rsa` 也就意味着本次生成的文件名中会有 "rsa" 字符，与上面 github 中的 `-t ed25519` 刚好有所区分

3. 敲回车后，会有询问，大致为询问你是否确定，以及是否要设置密码，这里无需理会，直接摁回车即可

   > 应该一共需要摁 3 次回车，这一步和 上面设置 github 是一模一样的

4. 最终命令执行完成后，会在 .ssh/ 目录下 生成 `id_rsa` 和 `id_rsa.pub` 这 2 个文件

   > 其中 id_rsa 为私钥、id_rsa.pub 为公钥

5. 同样记事本打开 id_rsa.pub 这个文件，复制里面的内容

6. 浏览器打开 http://git.xxx.com/profile/keys

7. 将 id_rsa.pub 复制到的内容粘贴到 `Key` 输入框中，同时也填写一些 “标题”

8. 点击 “添加秘钥”，当提示创建成功后，至此完成了全部的步骤



<br>

当以后每次在 VSCode 中提交代码时，它都会默认扫描 .ssh/ 中的 私钥，然后跟 gitlab 做匹配，可以实现账户验证，提交代码。



<br>

**这样，就实现了在 VSCode 中 同时可以向 github  和 gitlab 提交代码。**



<br>

注：SSH 验证，你无需配置修改 git config user.name 和 git config user.email
