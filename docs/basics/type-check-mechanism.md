---
sidebarDepth: 4
---

# 类型检查机制

TypeScript 编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为。

本篇分为三大部分：**类型推断**、**类型兼容性**、**类型保护**。

:::warning
内容略长
:::

## 类型推断

不需要指定变化的类型（函数的返回值类型），TypeScript 可以根据某些规则自动为其推断出一个类型。

### 基础类型推断

基本类型推断经常出现在初始化变量的时候。

```ts
let a
// let a: any

let a = 1
// let a: number

let a = []
// let a: any[]
```

声明变量 `a` 时，我们不指定它的类型，`ts` 就会默认推断出它是 `any` 类型。

如果我们将它复制为 `1`，`ts` 就会推断出它是 `number` 类型。

如果我们将它复制为 `[]`，`ts` 就会推断出它是 `any` 类型的数组。

基本类型推断还会出现在定义函数参数。

```ts
let a = (x = 1) => {}
// let a: (x?: number) => void
```

声明函数 `a`，设置一个参数 `x`，为它赋值一个默认参数 `1`，此时 `ts` 就会推断出它是 `number` 类型。同样返回值类型也会被推断。

### 最佳通用类型推断

当需要从多个类型中推断出一个类型时，`ts` 就会尽可能的推断出一个最佳通用类型。

```ts
let a = [1, null]
// let a: (number | null)[]
```

声明一个变量 `a`，值为一个包含数字 `1` 和 `null` 的数组。此时，变量 `a` 就被推断为 `number` 和 `null` 的联合类型。

以上的类型推断都是从右向左的推断，根据表达式的值推断出变量的类型。还有一种方式是从左到右，根据上下文推断。

### 上下文类型推断

通常发生在事件处理中。

```ts
window.onkeydown = (event) => {
}
// (parameter) event: KeyboardEvent
```

为 `window` 绑定 `onkeydown` 事件，参数为 `event`，此时 `ts` 会根据左侧的事件绑定推断出右侧事件的类型。

## 类型兼容性

当一个类型 Y 可以赋值给另一个类型 X 时，我们可以认为类型 X 兼容类型 Y。

X 兼容 Y : X (目标类型) = Y (源类型)

### 变量兼容性

```ts
let s: string = 'abc'
s = null
```

默认会提示 Type 'null' is not assignable to type 'string'. 如果将 `tsconfig.json` 内的 `strictNullChecks` 的值设置为 `false`，这时编译就不会报错。

可以说明 `string` 类型兼容 `null` 类型，`null` 是 `string` 类型的子类型。

### 接口兼容性

示例如下：

```ts
interface X {
  a: any
  b: any
}

interface Y {
  a: any
  b: any
  c: any
}

let x: X = { a: 1, b: 2 }
let y: Y = { a: 1, b: 2, c: 3 }

x = y
y = x // Error: Property 'c' is missing in type 'X' but required in type 'Y'.
```

`y` 可以赋值给 `x`，`x` 不可以赋值给 `y`。

:::tip
接口之间相互赋值时，成员少的会兼容成员多的。源类型必须具备目标类型的必要属性。
:::

### 函数兼容性

#### 函数个数

示例如下：

```ts
type Handler = (a: number, b: number) => void
function hof(handler: Handler) {
  return handler
}

let handler1 = (a: number) => {}
hof(handler1)

let handler2 = (a: number, b: number, c: number) => {}
hof(handler2)
// Error: Argument of type '(a: number, b: number, c: number) => void' is not assignable to parameter of type 'Handler'.

let handler3 = (a: string) => {}
hof(handler3)
// Error: Types of parameters 'a' and 'a' are incompatible. Type 'number' is not assignable to type 'string'.
```

上述示例中，目标类型 `handler` 有两个参数，定义了三个不同的函数进行测试。

1. `handler1` 函数只有一个参数，将 `handler1` 传入 `hof` 方法作为参数（兼容）
2. `handler2` 函数有三个参数，同样作为参数传入 `hof` 方法（不兼容）。
3. `handler2` 函数参数类型与目标函数参数类型不同（不兼容）

:::tip
函数参数个数，参数多的兼容参数少的。换句话说，参数多的可以被参数少的替换。
:::

#### 固定参数、可选参数、剩余参数

示例如下：

```ts
// 固定参数
let a = (p1: number, p2: number) => {}
// 可选参数
let b = (p1?: number, p2?: number) => {}
// 剩余参数
let c = (...args: number[]) => {}

a = b
a = c
b = a // Error
b = c // Error
c = a
c = b
```

:::tip
固定参数兼容可选参数和剩余参数。可选参数不兼容固定参数和剩余参数，如果将 `tsconfig.json` 内的 `strictFunctionTypes` 的值设置为 `false`，这时编译就不会报错。剩余参数兼容固定参数和可选参数。
:::

#### 复杂类型

示例如下：

```ts
interface Point3D {
  x: number
  y: number
  z: number
}

interface Point2D {
  x: number
  y: number
}
let p3d = (point: Point3D) => {}
let p2d = (point: Point2D) => {}

p3d = p2d
p2d = p3d // Error: Property 'z' is missing in type 'Point2D' but required in type 'Point3D'.
```

