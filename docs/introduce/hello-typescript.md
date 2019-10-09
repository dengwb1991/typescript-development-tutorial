# Hello TypeScript

结合 `tsc` 命令，我们一起写一个简单的例子。

创建一个 index.ts 文件。

```ts
let text: string = 'Hello TypeScript'
```

执行 `tsc index.ts` 命令，会在同目录下生成 index.js 文件。

```js
var text = 'Hello TypeScript';
```

一个简单的例子就实现完了。我们可以通过官网提供的 [Playground](http://www.typescriptlang.org/play/index.html) 进行验证。

但是在项目开发过程中我们会结合构建工具，如 `webpack`，和对应的本地服务 `dev-server` 等相关工具一同使用。

接下来把我们了解到的知识结合在一起。搭建一个[完整的项目](https://github.com/dengwb1991/typescript-in-action/tree/master/first-typescript)。

项目根目录中有一个 `tsconfig.json` 文件，简单介绍其作用。

## tsconfig.json

如果一个目录下存在一个 `tsconfig.json` 文件，那么它意味着这个目录是 TypeScript 项目的根目录。`tsconfig.json` 文件中指定了用来编译这个项目的根文件和编译选项。 一个项目可以通过以下方式之一来编译：

* 不带任何输入文件的情况下调用 `tsc`，编译器会从当前目录开始去查找 `tsconfig.json文` 件，逐级向上搜索父目录。
* 不带任何输入文件的情况下调用 `tsc`，且使用命令行参数 `--project`（或 `-p` ）指定一个包含 `tsconfig.json` 文件的目录。

当命令行上指定了输入文件时，tsconfig.json文件会被忽略。

