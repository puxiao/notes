# ESLint学习笔记

## 为什么要学习和使用ESLint？

在日常的开发中，当我们的 .js/.jsx 或 .ts/.tsx 中有语法错误，那么 VSCode 或者 TypeScript 就会给我们警告或错误提示。

**请注意，他们只负责自动检查 代码语法错误，并不负责检查 代码约定规范。**

尤其对于大型、需团队配合的项目而言，严格遵循团队约定的代码规范非常有必要。



<br>

对于代码本身而言，试想一下以下情景：

1. 团队代码规范中约定，不允许在代码中出现 console.log()
2. 不允许使用 var 声明变量
3. 不允许使用 for 循环，而是要求使用 .map 或 .forEach
4. ...



<br>

对于代码样式而言，试想一下以下情景：

1. 团队代码规范中约定，函数中的参数之间必须有一个 空格 
2. 函数与函数之间必须有一个换行
3. ...



以上情景中的代码，实际上并不是语法错误，VSCode 或 TypeScript 自然不会有任何警告和错误提示。

而我们此时又需要对代码进行自动约定规范检查时，就需要使用 ESLint 了。



<br>

**ESLint是用于自动检查代码规范的工具。**

我们使用 ESLint 主要帮我们做以下 2 件事情：

1. 根据 ESLint 配置，检查代码是否遵循了某些代码规范。
2. 修改 ESLint 默认配置，让某些代码跳过需要遵循的代码规范检查。

<br>

ESLint官网：https://eslint.org/



<br>

**和 ESLint 相似的其他包：**

1. **TSLint**：已于 2019 年宣布停止更新，转而推荐使用 ESLint。
2. **JSLint 和 JSHint**：和 ESLint 功能相似，但没有 ESLint 强大。



<br>

## 安装ESLint

**默认 create-react-app 创建 react 项目时，会自动安装 ESLint，无需我们手工安装。**



<br>

**假设我们自己主动安装 eslint，那么执行命令：**

```
yarn add eslint --dev
```

或

```
npm i eslint --save-dev
```



<br>

**请注意：由于我们安装的是 --dev，因此 ESLint 并不会将自己添加到系统环境变量中。**

因此当我们调用 ESLint 程序时，需要书写出完整的 ESLint 所在目录。

例如查看 ESLint 版本号，

以下命令是错误的：

```
eslint -v
```

正确的命令应该是：

```
./node_modules/.bin/eslint -v
```



<br>

## 初始化配置文件

**创建 ESLint 的配置文件有 2 种方式：**

1. 手工在项目根目录创建 `.eslintrc` 文件
2. 通过命令自动创建 `.eslintrc` 文件



<br>

**第1种方式：手工创建 `.eslintrc` 文件：**

假设我们已经熟练掌握 ESLint 配置方法，或者团队其他成员向我们提供了一份 配置文档，那么可以直接手工在项目根目录下创建 `.eslintrc` 文件，并填写相应的代码规范。

> 文件名为：`.eslintrc` 或 `.eslintrc.js` 都可以
>
> 他们 2 者的区别为：
>
> 1. `.eslintrc`：内容直接为 { ... }
> 2. `.eslintrc.js`：内容为 module.exports = { ... }



<br>

**第2种方式：使用命令创建 `.eslintrc.js` 文件：**

第1步：执行初始化命令

```
./node_modules/.bin/eslint --init
```



<br>

第2步：在命令终端窗口中，根据提示选择我们需要的选项：

```
? How would you like to use ESLint?
  To check syntax only //(只检查语法)
> To check syntax and find problems (检查语法和不符合规范的问题)
  To check syntax, find problems, and enforce code style (检查语法、不符合规范的问题、强制修改代码样式)
```

> 通常情况下，我们选择默认的 `To check syntax and find problems` 即可。



<br>

第3步：根据提示选择我们需要的选项

```
? What type of modules does your project use?
> JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
```

> 通常情况下，我们前端框架都会选择 `JavaScript modules (import/export)`
>
> 若你是做 Node.js 后端项目，则可能需要选择 `CommonJS (require/exports)`
>
> 若你使用 TypeScript 做 Node.js 后端项目，则选择 `JavaScript modules (import/export)`



<br>

第4步：根据提示选择我们需要的选项

```
? Which framework does your project use?
> React
  Vue.js
  None of these
```

> 这里我选择 `React`



<br>

第5步：根据提示选择我们需要的选项

```
? Does your project use TypeScript?  No / Yes
```

> 我使用 TS，所以在这一步的时候我选择 `Yes`，若你选择 `No`，从第6步开始有可能和本文的提示项不同。



<br>

第6步：根据提示选择我们需要的选项

```
? Where does your code run？
√ Browser //(浏览器)
  Node //(Node环境，也就是服务器)
```

> 1. 你可以通过键盘上的 上下箭头键 进行选择
> 2. 通过摁 回车键 选择确定
> 3. 你可以摁 A 键，可以全选(即运行在浏览器，也运行在 Node 中)，再次摁 A 键取消全选
> 4. 假设此时你通过 2 次摁 A 键取消了全选，你可以通过摁 上下箭头键 切换到某个选项中，然后此时摁 空格键，即可勾选该选项

> 对于前端项目，通常只选择 `Browser` 即可



<br>

第7步：根据提示选择我们需要的选项

