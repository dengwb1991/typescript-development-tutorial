# 识别库的类型

本篇为大家介绍如何肉眼识别库的类型，为更好的理解后面即将要介绍的声明文件做好充足准备。

## 全局库

全局库是指能在全局命名空间下访问，不需要 `import`、`require`，例如：`jQuery`.

```js
$(() => { console.log('hello!') } )
```

### 如何识别全局库

全局库源码中，通常会看到以下 3 点：

1. 顶级的 `var` 语句或者 `function` 函数声明;
2. 一个或者多个赋值语句到 `window`;
3. 假设 DOM 原始值 `document` 或者 `window` 存在.

全局库你不会看到：

1. 检查是否使用或者如何使用模块加载器，比如 `require` 或 `define`
2. CommonJS / Node.js 风格的导入，如 `var fs = require("fs")`
3. `define(...)` 调用
4. 使用文档说明如何去 `require`、`import` 导入该库

## 模块化库

一些库只能工作在模块加载器的环境下。 比如，像 `express` 只能在 Node.js 里工作所以必须使用 CommonJS 的 `require` 函数加载。

如：

```js
// CommonJS （Node.js）
var fs = require("fs")

// ES6
import fs = require("fs")

// or
define(..., ['someLib'], function(someLib) {
})
```

### 如何识别模块化库

特征：

1. 使用 `require` 或 `define`
2. 使用 `import` 或 `export`
3. 使用 `exports` 或 `module.exports`


## UMD库

UMD模块既可以作为模块引入又可以作为全局使用

### 如何识别模块化库

UMD模块会检查是否存在模块加载器环境，如果在源码里看到 `typeof define`、`typeof window` 或 `typeof module` 关键字，尤其是在文件顶端，那么它几乎就是一个 UMD库。

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```