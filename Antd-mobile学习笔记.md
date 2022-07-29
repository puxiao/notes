# antd-mobile学习笔记

阅读本文的前提，是假设你已经熟练使用 antd 了。



<br>

antd 官网：https://ant.design/index-cn

antd-mobile 官网：https://mobile.ant.design/zh



<br>

#### antd 与 antd-mobile 的差异

1. antd 中的组件主要针对的是 电脑/平板 浏览器
2. antd-mobile 中的组件主要针对的是 移动端 浏览器

简单来说：antd 和 antd-mobile 组件的应用场景侧重点不同。

> 尽管 antd 也可以运行在 移动端浏览器中、antd-mobile 也可以运行在 电脑/平板 浏览器中



<br>

> 实际上 antd 和 antd-mobile 组件 80% 的属性、用法完全相同。



<br>

**具体的表现差异：**

1. 引入和修改 CSS 样式的方式不同

   > antd 需要手工引入 css 样式，而 antd-mobile 不需要手工引入 css

2. 相似功能的组件的名称和外观不同

   > 例如信息提示 antd 使用 message，而 antd-mobile 使用 Toast

3. 组件的交互方式不同

   > antd-mobile 侧重手指滑动，而 antd 侧重鼠标点击



<br>

#### 常用组件差异对比

以下几个组件是我在使用过程中总结的，有些组件我还没使用过，所以只能说是目前我发现到的一些差异。



<br>

**按钮：Button 显示颜色**

1. antd 中设置 Button 的 `type="primary"` 即可让按钮显示主题背景色
2. antd-mobile 中则需要设置 Button 的 `color="primary"` 让按钮显示主题背景色 



<br>

**全局信息提示：message 与 Toast**

当我们某些操作需要显示简单的提示文字信息给用户，那么：

1. antd 中使用 message 组件

   ```
   message.success('操作成功')
   message.error('发生错误')
   message.loading('加载中')
   ```

2. antd-mobile 中使用 Toast 组件

   ```
   Toast.show({
       icon: 'success',
       content: '操作成功',
       duration: 0, //消息框的显示时长，若为 0 则不会自动消失
       afterClose: () => { ... } //当全局提示框消失后触发的回调函数
   })
   
   Toast.show({
       icon: 'fail',
       content: '发生错误',
       ...
   })
   
   Toast.clear() //清除当前所有 Toast 消息框
   ```

   > 组件的名字由来：
   >
   > 消息弹框 外观是 四方圆角矩形，看上去特别像 吐司，所以就使用 吐司的英文 toast 来命名这个组件了。



<br>

**时间格式化：momentjs 和 dayjs**

1. antd 中默认时间格式化工具使用的是 momentjs

2. antd-mobile 中使用的是 dayjs

   > dayjs 更加轻量，只有 2K，功能和 momentjs 相同
   >
   > dayjs 官网：https://day.js.org/zh-CN/



<br>

#### antd-mobile 中 DatePicker 的用法



<br>

**antd-mobile 中 打开或关闭 DatePicker 组件**

1. open()：显示调用 datePickerRef.current 的 open() 函数才会让 DatePicker 显示出来
2. close()：关闭显示
3. toggle()：切换 显示或隐藏

如果是在 `<Form.Item>` 组件中，可以通过下面形式来唤起 DatePicker

```
<Form>
    <Form.Item name="mydate" label="预约日期" trigger="onConfirm" onClick={(e, datePickerRef) => { datePickerRef.current?.open();}} >
        <DatePicker precision='day' />
    </Form.Item>
</Form>
```



<br>

**设置 DatePicker 显示内容**

通过给 `<DatePicker>{ (value) => { return xxx }}</DatePicker>` 形式来设置其显中的结果内容。

```
<DatePicker>
    {
        (value) => {
            return <div>{value ? dayjs(value).format('YYYY-MM-DD') : '请选择预约日期'}</div>
        }
    }
</DatePicker>
```



<br>

**日期选择器：DatePicker 禁用(排除)项**

1. antd 中 DatePicker 禁用(不可选)日期和时间，对应的属性为 disabledDate 和 disabledTime

   > 具体用法可参考 antd 官方文档

2. antd-mobile 中 DatePicker 禁用(不可见) 日期，对应的属性为 filter

   > 补充：使用 precision 属性值来配置时间选择器的精度，其可选值为：'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'week' | 'week-day'，默认值为 'day'

   

<br>

**antd-mobile 中 DatePicker 具体禁用(不可见)**

官方文档中是这样定义 filter 的值类型的：

```
type DatePickerFilter = Partial<
  Record<
    Precision,
    (
      val: number,
      extend: {
        date: Date
      }
    ) => boolean
  >
>
```

1. precision：时间选择器的精度，例如 "day"、"hour" ...
2. (val,extend) => boo，中 val 是指 某精度下的具体值，而 extend 包含一个 date 的属性
3. boo：若为 true 则显示，若为 false 则不显示(禁用)



<br>

补充1：为什么采用这样的 过滤 “套路”？

答：为了筛选性能和筛选条件组合。

1. 性能：例如假设 precision 设置的为 "hour"，也就是说是按小时筛选，那么在组件内部就不用考虑筛选 年/月/日 中的选项了。
2. 组合：可以给 filter 设置 多个筛选条件，例如 { day: ()=>boo， hour: ()=>boo }



<br>

补充2：针对 extend 中 date 的解构

由于 extend 包含一个 date 属性，所以实际代码可以改造成：

```
{ precision: (val, { date }) => boo }
```



<br>

**示例：禁用周六和周日**

```
<DatePicker precision='day' filter={{
    day: (val, {date}) => {
      return date.getDay() !== 0 && date.getDay() !== 6
    }
}} />
```

> 0 为周日，6 为周六



<br>

**示例2：只禁用8月份的周六和周日**

```
<DatePicker precision='day' filter={{
    day: (val, { date }) => {
        if (date.getMonth() === 7) {
            return date.getDay() !== 0 && date.getDay() !== 6
        } else {
            return true
        }
    }
}} />
```

> 8月份 date.getMonth() 的值为 7



<br>

**示例3：禁用某几个指定日期**

```
const filterDate = ['2022-07-30', '2022-08-02','2022-08-03']

<DatePicker precision='day' filter={{
    day: (val, { date }) => {
        return filterDate.includes(dayjs(date).format('YYYY-MM-DD')) === false
    }
}} />
```



<br>

**附：完整示例**

```
import { DatePicker, Form } from 'antd-mobile'
import dayjs from 'dayjs'

function App() {

    const filterDate = ['2022-07-30', '2022-08-02','2022-08-03']

    return (
        <div className="App">
            <Form>
                <Form.Item name="mydate" label="预约日期" trigger="onConfirm" onClick={(e, datePickerRef) => {
                    datePickerRef.current?.open();
                }}
                    rules={[{ required: true, message: "请选择预约日期" }]}
                >
                    <DatePicker precision='day' filter={{
                        day: (val, { date }) => {
                            return filterDate.includes(dayjs(date).format('YYYY-MM-DD')) === false
                        }
                    }}>
                        {
                            (value) => {
                                return <div>{value ? dayjs(value).format('YYYY-MM-DD') : '请选择预约日期'}</div>
                            }
                        }
                    </DatePicker>
                </Form.Item>
            </Form>
        </div>
    );
}

export default App;
```

