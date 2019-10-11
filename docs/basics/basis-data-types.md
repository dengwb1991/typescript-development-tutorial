---
sidebarDepth: 3
---

# 基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型。

## JavaScript 数据类型

String、Number、Boolean、Object（Array、Function）、Symbol、undefined、null

## TypeScript 新增数据类型

void、any、never、元组、枚举、高级类型

## 类型注解

作用：相当于强类型语言中的类型声明

语法：(变量/函数): type

## 介绍

### 字符串类型

我们使用 `string` 表示文本数据类型。 和 JavaScript 一样，可以使用双引号 `"` 或单引号 `'` 表示字符串, 反引号 ` 来定义多行文本和内嵌表达式。

```ts
let str: string = 'abc'
```

### 数字类型

和 JavaScript 一样，TypeScript 里的所有数字都是浮点数。这些浮点数的类型是 `number`。 除了支持十进制和十六进制字面量，TypeScript 还支持 ECMAScript 2015 中引入的二进制和八进制字面量。

```ts
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744
```

### 布尔类型

我们使用 `boolean` 表示布尔类型，表示逻辑值 `true` / `false`。

```ts
let bool: boolean = true
```

### 数组类型

TypeScript 有两种定义数组的方式。 第一种，可以在元素类型后加上 `[]`。 第二种，可以使用数组泛型 `Array<元素类型>`。
此外，在元素类型中可以使用联合类型。 符号 `|` 表示或。

```ts
let arr1: number[] = [1, 2, 3]
let arr2: Array<number> = [1, 2, 3]
let arr3: Array<number | string> = [1, 2, 3, 'a']
```

### 元组

元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型必须相同。

```ts
let tuple: [number, string] = [0, '1']
tuple = ['1', 0] // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```ts
tuple[0].toFixed(2)
tuple[1].toFixed(2) // Error: Property 'toFixed' does not exist on type 'string'.
```

可以调用数组 `push` 方法添加元素，但并不能读取新添加的元素。

```ts
tuple.push('a')
console.log(tuple) // [0, "1", "a"]
tuple[2] // Error: Tuple type '[number, string]' of length '2' has no element at index '2'.
```


### 枚举

我们使用 `enum` 表示枚举类型。 枚举成员值只读，不可修改。 枚举类型是对 JavaScript 标准数据类型的一个补充。C# 等其它语言一样，使用枚举类型为一组数值赋予友好的命名。

#### 数字枚举

初始值为 0, 逐步递增，也可以自定义初始值，之后根据初始值逐步递增。

```ts
enum Role {
  Reporter = 1,
  Developer,
  Maintainer,
  Owner,
  Guest
}

console.log(Role.Developer) // 2
console.log(Role[2]) // Developer
```

数字枚举会**反向映射**，可以根据索引值反向获得枚举类型。原因如下编译后代码所示：

```js
var Role;
(function (Role) {
    Role[Role["Reporter"] = 1] = "Reporter";
    Role[Role["Developer"] = 2] = "Developer";
    Role[Role["Maintainer"] = 3] = "Maintainer";
    Role[Role["Owner"] = 4] = "Owner";
    Role[Role["Guest"] = 5] = "Guest";
})(Role || (Role = {}));
```

#### 字符串枚举

字符串枚举不支持反向映射

```ts
enum Message {
  Success = '成功',
  Fail = '失败'
}
```

#### 常量枚举

在枚举关键字前添加 `const`，该常量枚举会在编译阶段被移除。

```ts
const enum Month {
  Jan,
  Feb,
  Mar
}
let month = [Month.Jan, Month.Feb, Month.Mar]
```

编译后：

```js
"use strict";
var month = [0 /* Jan */, 1 /* Feb */, 2 /* Mar */]; // [0 /* Jan */, 1 /* Feb */, 2 /* Mar */]
```

### 对象

TypeScript 有两种定义对象的方式。 第一种，可以在元素后加上 `object`。 第二种，可以使用 `{ key: 元素类型 }` 形式。
同样在元素类型中可以使用联合类型。注意第一种形式对象元素为只读。

```ts
let obj1: object = { x: 1, y: 2 }
obj1.x = 3 // Error: Property 'x' does not exist on type 'object'.

let obj2: {  x: number, y: number } = { x: 1, y: 2 }
obj2.x = 3
```

### Symbol

`symbol` 类型的值是通过 Symbol 构造函数来创建

```ts
let s: symbol = Symbol()
```

### Null & Undefined

`null` 表示对象值缺失，`undefined` 表示未定义的值。

```ts
let un: undefined = undefined
let nu: null = null
```

若其他类型需要被赋值为 `null` 或 `undefined` 时， 在 tsconfig.json 中将 scriptNullChecks 设置为 false。或者 使用联合类型。

### void

用于标识方法返回值的类型，表示该方法没有返回值。

```ts
function noReturn (): void {
  console.log('No return value')
}
```

::: warning
undefined 并不是保留字段可以被赋值，所以设置undefined时，建议使用 void 0
:::

### 任意类型

声明为 `any` 的变量可以赋予任意类型的值。

```ts
let x: any
x = 1
x = 'a'
x = {}

let arr: any[] = [1, 'a', null]
```

### 函数

我们先回顾在 JavaScript 中，使用 es6 语法定义一个函数。

```js
let add = (x, y) => x + y
```

上面例子中，`add` 函数有两个参数 `x` 和 `y` 返回其相加之和。 该例子放在 TypeScript 中会提示 参数 `x` 和 `y` 隐含一个 `any` 类型。 所以我们修改如下：

```ts
let add = (x: number, y: number): number => x + y
```

给参数添加 `number` 类型，在括号之后也添加返回值的类型。这里返回值类型可以省略，因为 TypeScript 有类型推断机制，这个我们之后详细介绍。

接下来我们使用 TypeScript 定义一个函数类型并实现它。

```ts
let plus: (x: number, y: number) => number

plus = (a, b) => a + b

plus(2, 2) // 2
```

### never

`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never` 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 本身之外）。 即使 `any` 也不可以赋值给 `never`。

```ts
let error = (): never => {
    throw new Error('error')
}
let endless = (): never => {
    while(true) {}
}
```

:::tip
类型推断：变量在声明时并未赋值，类型推断为 `any`
:::