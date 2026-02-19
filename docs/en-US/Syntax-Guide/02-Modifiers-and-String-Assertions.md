## 5. Modifiers (`$.xxx`)

### 5.1 `$.or`

`$.or` represents a **union type**: the value passes validation if it satisfies any one of the sub-rules. This is TypeGuard’s **default modifier**, so it can be omitted.

**Basic syntax**

```json
["$.or", "string", "int"]
["string", "int"]  // Omit $.or; the effect is the same
```

**Practical examples**

```typescript
// Accept a string or a number
compiler.compile({ rule: ['string', 'number'] });
// ✓ "hello"
// ✓ 123
// ✗ true

// Multi-type config value
compiler.compile({ rule: ['string', 'boolean', 'null'] });
// ✓ "enabled"
// ✓ true
// ✓ null

// Union of object shapes
compiler.compile({
    rule: [
        { type: '==success', data: 'string' },
        { type: '==error', code: 'uint32' }
    ]
});
// ✓ { type: "success", data: "ok" }
// ✓ { type: "error", code: 404 }
```

### 5.2 `$.and`

`$.and` represents an **intersection condition**: the value must satisfy **all** sub-rules to pass. It is commonly used to combine type checks with numeric filters, string assertions, and other constraints.

**Basic syntax**

```json
["$.and", rule1, rule2, ...]
```

**Practical examples**

```typescript
// Integer and within range
compiler.compile({ rule: ['$.and', 'int', '|value between 1 100'] });
// ✓ 50
// ✗ 150  // Out of range
// ✗ 50.5  // Not an integer

// String that matches a format
compiler.compile({ rule: ['$.and', 'string', '~=/^[A-Z]{3}\\d{3}$/'] });
// ✓ "ABC123"
// ✗ "abc123"

// Array with limited length
compiler.compile({ rule: ['$.and', 'array', '|array.length between 1 10'] });
// ✓ [1, 2, 3]
// ✗ []

// Object with limited number of fields
compiler.compile({
    rule: ['$.and', { name: 'string', age: 'uint8' }, '|length eq 2']
});
```

### 5.3 `$.not`

`$.not` represents a **negation rule**: the value must **not match** any sub-rule. It is used to exclude certain types or values.

**Basic syntax**

```json
["$.not", rule1, rule2, ...]
```

**Practical examples**

```typescript
// Exclude strings and number 0
compiler.compile({ rule: ['$.not', 'string', 0] });
// ✓ 123
// ✓ true
// ✗ "hello"
// ✗ 0

// Exclude specific empty values
compiler.compile({ rule: ['$.not', null, undefined] });
// ✓ "anything"
// ✓ 0
// ✗ null

// Combine with $.and: non-negative integer
compiler.compile({ rule: ['$.and', 'int', ['$.not', '|value lt 0']] });
// ✓ 0
// ✓ 100
// ✗ -1
```

### 5.4 `$.string`

`$.string` enables **from-string interpretation mode**, which is commonly used for URL query parameters, form fields, or JSON strings.

**Basic syntax**

```json
["$.string", rule]
```

**How it works**

1. If the input is a string, it attempts `JSON.parse()`.
2. If parsing succeeds, it validates the parsed value against `rule`.
3. If the input is not a string or parsing fails, the original value is validated.

**Practical examples**

```typescript
// Numeric string
compiler.compile({ rule: ['$.string', 'uint32'] });
// ✓ "123"
// ✓ 123
// ✗ "abc"

// JSON-string object
compiler.compile({ rule: ['$.string', { age: 'uint8' }] });
// ✓ "{\"age\":25}"
// ✓ { age: 25 }
// ✗ "{\"age\":\"old\"}"
```

### 5.5 `$.strict`

Strict match at the current object level: extra fields are not allowed.

```json
["$.strict", {
    "a": "uint",
    "b": { "c": "string" }
}]
```

> [!NOTE]
> `$.strict` only constrains strictness for the current object level. Child objects (for example, `b` in the rule above) are still in loose mode by default.
> If you need child objects to be strict as well, add `$.strict` to each child object rule. If you need recursive strict matching for all levels, use `$.equal`.

### 5.6 `$.equal`

Recursive strict match: child objects are strict as well.

```json
["$.equal", {
    "a": "uint",
    "b": { "c": "string" }
}]
```

