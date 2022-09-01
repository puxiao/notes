# log4js学习笔记

log4js 是运行在 node.js 环境中的日志文件服务。



<br>

#### 第1步：安装log4js

```
yarn add log4js
```

> 当前最新版本为 6.6.1，本文将以这个版本为准来讲解学习log4js。
>
> 特别强调：对于 log4js 的不同版本，起配置方式略微有所差异。



<br>

#### 第2步：引入、配置、封装

我们在项目源码中创建这样一个文件：`src/logger/index.js`

**引入并配置log4js：**

```
const log4js = require('log4js')

log4js.configure({
    //在此处添加配置项
})

module.exports = log4js //将配置过后的log4js导出
```



<br>

我们通过 log4js 的 .d.ts 来看看都可以做哪些配置：

```
export interface Configuration {
  appenders: { [name: string]: Appender };
  categories: {
    [name: string]: {
      appenders: string[];
      level: string;
      enableCallStack?: boolean;
    };
  };
  pm2?: boolean;
  pm2InstanceVar?: string;
  levels?: Levels;
  disableClustering?: boolean;
}
```

> logger 单词本意为：记录器
>
> appender 单词本意为：附着器
>
> categories 单词本意为：类别



<br>

在讲解如何配置 appenders 和 categories 之前，我们先了解一下日志类型。

**日志类型：**

log4js 的日志类型包含以下几种：

1. trace：纯粹的输出信息
2. debug：内部调试信息
3. info：普通信息
4. warn：警告信息
5. error：错误信息
6. fatal：致命的、严重的错误信息

根据我们的实际需求，我们可以仅有针对性的去记录某种日志信息。

而这种 “有针对性” 的挑选实际上就是依靠 appenders(附着器)、categories(类别) 配置项来实现的。



<br>

**如何配置appenders？**

appenders 是由 N 个 appender 构成的。

对于单个 appender ，通常情况下只需配置 4 项，我们以一个名为 err 的 appender 来举例：

```
appenders: {
    err: {
        type: 'file',
        filename: path.join(__dirname, '../../logs/err.log'),
        pattern:'err-yyyy-MM-dd.log',
        alwaysIncludePattern: true
    }
}
```



<br>

**type：表明该附着器的类型**

| 值             | 对应appender           |
| -------------- | ---------------------- |
| categoryFilter | CategoryFilterAppender |
| console        | ConsoleAppender        |
| file           | FileAppender           |
| fileSync       | SyncfileAppender       |
| dateFile       | DateFileAppender       |
| logLevelFilter | LogLevelFilterAppender |
| noLogFilter    | NoLogFilterAppender    |
| multiFile      | MultiFileAppender      |
| multiprocess   | MultiprocessAppender   |
| recording      | RecordingAppender      |
| stderr         | StandardErrorAppender  |
| stdout         | StandardOutputAppender |
| tcp            | TCPAppender            |
| 自定义         | CustomAppender         |

以上 附着器 众多，但是通过它们的名字几乎都可以猜到它们对应哪种应用场景。

1. 假设将 type 值设置为 `file`，那么意味着它将会以 “写入文件” 形式来记录日志

   > 请注意这里还暗含了另外 1 个意思：它会把文件写入到某一个固定的日志文件中

2. 假设将 type 值设置为 `dateFile`，那么意味着它将会以 “按照某种日期设定写入到文件中” 形式来记录日志

   > 这里的 date 指某种日期格式，支持 年、月、日、时、分 等，需要与另外一个属性 `pattern` 来互相配合。

3. 假设将 type 值设置为 ...



<br>

**filename：日志文件的报错路径和文件名前缀**

不要以为 `filename` 仅仅指日志文件名称，它不光包含名称，还包含日志文件的路径。

在上面示例中，我们设置的是：`path.join(__dirname, '../../logs/err.log'),`

如果不添加 path.join 和 __dirname，例如直接写成：filename: 'err.log'，那么它会默认使用相对路径。

特别强调：

1. 假设后面设置有 `pattern` 配置项，那么 `filename + pattern` 才会是日志文件的最终路径和文件名，此时的 filename 是作为日志文件路径的前缀。
2. 若果没有设置 pattern 配置项，那么此时 filename 的值才会作为最终日志路径和文件名。



<br>

**pattern：日志文件名的后缀模板**

为什么说是 “后缀模板” 呢？因为实际情况是一个日志文件的名字最终是由：filename + . + pattern 构成的。

在上面示例中，我们设置的是：

```
filename: path.join(__dirname, '../../logs/err.log'),
pattern:'err-yyyy-MM-dd.log',
```

> 请注意上面日期格式中月份使用的是 MM 大写，如果改成小写 mm 那指的是 分钟

日志名字中会加上当时的日期，最终文件名可能会是：`err.log.err-2022-09-01.log`



<br>

**alwaysIncludePattern：是否永远使用pattern**

这是一个不需要过多解释的配置项。



<br>

关于 appenders 的配置项还有很多规则，但是上面 4 个已经足够应对常见的使用场景了。

