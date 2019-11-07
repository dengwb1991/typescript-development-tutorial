# 命名空间

在 JavaScript 中，命名空间能有效的避免全局污染。在 `es6` 引入了模块系统之后，命名空间就很少被使用了。但 TS 中依然实现了这个特性，尽管在模块系统中，我们不必考虑全局污染情况，但如果使用了全局的类库，命名空间仍然是一个比较好的解决方案。

## 例子

首先创建两个 ts 文件，分别为 `a.ts` 和 `b.ts` 代码如下：

本篇大部分为代码段，可以点击[查看源码](https://github.com/dengwb1991/typescript-in-action/tree/master/base-typescript/third-typescript)运行阅读。

```ts
// ./src/a.ts

namespace Shape {
  const pi = Math.PI
  export function cricle (r: number) {
    return pi * r ** 2
  }
}
```

如果让成员在全局可见，需要使用 `export` 关键字输出。

```ts
// ./src/b.ts

namespace Shape {
  export function square (x: number) {
    return x * x
  }
}

console.log(Shape.cricle(1))
console.log(Shape.square(1))
```

同样在 `b.ts` 文件中也声明了命名空间，在底部调用了 `Shape.cricle` 和 `Shape.square` 两个方法。

这时我们进行编译的话，因为 `cricle` 属性存在于 `a.ts` 文件内，会报出 `error TS2339: Property 'cricle' does not exist on type 'typeof Shape'.` 错误，这里我们可以使用**三斜线指令**

## 三斜线指令

三斜线指令是包含单个XML标签的单行注释。 注释的内容会做为编译器指令使用。

三斜线指令仅可放在包含它的文件的最顶端。 一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

`/// <reference path="..." />` 指令是三斜线指令中最常见的一种。 它用于声明文件间的 依赖。

三斜线引用告诉编译器在编译过程中要引入的额外的文件。

```ts
/// <reference path="a.ts" />

namespace Shape {
  export function square (x: number) {
    return x * x
  }
}

console.log(Shape.cricle(1))
console.log(Shape.square(1))
```

我们在执行一下打包命令 `tsc ./src/b.ts` 会生成 `a.js` 和 `b.js` 两个文件。

```js
// ./src/a.js

var Shape;
(function (Shape) {
    var pi = Math.PI;
    function cricle(r) {
        return pi * Math.pow(r, 2);
    }
    Shape.cricle = cricle;
})(Shape || (Shape = {}));

// ./src/b.js

/// <reference path="a.ts" />
var Shape;
(function (Shape) {
    function square(x) {
        return x * x;
    }
    Shape.square = square;
})(Shape || (Shape = {}));
console.log(Shape.cricle(1));
console.log(Shape.square(1));
```

命名空间在编译之后其实就是一个闭包。

为了实现全局引用效果，我们用 `script` 标签引入两个文件。

```js
console.log(Shape.cricle(1)) // 3.141592653589793
console.log(Shape.square(1)) // 1
```

为了调用方便，我们可以为方法设置别名。

```ts
// 别名
import cricle = Shape.cricle
console.log(cricle(2)) // 12.566370614359172
```

注意这里的 `import` 关键字并不是 `es6` 中的 `import`。