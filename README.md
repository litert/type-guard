# LiteRT/TypeGuard

[![npm version](https://img.shields.io/npm/v/@litert/typeguard.svg?colorB=brightgreen)](https://www.npmjs.com/package/@litert/typeguard "Stable Version")
[![License](https://img.shields.io/npm/l/@litert/typeguard.svg?maxAge=2592000?style=plastic)](https://github.com/litert/typeguard/blob/master/LICENSE)
[![node](https://img.shields.io/node/v/@litert/typeguard.svg?colorB=brightgreen)](https://nodejs.org/)
[![GitHub issues](https://img.shields.io/github/issues/litert/type-guard.svg)](https://github.com/litert/type-guard/issues)
[![GitHub Releases](https://img.shields.io/github/release/litert/type-guard.svg)](https://github.com/litert/type-guard/releases "Stable Release")

An easy and powerful data validation code generator by JavaScript.

## Requirement

- TypeScript v5.0.x (or newer)
- ECMAScript 2017 (or newer)

## Installation

Install by NPM:

```sh
npm i @litert/typeguard --save
```

## Quick Usage

```ts
import { createInlineCompiler } from '@litert/typeguard';

const compiler = createInlineCompiler();

const isUser = compiler.compile<{ id: number; name: string }>({
	rule: {
		id: 'uint32',
		name: 'string(1,64)'
	}
});

console.log(isUser({ id: 1, name: 'Alice' })); // true
```

## Document

- [English (en-US)](./docs/en-US/README.md)
- [简体中文](./docs/zh-CN/README.md)

## License

This library is published under [Apache-2.0](./LICENSE) license.
