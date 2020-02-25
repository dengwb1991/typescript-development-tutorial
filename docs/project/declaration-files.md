---
sidebarDepth: 3
---

# 声明文件

本篇会为大家详细介绍 `TypeScript` 中的声明文件，分享我在工作中遇到的一些问题最终是如何解决的。

## 什么是声明文件？

在开发过程中不可避免的要引用其他第三方 JavaScript 库。虽然通过直接引用可以调用库的类和方法，但是却无法通过 TypeScript 的严格类型检查机制。会提示类似以下的错误

```bash
Parameter 'xxx' implicitly has an 'any' type.ts(7006)
```

上面提示的意思是，这个参数存在隐式 `any` 类型，解决该错误有两种方式：

1. 把 `tsconfig.json` 中 `noImplicitAny` 设置为 `false`，但我们使用 Typescript 的目的就是为了规范编码，所以这个办法并不推荐。
2. 编写声明文件，就是以 `.d.ts` 为后缀的文件。 

接下来我们主要介绍在 `ts` 文件中如何引入外部类库以及如何为它们编写声明文件。

## 声明文件放在哪？

在介绍声明文件如何编写之前，列举一下一般声明文件存放的方式。

1. 目录 `src/@types/`，在 `src` 目录新建 `@types` 目录，在其中编写 `.d.ts` 声明文件，声明文件会自动被识别，可以在此为一些没有声明文件的模块编写自己的声明文件，实际上在 `tsconfig.json` 中 `include` 字段包含的范围内编写 `.d.ts`，都将被自动识别；
2. 与被声明的 `js` 文件同级目录内，创建相同名称的 `.d.ts` 文件，这样也会被自动识别；
3. 设置 `package.json` 中的 `typings` 属性值，如 `./index.d.ts`. 这样系统会识别该地址的声明文件。同样当我们把自己的js库发布到 npm 上时，按照该方法绑定声明文件。
4. 同过 npm 模块安装，如 `@type/react` ，它存放在 `node_modules/@types/` 路径下。

## 如何发布声明文件？

如果我们自己实现了一个js库，如何来写声明文件呢？目前有两种方式用来发布声明文件到 `npm` 上：

