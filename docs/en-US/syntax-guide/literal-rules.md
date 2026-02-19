# Literal Rules

TypeGuard supports literal rules for `number`, `boolean`, and `null`:

```json
123
true
false
null
```

Examples:

```ts
compiler.compile({ rule: 123 });
compiler.compile({ rule: true });
compiler.compile({ rule: null });
```

> For string literals, use the string assertion syntax, e.g. `"==hello"`.

