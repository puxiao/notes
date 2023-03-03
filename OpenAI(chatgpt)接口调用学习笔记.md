# OpenAI(chatgpt)接口调用学习笔记

> 以下更新于 2023.03.02

**号外号外！OpenAI 官方刚刚终于正式对外放开了 chatgpt 的接口：**

https://platform.openai.com/docs/api-reference/chat/create?lang=node.js

对应的是 `.createChatCompletion()` 方法

实际请求的接口地址为：`https://api.openai.com/v1/chat/completions`

示例代码：

```
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello world"}],
});
console.log(completion.data.choices[0].message);
```

<br>

```
fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'Authorization': 'Bearer sk-zGmRz-your-api-key-xxx-xxx-xxx'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ "role": "user", "content": "Hello!" }],
        })
      }).then(res => res.json().then(data => console.log(data)));
```



> 以上更新于 2023.03.02





<br>

#### 为什么要学习？

我们学习并会使用 OpenAI 的接口调用后，可以将其应用到我们自己的项目中。

我们可以将 "ChatGPT" 引入到自己的项目中。



<br>

国内众多 "ChatGPT" 收费小程序实际上都是中间商，背后都是通过调用官方提供的接口来实现的。

> 为什么要给 ChatGPT 加引号 ？？？
>
> 由于 ChatGPT 目前并未开放接口，国内中间商调用的其实是 openai 中近似于 chatgpt 一些接口，得到的回复和真正 ChatGPT 也是有差距的。

> 还有通过 GPT3 模型自己训练的，打着 ChatGPT 旗号但实际跟 OpenAI 并没有关系的。

> NPM 上面就有一个名为 "chatgpt" 的包，并不是 openai 官方的，这个 "chatgpt" 包内部又使用了另外一个NPM包 "gpt3-tokenizer"，而这个包的介绍中说的很清楚，它内部提供了几种模式，其中有一种就是基于 GPT3 模型自己训练的。



<br>

#### 前期准备：

* 拥有 科学爱国上网工具

* 注册一个 openai 的账户

  > 注册教程，可参考这篇文章：https://juejin.cn/post/7173447848292253704



<br>

#### 前言碎语：

chatgpt 目前非常火，但 chatgpt 仅仅是 openai 旗下的一款产品。

