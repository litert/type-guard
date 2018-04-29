# 快速入门

## 安装

```sh
npm i @litert/typeguard -S
```

## 使用

模块导出两个主要的方法 `createCompiler` 和 `createCompiler4JavaScript`。

### createCompiler

该方法创建一个 `TypeGuard.Compiler` 类型的编译器对象，用于编译规则为特定语言的校验
代码。

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

该方法创建一个 `TypeGuard.Compiler4JavaScript` 类型的编译器对象。该对象只能编译生成
JavaScript 代码，但是会自动转换成可以执行的 JavaScript 函数。

```ts

import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler4JavaScript();

const isOptionalString = compiler.compile<string | undefined>(
    ["$.or", "string", "void"]
);

console.log(isOptionalString("hello world"));
console.log(isOptionalString(undefined));
console.log(isOptionalString(null));
```

更多请查看[语法说明](./syntax.md)。
