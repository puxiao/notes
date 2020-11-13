假设 某函数，参数值不同，返回值类型也不同，有以下几种写法。


第1种写法：
function test<T extends boolean>(boo: T): T extends true ? [null, number] : [Error, null] {
    return boo ? [null, 1] : [new Error(), null] as any;
}
const a = test(true)
const b = test(false)


第2种写法：
function foo(boo: true): [null, number];
function foo(boo: false): [Error, null];
function foo<T extends boolean>(val: T): T {
    return val;
}
const a = test(true)
const b = test(false)


第3种写法：
function test(boo: true): [null, number]
function test(boo: false): [Error, null]
function test(boo: boolean): unknown {
    if (boo) {
        return [null, 1]
    }
    return [new Error(), null]
}
const a = test(true)
const b = test(false)