最终 appenders 可能配置如下：

```
appenders: {
    err: {
        type: 'dateFile',
        filename: path.join(__dirname, '../../logs/err.log'),
        pattern:'err-yyyy-MM-dd.log',
        alwaysIncludePattern: true
    },
    inf: {
        type: 'dateFile',
        filename: path.join(__dirname, '../../logs/inf.log'),
        pattern:'inf-yyyy-MM-dd.log',
        alwaysIncludePattern: true
    },
    req: {
        type: 'dateFile',
        filename: path.join(__dirname, '../../logs/req.log'),
        pattern:'req-yyyy-MM-dd.log',
        alwaysIncludePattern: true
    },
},
```

> 我们分别定义了 3 个附着器，他们是：
>
> 1. err：收集错误信息
> 2. inf：收集常规信息
> 3. req：收集网络请求信息



<br>

接下来看另外一个比较重要的配置项：categories(类别)

**如何配置categories？**

categories 是由 N 个类别构成的，所谓一个类别简单来说可以把它理解为 某一个场景。

> 我并不十分确定这样理解是否正确

从他的类型定义上可以看到：

```
categories: {
    [name: string]: {
      appenders: string[];
      level: string;
      enableCallStack?: boolean;
    };
};
```

每一个独立的 categori 它包含以下 3 个配置项：

1. appenders：该分类下使用哪些附着器

2. level：该分类属于哪种级别， 常见的可以设置为：error、debug 等

   > 请注意 level 的值只能是以下几种：
   >
   > ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, MARK, OFF
   >
   > level 的值可以不区分大小写

3. enableCallStack：可选配置项，是否启用调用堆栈



<br>

举个例子：

```
categories: {
    default: {
        appenders: ['err'],
        level: 'error'
    }
}
```

> 我们设定 default 状态下，使用 ['err'] 这个附着器，级别为 `error`。



<br>

除此之外 categories 还有可能配置如下：

```
categories: {
    default: {
        appenders: ['err'],
        level: 'error'
    },
    request: {
        appenders: ['req','err'],
        level: 'debug'
    }
}
```

> 具体的需要根据实际场景来配置。



<br>

> src/logger/index.js 完整示例代码

```
const path = require('path')
const log4js = require('log4js')

log4js.configure({
    appenders: {
        err: {
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/err.log'),
            pattern:'err-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        inf: {
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/inf.log'),
            pattern:'inf-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        req: {
            type: 'dateFile',
            filename: path.join(__dirname, '../../logs/req.log'),
            pattern:'req-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
    },
    categories: {
        default: {
            appenders: ['err'],
            level: 'error'
        }
    }
})

module.exports = log4js
```

> 从上面的代码可以看到，我们引入了 log4js，并且对它进行了一些配置，然后又将它导出。
>
> 这样在其他地方，当需要使用 log4js 时，引入我们这个自定义 log4js 即可。



<br>

**引入并使用我们自定义配置过的log4js：**

例如我们在 `src/app.js` 中编写下面的代码：

```
const log4js = require('./logger/index')

const logger = log4js.getLogger('app.js')

logger.error('test error ... ', Math.random() * 100)
```

1. 我们引入经过配置过后的 log4js
2. 通过 `log4js.getLogger()`创建一个记录器实例 logger，请注意该方法中的参数是可选的，参数值可以是任意字符，参数值只是在输入每一条记录时我们额外添加的标记而已。
3. 最终，我们触发执行一次错入日志调用

当我们执行 `node app.js` 后，会就在 logs 目录中产生一个 filename + pattern 模板的日志文件。

例如该文件可能是 "err.log.err-2022-09-01.log"，打开该日志里面的内容为：

```
[2022-09-01T15:19:05.850] [ERROR] app.js - test error ...  88.54845512818574
```



<br>

**日志内容说明：**

观察上述日志内容，你会发现一条日志信息由以下几块构成：

1. 日志写入时间：[2022-09-01T15:19:05.850]

2. 日志类型：ERROR

3. 日志额外标识：app.js，因为我们之前的代码是 `log4js.getLogger('app.js')`

   > 日志标识的作用是可以让我们快速知道当前这条日志是在哪个代码中触发执行的

4. 分隔符：-

5. 日志内容：test error ...  88.54845512818574



<br>

**补充说明：**

假设我们在 app.js 中添加：

```
logger.info('test info ... ', Math.random() * 100)
```

由于之前我们配置中 default 仅仅关注 err，所以 info 这条日志是不会被写入的。

想让 info 也被记录，只需修改：

```diff
categories: {
    default: {
-        appenders: ['err'],
+        appenders: ['err','inf'],
-        level: 'error'
+        level: 'all'
    }
}
```

> 由于日志包含 err 和 inf，level 的值如果还是 error 显然不太合适，所以我们将其修改为 all



<br>

以上仅仅为 log4js 最基础的配置、使用，更多更复杂的配置留给以后再慢慢研究吧。