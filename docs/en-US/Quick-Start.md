# Quick Start

This tutorial helps you complete three things with TypeGuard in the shortest time: install it, generate JavaScript validator code, and use `InlineCompiler` directly in Node.js.

## Table of Contents

- [1. Requirements](#1-requirements)
- [2. Installation](#2-installation)
- [3. Your First Checker (InlineCompiler)](#3-your-first-checker-inlinecompiler)
- [4. Generate JavaScript Checker Source (Compiler)](#4-generate-javascript-checker-source-compiler)
- [5. Predefined Types and Reuse](#5-predefined-types-and-reuse)
- [6. Error Tracing (traceErrors)](#6-error-tracing-traceerrors)

## 1. Requirements

- TypeScript `v3.3.x` or later
- ECMAScript `2017` or later

## 2. Installation

```bash
npm i @litert/typeguard --save
```

## 3. Your First Checker (InlineCompiler)

`InlineCompiler` compiles rules directly into executable functions, which is ideal for calling from application code.

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

## 4. Generate JavaScript Checker Source (Compiler)

If you want the “generated validation expression source”, use `createCompiler` along with the JavaScript language builder.

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

`result.source` is the core validation expression itself. You can wrap it into an executor or embed it into a larger code-generation workflow.

## 5. Predefined Types and Reuse

You can define a predefined type within a rule via `$.type`, and reference it later via `@TypeName`.

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

You can also register a JavaScript callback type directly (commonly used for business-specific custom rules):

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

## 6. Error Tracing (traceErrors)

When you set `traceErrors: true`, the generated checker function accepts a second parameter to receive failure paths.

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
console.log(traces);  // e.g.: ["data[\"profile\"][\"emails\"][1]"]
```

When you use TypeGuard at API gateways, form backends, or message consumers, enabling `traceErrors` by default is recommended so you can quickly locate which field failed.
