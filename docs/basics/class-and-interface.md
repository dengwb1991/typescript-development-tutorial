# 类与接口

本篇主要介绍类与接口之间实现、相互继承的操作。

## 类实现接口

实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interface），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

```ts
interface Animal {
  name: string
  eat (): void
}

class Cat implements Animal {
  constructor (name: string) {
    this.name = name
  }
  name: string
  eat () {}
}
```

:::warning
类实现接口时，**必须**声明接口中所有定义的属性和方法。
:::

```ts
interface Animal {
  name: string
  eat (): void
}

class Cat implements Animal {
  constructor (name: string) {
    this.name = name
  }
  name: string
  // eat () {}
}

// Error: Class 'Cat' incorrectly implements interface 'Animal'. Property 'eat' is missing in type 'Cat' but required in type 'Animal'.
```

:::warning
类实现接口时，声明接口中定义的属性和方法不能修饰为 `private` 或 `protected`。
:::

```ts
interface Animal {
  name: string
  eat (): void
}

class Cat implements Animal {
  constructor (name: string) {
    this.name = name
  }
  private name: string
  eat () {}
}

// Error: Class 'Cat' incorrectly implements interface 'Animal'. Property 'name' is private in type 'Cat' but not in type 'Animal'.
```

:::warning
接口不能约束类中的构造函数
:::

```ts
interface Animal {
  new (name: string): void
  name: string
  eat (): void
}

class Cat implements Animal {
  constructor (name: string) {
    this.name = name
  }
  name: string
  eat () {}
}

// Error: Class 'Cat' incorrectly implements interface 'Animal'. Type 'Cat' provides no match for the signature 'new (name: string): void'.
```

## 接口继承接口

实现方法如下：

```ts
interface Animal {
  name: string
  eat (): void
}

interface Predators extends Animal {
  run (): void
}

class Cat implements Predators {
  constructor (name: string) {
    this.name = name
  }
  name: string
  eat () {}
  run () {}
}
```

:::tip
继承多个接口用 `,` 分割，同理实现多个接口方式相同。
:::

```ts
interface Animal {
  name: string
  eat (): void
}
  
interface Lovely {
  cute: number
}

interface Predators extends Animal, Lovely {
  run (): void
}

class Cat implements Predators {
  constructor (name: string, cute: number) {
    this.name = name
    this.cute = cute
  }
  name: string
  cute: number
  eat () {}
  run () {}
}
```

## 接口继承类

实现方法如下：

```ts
class Auto {
  constructor (state: string) {
    this.state = state
  }
  state: string
}

interface AutoInterface extends Auto {}

class C implements AutoInterface {
  state = ''
}
```

## 混合类型

```ts
interface SearchFunc {
  (source: string, subString: string): boolean
}
​
let mySearch: SearchFunc
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1
}
```

一个函数还可以有自己的属性和方法

```ts
interface Counter {
  (start: number): string
  interval: number
  reset (): void
}
​
function getCounter(): Counter {
  let counter = <Counter>function (start: number) {}
  counter.interval = 123
  counter.reset = function () {}
  return counter
}
​
let c = getCounter()
c(10)
c.reset()
c.interval = 5.0
```

## 小结

:::tip
1. 接口与接口、类与类之间可以相互继承（extends）
2. 接口可以通过类来实现的（implements），接口只能约束类的公有成员
3. 接口可以抽离出类的成员、包括公有（public）、私有（private）、受保护（protected）成员
:::

