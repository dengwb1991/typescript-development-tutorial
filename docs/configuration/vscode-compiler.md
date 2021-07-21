# 解决 vscode 异常提示问题

本节会列举使用 vscode 进行 ts 开发时，出现的异常问题该如何解决。

## 隐式 any 类型

错误提示：Parameter 'xxx' implicitly has an 'any' type.ts(7006)

* 解决方案

1. 修改 `tsconfig.json` 配置文件，将 `noImplicitAny` 修改为 false.

```json
{
  "noImplicitAny": false
}
```

2. 全局安装 `tslint` 扩展包

```bash
$ npm install -g tslint
```

再安装 vscode 插件 [TSLint(deprecated)](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

## this 隐式具有 any 类型

错误提示：'this' implicitly has type 'any' because it does not have a type annotation.ts(2683)

```ts
const fn = (a) => {
  return function () {
    return a.apply(this, arguments)
  }
}
```

* 解决方案

1. 添加 `this: any`

```ts
const fn = (a) => {
  return function (this: any) {
    return a.apply(this, arguments)
  }
}
```

2. 修改 `tsconfig.json` 配置文件，将 `noImplicitThis` 修改为 false.

```json
{
  "noImplicitThis": false
}
```

## Cannot write file ... because it would overwrite input file

[https://github.com/Microsoft/TypeScript/issues/14538](https://github.com/Microsoft/TypeScript/issues/14538)

* 解决方案

1. 注销掉 `allowJs` 或设置为 false，不允许编译 JS 文件（js、jsx）

```json
{
  "compilerOptions": {
    ...

    // "allowJs": true,

    ...
  }
}
```

若想允许编译 JS 文件，参考第二种解决办法

2. tsconfig 设置 `allowJs`、`noEmit`

```json
{
  "compilerOptions": {
    ...

    "allowJs": true,
    "noEmit": true,

    ...
  }
}
```

`noEmit` 设置为 true 可能会导致 webpack 进行编译打包时报错，可以采用第三种的解决办法.

3. tsconfig 设置 `include`、`exclude`

```json
{
  "compilerOptions": {
    ...

    "allowJs": true,
    // "noEmit": true,

    ...
  },
  "include": ["src/**/*.*"],
  "exclude": ["node_modules", "build", "dist"]
}
```

这里主要是 `include` 起作用，本来设置其中一个就可以，但 `exclude` 并没有作用，可能是个**bug**.
  
## 不能使用JSX，除非提供了 '——JSX' 标志 

错误提示：Cannot use JSX unless the '--jsx' flag is provided.

* 解决方案

修改 `tsconfig.json`

```json
{
  "jsx": "react"
}
```

## ts(2307) Cannot find module 'xxx.vue' or its corresponding type declarations.

* 解决方案

`src` 目录下创建 `vue-shim.d.ts` 文件

```js
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}
```

## ts(2691) An import path cannot end with a '.ts' extension. Consider importing 'xxx.js' instead.

* 解决方案

1. 取消 `ts` 后缀

2. 在上一行添加 `// @ts-ignore` 过滤

## ts(2304) Cannot find name 'global'.

* 解决方案

修改 `tsconfig`

```js
// tsconfig.js
{
 "compilerOptions": {
  ...
  "types": [
    "node"
  ]
  ...
  }
}
```

安装包

```bash
$ npm install @types/node --save-dev
```