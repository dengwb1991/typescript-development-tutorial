# 声明语法

本章整理了声明文件中涉及到的新语法语句.

[`declare var` 声明全局变量](/project/declaration-syntax.html#全局变量)
[`declare function` 声明全局函数](/project/declaration-syntax.html#全局函数)
[`declare namespace` 声明带属性的对象](/project/declaration-syntax.html#带属性的对象)
[`interface type` 可重用类型接口或别名](/project/declaration-syntax.html#可重用类型接口或别名)
[组织类型](/project/declaration-syntax.html#组织类型)
[`declare class` 声明全局类](/project/declaration-syntax.html#全局类))

## 全局变量


使用 `declare var` 声明变量。 如果变量是只读的，那么可以使用 `declare const`。 你还可以使用 `declare let` 变量拥有块级作用域。

代码:

```js
console.log("Half the number of widgets is " + (foo / 2))
```

声明:

```ts
declare var foo: number
```

一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 `const` 而不是 `var` 或 `let`。

## 全局函数

使用 `declare function` 声明函数

代码:

```js
greet("hello, world")
```

声明:

```ts
declare function greet(greeting: string): void
```

在声明语句中，支持**函数重载**

```ts
declare function greet(greeting: string): void
declare function greet(greeting: number): void
```

## 带属性的对象

使用 `declare namespace` 描述用点表示法访问的类型或值

代码:

```js
let result = myLib.makeGreeting("hello, world")
console.log("The computed greeting is:" + result)

let count = myLib.numberOfGreetings
```

声明:

```js
declare namespace myLib {
    function makeGreeting(s: string): string
    let numberOfGreetings: number
}
```

## 可重用类型接口或别名

除了全局变量之外，可能有一些类型我们也希望能暴露出来。在类型声明文件中，我们可以直接使用 interface 或 type 来声明一个全局的接口或类型。

代码:

```js
greet({
  greeting: "hello world",
  duration: 4000
})
```

声明:

```ts
interface GreetingSettings {
  greeting: string
  duration?: number
  color?: string
}

declare function greet(setting: GreetingSettings): void
```

`type` 与 `interface` 类似.

## 组织类型

代码：

```js
const g = new Greeter("Hello")
g.log({ verbose: true })
g.alert({ modal: false, title: "Current Greeting" })
```

使用命名空间组织类型

```ts
declare namespace Greeter {
  interface LogOptions {
    verbose?: boolean
  }
  interface AlertOptions {
    modal: boolean
    title?: string
    color?: string
  }
}
```

也可以在一个声明中创建嵌套的命名空间

```ts
declare namespace Greeter.Options {
  // Refer to via Greeter.Options.Log
  interface Log {
    verbose?: boolean
  }
  interface Alert {
    modal: boolean
    title?: string
    color?: string
  }
}
```

## 全局类


使用 `declare class` 描述一个类或像类一样的对象。 类可以有属性和方法，就和构造函数一样，但不能用来定义具体的实现。

代码:

```js
const myGreeter = new Greeter("hello, world")
myGreeter.greeting = "howdy"
myGreeter.showGreeting()

class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings")
  }
}
```

声明:

```ts
declare class Greeter {
  constructor(greeting: string)
  greeting: string
  showGreeting(): void
}
```