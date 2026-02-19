# Built-in Types

Source: `src/lib/BuiltInTypes.ts` and `src/lib/BuiltInTypeCompiler.ts`.

### 2.1 Type List

| Category | Type | Description |
| --- | --- | --- |
| String | `string` | Any string |
|  | `ascii_string` | ASCII string |
|  | `latin_string` | Latin charset string |
|  | `hex_string` | Hex string |
| Integer | `int` | Signed integer |
|  | `int8` / `int16` / `int32` / `int64` | Fixed-width integers (`int64` is validated with integer semantics in JS) |
|  | `safe_int` | JavaScript safe integer range |
| Unsigned Integer | `uint` | Unsigned integer |
|  | `uint8` / `uint16` / `uint32` / `uint64` | Fixed-width unsigned integers |
|  | `safe_uint` | JavaScript safe unsigned integer range |
| Number | `number` | Any `number` |
|  | `float` | Floating-point / integer (`number`) |
|  | `ufloat` | Non-negative `number` |
|  | `numeric` | A number, or a string that can be parsed as a number |
| Decimal String | `decimal` | Decimal string, supports `(M,D)` |
|  | `udecimal` | Unsigned decimal string, supports `(M,D)` |
| Boolean | `boolean` | `true` / `false` |
|  | `true` / `false` | Boolean literals |
|  | `true_value` / `false_value` | Truthy / falsy |
| Structure | `array` | Any array |
|  | `struct` | Any object structure |
| Special | `null` | `null` |
|  | `undefined` / `void` / `optional` | `undefined` (synonyms) |
|  | `required` | Not `undefined` |
|  | `any` | Any value (always passes) |

### 2.2 Argument Rules

#### Numeric range arguments

Applies to: `int`, `float`, `number`, `numeric`.

> [!WARNING]
> `uint` and its fixed-width variants (`uint8`, `uint16`, `uint32`, `uint64`, `safe_uint`) **do not support** range arguments.
> If you need to constrain the range of an unsigned integer, use `["$.and", "uint", "|value between min max"]` or numeric filters.

**Syntax and examples:**

```ts
// Signed integer range
compiler.compile({ rule: 'int(-10, 20)' });   // -10 to 20
compiler.compile({ rule: 'int(-10,)' });      // >= -10
compiler.compile({ rule: 'int(,20)' });       // <= 20

// Floating-point range
compiler.compile({ rule: 'float(0.0, 1.0)' });
compiler.compile({ rule: 'number(1.5, 99.9)' });

// Numeric-string range
compiler.compile({ rule: 'numeric(-100, 100)' });
```

#### String length arguments

Applies to: `string`, `ascii_string`, `latin_string`, `hex_string`.

**Syntax and examples:**

```ts
// Fixed length
compiler.compile({ rule: 'string(8)' });      // exactly 8 characters

// Length range
compiler.compile({ rule: 'string(1, 32)' });  // 1 to 32 characters

// Minimum length
compiler.compile({ rule: 'string(3,)' });     // at least 3 characters
```

**Practical usage:**

```ts
// Username: 3–16 ASCII characters
const isUsername = compiler.compile({ rule: 'ascii_string(3,16)' });

// Verification code: exactly 6 digits (combined with regex)
const isCaptcha = compiler.compile({ rule: ['$.and', 'string(6)', '~=/^\\d{6}$/'] });
```

#### Decimal arguments

Applies to: `decimal`, `udecimal` (exact decimal numbers represented as strings).

**Syntax:**

- `decimal(M)`: total digits must not exceed M
- `decimal(M,D)`: total digits M, with D fractional digits

**Examples:**

```ts
// Money amount: up to 10 digits total, 2 digits after decimal point
compiler.compile({ rule: 'decimal(10,2)' });  // "12345678.90"

// Unsigned money amount
compiler.compile({ rule: 'udecimal(12,4)' });

// Integer form (fractional digits = 0)
compiler.compile({ rule: 'decimal(8,0)' });   // "-1234567"
```

> [!NOTE]
> The compiler option `ignoreInvalidArgs` controls what happens when you pass arguments to types that do not accept arguments (such as `boolean`, `any`, `void`, `uint8`, etc.):
>
> - Default `true`: ignore extra arguments (for backward compatibility)
> - Set to `false`: throw `SyntaxError` (recommended for new projects to catch invalid rules earlier)
>
> You can pass this option via `createInlineCompiler(opts)` and `createCompiler(lang, opts)`. See [API Reference](../api-reference.md) for details.

