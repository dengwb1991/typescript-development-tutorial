# 编译选项

本篇主要介绍 `tsconfig.json` 中与编译相关的选项。

```json
{
  "compilerOptions": {
    "incremental": true,                // 增量编译
    "tsBuildInfoFile": "./buildFile",   // 增量编译文件的存储位置
    "diagnostics": true,                // 打印编译信息

    "target": "es5",           // 目标语言的版本
    "module": "commonjs",      // 生成代码的模块标准
    "outFile": "./app.js",     // 将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中

    "lib": [],                 // TS 需要引用的库，即声明文件，es5 默认 "dom", "es5", "scripthost"

    "allowJs": true,           // 允许编译 JS 文件（js、jsx）
    "checkJs": true,           // 允许在 JS 文件中报错，通常与 allowJS 一起使用
    "outDir": "./out",         // 指定输出目录
    "rootDir": "./",           // 指定输入文件目录（用于输出）

    "declaration": true,         // 生成声明文件
    "declarationDir": "./d",     // 声明文件的路径
    "emitDeclarationOnly": true, // 只生成声明文件
    "sourceMap": true,           // 生成目标文件的 sourceMap
    "inlineSourceMap": true,     // 生成目标文件的 inline sourceMap
    "declarationMap": true,      // 生成声明文件的 sourceMap
    "typeRoots": [],             // 声明文件目录，默认 node_modules/@types
    "types": [],                 // 声明文件包

    "removeComments": true,    // 删除注释

    "noEmit": true,            // 不输出文件
    "noEmitOnError": true,     // 发生错误时不输出文件

    "noEmitHelpers": true,     // 不生成 helper 函数，需额外安装 ts-helpers
    "importHelpers": true,     // 通过 tslib 引入 helper 函数，文件必须是模块

    "downlevelIteration": true,    // 降级遍历器的实现（es3/5）

    "strict": true,                        // 开启所有严格的类型检查
    "alwaysStrict": false,                 // 在代码中注入 "use strict";
    "noImplicitAny": false,                // 不允许隐式的 any 类型
    "strictNullChecks": false,             // 不允许把 null、undefined 赋值给其他类型变量
    "strictFunctionTypes": false,          // 不允许函数参数双向协变
    "strictPropertyInitialization": false, // 类的实例属性必须初始化
    "strictBindCallApply": false,          // 严格的 bind/call/apply 检查
    "noImplicitThis": false,               // 不允许 this 有隐式的 any 类型

    "noUnusedLocals": true,                // 检查只声明，未使用的局部变量
    "noUnusedParameters": true,            // 检查未使用的函数参数
    "noFallthroughCasesInSwitch": true,    // 防止 switch 语句贯穿
    "noImplicitReturns": true,             // 每个分支都要有返回值

    "esModuleInterop": true,               // 允许 export = 导出，由import from 导入
    "allowUmdGlobalAccess": true,          // 允许在模块中访问 UMD 全局变量
    "moduleResolution": "node",            // 模块解析策略
    "baseUrl": "./",                       // 解析非相对模块的基地址
    "paths": {                             // 路径映射，相对于 baseUrl
      "jquery": ["node_modules/jquery/dist/jquery.slim.min.js"]
    },
    "rootDirs": ["src", "util"],           // 将多个目录放在一个虚拟目录下，用于运行时

    "listEmittedFiles": true,        // 打印输出的文件
    "listFiles": true,               // 打印编译的文件（包括引用的声明文件）
  }
}
```

接下来，我们会逐个分析上面的配置项。

## incremental

它的含义是增量编译，TypeScript 编译器在第一次编译后会生成一个可以编译信息的文件，在之后的编译之后会根据这个文件提高编译的速度。该文件默认会在根目录下名称为 `tsconfig.tsbuildinfo`：

```json
{
  "program": {
    "fileInfos": {
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.d.ts": {
        "version": "49ff9798f592c8b7e628fd881401e68810c1b3589ecd7a41b32b3c287374cde0",
        "signature": "49ff9798f592c8b7e628fd881401e68810c1b3589ecd7a41b32b3c287374cde0"
      },
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.es5.d.ts": {
        "version": "ff5688d6b2fcfef06842a395d7ff4d5730d45b724d4c48913118c889829052a1",
        "signature": "ff5688d6b2fcfef06842a395d7ff4d5730d45b724d4c48913118c889829052a1"
      },
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.dom.d.ts": {
        "version": "2d53f3741e5a4f78a90f623387d71a1cc809bb258f10cdaec034b67cbf71022f",
        "signature": "2d53f3741e5a4f78a90f623387d71a1cc809bb258f10cdaec034b67cbf71022f"
      },
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.webworker.importscripts.d.ts": {
        "version": "fe4e59403e34c7ff747abe4ff6abbc7718229556d7c1a5b93473fb53156c913b",
        "signature": "fe4e59403e34c7ff747abe4ff6abbc7718229556d7c1a5b93473fb53156c913b"
      },
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.scripthost.d.ts": {
        "version": "b9faa17292f17d2ad75e34fac77dd63a6403af1dba02d39cd0cbb9ffdf3de8b9",
        "signature": "b9faa17292f17d2ad75e34fac77dd63a6403af1dba02d39cd0cbb9ffdf3de8b9"
      },
      "./src/index.ts": {
        "version": "a0e2a405f15ab7f6218e22c622acc2706d51eae2aa90f302f81f68628e22cd55",
        "signature": "ec8f4696ee1308e5fbc9f50626f5677f0f15bd7c228311cbcc0669233461fa1d"
      }
    },
    "options": {
      "incremental": true,
      "configFilePath": "./tsconfig.json"
    },
    "referencedMap": {},
    "exportedModulesMap": {},
    "semanticDiagnosticsPerFile": [
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.d.ts",
      "./src/index.ts",
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.es5.d.ts",
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.dom.d.ts",
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.webworker.importscripts.d.ts",
      "../../../../../usr/local/lib/node_modules/typescript/lib/lib.scripthost.d.ts"
    ]
  },
  "version": "3.6.2"
}
```

