---
sidebarDepth: 3
---

# 导入导出

从本篇开始进入 TypeScript 工程篇的学习，首先我们先回顾 `ES6`、`CommonJS` 中导入和导出的语法结构。

本篇大部分为代码段，可以点击[查看源码](https://github.com/dengwb1991/typescript-in-action/tree/master/second-typescript)。

## ES6

### 导出

代码第一行注释了源码的位置。

```ts
// ./src/es6/a.ts

// 单独导出
export const a = 1

// 批量导出
const b = 2
const c = 3
export { b, c }

// 导出接口
export interface P {
  x: number
  y: number
}

// 导出函数
export function fn () {}

// 导出时起别名
export { fn as Fn }

// 默认导出
export default () => { console.log('I am a function') }

// 引入外部模块，重新导出
// ./src/es6/a.ts
// export const str = 'b'

export { str as Str } from './b'
```

ES6 导出使用 `export` 关键字，如上所示可以单独导出变量、对象、接口、函数等等。

### 导入

```ts
// ./src/es6/c.ts

import { a, b, c } from './a' // 批量导入
import { P } from './a' // 接口导入
import { fn as F } from './a' // 导入时设置别名
import * as All from './a' // 导入所有成员
import defaultFuntion from './a' // 导入默认

console.log(a, b, c) // 1 2 3

let p: P = {
  x: 1,
  y: 2
}

F()

/**
 * {
 *    __esModule: true,
 *    a: 1,
 *    b: 2,
 *    c: 3,
 *    fn: [Function: fn],
 *    Fn: [Function: fn],
 *    default: [Function],
 *    Str: 'b'
 * }
*/
console.log(All)

defaultFuntion() // I am a function
```

`ts` 中的导入导出与 `js` 大致相同。

## CommonJS

### 导出

`CommonJS` 导出：

```ts
// ./src/node/a.node.ts

let a = {
  x: 1,
  y: 2
}

module.exports = a
```

`module.exports` 整体导出

```ts
// ./src/node/b.node.ts

exports.c = 3
exports.d = 4
```

`exports` 导出多个变量，若这里再设置了 `module.exports` 会覆盖调 `exports` 所有导出的定义。

### 导入

`CommonJS` 导入：

```ts
// ./src/node/c.node.ts

let c1 = require('./a.node')
let c2 = require('./b.node')

console.log(c1) // { x: 1, y: 2 }
console.log(c2) // { c: 3, d: 4 }
```

这里需要注意，引入文件时未添加文件名后缀`.ts`，当用 `node` 命令执行时，默认会找 `js` 文件，这里有以下解决方案

 * 1、编译成 `js` 后执行
 * 2、添加 `ts` 后缀
 * 3、安装 `ts-node`，`npm install ts-node -g`

当 `CommondJS` 引入 `es6` 输出时，调用默认导出时需要调用 `default` 属性。

```ts
let es6 = require('../es6/a')

es6.default() // I am a function
```

若使用 `export =` 形式导出时，相当于 `CommonJS` 的顶级导出 `module.exports =` 

```ts
// ./src/es6/d.ts

export = () => { console.log('I am a function') }

let d = require('../es6/d')

d() // I am a function
```