# Quick Start

本教程用于帮助你在最短时间内完成 TypeGuard 的三件事：安装、生成 JavaScript 校验器代码、在 Node.js 中直接使用 `InlineCompiler`。

## 目录

- [1. 环境要求](#1-环境要求)
- [2. 安装](#2-安装)
- [3. 第一个校验器（InlineCompiler）](#3-第一个校验器inlinecompiler)
- [4. 生成 JavaScript 校验器源码（Compiler）](#4-生成-javascript-校验器源码compiler)
- [5. 预定义类型与复用](#5-预定义类型与复用)
- [6. 错误追踪（traceErrors）](#6-错误追踪traceerrors)

## 1. 环境要求

- TypeScript `v3.3.x` 或更高版本
- ECMAScript `2017` 或更高版本

## 2. 安装

```bash
npm i @litert/typeguard --save
```

## 3. 第一个校验器（InlineCompiler）

`InlineCompiler` 会把规则直接编译成可执行函数，适合在业务代码里直接调用。

```ts
import { createInlineCompiler } from '@litert/typeguard';

const compiler = createInlineCompiler();

const isUser = compiler.compile<{
    id: number;
    name: string;
    tags?: string[];
}>({
    rule: {
        id: 'uint32',
        name: 'string(1,64)',
        'tags?': 'string[]'
    }
});

console.log(isUser({ id: 1001, name: 'Alice' })); // true
console.log(isUser({ id: -1, name: 'Alice' }));   // false
```

## 4. 生成 JavaScript 校验器源码（Compiler）

如果你希望拿到“生成后的校验表达式源码”，可以使用 `createCompiler` + JavaScript Language Builder。

```ts
import {
    createCompiler,
    createJavaScriptLanguageBuilder
} from '@litert/typeguard';

const lang = createJavaScriptLanguageBuilder();
const compiler = createCompiler(lang);

const result = compiler.compile({
    rule: {
        id: 'uint32',
        name: 'string(1,64)'
    }
});

console.log('Arguments:', result.arguments);
console.log('Type Slot:', result.typeSlotName);
console.log('Source:', result.source);
console.log('Referred Types:', result.referredTypes);
```

`result.source` 是校验表达式本体，可用于进一步封装执行器或嵌入代码生成流程。

## 5. 预定义类型与复用

你可以在规则里通过 `$.type` 定义预定义类型，再通过 `@类型名` 引用。

```ts
import { createInlineCompiler } from '@litert/typeguard';

const compiler = createInlineCompiler();

const checker = compiler.compile({
    rule: {
        address: ['$.type', 'IPv4', 'string'],
        gateway: '@IPv4'
    }
});
```

也可以直接注册 JavaScript 回调类型（常见于业务自定义规则）：

```ts
import { createInlineCompiler } from '@litert/typeguard';

const compiler = createInlineCompiler();

compiler.addPredefinedType('trim_string', (
    v: unknown,
    minLen: number = 0,
    maxLen?: number
): v is string => {

    if (typeof v !== 'string') {
        return false;
    }

    const len = v.trim().length;
    return len >= minLen && len <= (maxLen ?? len);
});

const isName = compiler.compile<string>({
    rule: '@trim_string(2, 16)'
});
```

## 6. 错误追踪（traceErrors）

设置 `traceErrors: true` 后，校验函数第二个参数可接收失败路径。

```ts
import { createInlineCompiler } from '@litert/typeguard';

const compiler = createInlineCompiler();

const isPayload = compiler.compile({
    traceErrors: true,
    rule: {
        profile: {
            age: 'uint8',
            emails: 'string[]'
        }
    }
});

const traces: string[] = [];
const ok = isPayload({
    profile: {
        age: 20,
        emails: ['ok@example.com', 100]
    }
}, traces);

console.log(ok);      // false
console.log(traces);  // 例如: ["data[\"profile\"][\"emails\"][1]"]
```

当你在接口网关、表单后端或消息消费端使用 TypeGuard 时，建议默认开启 `traceErrors`，便于快速定位失败字段。