1. 与你的 `npm` 包同时捆绑在一起；
2. 发布到 `npm` 上的 [@types organization](https://www.npmjs.com/~types)

### npm包含声明文件

在 `package.json` 中，你的需要指定 `npm` 包的主 `js` 文件，那么你还需要指定主声明文件。如下：

```json
{
  "name": "owl-redux",
  "version": "0.0.1",
  "description": "A simple version of redux",
  "main": "dist/owl-redux.js",
  "typings": "index.d.ts"
}
```

有的 `npm` 包设置的 `types` 属性，它和 `typings` 具有相同意义。

:::tip
如果你的 `npm` 包需要依赖于其他包，需要将依赖放在 `dependencies` 中
:::

### 发布到@types

[@types](https://www.npmjs.com/~types) 下面的包是从  [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 里自动发布的，通过  [types-publisher](https://github.com/Microsoft/types-publisher) 工具。 如果想让你的包发布为@types包，提交一个pull request到 https://github.com/DefinitelyTyped/DefinitelyTyped。 在这里查看详细信息  [contribution guidelines page](http://definitelytyped.org/guides/contributing.html)。

## 编写声明文件

目前大致分为三种类型的类库，分别为**全局类库**、**模块类库**、**UMD类库**。接下来，我会带大家分析 `ts` 引入各自类库的用法和区别。

接下来介绍的大部分内容为代码段，可以点击[查看源码](https://github.com/dengwb1991/typescript-in-action/tree/master/base-typescript/fourth-typescript)同时阅读。

:::tip
这里会接触到 JavaScript模块化 的一些基础知识，若您还对它不了解，可以点击[了解 JavaScript模块化](https://notes.dengwb.com/notes/jsModular.html) 进行预习。
:::

### 引入jquery

jquery 是 UMD 类库，它可以全局引用，同时也可以使用模块化方式引用。

```ts
import $ from 'jquery'

// Error: Try `npm install @types/jquery` if it exists or add a new declaration (.d.ts) file containing `declare module 'jquery';`
```

在 `ts` 文件中引入 js 文件时，会提示上述错误，原因在于缺少声明文件。

我们在使用非 `ts` 编写的类库时，必须为这个类库编写一个声明文件，对外暴露它的 API，有时候这些类库的声明文件是单独提供的，需要额外安装。上述例子中就提示需要安装 `@types/jquery` 插件。

```bash
npm install @types/jquery -D
```

安装完之后，就可以正常在 ts 文件中使用 `jquery` 了。

:::tip
1. 可在 `http://microsoft.github.io/TypeSearch/` 中查询类库是否有声明文件
2. 可在 `http://definitelytyped.org/` 中了解如何发布声明文件
:::

### 全局类库

编写 js 文件，如下所示：

```js
function globalLib (options) {
  console.log(options)
}

globalLib.version = '1.0.0'

globalLib.doSomething = function () {
  console.log('global lib do something')
}
```

上述代码中，定义了一个函数，为函数添加了两个元素。接下来我们用 `script` 标签引入该文件，让该函数作用在全局。

我们在 ts 中调用该函数，如下所示：

```ts
globalLib({ a: 1 }) // Error: Cannot find name 'globalLib'.
```

提示未找到该函数。

解决办法为它添加一个声明文件，在同级目录下创建一个同名 `d.ts` 文件，如下所示：

```ts
declare function globalLib (options: globalLib.Options): void

declare namespace globalLib {
  const version: string
  function doSomething (): void
  interface Options {
    [key: string]: any
  }
}
```

定义了一个同名函数和命名空间，在上一篇声明合并中有介绍过函数与命名空间合并，相当于为函数添加了一些默认属性。函数参数定义了一个接口，参数指定为可索引类型，接受任意属性。`declare` 关键字可以为外部变量提供声明。

这样一个声明文件就定义好了。

### 模块类库

以下为 CommonJS 模块编写的文件：

```js
const version = '1.0.0'

function doSomething () {
  console.log('moduleLib do something')
}

function moduleLib (options) {
  console.log(options)
}

moduleLib.version = version
moduleLib.doSomething = doSomething

module.exports = moduleLib
```

同样我们将它引入 `ts` 文件中使用。

```ts
import module from './module-lib/index.js'
// Error: Could not find a declaration file for module './module-lib/index.js'. 
```

提示未找到该模块，同样我们需要为它编写文件声明。

```ts
declare function moduleLib (options: Options): void

interface Options {
  [key: string]: any
}

declare namespace moduleLib {
  const version: string
  function doSomething(): void
}

export = moduleLib
```

上述 ts 与刚刚编写的全局类库声明文件大致相同，唯一的区别这里需要 `export` 输出。

### UMD 类库

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.umdLib = factory()
  }
}(this, function () {
  return {
    version: '1.0.0',
    doSomething () {
      console.log('umd lib do something')
    }
  }
}))
```

同样我们将它引入 `ts` 文件中使用，如果没有声明文件也会提示错误，我们直接看 ts 声明文件

```ts
declare namespace umdLib {
  const version: string
  function doSomething (): void
}

export as namespace umdLib

export = umdLib
```

我们声明了一个命名空间，命名空间内有两个成员 `version` 和 `doSomething`，分别对应 `umd` 中的两个成员。

这里与其他类库不同的是，多添加了一条语句 `export as namespace umdLib`，如果为 `umd` 库声明，这条语句必不可少。

`umd` 同样可以使用全局方式引用。


## 插件

有时候，我们想给一个第三方类库添加一些自定义的方法。以下介绍如何在**模块插件**或**全局插件**中添加自定义方法。

### 模块插件

我们使用 `moment` 插件，为它添加一个自定义方法。 关键字 `declare module`。

```ts
import m from 'moment'
declare module 'moment' {
  export function myFunction (): void
}
m.myFunction = () => { console.log('I am a Fn') }
```

### 全局插件

在上面我们有介绍全局类库，我们为它添加一个自定义方法。关键字 `declare global`。

```ts
declare global {
  namespace globalLib {
    function doAnyting (): void
  }
}
globalLib.doAnyting = () => {}
```