# Three.js代码库提交的代码格式规范注意事项



### 向 three.js 官方仓库提交PR

**如果向 Three.js 提交 PR，一定要先检查自己代码的一些规范事项：**

1. 每一行代码结束后使用 分号 作为结束符
2. 使用 Tab 作为代码对齐，而不是空格
3. 代码块之间必须有空白的换行
4. 代码块内开头和结尾毕业使用空白的换行
5. 函数的参数前、后必须使用 1 个空格分隔
6. 模块导出对象中，不同属性之间也应遵循使用 1 个空格分隔



**以上几项中，除第 6 条之外，其他的规范均与 VSCode 默认代码样式格式化不同，需要手工修改。**



<br>

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



<br>

### 向 three-ts-types 提交PR

在 Three.js r126 版本以后，官方默认不再内置 .d.ts 文件，若你想使用 TypeScript 类型包，则需要自己单独下载安装。

```
yarn add @types/three
```



**Three.js 团队目前已经将 TS 类型包从 @types/three 中拆分独立出来，目前专属的仓库为 three-ts-types**

仓库地址由：https://github.com/DefinitelyTyped/DefinitelyTyped/

> DefinitelyTyped 这个仓库包含了 无数个常见 JS 库的 TS 类型，由于过于庞大且最高管理权限并不在 Three.js 手中，不便于 Three.js 团队管理，所以 Three.js 团队才决定将该仓库拆分独立出来。

> 请注意：仅仅是将仓库拆分出去，但是 three-ts-types 每次更新是会同步到 DefinitelyTyped 中的。
>
> 所以当你想安装 Three.js 对应的 TS 包时，依然选择安装 @types/three



拆分出来的仓库地址为：https://github.com/three-types/three-ts-types/

也就是说，当你想修改 Three.js 的 TS 类型包内容时，应向该仓库提交 PR。



<br>

#### 提交PR注意事项

**当你 Fork 项目且进行修改后，一定要执行在本地执行一次自动测试命令，只有通过 test 的 PR 才会被合并。**

1. Fork three-ts-types 项目仓库

2. 线上直接修改 或 Git clone 到本地中修改

3. 当所有修改完成后，一定要在本地执行 自动测试(test)

   ```
   yarn test three
   ```

   > 因为整个项目分为 核心源码(src)、示例(examples)、测试用例(test)，你修改的地方可能会影响其他地方，靠人工去排查是不可能的，所以只能靠 test 来检测修改所影响的其他地方都没有问题才可以。



<br>

**由于之前我向 Three.js 提交过 PR，1个月后我才意识到，我还要向 three-ts-types 提交对应的修改。**

这样才能保证 官方仓库中的 JS 代码 和 TS 类型包一致。

这是我提交的 PR：https://github.com/three-types/three-ts-types/pull/69 ，该 PR 已被合并。



