# Github的2FA验证操作步骤



### 为什么需要2FA验证？

因为 Github 最新政策：首次登录某个设备除了账户密码外，还需要 2FA 验证！

(2FA是英文单词：two-factor authentication 的简写)



<br>

### 2FA验证的几种方式：

1、Authenticator app：身份验证APP

2、SMS/Text message：短信验证

3、Security keys：安全密钥

4、Github Mobile：Github 手机APP



<br>

### 国内2FA的困境：

短信验证：最近不行，根本收不到短信

> 曾经是可以的，当时会收到一个国内手机号发送的短信，但是最近根本无法收到短信验证码



<br>

### 目前可行的2FA验证操作步骤：

**请注意：前提是你有科学上网神器。**



<br>

本人是安卓手机，所以下面操作是针对安卓手机而言。



<br>

**第1步：安装包 APK 下载**

打开科学上网神器，然后访问：https://apkcombo.com/

通过这个网站依次搜索并下载下面 3 个 APK 安装文件：

* Microsoft Authenticator
* Github
* Chrome



<br>

**第2步：关闭手机应用的安全检测**

不然安装上面的应用时就会告诉你：未检测到该应用的国内备案信息，不能安装....



<br>

**第3步：安装上面下载的 3 个 APK**



<br>

**第4步：向 Microsoft Authenticator 添加 github 账户**

1. 先电脑访问登录 Github 账户，然后打开个人安全设置页面：https://github.com/settings/security 找到 "Two-factor methods"

2. 点击 Authenticator app 右侧 "..." 按钮打开配置内容，这时你应该会看到一个二维码

   (或者你直接访问：https://github.com/settings/security?type=app#two-factor-summary)

3. 打开 Microsoft Authenticator 应用，添加个人账户，选择使用扫码方式添加，扫 Github 那个二维码

4. 扫码后 Microsoft Authenticator 应用就会跳转到你的 Github 账户信息中，应用页面此时会每个 30秒 刷新一个临时验证码

5. 将该验证码数字填入到 Github 刚才页面中的 "**Verify the code from the app**" 输入框中，点击保存

到了这一步，就算把最核心的步骤完成了。

(此时 Microsoft Authenticator 个人的 Github 账户信息页面先不要关闭)



<br>

**第5步：在手机 Github 应用中使用 Microsoft Authenticator 验证**

1. 手机打开 Github 应用，在登录时选择使用 2FA 验证
2. 在打开的页面中填入 Microsoft Authenticator 一直在刷新的那个临时验证码数字
3. 这样手机 Github 应用就成功进行了 2FA 验证了



<br>

**第6步：在手机 Chrome 浏览器应用中使用 2FA 验证**

1. 在手机谷歌浏览器中访问登录 Github 网站

2. 选择 2FA 的验证方式：Use your authenticator app，这时可以输入 Microsoft Authenticator 一直在刷新的那个临时验证码数字 进行 2FA 验证

3. 也可以点击：Use Github Mobile 使用 Github Mobile 进行 2FA验证

   (前提是你手机上的 Github Mobile 处于打开状态)

   你切换到手机上的 Github 应用，会看到一个对话弹窗：新登录请求 ...

   点击 "批准"，再回到谷歌浏览器，就看会看到登录成功了。



<br>

**经过上面一番操作，手机上：浏览器、Github 应用都可以进行 2FA 登录验证了。**



<br>

这时我们再去看 https://github.com/settings/security ，页面上的 Preferred 2FA method (首选 2FA 方式)，上面就有 3 个下拉可选项，我们可以修改默认优先使用：Authenticator app 或 Github Mobile

