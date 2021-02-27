# Three.js代码库提交的代码格式规范注意事项



**如果向 Three.js 提交 PR，一定要先检查自己代码的一些规范事项：**

1. 每一行代码结束后使用 分号 作为结束符
2. 使用 Tab 作为代码对齐，而不是空格
3. 代码块之间必须有空白的换行
4. 代码块内开头和结尾毕业使用空白的换行
5. 函数的参数前、后必须使用 1 个空格分隔
6. 模块导出对象中，不同属性之间也应遵循使用 1 个空格分隔



**以上几项中，除第 6 条之外，其他的规范均与 VSCode 默认代码样式格式化不同，需要手工修改。**



**我提交的一个 PR(21373) 正确示例：**

```
class Event {

	constructor( type, target = undefined ) {

		this.type = String( type );

		this.target = target;

	}

}

export { Event, EventDispatcher };
```

