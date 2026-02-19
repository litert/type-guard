# API Reference

This document focuses on TypeGuard’s compilation APIs: `Compiler`, `InlineCompiler`, language builders, and the shared public types.

## Table of Contents

- [1. Module Exports](#1-module-exports)
- [2. Factory Functions](#2-factory-functions)
- [3. IInlineCompiler](#3-iinlinecompiler)
- [4. ICompiler](#4-icompiler)
- [5. Options and Result Types](#5-options-and-result-types)
- [6. Type Aliases](#6-type-aliases)
- [7. Recommended Usage Patterns](#7-recommended-usage-patterns)

## 1. Module Exports

Source entry points:

- [src/lib/index.ts](../../src/lib/index.ts)
- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)
- [src/lib/Compiler.ts](../../src/lib/Compiler.ts)
- [src/lib/Common.ts](../../src/lib/Common.ts)

Exports:

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
- `type TypeChecker<T>` (deprecated)

## 2. Factory Functions

### 2.1 `createInlineCompiler`

```ts
function createInlineCompiler(opts?: ICompilerOptions): IInlineCompiler;
```

**Description**

Creates an “executable” inline compiler. Rules are compiled and wrapped into JavaScript functions.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `opts` | `ICompilerOptions` | No | Global compiler options. Currently supports `ignoreInvalidArgs`. |

**Return Value**

- `IInlineCompiler`

**Exceptions**

- Syntax errors in rules may throw `TypeError` / `SyntaxError` / `RangeError` when calling `compile()`.

**Change History**

- `v1.4.2`: Supports controlling invalid-argument behavior via `opts.ignoreInvalidArgs`.

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

Creates the JavaScript target language builder, used to generate JavaScript expression fragments.

**Parameters**

- None

**Return Value**

- `ILanguageBuilder`

**Exceptions**

- None

**Change History**

- `v1.0.0`: Provided with the new compiler architecture.

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

Creates the low-level compiler. It only compiles “rule → source structure” and does not directly return an executable function.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `lang` | `ILanguageBuilder` | Yes | Target language builder |
| `opts` | `ICompilerOptions` | No | Compiler options |

**Return Value**

- `ICompiler`

**Exceptions**

- Rule syntax errors may throw when calling `compile()`.

**Change History**

- `v1.4.2`: Supports `ignoreInvalidArgs`.

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

Interface definition source:

- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)

### 3.1 `compile<T>(options)`

```ts
compile<T>(options: IInlineCompileOptions): ITypeChecker<T>;
```

**Description**

Compiles a rule and returns an executable checker function with the signature:

```ts
type ITypeChecker<T> = (v: unknown, errorTraces?: string[]) => v is T;
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `options.rule` | `any` | Yes | Rule definition |
| `options.name` | `string` | No | Assign a name for the rule as a predefined type |
| `options.traceErrors` | `boolean` | No | Enable failure-path tracing |
| `options.stopOnEntry` | `boolean` | No | Insert `debugger` at the function entry |

**Return Value**

- `ITypeChecker<T>`

**Exceptions**

- Throws on invalid rules, type conflicts, or out-of-range arguments.

**Change History**

- `v1.3.0`: Supports `traceErrors`
- `v1.0.0`: Basic compilation capability

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

Registers a JavaScript callback-based predefined type handler, which can be invoked in rules via `@name(...)`.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Predefined type name (without `@`) |
| `checker` | `IPreDefinedTypeChecker<T>` | Yes | Callback function `(v, ...args) => boolean` |

**Return Value**

- `this` (for chaining)

**Exceptions**

- Throws `TypeError` if `name` is invalid.

**Change History**

- `v1.2.0`: Added this API

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

Gets an existing predefined type checker function.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Predefined type name |

**Return Value**

- `ITypeChecker<T>`

**Exceptions**

- Throws `Error` if the type does not exist.

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

Checks whether a predefined type has been registered or compiled.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Predefined type name |

**Return Value**

- `boolean`

**Exceptions**

- None

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

Returns the list of predefined type names that are referenced but not defined.

**Parameters**

- None

**Return Value**

- `string[]`

**Exceptions**

- None

**Change History**

- `v1.0.0`

**Examples**

```ts
compiler.compile({ rule: '@not_exists_type' });
console.log(compiler.detectUndefinedTypes());
```

## 4. ICompiler

Interface definition source:

- [src/lib/Common.ts](../../src/lib/Common.ts)
- [src/lib/Compiler.ts](../../src/lib/Compiler.ts)

### 4.1 `compile(options)`

```ts
compile(options: ICompileOptions): ICompileResult;
```

**Description**

Compiles a rule into a target-language code description (argument list, source, predefined type dependencies, etc.).

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `options.rule` | `any` | Yes | Rule definition |
| `options.name` | `string` | No | Register the rule as a predefined type |
| `options.traceErrors` | `boolean` | No | Generate failure-tracing capability |

**Return Value**

- `ICompileResult`

**Exceptions**

- Throws on syntax errors, unknown types, or invalid arguments.

**Change History**

- `v1.3.0`: Supports `traceErrors`

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

Gets the compile result of a predefined type that has been compiled and cached via `$.type`.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Predefined type name |

**Return Value**

- `ICompileResult | null`

**Exceptions**

- None

**Change History**

- `v1.0.0`

**Examples**

```ts
compiler.compile({
    rule: ['$.type', 'MyType', 'string(1,32)']
});

const typeResult = compiler.getPredefinedType('MyType');
```

## 5. Options and Result Types

Definition source:

- [src/lib/Common.ts](../../src/lib/Common.ts)
- [src/lib/InlineCompiler.ts](../../src/lib/InlineCompiler.ts)

### 5.1 `ICompilerOptions`

```ts
interface ICompilerOptions {
    ignoreInvalidArgs?: boolean;
}
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `ignoreInvalidArgs` | `boolean` | `true` | Whether to ignore extra arguments passed to built-in types that do not accept arguments (e.g. `int8(1,2)`) |

> [!TIP]
> For new projects, set this to `false` to surface invalid rules earlier.

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

| Field | Description |
| --- | --- |
| `arguments` | Generated function parameter list (name, type, default value) |
| `typeSlotName` | Slot variable name for predefined types |
| `source` | Core validation expression source |
| `referredTypes` | Names of referenced predefined types |

## 6. Type Aliases

### 6.1 `ITypeChecker<T>`

```ts
type ITypeChecker<T> = (v: unknown, errorTraces?: string[]) => v is T;
```

### 6.2 `IPreDefinedTypeChecker<T>`

```ts
type IPreDefinedTypeChecker<T> = (v: unknown, ...args: any[]) => v is T;
```

### 6.3 `TypeChecker<T>` (deprecated)

```ts
/** @deprecated Use ITypeChecker instead. */
type TypeChecker<T> = ITypeChecker<T>;
```

## 7. Recommended Usage Patterns

- Runtime in application code: prefer `createInlineCompiler()`.
- Code generation: use `createCompiler(createJavaScriptLanguageBuilder())`.
- To catch invalid rules earlier: `createInlineCompiler({ ignoreInvalidArgs: false })`.
- For observability: enable `traceErrors: true` during compilation, and pass a `string[]` at runtime to collect failure paths.
