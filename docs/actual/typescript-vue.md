# typescript & vue 手动搭建

[源码地址](https://github.com/dengwb1991/typescript-in-action/tree/master/vue-actions/ts-vue)

本节介绍 `ts` 与 `vue` 环境搭建，先看 `package.json`

```json
{
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.4.1",
    "html-webpack-plugin": "^3.2.0",
    "ts-loader": "^6.0.2",
    "typescript": "^3.5.1",
    "vue-loader": "^15.8.3",
    "vue-template-compiler": "^2.6.11",
    "webpack": "^4.39.2",
    "webpack-cli": "^3.3.2",
    "webpack-dev-server": "^3.5.1",
    "webpack-merge": "^4.2.1"
  },
  "dependencies": {
    "vue": "^2.6.10"
  }
}
```

可以对比 `react` 项目中 `package.json` 文件有安装 `@types/react`. 在 `vue` 包内已经包含了声明文件，所以不需要额外安装.

创建入口文件 `index.ts`

```ts
import Vue from 'vue'

new Vue({
  el: '#app',
  data: {
    name: 'TypeScript'
  },
  template: `<h1>Hello {{ name }}</h1>`
})
```

* 若在引入 `vue` 提示以下错误

[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build. (found in \<Root\>)

**解决方案**：在 webpack.config.js 中 `resolve` 配置添加 `alias`

```js
module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  }
}
```

## 添加 .vue 组件

安装相应插件，更改 webpack 配置

```bash
$ yarn add -D vue-loader vue-template-compiler css-loader
```

编写 `vue` 组件

```js
<template>
  <h1>Hello {{ name }}</h1>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      name: 'Typescript'
    }
  }
})
</script>

<style scoped>
h1 {
  color:darkorange;
}
</style>
```

这里需要注意的是，我们为 `script` 标签 lang 设置为 `ts`，需要在 webpack 配置文件中 `ts-loader` 添加一个选项, **`appendTsSuffixTo: [/\.vue$/]`**.

在主 `ts` 文件中引入，会出现以下错误提示

```ts
import Hello from './components/hello.vue'

// Cannot find module './components/hello.vue'.ts(2307)
```

**解决方案**：与入口文件同级目录下创建 `.d.ts` 文件，如下：

```ts
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```

