# Rule Forms Overview

TypeGuard rules are defined using standard JSON data structures. This means you do not need to parse a custom DSL or import complex class instances—rules are just data. They can be stored in databases, sent over networks, or defined inline in your code.

The compiler recursively analyzes the JSON structure to determine the validation logic. Understanding these forms is key to writing expressive and correct rules.

## Core Forms at a Glance

| Form | Example | Type | Description |
| :--- | :--- | :--- | :--- |
| **String Rule** | `"string(1,64)"` | Basic Type | Validates against built-in types, custom types (`@Name`), or string assertions (`==val`). |
| **Literal Rule** | `123`, `true`, `null` | Exact Value | Validates that the input equals the implementation-defined literal value. |
| **Object Rule** | `{ "name": "string" }` | Structure | Validates an object structure (keys and value types). |
| **Modifier Rule** | `["$.array", 3, "string"]` | Higher-Order | Invokes a built-in modifier (starting with `$.`) to transform or constrain other rules. |
| **Implicit Union** | `["string", "int"]` | Composition | A plain array without a modifier is treated as a Union (`$.or`). |

---

## 1. String Rules

Strings are the most versatile form in TypeGuard. A string rule is never just a string literal—it is parsed as a **type expression**.

It can represent:

- **Built-in Types**: `string`, `int`, `boolean`, `any`, etc.
  - Can accept arguments: `string(10)`, `int(-100, 100)`.
- **Custom Types**: References to types registered via `compiler.addPredefinedType()`.
  - Syntax: `@TypeName`, `@TypeName(args...)`.
- **String Assertions**: Checks for prefix, suffix, regex, or exact content.
  - Examples: `==active` (exact match), `^=https` (starts with), `~=/^\d+$/` (regex).
- **Numeric Filters**: Checks for value ranges or lengths via the pipe operator.
  - Example: `|value > 10`.
  - See [Numeric Filters](./numeric-filters.md).

> [!WARNING]
> Do not use a string rule like `"hello"` to check if a value equals the string "hello".
> In TypeGuard, `"hello"` would be interpreted as a type named `hello`, which likely doesn't exist.
> To check for the exact string "hello", use the assertion syntax: `"==hello"`.

## 2. Literal Rules

For primitive values (numbers, booleans, and null), the rule is the value itself.

- `123` validates that the input is exactly the number `123`.
- `true` validates that the input is exactly `true`.
- `null` validates that the input is exactly `null`.

> [!NOTE]
> There are no "string literals" in this form. As mentioned above, a JSON string is always parsed as a type expression.

## 3. Object Rules

An object literal `{ ... }` defines a structural validation rule. By default:

1.  **Strictly present**: Keys without `?` must be present.
2.  **Values**: Must satisfy the rule defined for that key.
3.  **Loose matching**: Extra keys in the input are allowed (unless `$.strict` or `$.equal` is used).

```javascript
{
    "id": "uint32",      // Required key "id" must be uint32
    "name": "string",    // Required key "name" must be string
    "isAdmin?": "boolean" // Optional key (note the "?")
}
```

You can use **key syntax sugar** (like `tags->[]`) to simplify complex structures. See [Syntax Sugar](./syntax-sugar.md).

## 4. Modifier Rules (Arrays starting with `$.`)

An array where the first element is a string starting with `$.` is a **Modifier Rule**.
It acts like a function call: `["$.modifierName", arg1, arg2, ...]`.

Common modifiers:

- **Logic**: `$.or` (Union), `$.and` (Intersection), `$.not` (Negation).
- **Structure**: `$.list`, `$.array`, `$.tuple` (Arrays), `$.map`, `$.dict` (Objects).
- **Special**: `$.string` (Parse string as JSON), `$.strict` (No extra keys).

```javascript
// A union of string OR integer
["$.or", "string", "int"]

// A list of strings
["$.list", "string"]
```

## 5. Composite Rules (Arrays without `$.`)

If an array **does not** start with a `$.` keyword, it is treated as a shorthand for `$.or` (Union).

```javascript
// This...
["string", "int", "boolean"]

// ...is exactly the same as this:
["$.or", "string", "int", "boolean"]
```

This shorthand makes defining optional or multi-type fields very concise:
`{ "value": ["string", "number", "null"] }`

---

## Example: How Forms Compose

Because rules are recursive, you can freely nest these forms to describe complex data shapes.

```javascript
// A complex rule combining multiple forms
const rule = {
    // Object Rule (Root)
    "meta": {
        // Object Rule (Nested)
        "version": "string",
        "timestamp": "uint(0,)"
    },
    "payload": [
        // Composite Rule (Union)
        // 1. Literal Rule (null)
        null,
        // 2. Object Rule
        {
            "type": "==data", // String Rule (Assertion)
            "items": [
                // Modifier Rule (List)
                "$.list",
                // Composite Rule inside List (string OR int)
                ["string", "int"]
            ]
        }
    ]
};
```

