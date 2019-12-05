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