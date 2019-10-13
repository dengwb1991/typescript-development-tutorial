# 函数

和 JavaScript 一样，TypeScript 函数可以创建有名字的函数或匿名函数，TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易的使用它。

在基本类型和接口部分中多多少少提到过函数，接下来总结四种定义函数的方式。

```ts
function add (x: number, y: number) {
  return x + y
}

const add: (x: number, y: number) => number

type add = (x: number, y: number) => number

interface add {
  (x: number, y: number) => number
}
```

TypeScript 里的每个函数参数都是必要的。这里不是指不能把 `null`、`undefined` 当做参数，而是说编译器检查用户是否为每个参数都传入了值。也就是说，传递给一个函数的参数个数必须与函数期望的参数个数保持一致。我们举个例子：

```ts
function add (x: number, y: number, z: number) {
  return x + y
}

add(1, 2) // Error: Expected 3 arguments, but got 2.
```

在上述例子中，函数定义了3个参数，分别为 `x`、`y`、`z`，结果返回 `x` 和 `y` 的和。并没有使用参数 `z`，调用 `add` 只传入 `x` 和 `y` 的值。这时 TypeScript 检查机制提示预期为三个参数，但实际只传入两个参数的错误。如何避免这种情况呢？

## 可选参数

在 TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能。

```ts
function add (x: number, y: number, z?: number) {
  return x + y
}

add(1, 2)
```

经过修改，参数 `z` 变为可选参数，检查通过。

:::warning
可选参数必须在必选参数之后
:::

## 默认参数

与 JavaScript 相同，在 TypeScript 里函数参数同样可以设置默认值，用法一致。

```ts
function add (x: number, y = 2) {
  return x + y
}
```

根据类型推断机制，参数 `y` 为推断为 `number` 类型。

## 剩余参数

与 JavaScript 相同。TypeScript 可以把所有参数收集到一个变量里。

```ts
function add (x: number, ...rest: number[]) {
  return x + rest.reduce((prev, curr) => prev + curr)
}

add(1, 2, 3) // 6
```

:::warning
剩余参数必须在必选参数之后，可选参数不允许和剩余参数共同出现在一个函数内。
:::

## 函数重载

TypeScript 的函数重载，要求我们先定义一系列名称相同的函数声明。

```ts
function add (...rest: number[]): number
function add (...rest: string[]): string
function add (...rest: any[]): any {
  let first = rest[0]
  let type = typeof first
  switch (type) {
    case 'number':
      return rest.reduce((prev, curr) => prev + curr)
    case 'string':
      return rest.join('')
  }
  return null
}
```

上面例子中，我们定义了三个相同名称的函数，参数分别为 `number`、`string`、`any` 类型数组，相继返回的类型与参数类型相同。当调用该函数时，TypeScript 编译器能够选择正确的类型检查。在重载列表里，会从第一个函数开始检查，从上而下，所以我们使用函数重载时，应该把最容易用到的类型放在最上面。

:::warning
`any` 类型函数不是重载列表的一部分
:::
