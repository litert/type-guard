# 快速入门

## 安装

```sh
npm i @litert/typeguard -S
```

## 使用

模块导出两个主要的方法 `createCompiler` 和 `createCompiler4JavaScript`。

### createCompiler

该方法创建一个 TypeGuard.Compiler 类型的编译器对象，用于编译规则为特定语言的检查代码。

> 目前仅支持 JavaScript。

```ts
import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler(new TyG.JavaScriptLanguage());

console.log(compiler.compile("uint8")); // 规则：0 ~ 255 的整数。
console.log(compiler.compile(
    ["$.and", "string", "|length eq 32"] // 规则：长度为 32 字符的字符串。
));
console.log(compiler.compile(
    ["$.tuple", "string", "uint"] // 规则：[string, uint] 类型的元组。
));
```

### createCompiler4JavaScript

该方法创建一个 TypeGuard.Compiler4JavaScript 类型的编译器对象。该对象只能编译生成
JavaScript 代码，但是会自动转换成可以执行的 JavaScript 函数。

```ts

import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler(new TyG.JavaScriptLanguage());

const isOptionalString = compiler.compile<string | undefined>(
    ["$.or", "string", "void"]
);

console.log(isOptionalString("hello world"));
console.log(isOptionalString(undefined));
console.log(isOptionalString(null));
```

## 基本类型

TypeGuard 支持大量内置简单类型，比如：

- `string`
- `numeric`（任意数值或者数值字符串）
- `number`（任意数值）
- `float`（不包含 NaN）
- `int`
- `int8`
- `int16`
- `int32`
- `int64`（等价于 int）
- `uint`
- `uint8`
- `uint16`
- `uint32`
- `uint64`（等价于 uint）
- `boolean`
- `array`
- `object`（包含 `null`）
- `valid_object` （不包含 `null`）
- `null`
- `any`（任意类型）
- `false`
- `true`
- `false_value`（任意非真值）
- `true_value`（任意真值）
- `undefined`
- `optional`（等价于 undefined）
- `void`（等价于 undefined）
- ...

```ts
import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler4JavaScript();

const isUInt8 = compiler.compile("uint8");
const isBoolean = compiler.compile("boolean");

console.log(isUInt8(123));
console.log(isUInt8(255));
console.log(isUInt8(256)); // 超出 UInt8 的范围
console.log(isBoolean(true));
console.log(isBoolean(null)); // null 不是 boolean 型
console.log(isBoolean(false));
console.log(isBoolean(123)); // 123 不是 boolean 型
```

## 对象

```ts
import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler4JavaScript();

const isPerson = compiler.compile({
    "name": "string",
    "age": ["$.and", "uint", "|value between 1 100"]
});

console.log(isPerson({
    "name": "Angus",
    "age": 24
}));

console.log(isPerson({
    "name": "Edith"
    // 缺少 age
}));

console.log(isPerson({
    "name": "Mike",
    "age": 101 // age 取值范围不对
}));
```

（未完待续，暂时可以参考 `sources/tests.ts`）
