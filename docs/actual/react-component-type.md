---
sidebarDepth: 3
---

# React 组件与类型

[源码地址](https://github.com/dengwb1991/typescript-in-action/tree/master/react-actions/ts-react-app)

使用 `npx` 安装

```bash
$ npx create-react-app ts-react-app --typescript
```

我们先简单了解一下 `npx` 是什么？


## npx

`npx` 是一种在 `npm` 中的安装工具，我们平时使用 `npm` 比较多，在安装 `npm@5.2.0+` 的版本时，会自动安装 `npx`。如果没有可以手动安装一下。

```bash
$ npm install -g npx
```

### 调用项目安装的模块

`npx` 想要解决的主要问题是，调用项目内部安装的模块。比如，项目内部安装了测试工具 Mocha。

```bash
$ npm install mocha -D
```

一般来说，调用 Mocha，只能在项目脚本和 package.json 的 script 字段里面，如果想在命令行下调用，必须像下面这样。

```bash
# 项目根目录下执行

$ node_modules/.bin/mocha --version
```

npx 的原理很简单，就是运行的时候，会到 node_modules/.bin 路径和环境变量 $PATH 里面，检查命令是否存在。

由于 `npx` 会检查环境变量 $PATH，所以系统命令也可以调用。

```bash
# 等于执行 ls

$ npx ls
```

需要注意，Bash 内置的命令不在 $PATH 里面。比如 `cd`，就不能用 `npx cd`。

### 避免全局安装模块

`npx` 能避免全局安装模块。比如，`create-react-app` 这个模块是全局安装，npx 可以运行它，而且不进行全局安装。

```bash
$ npx create-react-app my-react-app
```

`npx` 会将 `create-react-app` 下载到一个临时目录，再次执行该命令，会重新下载。

下载全局模块时，`npx` 允许制定版本。

```bash
$ npx uglify-js@3.1.0 main.js -o ./dist/main.js
```

指定使用 3.1.0 版本的 `uglify-js` 压缩脚本。

注意，只要 `npx` 后面的模块无法在本地发现，它就会下载同名模块。比如，本地没有安装 `http-server` 模块，当执行以下命令会自动下载该模块，并在当前目录启动一个 Web 服务。

```bash
$ npx http-server
```

### --no-install 和 --ignore-existing

如果想让 `npx` 强制使用本地模块，不下载远程模块，可以添加 `--on-install` 参数。如果本地不存在该模块，会报错。

```bash
$ npx http-server --on-install
```

如果想要忽略本地的同名模块，强制安装使用远程模块，可以添加 `--ignore-existing` 参数。比如，本地已经全局安装了 `create-react-app`，但还是想使用远程模块，就用这个参数。

```bash
$ npx create-react-app my-react-app --ignore-existing
```

### 使用不同版本的node

利用 `npx` 可以下载模块这个特点，我们可以指定某个版本的 node 运行脚本。

```bash
$ npx node@8.0.0 -v
```

上面命令会使用 8.0.0 版本的 node 执行脚本。原理是从 `npm` 下载这个版本的 node，使用后再删除。

### -p 和 -c

`-p` 参数用于指定 `npx` 所要安装的模块，对于需要安装多个模块的场景非常有用。

```bash
$ npx -p lolcatjs -p cowsay [command]
```

如果 `npx` 安装多个模块，默认情况下，所执行的命令中，只有第一个可执行项会使用 `npx` 安装的模块，后面的可执行项还是会交给 Shell 解释。

```bash
$ npx -p lolcatjs -p cowsay 'cowsay hello | lolcatjs'
```

上面的代码执行后，`cowsay hello | lolcatjs` 会报错，原因是第一项 `cowsay` 由 `npx` 解释，而第二项命令由 Shell 解释，但是 `lolcatjs` 并没有 全局安装，所以会报错。

这个问题可以用 `-c` 参数来解决，`-c` 参数的另一个作用，是将环境变量带入所有要执行的命令。举例来说，npm 提供当前项目的一些环境变量，可以用下面的命令查看。

```bash
$ npm run env | grep npm_
```

`-c` 参数可以把这些 npm 的环境变量带入 `npx` 命令.

```bash
$ npx -c 'echo "$npm_package_name"'
```

上面代码会输出当前项目的项目名。

### 执行GitHub源码

`npx` 还可以执行 GitHub 上面的模块源码。

```bash
# 执行 Gist 代码
$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32

# 执行仓库代码
$ npx github:piuccio/cowsay hello
```

注意，远程代码必须是一个模块，即必须包含 `package.json` 和入口脚本。

## 安装其他依赖包

我们使用 `yarn`

```bash
# 依赖
$ yarn add antd react-router-dom @types/react-router-dom

# 开发依赖
$ yarn add babel-plugin-import customize-cra http-proxy-middleware http-server react-app-rewired --dev
```

简单介绍以上包的作用

`babel-plugin-import` 可以实现 `antd` 按需加载。

`customize-cra` 和 `react-app-rewired` 可以帮助我们实现 `create-react-app` 脚手架的自定义。

`http-proxy-middleware` 和 `http-server` 可以帮助我们搭建一个 mock server。

## 创建函数组件和类组件

### 函数组件

React 可以通过函数或类的形式创建组件，接下来实现一个函数组件的示例。

```tsx
import React from 'react'
import { Button } from 'antd'

interface Greeting {
  name: string
}

const HelloFn = (props: Greeting) => <Button>Hello { props.name }</Button>

HelloFn.defaultProps = {
  name: 'React Function'
}

export default HelloFn
```

`defaultProps` 可以为接口提供默认值。

除了上面这种直接定义函数的方式之外，React 声明文件中对函数组件单独定义了一个类型 `React.FC`。

```tsx
const HelloFn: React.FC<Greeting> = ({
  name,
  children
}) => <Button>Hello { name }</Button>
```

使用 `React.FC` 优点是，它的参数中隐含提供了 `children` 属性，在调用 `defaultProps` 方法时，编译器会提示，但是为它设置默认属性时，对应接口中定义的属性需要设置成**可选属性**。

综合来讲，我们推荐直接定义函数的方式来实现函数组件。

### 类组件

类组件需要继承 `React.Component`，在 `React.Component` 的子类中有个必须定义的 `render()` 函数。

```tsx
import React, { Component } from 'react'
import { Button } from 'antd'

interface Greeting {
  name: string
}

interface HelloState {
  count: number
}

class HelloClass extends Component<Greeting, HelloState> {
  state: HelloState = {
    count: 0
  }
  static defaultProps = {
    name: 'React Class'
  }
  render () {
    return (
      <>
        <p>count: { this.state.count }</p>
        <Button onClick={ () => this.setState({ count: this.state.count + 1 }) }>Hello { this.props.name }</Button>
      </>
    )
  }
}

export default HelloClass
```

在 TypeScript 中 `Component` 被定义为泛型类，它有三个参数，第一个参数表示这个类属性的类型，第二个表示状态类型，第三个参数为 snapshot。

## 高阶组件和Hooks

### React组件演化

| 组件复用方式 | 优势 | 劣势 | 状态 |
| -- | -- | -- | -- |
| 类组件（class）| 发展时间长，接受度广泛 | 只能继承父类 | 传统模式，长期存在 |
| Mixin | 可以复制任意对象的任意多个方法 | 组件相互依赖、耦合，可能产生冲突，不利于维护 | 抛弃 |
| 高阶组件（HOC）| 利用装饰器模式，在不改变组件的基础上，动态为其添加新的能力 | 嵌套过多调试困难，需要遵循某些约定（不改变原始组件，必须要透传 props 等）| 能力强大，应用广泛 | 
| Hooks | 代替 class，多个 Hooks 互不影响，避免嵌套低于，开发效率高 | 切换到新思维需要成本 | React 的未来 |

### 高阶组件（HOC）

```tsx
import React from 'react'

import HelloClass from './hello-class'

interface Loading {
  loading: boolean
}

function HelloHoc<P>(WrappedComponent: React.ComponentType<P>) {
  return class extends React.Component<P & Loading> {
    render () {
      const { loading, ...props } = this.props
      return loading ? <div>Loading ...</div> : <WrappedComponent { ...props as P }/>
    }
  }
}

export default HelloHoc(HelloClass)
```

### Hooks

```tsx
import React, { useState, useEffect }from 'react'
import { Button } from 'antd'

interface Greeting {
  name: string
}

const HelloHooks = (props: Greeting) => {
  const [count, setCount] = useState(0)
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    if (count > 5) {
      setText('stop!!!')
    }
  })

  return (
    <>
      <p>你点击了 { count } 次 { text }</p>
      <Button onClick={() => setCount(count + 1)}>
        Hello { props.name }
      </Button>
    </>
  )
}

HelloHooks.defaultProps = {
  name: 'React Hooks'
}

export default HelloHooks
```