# typescript & jest

以 react 项目为例

## 安装

```bash
$ yarn add jest ts-jest @types/jest -D
```

## 创建 jest 配置文件

```bash
$ npx ts-jest config:init
```

`ts-jest` 可以在测试用例中进行类型检查

## 测试 react dom

这里选用 `enzyme` 和 `enzyme-adapter-react-16`

[Enzyme](https://github.com/airbnb/enzyme) 为 Airbnb 开发的测试工具.

`enzyme-adapter-react-16` 为 React 版本安装适配器.

```bash
$ yarn add enzyme @types/enzyme enzyme-adapter-react-16 @types/enzyme-adapter-react-16 -D
```

使用 chai 做断言

```bash
$ yarn add chai @types/chai -D
```

## enzyme 结合 jest

配置文件

```js
// jest.config.js

const path = require('path')

module.exports = {
  preset: 'ts-jest',
  transform: { // 哪些文件需要用 ts-jest 执行
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$', // Jest使用模式或模式来检测测试文件
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  setupFilesAfterEnv: [path.resolve(__dirname, './setup-enzyme.ts')],
}
```

setup-enzyme.ts

```ts
// setup-enzyme.ts
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new Adapter()
})
```

示例看 `/src/components/`

## shallow、mount、render

`shallow` 渲染叫浅渲染，仅仅对当前 `jsx` 结构内的顶级组件进行渲染，而不对这些组件的内部子组件进行渲染，因此，它的性能上最快的，大部分情况下，如果不深入组件内部测试，那么可以使用 `shallow` 渲染。

`mount` 则会进行完整渲染，而且完全依赖 DOM API，也就是说 `mount` 渲染的结果和浏览器渲染结果说一样的，结合 `jsdom` 这个工具，可以对上面提到的有内部子组件实现复杂交互功能的组件进行测试。

`render` 也会进行完整渲染，但不依赖 DOM API，而是渲染成 HTML 结构，并利用 `cheerio` 实现 `html` 节点的选择，它相当于只调用了组件的 `render` 方法，得到 `jsx` 并转码为 `html`，所以组件的生命周期方法内的逻辑都测试不到，所以render常常只用来测试一些数据（结构）一致性对比的场景。`shallow` 实际上也测试不到 `componentDidMount` / `componentDidUpdate` 这两个方法内的逻辑。

## css-modules 结合 jest

安装 [identity-obj-proxy](https://github.com/keyz/identity-obj-proxy)

```bash
$ yarn add identity-obj-proxy -D
```

```js
// jest.config.js

module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  ...
}
```

[文档](https://jestjs.io/docs/en/webpack)

[解决问题](https://stackoverflow.com/questions/41040269/syntax-error-when-test-component-with-sass-file-imported)

## 测试报告

设置 `script`

```json
  "scripts": {
    "test": "jest --collect-coverage"
  },
```

或配置中设置 `collectCoverage: true`

## 问题解决

* It looks like you called `mount()` without a global document being loaded.

[issues341](https://github.com/airbnb/enzyme/issues/341)

解决方案：

安装 jsdom jsdom-global

```bash
$ yarn add jsdom jsdom-global -D
```

在引入 `react` 之前，文件顶部设置如下

```js
import 'jsdom-global/register'
```

## 链接

[react示例](https://github.com/dengwb1991/typescript-in-action/tree/master/jest-actions/ts-react-jest)

[jest简单示例](https://github.com/dengwb1991/typescript-in-action/tree/master/jest-actions/ts-jest)

[Jest 官网文档](https://jestjs.io/)

[enzyme](https://github.com/airbnb/enzyme)

