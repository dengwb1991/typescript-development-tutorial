---
home: true
---

<div class="home-content-wrap">
<div class="home-item">
<div class="home-item-title">
  <img class="home-icon" src="/typescript/images/introduce-icon.png"/>
  <p class="home-title">初识篇</p>
</div>

[什么是 TypeScript](/introduce/what-is-typescript.html)

[安装 TypeScript](/introduce/install-typescript.html)

[第一个 TypeScript 项目](/introduce/hello-typescript.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <img class="home-icon" src="/typescript/images/basics-icon.png"/>
  <p class="home-title">基础篇</p>
</div>

[TypeScript 基础类型](/basics/basis-data-types.html)

[TypeScript 接口](/basics/interface.html)

[TypeScript 函数](/basics/function.html)

[TypeScript 类](/basics/class.html)

[TypeScript 类与接口](/basics/class-and-interface.html)

[TypeScript 泛型](/basics/generics.html)

[TypeScript 类型检查机制](/basics/type-check-mechanism.html)

[TypeScript 高级类型](/basics/advanced-type.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <img class="home-icon" src="/typescript/images/project-icon.png"/>
  <p class="home-title">工程篇</p>
</div>

[TypeScript 导入导出](/project/import-export.html)

[TypeScript 命名空间](/project/namespace.html)

[TypeScript 声明合并](/project/declaration-merging.html)

[如何识别库的类型](/project/identify-the-class-library.html)

[TypeScript 声明语法](/project/declaration-syntax.html)

[TypeScript 声明文件](/project/declaration-files.html)

[TypeScript 编译工具](/project/compile-tools.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <img class="home-icon" src="/typescript/images/configuration-icon.png"/>
  <p class="home-title">配置篇</p>
</div>

[tsconfig 文件选项](/configuration/file-options.html)

[tsconfig 编译选项](/configuration/compiler-options.html)

[vscode 编译异常](/configuration/vscode-compiler.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <img class="home-icon" src="/typescript/images/actual-icon.png"/>
  <p class="home-title">实战篇</p>
</div>

[TypeScript React](/actual/typescript-react.html)

[React 组件与类型](/actual/react-component-type.html)

[TypeScript Vue](/actual/typescript-vue.html)

[Vue 组件与类型](/actual/vue-component-type.html)

[TypeScript ESLint](/actual/typescript-eslint.html)

[TypeScript Jest](/actual/typescript-jest.html)

</div>
</div>

<style>
.home-content-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}
.home-item {
  padding: 0 15px;
}
.home-item-title {
  padding-left: 20px;
}
.home-icon {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}
.home-title {
  display: inline-block;
  font-weight: bold;
}
@media screen and (max-width: 500px) {
  .home-content-wrap {
    display: block;
  }
  .home-item {
    padding: 0;
  }
  .home-item-title {
    padding-left: 0;
  }
}
</style>