# 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

:::tip
小技巧：直接把泛型理解为代表类型的参数
:::

## 简单的例子

首先，我们来实现一个函数 `createArray`，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值：

```ts
function createArray(length: number, value: any): Array<any> {
  let result = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray(3, 'x') // ['x', 'x', 'x']
```

这段代码编译不会报错，但是一个显而易见的缺陷是，它并没有准确的定义返回值的类型：

`Array<any>` 允许数组的每一项都为任意类型。但是我们预期的是，数组中每一项都应该是输入的 `value` 的类型。

这时候，泛型就派上用场了：

```ts
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray<string>(3, 'x') // ['x', 'x', 'x']
```

上例中，我们在函数名后添加了 `<T>`，其中 `T` 用来指代任意输入的类型，在后面的输入 `value: T` 和输出 `Array<T>` 中即可使用了。

接着在调用的时候，可以指定它具体的类型为 `string`。当然，也可以不手动指定，而让类型推断自动推算出来：

```ts
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray(3, 'x') // ['x', 'x', 'x']
```

同样类型数组也可以被类型推断。

```ts
function log<T> (value: T): T {
  console.log(value)
  return value
}

log<string[]>(['a', 'b'])
// or
log(['a', 'b'])
```

## 多个类型参数

定义泛型的时候，可以一次定义多个类型参数：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

swap([7, 'seven']) // ['seven', 7]
```

上例中，我们定义了一个 swap 函数，用来交换输入的元组。

## 泛型约束

在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法。

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length) // Error: Property 'length' does not exist on type 'T'.
  return arg
}
```

上例中，泛型 `T` 不一定包含 `length` 属性，所以编译的时候会报错。

这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 `length` 属性的变量。这就叫**泛型约束**。

```ts
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

上例中，我们使用了 `extends` 约束了泛型 `T` 必须符合接口 `Lengthwise` 的形状，也就是必须包含 `length` 属性。

此时如果调用 `loggingIdentity` 函数的时候，传入的参数不包含 `length`，那么在编译阶段就会报错了。

```ts
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

loggingIdentity(7) // Error: Argument of type '7' is not assignable to parameter of type 'Lengthwise'.
```

多个类型参数之间也可以相互约束。

```ts
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id]
  }
  return target
}

let x = { a: 1, b: 2, c: 3, d: 4 }

copyFields(x, { b: 10, d: 20 }) // { a: 1, b: 10, c: 3, d: 20 }
```

上述例子中，我们使用了两个类型参数，其中要求 `T` 继承 `U`，这样就保证了 `U` 上不会出现 `T` 中不存在的字段。

## 泛型函数

可以用泛型来约束函数的参数和返回值类型。

```ts
type Log = <T>(value: T) => T

let log: Log = (value) => {
  console.log(value)
  return value
}

log<number>(2) // 2
log('2') // '2'
log(true) // <boolean>true 
```

## 泛型接口

之前学习过，可以使用接口的方式来定义一个函数需要符合的形状。

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function (source: string, subString: string) {
  return source.search(subString) !== -1
}
```

同样也可以使用含有泛型的接口来定义函数的形状。

```ts
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>
}

let createArray: CreateArrayFunc
createArray = function<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray(3, 'x') // ['x', 'x', 'x']
```

进一步，我们可以把泛型参数提前到接口名上。

```ts
interface CreateArrayFunc<T> {
  <T>(length: number, value: T): Array<T>
}

let createArray: CreateArrayFunc<any>
createArray = function<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray(3, 'x') // ['x', 'x', 'x']
```

注意，此时在使用泛型接口的时候，需要定义泛型的类型。

若不想在使用泛型接口时定义泛型的类型，那么，需要在接口名上的泛型参数设置默认类型。

```ts
interface CreateArrayFunc<T = any> {
  <T>(length: number, value: T): Array<T>
}

let createArray: CreateArrayFunc
```

## 泛型类

与泛型接口类似，泛型也可以用于类的类型定义中。

```ts
class Log<T> {
  run (value: T) {
    console.log(value)
    return value
  }
}

let log1 = new Log<number>()
log1.run(1) // 1

let log2 = new Log()
log2.run('1') // '1'
```

:::warning
注意: 泛型不能应用于类的静态成员。
:::

```ts
class Log<T> {
  static run (value: T) {
    console.log(value)
    return value
  }
}
// Error: Static members cannot reference class type parameters.
```

## 小结

:::tip
1. 函数和类可以轻松支持多种类型，增强程序的扩展性
2. 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
3. 灵活控制类型之间的约束
:::