* github 推出的编程助手 [copilot](https://copilot.github.com/) 也出自 oepnai
* 微软 New Bing 搜索引擎中的 "chat(聊天)" 是 openai 针对微软的 chatgpt 特供版



<br>

#### 官方文档：

接口文档：https://platform.openai.com/docs/api-reference/introduction

官方示例：https://platform.openai.com/examples

> 包含同一接口中传入不同参数值的效果对比



<br>

#### 获取自己的key：

想调用 openai 的接口，首先需要获取自己的 key。

获取地址：https://platform.openai.com/account/api-keys





<br>

#### 编程接口：

目前 openai 提供 2 种编程语言的接口库(Python 和 JS )，里面封装了很多接口调用函数，让我们比较方便调用接口。

**假设你不使用以上编程语言，或者你不想使用官方封装好的，那么你可以直接通过请求官方接口(API地址)的方式来进行调用，即发起 POST 请求的方式。**

> openai 官方接口示例代码中，默认就展示的是使用 curl 命令请求的方式。



**python：**

```
pip install openai
```

代码仓库：https://github.com/openai/openai-python

简单示例：https://github.com/openai/openai-quickstart-python



<br>

**Node.js：**

```
yarn add openai
//or
npm i openai
```

代码仓库：https://github.com/openai/openai-node

简单示例：https://github.com/openai/openai-quickstart-node





<br>

## openai-quickstart-node 示例



<br>

**运行示例：**

1. 拉取代码 `git clone https://github.com/openai/openai-quickstart-node.git`

2. 安装NPM包：`yarn`

3. 将项目根目录下的 `.env.example` 重命名为 `.env`

4. 编辑 `.env` 填上自己的 key

   > 获取地址：https://platform.openai.com/account/api-keys

5. 运行项目：`yarn dev`

   > 官方示例使用了 Next.js 作为前端页面



<br>

> 上面第 3 、第 4 步骤也可以省略，直接修改 `pages/api/generate.js`，在里面填上你的 key
>
> ```diff
> - apiKey: process.env.OPENAI_API_KEY
> + apiKey: 'xxx-you-key-xxx'
> ```



<br>

**运行结果：**

![openai-quickstart-node.jpg](https://github.com/puxiao/notes/blob/master/imgs/openai-quickstart-node.jpg?raw=true)



**大体介绍：**

* 这是一个给自己宠物起名字的简单程序

* 首先输入自己的宠物类型，例如 "tiger"

* 然后点击 生成名字 按钮 "Generate names"

* 在本示例中，先将关键词 "tiger" 在 JS 中转换成下面一段文字

  ```
  const capitalizedAnimal =
      animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return  `Suggest three names for an animal that is a superhero.
  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`;
  ```

  **也就是说我们将原本的一个关键词转换成了一段话，在这段话里我们增加上了 "宠物起名" 的一大堆相关语言，然后将这些完整话作为调用 openai api 的参数。**

* 接着是网络请求，并将 openai 的 API 返回结果显示在按钮下面，

  例如上图中的 "Super Stripe, The Magnificent Tigress, Major Stripes"



<br>

## 初探 openai API 接口调用

<br>

实际上调用 OepnAI 的 API 接口和调用普通的 前后端分离项目 的 API 是没有任何区别的。

大体使用步骤如下：

<br>

**第1部分：创建并基础配置 openai**

```
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: 'xxx-you-key-xxx',
});
const openai = new OpenAIApi(configuration);
```

> 上述配置项中必填项为 apiKey，除此之外还有其他可选配置项，例如：
>
> organization：所属组织的 key id。假设你在 openai.com 上创建有组织，甚至自定义有专属的训练模型，那么就需要配置此选项
>
> username、password：用户名和密码
>
> accessToken：账户令牌
>
> basePath、baseOptions：基础的请求路径、配置项
>
> formDataCtor：类型为 {new () => FormData}，用于自定义创建 FormData 的函数
>
> isJsonMime(mime:string)：用于判定 MIME 格式，例如 "application/json; charset=UTF8"



<br>

**第2部分：异步调用请求 API**

```
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: 'xxx',
  temperature: 0.6,
});
```

> model 的值表示你要异步请求的服务类型，换句话说就是你要发起调用哪种 API 产品模型。
>
> 想要获取完整的 model 值可选列表，可以调用 `listModels()` 方法获取。
>
> 例如执行下面的代码：
>
> ```
> const response = await openai.listModels();
> ```



<br>

> prompt：可以暂时理解为 请求获取结果所需要的 "提示"，即 参数值，需要根据配置项 model 的类型不同来设置不同的参数值。
>
> temperature：单词本意为 "温度"，但在此处为 "语言模型采样参数中的风险值"，该值取值范围为 0 - 1。
>
> * 对于答案特别明确的程序可以将此值设置为 0
> * 相反，对于答案不是那么清晰明确的，可以将此值设置更高一些，例如 0.9



<br>

**第3部分：解析返回结果以**

```
res.status(200).json({ result: completion.data.choices[0].text });
```

> completion：完成的结果
>
> .data：完成的结果数据
>
> .choices：以数组形式存放着完成结果列表，在上面示例中我们使用 `choices[0]` 来获取第 1 个结果
>
> .text：结果中的文本



<br>

> 提醒：如果是其他模型，例如创建一张图片，那么它的返回结果中需要用到的字段是 .url



<br>

**其他部分：添加网络错误处理**

```
try {
    const completion = await openai.createCompletion({ ... });
    ...
  } catch(error) {
    if (error.response) { ... } else { ... }
}
```



<br>

以上就是一个简单调用请求 openai  api 的代码示例。

如果你不想使用官方提供的，那么你可以直接通过 POST 请求 URL 的方式来进行接口调用。

**使用POST请求接口示例：**

> 以 fetch 请求为例：

```diff
- await openai.createCompletion({ ... })

+ fetch('https://api.openai.com/v1/completions', {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+        'Authorization': 'Bearer xxx-your-key-xxx'
+      },
+      body: {
+        model:'text-davinci-003',
+        prompt: 'xxxxxxxx',
+        //...
+      }
+ }).then( ... )
```





<br>

#### 其他模型：

上面示例中演示的是 "根据宠物类型给宠物起一个名字"，调用的是 `.createCompletion()`方法，使用的模型是 "text-davinci-003"。

除此之外还其他用途的模型，适用于不同的应用场景。

不同模型对应不同的调用函数和参数。



<br>

**.createEdits()**

模型： "text-davinci-edit-001"

作用：用于修改编辑文本的模型。

场景：请修改 "What day of the wek is it?" 这句话中的错误拼写

```
const response = await openai.createEdit({
  model: "text-davinci-edit-001",
  input: "What day of the wek is it?",
  instruction: "Fix the spelling mistakes",
});
```



<br>

**.createImage()**

模型：无需设置

作用：根据相应参数生成图片

例如下面的参数：

```
const response = await openai.createImage({
  prompt: "A cute baby sea otter",
  n: 2,
  size: "1024x1024",
});
```



<br>

**.createEmbedding()**

获取极其学习模型和算法。



<br>

**文件相关的**

* .createFile()：创建文件
* .listFiles()：文件信息
* ...



<br>

....



<br>

> 每一个被封装好的调用函数都对应一个真实接口地址。
>
> 例如：
>
> * openai.createCompletion() 对应 `https://api.openai.com/v1/completions`
> * openai.createEdit() 对应 `https://api.openai.com/v1/edits`
> * ...



更多模型请以及每个模型的函数、参数、返回值 请执行查阅官方文档。

> 注：我们上面提到的模型都是指 "openai 已经帮我们训练好的、可以直接使用的模型"



<br>

关于模型更加详细的介绍，请查阅：

https://platform.openai.com/docs/models



<br>

**ChatGPT 实际是集成了上述各个模型，所以它才可以理解并生成对话、编写修改代码等。**



<br>

**最后特别说一点：假设我们希望 openai 能够帮我们写编程代码，就可以使用 "text-davinci-003" 模型。**

我们需要做的就是把参数 `prompt` 设定好编程相关的话术。



<br>

**补充：GPT-3 实际上一共有 4 种模型**

* text-devinci-003：最新、最"聪明"、模型训练数据更新至 2021年6月
* text-curie-001：
* text-babbage-001：
* text-ada-001：

我们只需知道、使用 text-devinci-003 即可，其他 3 个模型相对较老、模型训练数据更新至 2019年10月。

> 对于更老的，还有 "text-devinci-002"等。



<br>

**国内相关：**

国内的一些同类型产品目前可能处于上面后 3 个模型阶段，例如 复旦大学自然语言处理实验室 的 MOSS。

百度的 文心一言 还未上线，据他们自己宣传是可以和 ChatGPT 相提并论的。



<br>

**这些 AI 对话就由这些大公司作为底层服务提供给我们，那么我们需要做的就是利用好这些 API 去做自己的事情。**

加油！
