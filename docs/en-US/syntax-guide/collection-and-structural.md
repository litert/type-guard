# Collection and Structural Types

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
> To disallow extra keys, use the `$.strict` modifier (see [Section 5.5](./modifiers.md#55-strict)). To enforce deep exact equality, use the `$.equal` modifier (see [Section 5.6](./modifiers.md#56-equal)).
