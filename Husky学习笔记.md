# Husky学习笔记



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



<br>

**需求描述：提交代码前，必须先经过 lint 检查，确保代码无误后才能提交。**



<br>

> package.json

```
"scripts": {
    ...
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
}
```



<br>

> .huskye/pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint
```



<br>

当去执行提交前，都会自动运行一下 `yarn lint`，若未通过则跳过本次提交，并输出原因。



<br>

### husky配套工具：lint-staged



<br>

**lint-staged 是什么？**

答：lint-staged 是针对 git 暂存区中文件代码格式化的一个 NPM 包。



<br>

**husky不够用吗？为什么还要安装lint-staged ？**

在前面讲解中，我们已经学会了 husky 的用法，我们知道  husky 可以在提交前触发 `yarn lint` 用于代码检查。

虽然这看上去已经够用了，但是还是存在一些缺点的：

* `yarn lint` 是针对所有的代码进行代码检查，但很多时候我们仅需要针对我们本次修改的代码检查即可，而不是全部

  > 换句话说，我们只需保证自己提交的代码没有问题即可，若之前其他人提交的代码不通过 lint 检查，我们难道还有义务必须去替他们全部修改好吗？

  > 此外对于复杂项目，全局执行一遍检查所需要的时间是比较久的。

* `yarn lint` 无法提供更加细颗粒度的检查区分，例如我们不光要检查代码文件(例如 .jsx、.ts)，还要检查文档文件(例如 .md)，此时单单一条 `yarn lint` 就无法满足要求了



<br>

**所以使用 lint-staged 就显得非常有必要了：**

* 我们只需在提交前检查本次自己修改的代码，即 git 暂存区 中的代码
* lint-staged 可以提供更加细颗粒度(针对不同文件类型)的代码检查配置



<br>

好了，我们决定 huskye 要搭配 lint-staged 了，开始学习 lint-staged 吧。



<br>

### 安装lint-staged



<br>

**1、安装：**

```
yarn add lint-staged --dev
```



<br>

**2、向 package.json 的 scripts 添加一行命令：**

```diff
"scripts": {
    ...
+   "lint-staged": "lint-staged",
}
```



<br>

**3、修改pre-commit中的命令：**

```diff
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- yarn lint
+ yarn lint-staged
```



<br>

**4、向 package.json 中添加 lint-staged 详细的规则：**

> 注意：新添加的 "lint-staged" 标签与 "scripts" 同一级别

```
"scripts": {
    ...
},
"lint-staged": {
    "*.{js,ts,jsx,tsx}": ["lint"],
    "*.md": "prettier --list-different"
}
```



<br>

**详细规则配置说明：**

配置规则就是：文件匹配规则 + 触发的命令

* 文件匹配规则：
  * 对于某一种文件可以使用 `*.xx` 来表示，例如 `"*.ts"` 或  `"*.md"`
  * 想一次定义多种文件格式，则规范为：`*.{ts,tsx,...}`
  * 文件名前还可以增加路径作为文件过滤条件，例如 `src/xx/*.ts`、`src/**/*.ts`
  * 也支持排除方式，例如 `!(*test).js` 其匹配结果为：除 xx.test.js 以外的其他全部 .js 文件
* 对应命令：
  * 如果只有一条命令，可以直接使用字符串形式
  * 如果对应多条命令，可以使用 数组，数组每一个元素为一条命令，数组中命令执行顺序从左至右
  * 温馨提醒：命令不必须是 package.json 中 "scripts" 定义的，而是任何可执行的命令，例如 `git add`、"yarn add ..."



<br>

**详细规则配置的另外一种方式：**

上面我们讲解配置 lint-staged 规则时，是通过向 package.json 中新增 "lint-staged" 元素来完成的。

还有另外一种配置方式：创建 lint-staged 配置文件



<br>

**lint-staged 的配置文件形式可以有非常多中：**

* .lintstagedrc
* .lintstagedrc.json
* .lintstagedrc.yaml
* .lintstagedrc.yml
* .lintstagedrc.mjs 或 lint-stage.config.mjs
* .lintstagedrc.cjs 或 lint-stage.config.cjs
* .lintstagedrc.js

**我们只需要明白 lint-staged 配置规则为一个对象，那么只要是其内容或返回结果是一个对象即可。**



<br>

### 总结

经过上面的学习，我们已经会安装和配置 husky 和 lint-staged。

* husky 用来关联 git commit 钩子函数
* lint-staged 用来强调只针对 git 暂存区 中的文件进行各种检查



<br>