```
? What format do you want your config file to be in?
> JavaScript
  YAML
  JSON
```

> 毫无疑问，我们选择 `JavaScript`
>
> 我们暂时不需要对 YAML 或 JSON 文件进行规范检查。



<br>

第8步：根据提示选择我们需要的选项

```
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest     
? Would you like to install them now with npm? » No / Yes
```

> 假设我们使用的是 create-react-app，通过添加参数 --template typescript 创建的 typescript react 项目，那么上面提到的几个 NPM 包已经默认安装，无需我们再次安装。

> 这里我选择 `No`

> 至此初始化配置文件完成



<br>

最终会在项目根目录产生一个 `.eslintrc.js` 的文件，内容可能如下：

```
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
    }
};

```

> 我们暂且不用过多去理解上述配置中具体的内容细节



<br>

**规则优先级的说明：**

> 这里说的 `.eslintrc` 也包含 `.eslintrc.js`

如果项目中不存在 .eslintrc 文件，则采用 ESLint 默认的配置规则。

如果项目中存在 .eslintrc 文件，则会将 .eslintrc 中的配置规则 与 默认的 ESLint 配置规则进行相结合。

.eslintrc 文件中的配置规则优先级 高于 默认的 ESLint 配置规则。



<br>

**当我们在 React 中使用 TypeScript 的 as 语法时，ESLint 有可能会报错：**

```
Parsing error: Unexpected token, expected ","
```

**解决办法是向 .eslintrc 中添加：**

```
{
	"extends": ["react-app", "react-app/jest"],
}
```

> 尽管 package.json 中，create-react-app 已经自动添加有以下内容
>
> ```
> "eslintConfig": {
>     "extends": [
>         "react-app",
>         "react-app/jest"
>     ]
> },
> ```
>
> 但是依然需要我们再在 .eslintrc 中添加一次，这点究竟原因是为什么，暂时还没理解。



<br>

### 查看更多配置

具体的 ESLint 配置项，可查阅：

https://eslint.org/docs/user-guide/configuring/

上面罗列出详细的配置文件的使用说明。



<br>

## 添加和配置规则

在 `.eslintrc` 或 `.eslintrc.js` 文件中，"rules：{ }"  是用来添加和配置规则的。



举例，假设我们使用了 webpack 的 worker-loader 插件，在引入 worker.ts 文件中我们需要使用 

```
import Worker from 'worker-loader!./worker'
```

默认情况下 上面这行代码是会报错的，因为我们使用了 `!` 这个不符合引入路径规范的字符。

那么此时我们就需要修改对应的 ESLint 检测规则。

```
{
    "rules": {
        "no-restricted-globals": ["error", "event", "fdescribe"],
        "import/no-webpack-loader-syntax": "off"
    }
}
```

在上述修改的配置中，我们添加了相应的规则，将 "import/no-webpack-loader-syntax" 的值设置为 "off"，这样 ESLint 将不再对引入路径中的 `!` 做报错处理。

> 上面规则中的 `"no-restricted-globals": ["error", "event", "fdescribe"]` 是允许我们在 worker.ts 中使用 global 。



<br>

再举另外一个例子，假设我们现在不允许代码中出现 `console.log()`，那么我们可以添加以下规则：

```
{
    "rules": {
        "no-console": "error"
    }
}
```

> 当我们去编译项目代码时，若发现代码中存在 console.log()，则会报错。



<br>

### 报错级别

对于不同的检测规则，我们可以设置其报错级别，分别为：

| 级别(值)     | 对应含义                                                     |
| ------------ | ------------------------------------------------------------ |
| "off" 或 0   | 关闭这条规则检测                                             |
| "warn" 或 1  | 执行该条规则检测，若发现违反则发出警告信息(warning)，并不会退出代码的运行 |
| "error" 或 2 | 执行该条规则检测，若发现违反则发出错误信息(error)，并退出代码的运行 |



<br>

### 查看更多规则

有些规则需要我们额外去安装一些 ESLint 的插件才可以。具体 ESLint 都支持哪些规则，可查看：

https://eslint.org/docs/rules/

这上面列出了全部的，详细的规则说明。



<br>

举例：假设团队中不允许使用 for 循环，必须使用 .map 或 .forEach，那么我们可以：

1. 安装 eslint-plugin-no-loops

   ```
   yarn add eslint-plugin-no-loops --dev 
   //npm install --save-dev eslint-plugin-no-loops
   ```

2. 添加 ESLint 规则

   ```
   {
       "rules": {
           "no-loops/no-loops": "error"
       }
   }
   ```



<br>

**实际工作中的ESLint配置项**

在实际工作中，通常我们会使用团队自己内部约定商议的规则，或者直接使用大公司的代码规则。

例如直接使用 阿里、腾讯 或 facebook 他们的 ESLint 配置规则。



<br>

## 创建忽略检查的文件配置

在我们的项目中会使用到大量第三方 NPM 包，我们通过创建 `.eslintignore` 文件来声明哪些文件或目录是不需要进行 ESLint 检测的。

**在项目根目录新建 .eslintignore 文件，内容如下：**

```
node_modules
dist
```



<br>

## 执行ESLint代码检测

**对单个文件进行检测**

```
./node_modules/.bin/eslint yourfile.js
```

<br>

**对整个项目进行检测**

当我们使用 react 编译调试或构建项目时，均会自动执行 ESLint 检测。

