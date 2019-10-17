# 高级类型

介绍五种 TypeScript 高级类型：**交叉类型**、**联合类型**、**索引类型**、**映射类型**、**条件类型**。

这些类型在前面多多少少有被提到过，我们在统一梳理一遍。

## 交叉类型

`&` 符号，多个类型合并为一个类型，新的类型具有所有类型的特性。

```ts
interface DogInterface {
  run (): void
}
interface CatInterface {
  jump (): void
}
let pet: DogInterface & CatInterface = {
  run () {},
  jump () {}
}
```

## 联合类型

取值可以为多种类型中的一种

```ts
let a: number | string = 1 // or '1'
```

字面量联合类型

```ts
let a: 'a' | 'b' | 'c'
let b: 1 | 2 | 3
```

对象联合类型

```ts
interface DogInterface {
  run (): void
}
interface CatInterface {
  jump (): void
}
class Dog implements DogInterface {
  run () {}
  eat () {}
}
class Cat implements CatInterface {
  jump () {}
  eat () {}
}
enum Master { Boy, Girl }
function getPet (master: Master) {
  let pet = master === Master.Boy ? new Dog() : new Cat()
  pet.eat()
  return pet
}
```

`getPet` 方法体内的 `pet` 变量被推断为 `Dog` 和 `Cat` 的联合类型。在类型未确定的情况下，只能访问联合类型的公有成员 `eat` 方法。

## 索引类型

```ts
let obj = {
  a: 1,
  b: 2,
  c: 3
}
function getValues (obj: any, keys: string[]) {
  return keys.map(key => obj[key])
}

getValues(obj, ['a', 'b']) // [1, 2]
getValues(obj, ['d', 'e']) // [undefined, undefined]
```

当 `keys` 传入非 `obj` 中的属性时，会返回 `undefined`。如何进行约束呢？这里就需要索引类型。

索引类型的查询操作符 `keyof T` 表示类型 T 的所有公共属性的字面量联合类型

```ts
interface Obj {
  a: number
  b: string
}
let key: keyof Obj // let key: "a" | "b"
```

索引访问操作符 `T[K]` 对象 T 的属性 K 代表的类型

```ts
let value: Obj['a'] // let value: number
```

泛型约束 `T extends U`

```ts
let obj = {
  a: 1,
  b: 2,
  c: 3
}
function getValues <T, U extends keyof T>(obj: T, keys: U[]): T[U][] {
  return keys.map(key => obj[key])
}

getValues(obj, ['a', 'b']) // [1, 2]
getValues(obj, ['d', 'e']) // Type 'string' is not assignable to type '"a" | "b" | "c"'.
```

## 映射类型

可以讲一个旧的类型生成一个新的类型，比如把一个类型中的所有属性设置成只读。

```ts
interface Obj {
  a: string
  b: number
  c: boolean
}

// 接口所有属性设置成只读
type ReadonlyObj = Readonly<Obj>

// 源码
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 接口所有属性设置成可选
type PartialObj = Partial<Obj>

// 源码
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// 抽取Obj子集
type PickObj = Pick<Obj, 'a' | 'b'>

// 源码
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type RecordObj = Record<'x' | 'y' , Obj>
```

`ts` 还有更多内置的映射类型，路径在 `typescript/lib/lib.es5.d.ts` 内提供参考。

## 条件类型

形式为 `T extends U ? X : Y`，如果类型 `T` 可以赋值为 `U` 结果就为 `X` 反之为 `Y`。

```ts
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends Function ? 'function' :
  'object'

type T1 = TypeName<string> // type T1 = "string"
type T2 = TypeName<string[]> // type T2 = "object"
```

若 `(A | B) extends U ? X : Y` 形式，其约等于 `(A extends U ? X : Y) | (B extends U ? X : Y)`

```ts
type T3 = TypeName<string | number> // type T3 = "string" | "number"
```

利用该特性可实现类型过滤。

```ts
type Diff<T, U> = T extends U ? never : T

type T4 = Diff<'a' | 'b', 'a'> // type T4 = "b"

// 拆解
// Diff<'a', 'a'> | Diff<'b', 'a'>
// never | 'b'
// 'b'
```

根据 `Diff` 再做拓展。

```ts
type NotNull<T> = Diff<T, undefined | null>

type T5 = NotNull<string | number | undefined | null> // type T5 = string | number
```

以上 `Diff` 和 `NotNull` 条件类型官方已经实现了。

:::tip
`Exclude<T, U>` 等于 `Diff<T, U>`

`NonNullable<T>` 等于 `NotNull<T>`
:::

还有更多的官方提供的条件类型，可供大家参考。

```ts
// Extract<T, U>
type T6 = Extract<'a', 'a' | 'b'> // type T6 = "a"

// ReturnType<T>
type T7 = ReturnType<() => string> // type T7 = string
```