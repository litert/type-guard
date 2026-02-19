# Numeric Filters (`|...`)

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

