# Syntax Guide

This document covers the syntax rules that TypeGuard **actually supports** in the current implementation, and provides examples you can reuse directly.

## Table of Contents

- [1. Rule Forms Overview](#1-rule-forms-overview)
- [2. Built-in Types](#2-built-in-types)
- [3. Literal Rules](#3-literal-rules)
- [4. Collection and Structural Types](#4-collection-and-structural-types)
- [5–6. Modifiers and String Assertions](./02-Modifiers-and-String-Assertions.md)
- [7–8. Numeric Filters and Syntax Sugar](./03-Filters-and-Syntax-Sugar.md)
- [9–10. Predefined Types and Practical Examples](./04-Predefined-Types-and-Examples.md)

## 1. Rule Forms Overview

TypeGuard rules are JSON-expressible structures. The core forms are:

- String rules: `"string"`, `"uint32"`, `"@MyType(1,2)"`, `"==hello"`
- Literal rules: `123`, `true`, `false`, `null`
- Object rules: `{ "name": "string", "age?": "uint8" }`
- Array modifier rules: `["$.array", 3, "string"]`
- Composite rules: `["$.or", "string", "int"]`

## 2. Built-in Types

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
> You can pass this option via `createInlineCompiler(opts)` and `createCompiler(lang, opts)`. See [API Reference](../API-Reference.md) for details.

## 3. Literal Rules

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

## 4. Collection and Structural Types

### 4.1 Arrays and Lists

#### `$.list` (variable-length array)

`$.list` represents an array whose element type is constrained but whose length is unconstrained.

**Syntax:**

```json
["$.list", elementType]
["$.list", elementType1, elementType2, ...]
```

**Examples:**

```ts
// String array of any length
compiler.compile({ rule: ['$.list', 'string'] });
// Matches: [], ["a"], ["a", "b", "c"]

// Mixed array: string or integer elements
compiler.compile({ rule: ['$.list', 'string', 'uint32'] });
// Matches: [], ["a", 123], [456, "b"]

// Array of objects
compiler.compile({ rule: ['$.list', { id: 'uint32', name: 'string' }] });
// Matches: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### `$.array` (fixed-length / ranged-length array)

`$.array` provides precise control over array length.

**Syntax:**

```json
["$.array", exactLength, elementType]
["$.array", [minLength, maxLength], elementType]
["$.array", [minLength], elementType]
```

**Examples:**

```ts
// Exactly 3 strings
compiler.compile({ rule: ['$.array', 3, 'string'] });
// Matches: ["a", "b", "c"]
// Does not match: ["a", "b"], ["a", "b", "c", "d"]

// Between 2 and 5 elements
compiler.compile({ rule: ['$.array', [2, 5], 'string'] });
// Matches: ["a", "b"], ["a", "b", "c", "d", "e"]
// Does not match: ["a"], ["a", "b", "c", "d", "e", "f"]

// At least 2 elements
compiler.compile({ rule: ['$.array', [2], 'string'] });
// Matches: ["a", "b"], ["a", "b", "c", ...]

// Fixed-length multi-type array
compiler.compile({ rule: ['$.array', 2, 'string', 'int'] });
// Matches: ["a", "b"], ["a", 123], [456, "b"], [789, 0]
```

**Practical scenarios:**

```ts
// RGB color: exactly 3 integers in [0, 255]
const isRGB = compiler.compile({ rule: ['$.array', 3, 'uint8'] });

// Paged query result: at least 1 item, at most 100 items
const isPageItems = compiler.compile({
    rule: ['$.array', [1, 100], { id: 'uint32', title: 'string' }]
});
```

### 4.2 Tuple `$.tuple`

A tuple defines an array where each position can have a different element type.

**Basic syntax:**

```json
["$.tuple", type1, type2, ...]
```

**Optional element syntax:**

- `...N`: repeat the previous type up to N times (optional)
- `...`: apply the previous type to all remaining elements (optional)

**Examples:**

```ts
// Fixed 2-element tuple: string + integer
compiler.compile({ rule: ['$.tuple', 'string', 'int'] });
// Matches: ["hello", 123]
// Does not match: ["hello"], ["hello", 123, 456]

// Infinite tail: string + integer + any number of integers
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...'] });
// Matches: ["hello", 1], ["hello", 1, 2, 3]

// Bounded optional elements: string + integer + up to 3 integers + string
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...3', 'string'] });
// Matches: ["a", 1, 2, 3, "z"], ["a", 1, "z"]
// Does not match: ["a", 1, 2, 3, 4, "z"] (more than 3 optional integers)

// Mixed optional: string + integer + up to 4 integers + string + any number of strings
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...4', 'string', '...'] });
// Matches: ["a", 1, 2, "z"], ["a", 1, 2, 3, 4, "z", "extra"]
```

**Practical usage:**

```ts
// 2D point: [x, y]
const isPoint2D = compiler.compile({ rule: ['$.tuple', 'float', 'float'] });

// CSV row: first column is ID, then any number of columns
const isCSVRow = compiler.compile({ rule: ['$.tuple', 'uint32', 'string', '...'] });
```

### 4.3 Mapping `$.map`

The `$.map` modifier creates a mapping type (Map). The input must be a plain object, and the value for every key must satisfy the specified value rule.

**Basic syntax**

```json
["$.map", "string"]
```

Validates an object where all values are strings.

**With key-type constraint**

```json
["$.map", "string", "uint32"]
```

The third argument specifies the key type rule (this example requires keys to be `uint32`).

**Practical examples**

```typescript
// Config map: keys are arbitrary strings, values are numbers
const configRule = ["$.map", "number"];
// ✓ { "timeout": 3000, "retries": 5 }
// ✗ { "timeout": "3000" }  // Value is not a number

// Permissions table: key is user ID (uint32), value is a role string
const permissionsRule = ["$.map", "string", "uint32"];
// ✓ { "1001": "admin", "1002": "user" }
// ✗ { "user1": "admin" }  // Key is not uint32
```

**As a rest-key rule (Rest Mapping)**

`$.map` can be used inside an object rule to define the validation rule for keys that are not explicitly listed:

```json
{
    "id": "uint32",
    "$.map": "string"
}
```

This rule requires the object to contain the key `id` (type `uint32`), and all other keys’ values must be strings.

> [!IMPORTANT]
> Within a single object rule, you can use only one `$.map` as the rest-key rule.

### 4.4 Dictionary `$.dict`

The `$.dict` modifier validates that an object contains a specified set of keys, and that each specified key’s value satisfies the same type rule.

**Basic syntax**

```json
["$.dict", ["a", "b"], "string"]
```

This requires the object to contain keys `a` and `b`, and their values must both be strings. By default, **extra keys are allowed**.

**Practical example**

```typescript
// API response headers: must include content-type and authorization
const headersRule = ["$.dict", ["content-type", "authorization"], "string"];
// ✓ { "content-type": "application/json", "authorization": "Bearer xxx" }
// ✓ { "content-type": "text/html", "authorization": "Basic yyy", "cache-control": "no-cache" }  // Extra keys allowed
// ✗ { "content-type": "application/json" }  // Missing authorization
```

**Strict-mode dictionary**

If you do not want to allow extra keys, combine with the `$.strict` modifier:

```json
["$.strict", "$.dict", ["a", "b"], "string"]
```

This rule requires the object to contain **only** keys `a` and `b`, and disallows any extra keys.

```typescript
// Strict config validation
const strictConfigRule = ["$.strict", "$.dict", ["host", "port"], "string"];
// ✓ { "host": "localhost", "port": "3000" }
// ✗ { "host": "localhost", "port": "3000", "protocol": "http" }  // Extra protocol key not allowed
```

### 4.5 Object Rules

Object rules use JSON object literal syntax and define the type rule for each key directly.

**Basic object (loose mode)**

```json
{
    "name": "string",
    "age": "uint8"
}
```

This requires the object to contain keys `name` (string) and `age` (uint8). By default, **extra keys are allowed**.

**Optional keys**

Add `?` after a key name to make the key optional:

```json
{
    "name": "string",
    "age?": "uint8"
}
```

This requires the object to contain `name`, while `age` may or may not be present.

**Practical examples**

```typescript
// User profile validation
const userProfileRule = {
    "username": "string",
    "email": "string",
    "age?": "uint8",       // Optional age
    "phone?": "string"     // Optional phone
};
// ✓ { "username": "alice", "email": "alice@example.com" }
// ✓ { "username": "bob", "email": "bob@example.com", "age": 25 }
// ✗ { "username": "charlie" }  // Missing required email

// Nested objects
const orderRule = {
    "orderId": "string",
    "customer": {
        "name": "string",
        "address": "string"
    },
    "items": ["$.array", {
        "productId": "string",
        "quantity": "uint32"
    }]
};
```

> [!TIP]
> To disallow extra keys, use the `$.strict` modifier (see [Section 5.5](./02-Modifiers-and-String-Assertions.md#55-strict)). To enforce deep exact equality, use the `$.equal` modifier (see [Section 5.6](./02-Modifiers-and-String-Assertions.md#56-equal)).
