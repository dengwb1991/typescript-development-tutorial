# 安装 TypeScript

通过 npm 安装

```bash
$ npm install typescript -g
```

以上命令会在全局环境下安装 `tsc` 和 `tsserver` 两个命令，安装完成之后，我们就可以在任何地方执行它了。

## tsserver

TypeScript 独立服务器(又名 tsserver )是一个节点可执行文件，它封装了 TypeScript 编译器和语言服务，并通过 JSON 协议公开它们。tsserver 非常适合编辑器和 IDE 支持。

一般工作中不常用到它。[进一步了解tsserver](https://github.com/microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29)

## tsc

tsc 为 typescript compiler 的缩写，即 TypeScript 编译器，用于将 TS 代码编译为 JS 代码。使用方法如下：

```bash
$ tsc index.ts
```

编译成功后，就会在相同目录下生成一个同名 js 文件，你也可以通过命令参数来修改默认的输出名称。

默认情况下编译器以 ECMAScript 3（ES3）为目标。可以通过 `tsc -h` 命令查看相关帮助，可以了解更多的配置。

我们约定使用 TypeScript 编写的文件以 `.ts` 为后缀，用 TypeScript 编写 React 时，以 `.tsx` 为后缀。
