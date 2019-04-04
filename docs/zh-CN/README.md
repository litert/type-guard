# 快速入门

## 0. 安装

推荐通过npm安装

```sh
npm i -S @litert/typeguard
```

在 Node.js 中使用：

```ts
import * as TyG from "@litert/typeguard";

const tgc = createJavaScriptCompiler();

const isValidString = tgc.compile(
  "string(1,255)"
);

console.log(isValidString("FF")); // true
console.log(isValidString("")); // false
console.log(isValidString(null)); // false
```

## 1. 语法简介

[点击查看](./Rules.md)

## 2. 接口说明

[点击查看](./APIs.md)

