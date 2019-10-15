---
sidebarDepth: 3
---

# 类

传统的 JavaScript 使用函数和基于原型的继承来创建可重用的组件。

```js
function Point (x, y) {
  this.x = x
  this.y = y
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')'
}

var p = new Point(1, 2)
```

从 ES6 开始，我们能够使用基于类的面向对象的方式。

```js
class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  toString () {
    return `(${this.x}, ${this.y})`
  }
}
```

TypeScript 除了保留了 ES6 中类的功能以外，还增添了一些新的功能。

```ts
class Dog {
  constructor (name: string) {
    this.name = name
  }
  name: string
  run () {}
}

class Husky extends Dog {
  constructor (name: string, color: string) {
    super(name)
    this.color = color
  }
  color: string
}
```

上面的例子中需要注意以下几点：

1. 继承类中的构造函数里访问 `this` 的属性之前，一定要调用 `super` 方法；
2. TypeScript 和 ES6 中，“类的成员属性”都是实例属性，而不是原型属性，“类的成员方法”都是“原型”方法。`Dog.prototype` => `{constructor: ƒ, run: ƒ}`，`new Dog('huang')` => `{name: "huang"}`
3. TypeScript 中实例的属性必须有初始值，或者在构造函数中被初始化。

## public、private、protected、readonly

TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`

* `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public`

* `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问，包括继承它的类也不可以访问
  
* `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问

* 以上三种可以修饰构造函数，默认为 `public`，当构造函数为 `private` 时，该类不允许被继承或实例化；当构造函数为 `protected` 时，该类只允许被继承。

* `readonly` 修饰的属性为只读属性，只允许出现在属性声明或索引签名中。

### public

公共修饰符

```ts
class Animal {
  public name: string
  public constructor (name: string) {
    this.name = name
  }
}

let a = new Animal('Jack')
console.log(a.name) // Jack
a.name = 'Tom'
console.log(a.name) // Tom
```

### private

私有修饰符

```ts
class Animal {
  private name: string
  public constructor (name: string) {
    this.name = name
  }
}

let a = new Animal('Jack')
console.log(a.name) // Error: Property 'name' is private and only accessible within class 'Animal'.

class Cat extends Animal {
  constructor (name: string) {
    super(name)
    console.log(this.name) // Error: // Property 'name' is private and only accessible within class 'Animal'.
  }
}
```

需要注意的是，TypeScript 编译之后的代码中，并没有限制 `private` 属性在外部的可访问性。

上面的例子编译后的代码如下：

```js
var Animal = (function () {
    function Animal (name) {
        this.name = name
    }
    return Animal
}())
var a = new Animal('Jack')
console.log(a.name)
```

### protected

受保护修饰符

```typescript
class Animal {
  protected name: string
  public constructor (name: string) {
    this.name = name
  }
}

class Cat extends Animal {
  constructor (name: string) {
    super(name)
    console.log(this.name)
  }
}
```

:::tip
构造函数参数添加修饰等同于在类中定义该属性，这样使代码更为简洁。
:::

```ts
class Animal {
  // public name: string
  constructor (public name: string) {
    this.name = name
  }
}
class Cat extends Animal {
  constructor (public name: string) {
    super(name)
  }
}

let a = new Animal('Jack')
console.log(a.name) // Jack
a.name = 'Tom'
console.log(a.name) // Tom
```

### readonly

只读修饰符

```ts
class Animal {
  readonly name: string
  public constructor (name: string) {
    this.name = name
  }
}

let a = new Animal('Jack')
console.log(a.name) // Jack
a.name = 'Tom' //Error: Cannot assign to 'name' because it is a read-only property.
```

注意如果 `readonly` 和其他访问修饰符同时存在的话，需要写在其后面。

```ts
class Animal {
  // public readonly name: string
  public constructor (public readonly name: string) {
    this.name = name
  }
}
```

## 抽象类

`abstract` 用于定义抽象类和其中的抽象方法。需要注意以下两点：

抽象类不允许被实例化

```ts
abstract class Animal {
  public name: string
  public constructor (name: string) {
    this.name = name
  }
}

var a = new Animal('Jack') //Error: Cannot create an instance of an abstract class.
```

抽象类中的抽象方法必须被继承类实现

```ts
abstract class Animal {
  public name: string;
  public constructor (name: string) {
    this.name = name;
  }
  abstract sayHi (): any
}

class Cat extends Animal {
  public color: string
  sayHi () { console.log(`Hi`) }
  constructor (name: string, color: string) {
    super(name)
    this.color = color
  }
}

var a = new Cat('Tom', 'Blue')
```