> [!IMPORTANT]
> `$.equal` applies strictness recursively to all child levels. All nested objects will be matched strictly and no extra fields are allowed. This differs from `$.strict`, which only constrains the current level.

### 5.7 `$.type`

`$.type` defines a reusable predefined type within a rule.

**Basic syntax**

```json
["$.type", "TypeName", rule]
```

**Reference syntax**

```json
"@TypeName"
"@TypeName(arg1, arg2)"
```

**Practical examples**

```typescript
compiler.compile({
    rule: {
        a: ['$.type', 'Username', 'string(3,16)'],
        b: '@Username',
        c: '@Username'
    }
});

compiler.addPredefinedType('Email', function(v) {
    return typeof v === 'string' && /^[^@]+@[^@]+$/.test(v);
});

compiler.compile({ rule: '@Email' });
```

> [!TIP]
> If you need to reuse a type across multiple rules, prefer registering it globally via `compiler.addPredefinedType()`.

### 5.8 `$.enum` (v1.4.0+)

Literal enumeration:

```json
["$.enum", "a", "b", 1, true, null]
```

Allowed member types: `string`, `number`, `boolean`, `null`.

> [!NOTE]
> String members in `$.enum` are plain literal values. They are not interpreted as other rule syntaxes like `==text`. Only strict value equality comparison is performed.

## 6. String Assertion Rules

String assertions first ensure the value is a string, then perform matching.

### 6.1 Shorthand

| Expression | Description |
| --- | --- |
| `==text` / `=text` | Equals |
| `!=text` | Not equals |
| `%=text` | Equals (case-insensitive) |
| `%!text` | Not equals (case-insensitive) |
| `~=/re/flags` / `~/re/flags` | Regex match |
| `~!/re/flags` | Regex not match |
| `?=text` | Contains |
| `?!text` | Does not contain |
| `*=text` | Contains (case-insensitive) |
| `*!text` | Does not contain (case-insensitive) |
| `^=text` / `^!text` | Starts with / does not start with |
| `$=text` / `$!text` | Ends with / does not end with |

### 6.2 Full Form

| Expression | Equivalent shorthand |
| --- | --- |
| `:equal:text` | `==text` |
| `:not-equal:text` | `!=text` |
| `:equal-i:text` | `%=text` |
| `:not-equal-i:text` | `%!text` |
| `:match:/re/` | `~=/re/` |
| `:not-match:/re/` | `~!/re/` |
| `:include:text` | `?=text` |
| `:not-include:text` | `?!text` |
| `:include-i:text` | `*=text` |
| `:not-include-i:text` | `*!text` |
| `:start-with:text` | `^=text` |
| `:not-start-with:text` | `^!text` |
| `:start-with-i:text` | Case-insensitive prefix |
| `:not-start-with-i:text` | Case-insensitive non-prefix |
| `:end-with:text` | `$=text` |
| `:not-end-with:text` | `$!text` |
| `:end-with-i:text` | Case-insensitive suffix |
| `:not-end-with-i:text` | Case-insensitive non-suffix |

### 6.3 Examples

```typescript
// Equality
compiler.compile({ rule: '==hello' });
// ✓ "hello"
// ✗ "Hello", "world"

// Case-insensitive equality
compiler.compile({ rule: '%=hello' });
// ✓ "hello", "HELLO", "HeLLo"
// ✗ "world"

// Regex match: email format
compiler.compile({ rule: '~=/^[^@]+@[^@]+\\.[^@]+$/' });
// ✓ "user@example.com"
// ✗ "invalid.email"

// Contains
compiler.compile({ rule: '?=@gmail' });
// ✓ "user@gmail.com", "admin@gmail.co.uk"
// ✗ "user@yahoo.com"

// Prefix match: URL scheme
compiler.compile({ rule: '^=https://' });
// ✓ "https://example.com"
// ✗ "http://example.com"

// Suffix match: file extension
compiler.compile({ rule: '$=.json' });
// ✓ "config.json", "data.json"
// ✗ "config.yaml"

// Combined: API path validation
compiler.compile({
    rule: {
        method: ['$.enum', 'GET', 'POST', 'PUT', 'DELETE'],
        path: ['$.and', 'string', '^=/api/']
    }
});
// ✓ { method: "GET", path: "/api/users" }
// ✗ { method: "GET", path: "/admin/users" }
```
