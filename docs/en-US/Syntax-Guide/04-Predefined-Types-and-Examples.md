## 9. Predefined Types and Argument Calls

### 9.1 Inline definition

```json
{
    "a": ["$.type", "MyType", "string(1,32)"],
    "b": "@MyType"
}
```

Note that within the same compiler context, an inline predefined type name **must be unique** and cannot be defined more than once with the same name. Therefore, registering and managing custom predefined types in code is the more common approach, especially when you need to reuse or share type definitions.

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

Allowed characters in predefined type names: letters, digits, underscore, colon, hyphen, dot.

## 10. Practical Examples

### 10.1 API input validation

```json
["$.strict", {
    "page?": "uint32",
    "pageSize?": "uint8(1,100)",
    "query?": "string(0,128)",
    "filters->{}?": "string"
}]
```

### 10.2 Form string input validation

```json
["$.string", ["$.strict", {
    "age": "uint8(1,120)",
    "email": "~=^[^@]+@[^@]+\\.[^@]+$"
}]]
```

### 10.3 Config file validation (with enum)

```json
["$.equal", {
    "mode": ["$.enum", "dev", "test", "prod"],
    "port": "uint16(1,65535)",
    "features->{}?": "boolean"
}]
```
