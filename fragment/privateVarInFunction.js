//在类的函数中定义私有变量，并且使用箭头函数以便使用类的 this 对象。

class Test {
    a = 'aa'

    update = (() => {
        let num = 0
        const update = () => {
            num += 1
            console.log(num + this.a)
        }
        return update
    })()
}

const test = new Test()
test.update() // 1aa
test.update() // 2aa
test.update() // 3aa

export default Test
