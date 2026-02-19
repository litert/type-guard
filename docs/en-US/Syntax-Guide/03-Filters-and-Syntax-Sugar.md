## 7. Numeric Filters (`|...`)

Syntax:

```text
|<target> <rel> <args...>
```

### 7.1 target

The filter `target` specifies which property of the data to compare.

| Target | Description | Typical usage | Example |
|--------|-------------|---------------|---------|
| `value` | The value itself | Numeric values | `\|value gt 100` |
| `length` | Object key count or array length | Objects or arrays | `\|length eq 3` |
| `string.length` | String length (character count) | Strings | `\|string.length between 3 10` |
| `array.length` | Array length (element count) | Arrays | `\|array.length le 100` |
| Built-in numeric types | Validate the type first, then compare the value | Type + range constraints | `\|uint lt 256`<br>`\|int between -100 100` |

**Examples**

```typescript
// value: compare the value itself
compiler.compile({ rule: ['$.and', 'number', '|value gt 0'] });
// ✓ 1, 100.5
// ✗ 0, -1

// length: compare object key count
compiler.compile({ rule: ['$.and', 'struct', '|length between 1 5'] });
// ✓ { a: 1 }
// ✓ { a: 1, b: 2, c: 3 }
// ✗ {}

// string.length: compare string length
compiler.compile({ rule: ['$.and', 'string', '|string.length ge 5'] });
// ✓ "hello"
// ✗ "hi"

// array.length: compare array length
compiler.compile({ rule: ['$.and', 'array', '|array.length le 10'] });
// ✓ [1, 2, 3]
// ✗ [1, 2, ... 20 elements]

// Built-in type: type validation + range constraint
compiler.compile({ rule: '|uint lt 256' });
// ✓ 0, 1, 255
// ✗ 256, -1, "123"
```

### 7.2 Comparison operators

| Operator | Aliases | Description | Example |
|--------|---------|-------------|---------|
| `gt` | `>` | Greater than | `\|value gt 100` |
| `ge` | `gte`, `>=` | Greater than or equal to | `\|value ge 1` |
| `lt` | `<` | Less than | `\|value lt 255` |
| `le` | `lte`, `<=` | Less than or equal to | `\|length le 16` |
| `eq` | `==` | Equal to | `\|value eq 42` |
| `ne` | `!=` | Not equal to | `\|value ne 0` |
| `between a b` | — | In range [a, b] (inclusive) | `\|value between 1 199` |
| `timesof n` | — | Is a multiple of n | `\|uint timesof 10` |

**Examples**

```json
"|value between 1 199"
"|value gt 1"
"|length le 16"
"|string.length ge 3"
"|array.length between 1 10"
"|uint timesof 10"
```

> [!WARNING]
> Comparison arguments in filters must be valid numeric strings, otherwise a `TypeError` will be thrown.

## 8. Syntax Sugar and Shorthand Rules

### 8.1 Prefixes

| Prefix form | Equivalent form | Description | Examples |
|----------|------------------|-------------|----------|
| `?type` | `["$.or", "void", type]` | Optional type; allows `undefined` | `"?string"`<br>`"?uint32"` |
| `!type` | `["$.not", type]` | Negation; disallows the type | `"!string"`<br>`"!null"` |
| `@TypeName` | Reference a predefined type | Reference a registered or inline-defined type | `"@IPv4"`<br>`"@Email"` |
| `@TypeName(args)` | Reference with arguments | Pass arguments to a predefined type | `"@range(1,100)"`<br>`"@enum(a,b,c)"` |

**Examples**

```typescript
// ?type: optional type
compiler.compile({ rule: { name: 'string', age: '?uint8' } });
// ✓ { name: "alice", age: 25 }
// ✓ { name: "bob" }  // age can be omitted

// !type: negation
compiler.compile({ rule: ['!string', '!null'] });
// ✓ 123, true, []
// ✗ "hello", null

// @TypeName: predefined type reference
compiler.addPredefinedType('IPv4', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
compiler.compile({ rule: '@IPv4' });
// ✓ "192.168.1.1"

// @TypeName(args): reference with arguments
compiler.addPredefinedType('trim_string', (v, min, max) =>
    typeof v === 'string' && v.trim().length >= min && v.trim().length <= max
);
compiler.compile({ rule: '@trim_string(2,16)' });
// ✓ "  hello  " (length is 5 after trimming)
```

### 8.2 Suffixes

| Suffix form | Equivalent form | Description | Examples |
|----------|------------------|-------------|----------|
| `type[]` | `["$.list", type]` | Variable-length list (any length) | `"string[]"`<br>`"uint32[]"` |
| `type[N]` | `["$.array", N, type]` | Fixed-length array (exactly N elements) | `"string[3]"`<br>`"int[5]"` |
| `type[N,M]` | `["$.array", [N,M], type]` | Ranged-length array (N to M elements) | `"string[1,5]"`<br>`"uint[2,10]"` |
| `type[N,]` | `["$.array", [N], type]` | Min-length array (at least N elements) | `"string[1,]"`<br>`"int[3,]"` |
| `type{}` | `["$.map", type]` | Mapping (object value-type constraint) | `"string{}"`<br>`"uint32{}"` |

**Examples**

```typescript
// type[]: variable-length list
compiler.compile({ rule: 'string[]' });
// ✓ [], ["a"], ["a", "b", "c"]

// type[N]: fixed-length array
compiler.compile({ rule: 'uint8[3]' });
// ✓ [1, 2, 3]
// ✗ [1, 2], [1, 2, 3, 4]

// type[N,M]: ranged-length array
compiler.compile({ rule: 'string[2,5]' });
// ✓ ["a", "b"], ["a", "b", "c", "d", "e"]
// ✗ ["a"], ["a", "b", "c", "d", "e", "f"]

// type[N,]: min-length array
compiler.compile({ rule: 'int[1,]' });
// ✓ [1], [1, 2, 3, ...]
// ✗ []

// type{}: mapping type
compiler.compile({ rule: 'number{}' });
// ✓ { a: 1, b: 2 }
// ✗ { a: 1, b: "2" }  // Values must all be numbers
```

