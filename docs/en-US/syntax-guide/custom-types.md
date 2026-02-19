# Custom Types and Argument Calls

### 9.1 Inline definition

```json
{
    "a": ["$.type", "MyType", "string(1,32)"],
    "b": "@MyType"
}
```

Note that within the same compiler context, an inline custom type name **must be unique** and cannot be defined more than once with the same name. Therefore, registering and managing custom types in code is the more common approach, especially when you need to reuse or share type definitions.

### 9.2 JavaScript registration

```ts
compiler.addPredefinedType('enum', (v: unknown, ...args: unknown[]) =>
    args.includes(v)
);
```

Call it in rules:

```json
"@enum(1, 2, 3, \"ok\", true, null)"
```

### 9.3 Literal argument types

Arguments in `@TypeName(...)` only support:

- Strings (single quotes or double quotes)
- Numbers (including negatives and hex)
- Booleans
- `null`

Allowed characters in custom type names: letters, digits, underscore, colon, hyphen, dot.

