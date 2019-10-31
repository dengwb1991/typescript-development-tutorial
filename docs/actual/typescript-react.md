# typescript & react 手动搭建

[源码地址](https://github.com/dengwb1991/typescript-in-action/tree/master/react-actions/ts-react)

安装 react 和 文件声明

```bash
$ npm i react react-dom @types/react @types/react-dom
```

## 修改tsconfig配置项

首先我们需要修改一下 `tsconfig.json` 中的配置项

```json
{
  "jsx": "react"   /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
}
```

`jsx` 配置项有三个参数: 

`preserve` 表示生成代码中会保留 JSX 以供后续的转换操作使用，比如：Babel。 另外，输出文件会带有 `.jsx` 扩展名。

`react` 表示会生成 React.createElement，在使用前不需要再进行转换操作，输出文件的扩展名为 `.js`。

`react-native` 相当于 `preserve`，它也保留了所有的 JSX，但是输出文件的扩展名是 `.js`。

[了解更多JSX](http://www.typescriptlang.org/docs/handbook/jsx.html)

这里我们设置为 `react` 选项。

## 创建tsx文件

我们写一个简单的模板组件。

```ts
// /src/components/hello.tsx

import React from 'react'

interface Greeting {
  name: string
}

const hello = (props: Greeting) => <h1>Hello { props.name }</h1>

export default hello
```

如果编译器报出 `Cannot use JSX unless the '--jsx' flag is provided.` 的错误，可以检查一下 `tsconfig.json` 中的 `jsx` 是否配置错误。如果依然报错，可以重启 IDE。

接下来，将模板组件引入主文件。

```ts
// /src/index.tsx

import React from 'react'
import ReactDOM from 'react-dom'

import Hello from './components/hello'

ReactDOM.render(
  <Hello name="TypeScript"></Hello>,
  document.getElementById('app')
)
```

## 修改webpack配置

```js
// /build/webpack.base.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.tsx'
  },
  output: {
    filename: '[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [{
          loader: 'ts-loader'
        }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

设置 `entry` 为 `index.tsx`，`output` 设置文件名添加 `hash`，添加 `optimization` 配置项，将业务代码与引用 node_modules 的包分开。

我们执行 `npm run build` 命令后，打包目录如下：

```
├── app.3b98be32.js
├── index.html
└── vendors~app.60b76dfd.js
```

`app` 文件是我们的业务代码，`vendors` 文件是我们项目引用的代码，它非常庞大。文件后面会带有 8 位数的 `hash`，这样我们只更新业务代码的话，只有 `app` 文件 `hash` 会改变。`vendors` 文件会不会更改，可以利用浏览器缓存机制，保证性能。