:::tip
成员个数多的兼容成员个数少的，这里与接口兼容性结论相反。可以把对象拆分为参数，参数多的兼容参数少的，与函数兼容性结论一致。
:::

如果想要上述示例中的 p2d = p3d 兼容。将 `tsconfig.json` 内的 `strictFunctionTypes` 的值设置为 `false`。

#### 返回值类型

示例如下：

```ts
let f = () => ({ name: 'Alice' })
let g = () => ({ name: 'Alice', location: 'Beijing' })
f = g
g = f // Error
```

:::tip
目标函数的返回值类型，必须与源函数的返回值类型相同，或为其子类型。成员少的兼容成员多的。
:::

#### 函数重载

在函数部分中有介绍函数重载，这里我们重温一下。

```ts
function overload (a: number, b: number): number
function overload (a: string, b: string): string
function overload (a: any, b: any): any {}
```

函数重载分为两个部分，第一个部分为函数重载的列表，也就是第一、二个 `overload` 函数，也就是目标函数。第二个部分就是函数的具体实现，也就是第三个 `overload` 函数，也就是源函数。

:::tip
在重载列表中，目标函数的参数要大于等于源函数的参数。
:::

### 枚举兼容性

示例如下：

```ts
enum Fruit { Apple, Banana }
enum Color { Red, Yellow }

let fruit: Fruit.Apple = 3
let no: number = Fruit.Apple

let color: Color.Red = Fruit.Apple // Error
```

:::tip
枚举类型和数值(number)类型相互兼容，枚举与枚举之间相互不兼容
:::

### 类兼容性

示例如下：

```ts
class A {
  constructor (p: number, q: number) {}
  id: number = 1
}

class B {
  static s = 1
  constructor (p: number) {}
  id: number = 2
}

let aa = new A(1, 2)
let bb = new B(1)

aa = bb
bb = aa
```

:::tip
比较类与类是否兼容时，静态成员和构造函数不进行比较。成员少的兼容成员多的，父类与子类的实例相互兼容。
:::

### 泛型兼容性

示例如下：

```ts
interface Empty<T> {}

let obj1: Empty<number> = {}
let obj2: Empty<String> = {}

obj1 = obj2

// 设置属性

interface Empty<T> {
  value: T
}

let obj1: Empty<number> = { value: 1 }
let obj2: Empty<String> = { value: 'a'}

obj1 = obj2 // Error
```

:::tip
泛型接口未设置任何属性时，`obj1` 与 `obj2` 相互兼容，若此时 `Empty` 设置了属性 `value: T` 时，`obj1` 与 `obj2` 不兼容。
:::

泛型函数

```ts
let log1 = <T>(x: T): T => {
  console.log('x')
  return x
}
let log2 = <U>(y: U): U => {
  console.log('y')
  return y
}

log1 = log2
```

:::tip
泛型函数参数类型相同，参数多的兼容参数少的。
:::

### 小结

:::tip
1. 结构之间兼容，成员少的兼容成员多的
2. 函数之间兼容，参数多的兼容参数少的
:::

## 类型保护

`TypeScript` 能够在特定的区块中保证变量属于某种确定的类型。

可以再此区块中放心地引用此类型的属性，或者调用此类型的方法。

```ts
enum Type { Strong, Week }

class Java {
  helloJava () {
    console.log('hello java')
  }
  java: any
}

class JavaScript {
  helloJavaScript () {
    console.log('hellp javascript')
  }
  javascript: any
}

function getLanguage (type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()
  if (lang.helloJava) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }
  return lang
}

getLanguage(Type.Strong)
```

定义 `getLanuage` 函数参数 `type`，判断 `type` 为强类型时，返回 `Java` 实例，反之返回 `JavaScript` 实例。

判断 `lang` 是否有 `helloJava` 方法，有则执行该方法，反之执行 `JavaScript` 方法。此时这里有一个错误 `Property 'helloJava' does not exist on type 'Java | JavaScript'.`。

解决这个错误，我们需要给 `lang` 添加类型断言。

```ts
  if ((lang as Java).helloJava) {
    (lang as Java).helloJava()
  } else {
    (lang as JavaScript).helloJavaScript()
  }
```

这显然不是非常理想的解决方案，代码可读性很差。我们可以利用类型保护机制，如下几个方法。

### instanceof

判断实例是否属于某个类

```ts
if (lang instanceof Java) {
  lang.helloJava()
} else {
  lang.helloJavaScript()
}
```

### in

判断一个属性是否属于某个对象

```ts
if ('java' in lang) {
  lang.helloJava()
} else {
  lang.helloJavaScript()
}
```

### typeof

判断一个基本类型

```ts
if (typeof x === 'string') {
  x.length
} else {
  x.toFixed(2)
}
```

### 创建类型保护函数

```ts
function isJava(lang: Java | JavaScript): lang is Java {
  return (lang as Java).helloJava !== undefined
}

if (isJava(lang)) {
  lang.helloJava()
} else {
  lang.helloJavaScript()
}
```
