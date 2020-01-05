---
sidebarDepth: 3
---

# 编译工具

本篇主要介绍 ts-loader、awesome-typescript-loader 和 babel 分别编译 Typescript 的区别

## ts-loader

[ts-loader](https://www.npmjs.com/package/ts-loader) 内部调用了 `tsc`，所以在使用 `ts-loader` 时，会使用 `tsconfig.json` 配置文件。

### 提高构建速度

当项目中的代码变的越来越多，体积也越来越庞大时，项目编译时间也随之增加。这是因为 Typescript 的语义检查器必须在每次重建时检查所有文件。 `ts-loader` 提供了一个 `transpileOnly` 选项，它默认为 `false`，我们可以把它设置为 `true`，这样项目编译时就**不会进行类型检查，也不会输出声明文件**。

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  }
}
```

我们对一下 `transpileOnly` 分别设置 `false` 或 `true` 的项目构建速度。如下：

```bash
$ yarn build

yarn run v1.12.3
$ webpack --mode=production --config ./build/webpack.config.js
Hash: 36308e3786425ccd2e9d
Version: webpack 4.41.0
Time: 2482ms
Built at: 12/20/2019 4:52:43 PM
     Asset       Size  Chunks             Chunk Names
    app.js  932 bytes       0  [emitted]  main
index.html  338 bytes          [emitted]
Entrypoint main = app.js
[0] ./src/index.ts 14 bytes {0} [built]
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./index.html 489 bytes {0} [built]
    [2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [3] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
✨  Done in 4.88s.
```

```bash
$ yarn build

yarn run v1.12.3
$ webpack --mode=production --config ./build/webpack.config.js
Hash: e5a133a9510259e1f027
Version: webpack 4.41.0
Time: 726ms
Built at: 12/20/2019 4:54:20 PM
     Asset       Size  Chunks             Chunk Names
    app.js  932 bytes       0  [emitted]  main
index.html  338 bytes          [emitted]
Entrypoint main = app.js
[0] ./src/index.ts 14 bytes {0} [built]
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [0] ./node_modules/html-webpack-plugin/lib/loader.js!./index.html 489 bytes {0} [built]
    [2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [3] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
✨  Done in 2.40s.
```

当 `transpileOnly` 为 false 时，整体构建时间为 **`4.88s`**
，当 `transpileOnly` 为 true 时，整体构建时间为 **`2.40s`**

虽然构建速度提升了，但是有了一个弊端打包编译**不会进行类型检查**。

### fork-ts-checker-webpack-plugin

这里官方推荐了一个解决方案，使用 [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)，它在一个单独的进程上运行类型检查器，该插件在编译之间重用抽象语法树，并与TSLint共享这些树。可以通过多进程模式进行扩展，以利用最大的CPU能力。

需要注意的是，此插件使用 TypeScript 而不是 webpack 的模块解析，这一点非常重要。这意味着你必须正确设置 tsconfig.json。例如，如果您在 tsconfig.json 中设置文件：['./src/someFile.ts']，则此插件将仅检查 someFile.ts 的语义错误。这是为了构建性能。该插件的目标是尽可能快。有了 TypeScript 的模块解析，我们不必等待 webpack 编译文件（在编译过程中会遍历依赖图）-我们从一开始就拥有完整的文件列表。

要调试 TypeScript 的模块解析，可以使用 `tsc --traceResolution `命令。

#### 使用 fork-ts-checker-webpack-plugin

安装

```bash
$ yarn add -D fork-ts-checker-webpack-plugin
```

webpack.config.js 中修改：

```js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()
  ]
}
```

这样在构建的时候，既保证了构建速度，又会对其做类型检查。

它提供了更多的配置，如：`reportFiles`

```js
new ForkTsCheckerWebpackPlugin({
  reportFiles: ['src/**/*.{ts,tsx}']
})
```

这里表示只报告与这些全局模式匹配的文件的错误。更多选项可以自行查阅。

## awesome-typescript-loader

### 与 ts-loader 对比

1. [atl](https://www.npmjs.com/package/awesome-typescript-loader) 更适合于 Babel 集成，当启用了 useBabel 和 useCache 标志时，typescript 的派发将被 Babel 替换并缓存，下次源文件和环境有相同的校验，我们可以完全跳过 typescript 和 Babel 的转换。
2. atl 能够将类型检查器和发射器发送到一个单独的进程，这也加快了类似热更新的开发场景。
3. 不需要安装额外的插件。

### 使用

```bash
$ yarn add awesome-typescript-loader
```

webpack.config.js

```js
rules: [
  {
    test: /\.tsx?$/i,
    use: [{
      loader: 'awesome-typescript-loader',
      options: {
        transpileOnly: true
      }
    }],
    exclude: /node_modules/
  }
]
```

atl 本身提供了检查插件 `CheckerPlugin`，检查 ts 语法错误。

```js
const { CheckerPlugin } = require('awesome-typescript-loader')

...

plugins: [
  new CheckerPlugin()
]
```

:::warning
当 `transpileOnly` 设置为 true 时，`CheckerPlugin` 将会无效
:::

## babel 编译

TSC 与 Babel 对比

| - | 编译能力 | 类型检查 | 插件 |
| -- | -- | -- | -- |
| TSC | ts(x)、js(x) -> es3/5/6/... | 有 | 无 |
| Babel | ts(x)、js(x) -> es3/5/6/... | 无 | 丰富 |

Babel 没有类型检查机制，可以配合 typescript `tsc --watch`.

### 安装使用

安装包

```
  "@babel/cli": "^7.4.4",
  "@babel/core": "^7.4.5",
  "@babel/plugin-proposal-class-properties": "^7.4.4",
  "@babel/plugin-proposal-object-rest-spread": "^7.4.4",
  "@babel/preset-env": "^7.4.5",
  "@babel/preset-typescript": "^7.3.3"
```

`plugin-proposal-class-properties` 支持 class、`plugin-proposal-object-rest-spread` 支持对象解构赋值


.babelrc

```
{
  "presets": [
    "@babel/env",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]
}
```

### 4种书写方式 Babel 无法编译

1. 命名空间

```ts
namespace N {
  export const n = 1
}
```

2. 类型断言只允许使用 `as`

```ts
let s = <A>{}
```

3. 常量枚举

```ts
const enum E { A }
```

4. 默认导出

```ts
export = s
```

## 总结

1. 如果没有使用过 Babel，应使用 TypeScript 自身编译器，可配合 ts-loader.
2. 如果项目中已经安装使用了 Babel，可以安装 @babel/preset-typescript，配合 tsc 做类型检查.
3. 两种编译工具不要混合使用.

## 链接

[ts-loader、awesome-typescript-loader 示例](https://github.com/dengwb1991/typescript-in-action/tree/master/base-typescript/fifth-typescript)

[typescript-babel 示例](https://github.com/dengwb1991/typescript-in-action/tree/master/base-typescript/ts-babel)