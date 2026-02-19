# 字面量规则

TypeGuard 支持 `number`、`boolean`、`null` 字面量规则：

```json
123
true
false
null
```

示例：

```ts
compiler.compile({ rule: 123 });
compiler.compile({ rule: true });
compiler.compile({ rule: null });
```

> 字符串字面量请使用字符串断言语法，如 `"==hello"`。

