# API Reference

本文档聚焦 TypeGuard 的编译 API：`Compiler`、`InlineCompiler`、语言构建器以及公共类型。

## 目录

- [1. 模块导出](#1-模块导出)
- [2. 工厂函数](#2-工厂函数)
- [3. IInlineCompiler](#3-iinlinecompiler)
- [4. ICompiler](#4-icompiler)
- [5. 选项与结果类型](#5-选项与结果类型)
- [6. 类型别名](#6-类型别名)
- [7. 推荐使用模式](#7-推荐使用模式)

## 1. 模块导出

源码入口：

- [src/lib/index.ts](../../src/lib/index.ts)
- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)
- [src/lib/Compiler.ts](../../src/lib/Compiler.ts)
- [src/lib/Common.ts](../../src/lib/Common.ts)

导出内容：

- `function createInlineCompiler`
- `function createCompiler`
- `function createJavaScriptLanguageBuilder`
- `interface IInlineCompiler`
- `interface ICompiler`
- `interface ICompileOptions`
- `interface ICompilerOptions`
- `interface IInlineCompileOptions`
- `interface ICompileResult`
- `interface ILanguageBuilder`
- `type ITypeChecker<T>`
- `type IPreDefinedTypeChecker<T>`
- `type TypeChecker<T>` (已弃用)

## 2. 工厂函数

### 2.1 `createInlineCompiler`

```ts
function createInlineCompiler(opts?: ICompilerOptions): IInlineCompiler;
```

**Description**

创建一个“可直接执行”的内联编译器。规则会被编译并包装为 JavaScript 函数。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `opts` | `ICompilerOptions` | 否 | 编译器全局选项，目前支持 `ignoreInvalidArgs` |

**Return Value**

- `IInlineCompiler`

**Exceptions**

- 规则语法错误会在 `compile()` 时抛出 `TypeError` / `SyntaxError` / `RangeError`

**Change History**

- `v1.4.2`：支持通过 `opts.ignoreInvalidArgs` 控制无效参数行为

**Examples**

```ts
import { createInlineCompiler } from '@litert/typeguard';

const c = createInlineCompiler({ ignoreInvalidArgs: false });
const isId = c.compile<number>({ rule: 'uint32' });
```

---

### 2.2 `createJavaScriptLanguageBuilder`

```ts
function createJavaScriptLanguageBuilder(): ILanguageBuilder;
```

**Description**

创建 JavaScript 目标语言构建器，用于生成 JavaScript 表达式片段。

**Parameters**

- 无

**Return Value**

- `ILanguageBuilder`

**Exceptions**

- 无

**Change History**

- `v1.0.0`：随新编译架构提供

**Examples**

```ts
import { createJavaScriptLanguageBuilder } from '@litert/typeguard';

const lang = createJavaScriptLanguageBuilder();
```

---

### 2.3 `createCompiler`

```ts
function createCompiler(
    lang: ILanguageBuilder,
    opts?: ICompilerOptions
): ICompiler;
```

**Description**

创建底层编译器，仅负责“规则 -> 源码结构”的编译，不直接返回可执行函数。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `lang` | `ILanguageBuilder` | 是 | 目标语言构建器 |
| `opts` | `ICompilerOptions` | 否 | 编译器选项 |

**Return Value**

- `ICompiler`

**Exceptions**

- 规则语法错误会在 `compile()` 时抛出

**Change History**

- `v1.4.2`：支持 `ignoreInvalidArgs`

**Examples**

```ts
import {
    createCompiler,
    createJavaScriptLanguageBuilder
} from '@litert/typeguard';

const compiler = createCompiler(createJavaScriptLanguageBuilder());
const code = compiler.compile({ rule: 'string(1,32)' });
```

## 3. IInlineCompiler

接口定义来源：

- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)

### 3.1 `compile<T>(options)`

```ts
compile<T>(options: IInlineCompileOptions): ITypeChecker<T>;
```

**Description**

编译规则并返回可执行校验函数，函数签名为：

```ts
type ITypeChecker<T> = (v: unknown, errorTraces?: string[]) => v is T;
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `options.rule` | `any` | 是 | 规则定义 |
| `options.name` | `string` | 否 | 将规则命名为自定义类型 |
| `options.traceErrors` | `boolean` | 否 | 是否启用失败路径追踪 |
| `options.stopOnEntry` | `boolean` | 否 | 生成函数入口处插入 `debugger` |

**Return Value**

- `ITypeChecker<T>`

**Exceptions**

- 规则非法、类型冲突、参数范围错误时抛出异常

**Change History**

- `v1.3.0`：支持 `traceErrors`
- `v1.0.0`：提供基础编译能力

**Examples**

```ts
const checker = compiler.compile<{ name: string }>({
    traceErrors: true,
    rule: { name: 'string' }
});

const traces: string[] = [];
checker({ name: 123 }, traces); // false
```

---

### 3.2 `addPredefinedType(name, checker)`

```ts
addPredefinedType<T>(name: string, checker: IPreDefinedTypeChecker<T>): this;
```

**Description**

注册 JavaScript 回调型自定义类型处理器，可在规则里通过 `@name(...)` 调用。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 自定义类型名称（不含 `@`） |
| `checker` | `IPreDefinedTypeChecker<T>` | 是 | 回调函数 `(v, ...args) => boolean` |

**Return Value**

- `this`（便于链式调用）

**Exceptions**

- `name` 非法时抛出 `TypeError`

**Change History**

- `v1.2.0`：新增此 API

**Examples**

```ts
compiler
    .addPredefinedType('trim_string', (v: unknown, min = 0) =>
        typeof v === 'string' && v.trim().length >= min
    )
    .addPredefinedType('is_hello', (v: unknown) => v === 'hello');
```

---

### 3.3 `getPredefinedType(name)`

```ts
getPredefinedType<T>(name: string): ITypeChecker<T>;
```

**Description**

获取已经存在的自定义类型校验函数。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 自定义类型名称 |

**Return Value**

- `ITypeChecker<T>`

**Exceptions**

- 类型不存在时抛出 `Error`

**Change History**

- `v1.0.0`

**Examples**

```ts
const fn = compiler.getPredefinedType('trim_string');
```

---

### 3.4 `hasPredefinedType(name)`

```ts
hasPredefinedType(name: string): boolean;
```

**Description**

判断自定义类型是否已注册或已编译。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 自定义类型名称 |

**Return Value**

- `boolean`

**Exceptions**

- 无

**Change History**

- `v1.0.0`

**Examples**

```ts
if (!compiler.hasPredefinedType('ipv4_address')) {
    // register or compile it
}
```

---

### 3.5 `detectUndefinedTypes()`

```ts
detectUndefinedTypes(): string[];
```

**Description**

返回“被引用但未定义”的自定义类型名称列表。

**Parameters**

- 无

**Return Value**

- `string[]`

**Exceptions**

- 无

**Change History**

- `v1.0.0`

**Examples**

```ts
compiler.compile({ rule: '@not_exists_type' });
console.log(compiler.detectUndefinedTypes());
```

## 4. ICompiler

接口定义来源：

- [src/lib/Common.ts](../../src/lib/Common.ts)
- [src/lib/Compiler.ts](../../src/lib/Compiler.ts)

### 4.1 `compile(options)`

```ts
compile(options: ICompileOptions): ICompileResult;
```

**Description**

把规则编译为目标语言代码描述（参数列表、源码、自定义类型依赖等）。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `options.rule` | `any` | 是 | 规则定义 |
| `options.name` | `string` | 否 | 将规则注册为自定义类型 |
| `options.traceErrors` | `boolean` | 否 | 生成失败追踪能力 |

**Return Value**

- `ICompileResult`

**Exceptions**

- 语法错误、未知类型、非法参数时抛出异常

**Change History**

- `v1.3.0`：支持 `traceErrors`

**Examples**

```ts
const result = compiler.compile({
    traceErrors: true,
    rule: {
        id: 'uint32',
        title: 'string(1,128)'
    }
});
```

---

### 4.2 `getPredefinedType(name)`

```ts
getPredefinedType(name: string): ICompileResult | null;
```

**Description**

获取已通过 `$.type` 编译并缓存的自定义类型结果。

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 自定义类型名称 |

**Return Value**

- `ICompileResult | null`

**Exceptions**

- 无

**Change History**

- `v1.0.0`

**Examples**

```ts
compiler.compile({
    rule: ['$.type', 'MyType', 'string(1,32)']
});

const typeResult = compiler.getPredefinedType('MyType');
```

## 5. 选项与结果类型

定义来源：

- [src/lib/Common.ts](../../src/lib/Common.ts)
- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)

### 5.1 `ICompilerOptions`

```ts
interface ICompilerOptions {
    ignoreInvalidArgs?: boolean;
}
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ignoreInvalidArgs` | `boolean` | `true` | 对不接收参数的内建类型（如 `int8(1,2)`）是否忽略多余参数 |

> 建议：新项目设为 `false`，尽早暴露错误规则。

### 5.2 `ICompileOptions`

```ts
interface ICompileOptions {
    rule: any;
    name?: string;
    traceErrors?: boolean;
}
```

### 5.3 `IInlineCompileOptions`

```ts
interface IInlineCompileOptions extends ICompileOptions {
    stopOnEntry?: boolean;
}
```

### 5.4 `ICompileResult`

```ts
interface ICompileResult {
    arguments: ICompileOutputArgument[];
    typeSlotName: string;
    source: string;
    referredTypes: string[];
}
```

| 字段 | 说明 |
| --- | --- |
| `arguments` | 生成函数参数列表（名称、类型、默认值） |
| `typeSlotName` | 自定义类型槽位变量名 |
| `source` | 核心校验表达式源码 |
| `referredTypes` | 引用到的自定义类型名 |

## 6. 类型别名

### 6.1 `ITypeChecker<T>`

```ts
type ITypeChecker<T> = (v: unknown, errorTraces?: string[]) => v is T;
```

### 6.2 `IPreDefinedTypeChecker<T>`

```ts
type IPreDefinedTypeChecker<T> = (v: unknown, ...args: any[]) => v is T;
```

### 6.3 `TypeChecker<T>`（已弃用）

```ts
/** @deprecated Use ITypeChecker instead. */
type TypeChecker<T> = ITypeChecker<T>;
```

## 7. 推荐使用模式

- 业务运行态：优先使用 `createInlineCompiler()`。
- 代码生成态：使用 `createCompiler(createJavaScriptLanguageBuilder())`。
- 若希望尽早发现错误规则：`createInlineCompiler({ ignoreInvalidArgs: false })`。
- 若需要可观测性：编译时开启 `traceErrors: true`，调用时传入 `string[]` 收集失败路径。