## tsBuildInfoFile

可以修改增量编译文件的存储文件夹和文件名

## diagnostics

打印编译信息。

```bash
Files:            6
Lines:        24817
Nodes:       111372
Identifiers:  41045
Symbols:      27914
Types:         8268
Memory used: 68338K
I/O read:     0.01s
I/O write:    0.00s
Parse time:   0.42s
Bind time:    0.23s
Check time:   1.13s
Emit time:    0.02s
Total time:   1.80s
```

## target

设置目标语言的版本，可设置为 `ES3`、`ES5` 和 `ES2015` 等等，默认为 `ES3`。

## module

设置生成代码的模块标准，可以设置为 `CommonJS`、`AMD` 和 `UMD` 等等。

## outFile

将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中。

我们创建两个文件，分别为 `index.ts` 和 `amd.ts`，如下所示：

```ts
// ./src/index.ts
import a = require('./amd')

let str: string = 'abc'
```

```ts
// ./src/amd.ts

let amd: number = 0

export = amd
```

`index.ts` 引入 `amd.ts`，我们再设置一下 `tsconfig.json` 文件。

```json
{
  "compilerOptions": {
    "module": "amd",
    "outFile": "./app.js"
  }
}
```

然后在命令行执行 `tsc` 命令，编译器会将两个 `ts` 文件合并编译成一个 `app.js` 文件。

```js
define("amd", ["require", "exports"], function (require, exports) {
    "use strict";
    var amd = 0;
    return amd;
});
define("index", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var str = 'abc';
});
```

## lib

指定 `ts` 需要引用的库，即声明文件，若 `target` 设置为 `es5` 时，`lib` 默认为 `["dom",  "es5", "scripthost"]`。

例如，我们想在 `ts` 中使用 es2019 的方法。可以在 `lib` 配置里添加 `es2019`。

## allowJs

允许编译器编译 JS 文件（js、jsx）。

## checkJs

允许在 JS 文件中报错，通常与 allowJS 一起使用。

## outDir

指定输出目录

## rootDir

指定输入文件目录

## declaration

编译器编译时，允许生成声明文件（`.d.ts`）。

## declarationDir

指定声明文件的生成的目录。

## emitDeclarationOnly

编译器编译时，只允许生成声明文件。

## sourceMap

编译器编译时，生成目标文件的 sourceMap 文件。

## inlineSourceMap

编译器编译时，将 sourceMap 生成在 `js` 文件中。

## declarationMap

编译器编译时，生成声明文件的 sourceMap。

## typeRoots

设置声明文件目录，默认 `node_modules/@types`

## types

这是声明文件包，如果设置了某一个声明文件，那么编译器只会加载这个声明文件。

## removeComments

是否删除注释

## noEmit

执行 `tsc` 不会输出任何文件

## noEmitOnError

发生错误时不输出文件

## noEmitHelpers

设置为 `true` 时，不生成 `helper` 函数。先看下面示例：

```ts
class B {}

class A extends B {}

export = A
```

我们创建了一个模块。然后在控制台执行 `tsc`，下面就是编译后的结果：

```js
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var B = /** @class */ (function () {
    function B() {
    }
    return B;
}());
var A = /** @class */ (function (_super) {
    __extends(A, _super);
    function A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return A;
}(B));
module.exports = A;
```

编译器会自动生成 `__extends`。

如果我们将 noEmitHelpers 这个配置设置为 `true` 之后。编译后的结果如下：

```js
"use strict";
var B = /** @class */ (function () {
    function B() {
    }
    return B;
}());
var A = /** @class */ (function (_super) {
    __extends(A, _super);
    function A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return A;
}(B));
module.exports = A;
```

上面的编译后的结果中 `__extends` 未定义。`ts` 已经为开发者定义了一个配置项，方便解决该问题。 就是接下来要介绍的配置 `importHelpers`。

## importHelpers

通过 `tslib` 引入 `helper` 函数，文件必须是模块。编译结果如下：

