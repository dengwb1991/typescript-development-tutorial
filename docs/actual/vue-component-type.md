# Vue 组件与类型

## 介绍

在 Vue2.x 中使用 Typescript 开发中，我们通常会使用两种依赖库 `vue-class-component` 和 `vue-property-decorator` 二选一.

[vue-class-component](https://github.com/vuejs/vue-class-componen) 可以在 Vue 组件中使用类修饰器。

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) 该库完全依赖于 `vue-class-component`，在该库的基础上拓展了如 @Prop、@Inject、@Emit 等操作符。

虽然 `vue-property-decorator` 库依赖于 `vue-class-component` 库，但在使用 `vue-property-decorator` 库时，不需要安装 `vue-class-component`.

本文主要介绍 `vue-property-decorator` 库的常用 api.

## 链接

[源码地址](https://github.com/dengwb1991/typescript-in-action/tree/master/vue-actions/ts-vue-component)

## 安装

安装 `vue-property-decorator` 库

```bash
$ yarn add -D vue-property-decorator
```

在 `tsconfig.json` 中将 `experimentalDecorators` 设置为 **true**. 否则编译器不识别装饰器. 

该库提供装饰器有: @Component、@Model、@Watch、@Provide、@Inject、@Emit、@Ref.

## @Component

声明组件装饰器. `vue-property-decorator` 库中的 @Component 修饰器，使用的 `vue-class-component` 库中的 @Component.

### JS 与 TS 对比

**JS中：**

```js
// hello.vue
<template>
  <h1>Hello {{ name }}</h1>
</template>

<script>
export default {
  data () {
    return {
      name: 'Typescript'
    }
  }
}
</script>
```

```js
// index.vue
<template>
  <Hello/>
</template>

<script>
import Hello from './hello.vue'
export default {
  components: {
    Hello
  }
}
</script>
```

**TS中：**

```ts
// hello.vue
<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default class Hello extends Vue {
  private name:string = 'Typescript'
}
</script>
```

```ts
// index.vue
<script lang="ts">
import Hello from './hello.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({components: { Hello }})
export default class componentExample extends Vue {
}
</script>
```

在使用该库时，组件导出为一个 Class 类，在类中可以写 created、mounted 函数，声明变量.

@Component 修饰器中可以声明 `components`、`computed`、`created`、`mounted` 等函数.

若想在 Class 类中写计算属性如下：

```ts
@Component
export default class Hello extends AppProps {
  // initial data
  msg: number = 123

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }
}
```

每一个 `class` 上必须写 `@Component`

## Mixins

辅助函数装饰器，同 @Component 一致，使用 `vue-class-component` 库中的 mixins.

定义一个 mixin.ts

```ts
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class MyMixins extends Vue {
  mixinValue: string = 'I am mixins'
}
```

使用：

```ts
import { Component, Mixins } from 'vue-property-decorator'
import MyMixin from './mixin'

@Component
export default class Index extends Mixins(MyMixin) {
  created () {
    console.log(this.mixinValue)
  }
}
```

## @Prop & @PropSync

父子组件通讯装饰器.

### @Prop

用法 @Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator.

```ts
export default class PropsHello extends Vue {
  @Prop(Number)
  readonly propA: number | undefined

  @Prop({ type: String, default: 'default value' })
  readonly propB!: string

  @Prop([String, Boolean])
  propC: string | boolean | undefined
}
```

@Prop 可以定义类型、类型数组 或 配置对象. 如果参数未设置默认值，需要定义 undefined.

当为参数设置默认值时，如 `propB`. 未添加 ! 这个标志时，会爆出一下错误

```bash
TS2564: Property 'propB' has no initializer and is not definitely assigned in the constructor.
```

当添加了 ! 标志. 该参数会避开 Typescript 校验机制，如果定义了 Number 类型，其实你可以传入 string、boolean 类型. 或者不定义任何类型.


### @PropSync

用法 @Prop(propName: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator.

**TS中：**

```ts
import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @PropSync('name', { type: String }) syncedName!: string
}
```

**JS中：**

```js
export default {
  props: {
    name: {
      type: String
    }
  },
  computed: {
    syncedName: {
      get() {
        return this.name
      },
      set(value) {
        this.$emit('update:name', value)
      }
    }
  }
}
```

## @Model

允许一个自定义组件在使用 v-model 时定制 prop 和 event。默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。

用法：@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator

**TS中：**

```ts
import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean
}
```

**JS中：**

```js
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    }
  }
}
```

## @Watch

用法：@Watch(path: string, options: WatchOptions = {}) decorator

**TS中：**

```ts
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) {}

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) {}
}
```

**JS中：**

```js
export default {
  watch: {
    child: [
      {
        handler: 'onChildChanged',
        immediate: false,
        deep: false
      }
    ],
    person: [
      {
        handler: 'onPersonChanged1',
        immediate: true,
        deep: true
      },
      {
        handler: 'onPersonChanged2',
        immediate: false,
        deep: false
      }
    ]
  },
  methods: {
    onChildChanged(val, oldVal) {},
    onPersonChanged1(val, oldVal) {},
    onPersonChanged2(val, oldVal) {}
  }
}
```

## @Provide & @Inject

`provide` 和 `inject` 允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，实现**跨级访问顶层组件**的数据.

用法：@Provide(key?: string | symbol) / @Inject(options?: { from?: InjectKey, default?: any } | InjectKey) decorator

**TS中：**

```ts
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'

const symbol = Symbol('baz')

@Component
export class MyComponent extends Vue {
  @Inject() readonly foo!: string
  @Inject('bar') readonly bar!: string
  @Inject({ from: 'optional', default: 'default' }) readonly optional!: string
  @Inject(symbol) readonly baz!: string

  @Provide() foo = 'foo'
  @Provide('bar') baz = 'bar'
}
```

**JS中：**

```js
const symbol = Symbol('baz')

export const MyComponent = Vue.extend({
  inject: {
    foo: 'foo',
    bar: 'bar',
    optional: { from: 'optional', default: 'default' },
    [symbol]: symbol
  },
  data() {
    return {
      foo: 'foo',
      baz: 'bar'
    }
  },
  provide() {
    return {
      foo: this.foo,
      bar: this.baz
    }
  }
})
```

如果希望顶层组件中提供的值被修改，子孙组件注入的值同样更改的话，使用 `ProvideReactive` 和 `ProvideReactive`

用法：@ProvideReactive(key?: string | symbol) / @InjectReactive(options?: { from?: InjectKey, default?: any } | InjectKey) decorator

```ts
const key = Symbol()
@Component
class ParentComponent extends Vue {
  @ProvideReactive() one = 'value'
  @ProvideReactive(key) two = 'value'
}

@Component
class ChildComponent extends Vue {
  @InjectReactive() one!: string
  @InjectReactive(key) two!: string
}
```

## @Emit

用法：@Emit(event?: string) decorator

**TS中：**

```ts
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  count = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }

  @Emit()
  returnValue() {
    return 10
  }

  @Emit()
  onInputChange(e) {
    return e.target.value
  }

  @Emit()
  promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}
```

**JS中：**

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })

      promise.then(value => {
        this.$emit('promise', value)
      })
    }
  }
}
```

## @Ref

用法：@Ref(refKey?: string) decorator

**TS中：**

```ts
import { Vue, Component, Ref } from 'vue-property-decorator'

import AnotherComponent from '@/path/to/another-component.vue'

@Component
export default class YourComponent extends Vue {
  @Ref() readonly anotherComponent!: AnotherComponent
  @Ref('aButton') readonly button!: HTMLButtonElement
}
```

**JS中：**

```js
export default {
  computed() {
    anotherComponent: {
      cache: false,
      get() {
        return this.$refs.anotherComponent as AnotherComponent
      }
    },
    button: {
      cache: false,
      get() {
        return this.$refs.aButton as HTMLButtonElement
      }
    }
  }
}
```
