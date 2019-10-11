---
sidebarDepth: 3
---

# 接口

在 TypeScript 中，我们可以使用接口 `interface` 来定义对象类型。

## 介绍

接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法。

接下来，定义一个简单的接口：

```ts
interface Person {
  name: string
  age: number
}

let man: Person = {
  name: 'James',
  age: 30
}
```

我们定义了一个接口 `Person` 和变量 `man`，变量的类型是 `Person`。 这样我们就约束了该变量的值中对象的 `key` 和 `value` 要和接口一致。

需要注意的是：

::: tip
1. 接口规范首字母大写；
2. 被赋值的变量必须和接口的定义保持一致，参数不能多也不能少；
3. 类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型正确即可。
:::

### 可选属性

接口的所有属性可能都不是必需的。

```ts
interface Person {
  name: string
  age?: number
}

let man: Person = {
  name: 'James'
}
```

### 只读属性

属性名前使用 `readonly` 关键字制定为只读属性，初始化后不可更改。

```ts
interface Person {
  readonly name: string
  age: number
}

let man: Person = {
  name: 'James',
  age: 30
}

man.name = 'Tom' // Error: Cannot assign to 'name' because it is a read-only property.
```

### 任意属性

用任意的字符串索引，使其可以得到任意的结果。

```ts
interface Person {
  name: string
  age: number
  [x: string]: any
}

let man: Person = {
  name: 'James',
  age: 30,
  height: '180cm'
}
```

除了 `name` 和 `age` 必须一致以外，其他属性可以随意定义数量不限。

::: warning
一旦定义了任意属性，那么其他属性的类型必须是任意属性类型的子集。
:::

```ts
interface Person {
  name: string
  age: number
  [x: string]: string
}

let man: Person = {
  name: 'James',
  age: 30,
  height: '180cm'
}

/**
 * Type '{ name: string; age: number; height: string; }' is not assignable to type 'Person'.
 * Property 'age' is incompatible with index signature.
 * Type 'number' is not assignable to type 'string'.
 */
```

#### 数字索引

可以得到任意长度的数组。

```ts
interface StringArray {
  [i: number]: string
}
let chars: StringArray = ['a', 'b']
```

## 函数类型接口

接口能够描述 JavaScript 中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

在数据类型中我们提到过，可以用一个变量声明一个函数类型。

```ts
let add: (x: number, y: number) => number
```

此外，我们还可以用接口来定义它。

```ts
interface Add {
  (x: number, y: number): number
}

let add: Add = (a, b) => a + b
```

除此之外，还有一种更简洁的方式就是使用**类型别名**

类型别名使用 `type` 关键字

```ts
type Add = (x: number, y: number) => number

let add: Add = (a, b) => a + b
```



:::tip
* `interface` 定义函数(Add)和用 `type` 定义函数(Add)有区别？

`type` 和 `interface` 多数情况下有相同的功能，就是定义类型。 但有一些小区别：<br>
**type**：不是创建新的类型，只是为一个给定的类型起一个名字。type还可以进行联合、交叉等操作，引用起来更简洁。<br>
**interface**：创建新的类型，接口之间还可以继承、声明合并。建议优先使用 `interface`。
:::