### 8.3 Object key syntax sugar

Object key syntax sugar allows special suffixes on key names in object rules to simplify common structural patterns. These shorthands are high-frequency TypeGuard features and can significantly improve rule readability.

#### 8.3.1 Syntax table

| Sugar | Equivalent form | Description | Typical usage |
|--------|------------------|-------------|---------------|
| `field?` | Optional field | Field may exist or not | Optional config items, optional properties |
| `field->[]` | `["$.list", ...]` | Field value is a variable-length list | Tag arrays, comment lists |
| `field->[N]` | `["$.array", N, ...]` | Field value is a fixed-length array | RGB color, coordinate point |
| `field->[N,M]` | `["$.array", [N,M], ...]` | Field value is a ranged-length array | Paging results, batch data |
| `field->[N,]` | `["$.array", [N], ...]` | Field value is a min-length array | Lists with at least one item |
| `field->{}` | `["$.map", ...]` | Field value is a mapping object | Key-value config, dictionaries |
| `field->()` | `["$.strict", ...]` | Field value is strict (no extra keys) | Exact-structure validation |
| `field->(=)` | `["$.equal", ...]` | Field value is recursively strict | Deep structure validation |

#### 8.3.2 Optional field `field?`

```typescript
// Optional age field
compiler.compile({
    rule: {
        name: 'string',
        age?: 'uint8'
    }
});
// ✓ { name: "alice" }
// ✓ { name: "bob", age: 25 }

// Multiple optional fields
compiler.compile({
    rule: {
        id: 'uint32',
        'email?': 'string',
        'phone?': 'string',
        'address?': 'string'
    }
});
```

#### 8.3.3 List field `field->[]`

```typescript
// Variable-length tag list
compiler.compile({
    rule: {
        title: 'string',
        'tags->[]': 'string'
    }
});
// ✓ { title: "Post", tags: [] }
// ✓ { title: "Post", tags: ["tech", "js"] }

// Object list
compiler.compile({
    rule: {
        'users->[]': {
            id: 'uint32',
            name: 'string'
        }
    }
});
// ✓ { users: [{ id: 1, name: "alice" }, { id: 2, name: "bob" }] }
```

#### 8.3.4 Array field `field->[N]` / `field->[N,M]` / `field->[N,]`

```typescript
// Fixed-length array: RGB color
compiler.compile({
    rule: {
        name: 'string',
        'color->[3]': 'uint8'
    }
});
// ✓ { name: "red", color: [255, 0, 0] }
// ✗ { name: "red", color: [255, 0] }

// Ranged-length array: 1–5 roles
compiler.compile({
    rule: {
        username: 'string',
        'roles->[1,5]': 'string'
    }
});
// ✓ { username: "admin", roles: ["admin", "moderator"] }
// ✗ { username: "admin", roles: [] }

// Min-length array: at least one skill
compiler.compile({
    rule: {
        name: 'string',
        'skills->[1,]': 'string'
    }
});
// ✓ { name: "alice", skills: ["js", "ts", "python"] }
// ✗ { name: "bob", skills: [] }
```

#### 8.3.5 Mapping field `field->{}`

```typescript
// String key-value pairs
compiler.compile({
    rule: {
        name: 'string',
        'metadata->{}': 'string'
    }
});
// ✓ { name: "config", metadata: { author: "alice", version: "1.0" } }
// ✗ { name: "config", metadata: { count: 123 } }  // Values must be strings

// Numeric config mapping
compiler.compile({
    rule: {
        'settings->{}': 'number'
    }
});
// ✓ { settings: { timeout: 3000, retries: 5 } }
```

#### 8.3.6 Strict field `field->()` and `field->(=)`

```typescript
// field->(): single-level strict match
compiler.compile({
    rule: {
        'config->()': {
            host: 'string',
            port: 'uint16'
        }
    }
});
// ✓ { config: { host: "localhost", port: 3000 } }
// ✗ { config: { host: "localhost", port: 3000, debug: true } }  // debug not allowed

// field->(=): recursive strict match
compiler.compile({
    rule: {
        'settings->(=)': {
            db: {
                host: 'string',
                port: 'uint16'
            }
        }
    }
});
// ✓ { settings: { db: { host: "localhost", port: 5432 } } }
// ✗ { settings: { db: { host: "localhost", port: 5432, pool: 10 } } }  // db cannot have extra keys
```

#### 8.3.7 Combined usage

Multiple shorthands can be combined to build complex structures:

```typescript
compiler.compile({
    rule: {
        id: 'uint32',
        title: 'string',
        'author?': 'string',                    // Optional
        'tags->[]': 'string',                   // Variable-length list
        'comments->[0,100]': {                  // At most 100 comments
            user: 'string',
            content: 'string',
            'replies->[0,10]': {                // At most 10 replies per comment
                user: 'string',
                content: 'string'
            }
        },
        'metadata->{}?': 'string',              // Optional string mapping
        'settings->()': {                       // Strict config object
            visible: 'boolean',
            pinned: 'boolean'
        }
    }
});
```

> [!TIP]
> Object key syntax sugar can greatly reduce nesting and redundancy. It is a key technique for writing clear, maintainable rules. In practice, it is recommended to use these shorthands instead of the equivalent expanded forms whenever possible.