```js
"use strict";
var tslib_1 = require("tslib");
var B = /** @class */ (function () {
    function B() {
    }
    return B;
}());
var A = /** @class */ (function (_super) {
    tslib_1.__extends(A, _super);
    function A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return A;
}(B));
module.exports = A;
```

若提示 `tslib` 未找到时，可以手动安装它。

## downlevelIteration

降级遍历器的实现，下面是一个 `es6` 语法：

```ts
let a = [1, 2, 3]
let b = [4, ...a]
```

我们打开这项配置，进行编译后结果如下：

```js
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var a = [1, 2, 3];
var b = __spread([4], a);
```

会生成两个 `helper` 函数。

## strict

表示开启所有严格的类型检查，若 `strict` 为 true，`alwaysStrict`、`noImplicitAny`、`strictNullChecks`、`strictFunctionTypes`、`strictPropertyInitialization`、`strictBindCallApply` 和 `noImplicitThis` 选项默认都为 true。

## alwaysStrict

在代码中注入 `use strict`。

## noImplicitAny

不允许隐式的 `any` 类型。

## strictNullChecks

不允许把 `null`、`undefined` 赋值给其他类型变量。

## strictFunctionTypes

不允许函数参数双向协变。

## strictPropertyInitialization

类的实例属性必须初始化。

## strictBindCallApply

严格的 `bind`、`call`、`apply` 检查。

```ts
function add (a: number, b: number) {
  return a + b
}

add.call(undefined, 1, '2')
// Error: Argument of type '"2"' is not assignable to parameter of type 'number'.
```

## noImplicitThis

不允许 `this` 有隐式的 `any` 类型。

```ts
class A {
  name: string = 'abc'
  getName () {
    return function () {
      console.log(this.name)
    }
  }
}
// Error: 'this' implicitly has type 'any' because it does not have a type annotation.
```
## noUnusedLocals

检查只声明，未使用的局部变量

## noUnusedParameters

检查未使用的函数参数

## noFallthroughCasesInSwitch

防止 switch 语句贯穿

## noImplicitReturns

每个分支都要有返回值

## esModuleInterop

允许 `export =` 方式导出，也可以用 `import =` 的方式导入。

## allowUmdGlobalAccess

允许在模块中访问 UMD 全局变量

## moduleResolution

模块解析策略，这里提供两种解析策略 `node` 和 `classic`，`ts` 默认使用 `node` 解析策略。

* **classic** 模块解析策略 

适用于 `AMD`、`System`、`ES2015`

如果一个模块使用相对方式导入时，`ts` 就会依次解析同级目录 `.ts`、`.d.ts` 文件。

```ts
// /root/src/moduleA.ts

import { b } from './moduleB'

/**
 * /root/src/moduleB.ts
 * /root/src/moduleB.d.ts
 */
```

如果使用非相对方式导入时如下， `ts` 会从当前目录的 `node_modules` 目录里查找，如果未找到，会依次向上级目录查找。

```ts
// /root/src/moduleA.ts

import { b } from 'moduleB'

/**
 * /root/src/node_modules/moduleB.ts
 * /root/src/node_modules/moduleB.d.ts
 * 
 * /root/node_modules/moduleB.ts
 * /root/node_modules/moduleB.d.ts
 * 
 * /node_modules/moduleB.ts
 * /node_modules/moduleB.d.ts
 */
```

* **node** 模块解析策略

使用相对方式导入

```ts
// /root/src/moduleA.ts

import { b } from './moduleB'

/**
 * /root/src/moduleB.ts
 * /root/src/moduleB.tsx
 * /root/src/moduleB.d.ts
 * /root/src/moduleB/package.json ( types 属性)
 * /root/src/moduleB/index.ts
 * /root/src/moduleB/index.tsx
 * /root/src/moduleB/index.d.ts
 */
```

使用非相对方式导入

```ts
// /root/src/moduleA.ts

import { b } from 'moduleB'

/**
 * /root/src/node_modules/moduleB.ts
 * /root/src/node_modules/moduleB.tsx
 * /root/src/node_modules/moduleB.d.ts
 * /root/src/node_modules/package.json ( types 属性)
 * /root/src/node_modules/index.ts
 * /root/src/node_modules/index.tsx
 * /root/src/node_modules/index.d.ts
 * 
 * 依次向上目录查找
 */
```

## baseUrl

解析非相对模块的基地址，默认为当前目录

## paths

路径映射，相对于 baseUrl。比如示例中我们想引入 jquery 精简版本，可以制定它的相对路径。

## rootDirs

将多个目录放在一个虚拟目录下，用于运行时。

比如 我们创建量以下两个文件。

```ts
// /util/a.ts
let a: string = 'A'
export = a
```

```ts
// /src/index.ts
import a from './a'
```

注意在引入 `a` 时，是引入的当前目录。因为当 `rootDirs` 设置了 `src` 和 `util` 目录时，编译器默认它们属于同级目录。

## listEmittedFiles

打印输出的文件。

## listFiles

打印编译的文件，包括引用的声明文件。
