---
sidebarDepth: 3
---

# 声明合并

编译器会把程序多个地方具有相同名称的声明合并为一个声明，合并后的声明同时拥有原先两个声明的特性。

## 接口声明合并

```ts
interface A {
  x: number
}
interface A {
  y: number
}
let a: A = {
  x: 1,
  y: 2
}
```

上述例子中，我们定义了两个同名接口 A，各自添加了一个属性。我们在定义一个变量 `a`，它的类型设置为接口 `A`，这时 `a` 就要具备两个同名接口的属性。

如果两个同名函数中具有相同的属性时会怎样呢？如下所示：

```ts
interface A {
  x: number
}
interface A {
  x: number
}

interface B {
  y: string
}
interface B {
  y: number
}
// Error: Subsequent property declarations must have the same type.Property 'y' must be of type 'string', but here has type 'number'.
```

同名接口中，成员属性相同时类型必须相同。

若成员属性为函数时，每个函数都会被声明为一个函数重载。

```ts
interface A {
  foo (bar: number): number // 3
}
interface A {
  foo (bar: string): string // 1
  foo (bar: string[]): string[] // 2
}

let a: A = {
  foo (bar: any) {
    return bar
  }
}
```

每组接口里的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置。上述函数重载列表优先级顺位为注释所示。

:::tip
如果签名里有一个参数的类型是 单一的字符串字面量，那么它将会被提升到重载列表的最顶端。
:::

## 命名空间与类、函数、枚举类型合并

命名空间可以与其它类型的声明进行合并。 只要命名空间的定义符合将要合并类型的定义。合并结果包含两者的声明类型。 

### 命名空间与类

```ts
class C {}

namespace C {
  export let version = '1.0.0'
}

console.log(C.version) // 1.0.0
```

### 命名空间与函数

```ts
function Lib () {}

namespace Lib {
  export let version = '1.0.0'
}

console.log(Lib.version) // 1.0.0
```

相当于为函数添加了一些默认属性。

### 命名空间与枚举

```ts
enum Color {
  Red,
  Blue
}
namespace Color {
  export let version = '1.0.0'
}

console.log(Color.version) // 1.0.0
```

:::warning
命名空间与类、命名空间与函数合并时，命名空间要在其之后。
:::