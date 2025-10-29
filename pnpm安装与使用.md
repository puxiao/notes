# pnpm安装与使用

<br>

### 修改PowerShell安全策略

使用 pnpm 命令时，需要先修改 PowerShell 的安全策略，否则即使 pnpm 安装成功，执行时也会收到这样的报错信息：

```
pnpm : 无法加载文件 C:\Users\xiao\AppData\Roaming\npm\pnpm.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fw
link/?LinkID=135170 中的 about_Execution_Policies。
```

<br>

#### 修改方式：

1. windows > 开始 > 列表中找到 Windows PowerShell
  
2. 鼠标放到 PowerShell 上面点击右键，在 `更多` 中点击 `以管理员身份运行`
  
3. 输入下面命令后按回车键：
  
  ```
  set-ExecutionPolicy RemoteSigned
  ```
  
4. 输入 A 或者 Y 都可以
  
5. 重启 PowerShell 就可以放心使用 pnpm 了。
  

<br>

### 安装pnpm

假定电脑已安装最新版 nodejs。

> 需要 nodejs 16+ 以上的版本

```
npm i -g pnpm
```

<br>

### 常用命令

<br>

**查看pnpm信息与帮助**

```
pnpm
```

<br>

**查看配置项**

```
#查看当前项目配置项，默认会使用空格分割不同配置项
pnpm config list

#以 JSON 方式输出
pnpm config list --json


#查看全局配置项
pnpm config list -g --json

#或
pnpm config list --global --json
```

<br>

**查看或修改某个配置项**

```
#查看
pnpm config get xxx

#设置
pnpm config set xxx
```

<br>

**查看全局npm源**

```
pnpm config get registry
```

> 默认的 NPM 源为：https://registry.npmjs.org/

<br>

**修改全局npm淘宝源**

```
pnpm config set registry https://registry.npmmirror.com
```

> 修改 淘宝镜像源 的方式和 npm 、yarn 都是一模一样的

<br>

**初始化项目**

```
pnpm init
```

> 若当前目录不存在 package.json 则会自动创建

<br>

**安装到生产依赖(dependencies)**

```
pnpm add xxx
```

<br>

**安装到开发依赖(devDependencies)**

```
pnpm add -D xxx

#或
pnpm --save-dev xxx
```

<br>

**安装到非必须的选项依赖(optionalDependencies)**

```
pnpm add -O xxx

#或
pnpm add --save-option xxx
```

<br>

**安装到全局**

```
pnpm add -g xxx

#或
pnpm add --global xxx
```

<br>

**安装依赖**

```
pnpm i

#不使用简写
pnpm install
```

<br>

**更新依赖**

```
#根据 package.json 小版本升级
pnpm up

#无论任何包都升级至最新版
pnpm up --lastest

#不使用简写
pnpm update
```

<br>

**删除依赖**

```
pnpm remove xxx

#删除全局依赖包
pnpm remove -g xxx

#删除开发依赖包
pnpm remove -D xxx
```

> remove 还可以使用其他词语替代：rm、uninstall、un

<br>

**检查当前包的安全性**

```
pnpm aduit
```

<br>

**以树状结构输出当前依赖项**

```
pnpm list

#可以简写为
pnpm ls
```

<br>

**运行自定义的脚本**

```
pnpm run xxx
```

> 如果是 package.json 中自定义的脚本命令，则无需 `run`，直接 `pnpm xxx`

<br>

**创建vue 或 vit 项目：**

```
pnpm create vue
```

```
pnpm create vite
```

<br>

### 与monorepo(同一仓库多子项目)结合

<br>

**pnpm-workspace.yaml**

在 monorepo 项目中，需要在项目根目录创建 `pnpm-workspace.yaml` 文件。

```
packages:
  - 'monorepo/*'
```

像上面这样的配置含义为：

- monorepo目录下所有的子目录(子项目) 中需要 pnpm 安装的包都会集中到 根目录下的 node_modules 中
- 而所有子目录下创建的 node_modules 中的 npm 包仅仅是根目录下 node_modules 的文件引用

**这样的好处就是：各个子项目中相同的 npm 包文件实际上只会存在一份，节省本地磁盘空间。**

<br/>

**三级目录：**

如果你的 monorepo/xx/ 下面还有子项目目录，那么你需要这样的配置：

```
packages:
  - 'monorepo/**'
```

<br>

**在根目录中运行monorepo中的子项目：**

假设子项目 xx 目录为 /monorepo/xx/ ，若想在根目录中执行子项目 xx 的 dev ，那么按照传统的写法，需要在 /package.json 中增加这样的配置：

```
"scripts": {
    "devXx": "cd ./monorepo/xx && pnpm dev",
}"
```

但是在配置了 pnpm-workspace.yaml 的情况下，可以通过 pnpm 特有的 `--filter` 参数简化上述配置：

```
"scripts": {
    "devXx": "pnpm --filter ./monorepo/xx dev",
}"
```

> 也可以把 `--filter` 简写成 `-F`

整个过程中无需用户 `cd` 到该子项目目录。
