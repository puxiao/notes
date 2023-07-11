# Husky学习笔记



<br>

### Husky简介与作用

Husky 通过与 git 的 hooks 钩子挂钩，实现代码 git 提交前进行相关检查。

这些检查通常包括：

* 检查 git 的 commit 描述信息是否符合约定

* 检查 代码 是否符合规范

* 运行测试代码 是否运行正常，不正常或有报错禁止提交

  > husky 仅仅是触发执行 npm test 这样的命令来执行代码检查

* ...



<br>

Husky 官网：https://typicode.github.io/husky/

代码仓库：https://github.com/typicode/husky



<br>

**git版本要求：**

Husky 要求 git 版本需大于 2.9，因此在安装使用 husky 之前应先检查自己的 git 版本是否符合要求。

```
git -v
```

> 目前 git 最新版本为 2.41



<br>

### 安装husky

安装并启用 husky 一共有 2 种创建流程：



**第1套流程：**

1、安装

```
yarn add husky --dev
```

2、创建 git 挂钩(hooks)

```
npx husky install
```

上述命令执行结束后：

* 会自动向 package.json 的 scripts 命令中增加 `"prepare": "husky install"`
* 会在项目根目录创建 `.husky/_/` 目录，里面包含 2 个文件 `.gitignore` 、`husky.sh`



<br>

**第2套流程：**

1、手工向 package.json 的 scripts 命令中增加一条命令：

```
"scripts": {
    ...
    "prepare": "husky install"
},
```

> parpare 单词翻译为 "准备"



<br>

若你不想手工添加，也可以采用命令方式添加：

```
npm pkg set scripts.prepare="husky install"
```



2、安装

```
yarn add husky --dev
```



<br>

以上 2 种安装与启用 husky 的方式最终结果都是相同的。



<br>

**特别补:1：修改 `.husky`的位置**

默认情况下 husyk 创建的文件位于项目根目录 `.husky`，假定你不想存放在此位置，例如你想存放到 `.config` 目录下，那么你可以采用上面第 2 种流程，并修改 "prepare" 命令的值：

```diff
"scripts": {
     ...
-    "prepare": "husky install"
+    "prepare": "husky install .config/husky"
},
```



<br>

**检查 git core.hooksPath 与 .husky 是否正确关联：**

```
git config core.hooksPath
```

> 上述命令，若会输出的目录是 .husky 即表示关联正确



<br>

**特别补充2：package.json 与 .git 目录的关系**

通常情况下 package.json 文件与 .git 目录应该是同一个目录。

但假定有一些特殊场景：package.json 与 .git 并不在同一个目录里，那么就需要我们做一些特殊处理。

我们需要修改 "prepare" 命令，先通过 cd 的方式从 package.json 所在目录切换至 .git 所在目录中：

```
"scripts": {
     ...
-    "prepare": "husky install"
+    "prepare": "cd .. && husky install xxx/husky"
},
```

同时要修改 .husky/pre-commit

```
cd xx
npm test
```

> 实际工作中并未遇到这种 package.json 与 .git 不同目录的情况，上面的这段操作我并没有运行过，仅为从  husky 官网中看到的，具体还请查阅官网：
>
> https://typicode.github.io/husky/guide.html#custom-directory



<br>

### 禁用、跳过husky



<br>

**临时跳过 husky 检查：**

假定处于某种需求，需要临时跳过、忽略 husky 对应的 git 代码提交前的检查，最简单的做法是：git push 增加 `--no-verify` 参数。例如：

```
git commit -a -m 'xxx' --no-verify
```



<br>

**卸载 husky：**

假设以后都不再需要 husky，那么最彻底的就是删除卸载 husky。

```
yarn remove husky && git config --unset core.hooksPath
```

> husky 安装创建之初会修改当前 git 的 core.hooksPath 的值，所以卸载时也需要恢复改值



<br>

或者我们使用 husky 提供的卸载命令：

```
npx husky uninstall
yarn remove husky
```

> npx husky uninstall 命令相当于执行 git config --unset core.hooksPath



<br>

### 关于 git 的 hooks



<br>

在使用 husky 添加 hooks 之前，强烈建议先了解一下 git 的 hooks(钩子)：

[https://git-scm.com/book/zh/v2/自定义Git-Git钩子](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)



<br>

**与提交有关的 4 个钩子：**

> 这里说的 提交 强调的是 commit 而不是 push(代码推送)

* pre-commit：键入提交信息前运行

  > 可在此契机中执行代码检查、测试运行等，是我们使用最频繁的钩子

* prepare-commit-msg：修改提交信息前运行

* commit-msg：用户正在输入提交信息后触发

* post-commit：commit-msg 之后立即执行，通常仅显示一些消息



<br>

除了上面提交相关的 hooks 之外，还有其他几个工作流相关的 hooks：

* email 工作流
* 其他
* 服务器端的 hooks



<br>

**特别补充：**

git 的 hooks 名称中遵循下面命名规则：

* pre- 开头表示：在 xx 之前触发的
* post- 开头表示：在 xx 之后触发的



<br>

### 添加hooks钩子处理

假定我们在对 git 的各个 hooks 已经有了初步了解，那么我们现在就可以添加某个 hooks 钩子处理文件到我们的项目中。



<br>

**通过 husky 添加 hooks 的命令格式为：npx husky add ./husky/xxx "xxxxx"**

其中：

* ./husky/xxx：以关联的钩子名为文件名的 shell 文件保存目录

  > 提醒：该文件名必须与 git hooks 钩子名相同，拼写有误将不会执行触发

* "xxxxx"：该钩子函数需要执行的命令

  > 例如："npm test" 或 "yarn test"



<br>

通常情况下 `pre-commit` 是我们使用最多的 钩子，我们创建它的钩子命令为：

```
npx husky add .husky/pre-commit "yarn test"
git add .husky/pre-commit
```



<br>

> 注意一定不要把 .husky 路径写错，我实际执行时就犯了低级错误，手误把 ".husky" 误写成了 "./husky"：
>
> ```
> husky - can't create hook, .husky directory doesn't exist (try running husky install)
> ```



<br>

**生成的文件说明：**

上述命令执行完成后，就会在 ./husky/ 下创建一个名为 pre-commit 的文件：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn test

```



**特别强调：**

git pre-commit 钩子关联执行的 "yarn test" 的前提是我们在 package.json 中有定义该命令。

> vite 创建的项目默认就不包含该命令，需要我们自己创建。



<br>

**修改pre-commit：**

对于已经创建好的 .husky/pre-commit ，想修改它，最简单的办法就是直接打开编辑该文件。

当然 husky 也为我们提供了修改命令：

* npx husky add ... 是 创建新增
* npx husky set ... 是 修改



<br>

### 实际示例

未完待续...