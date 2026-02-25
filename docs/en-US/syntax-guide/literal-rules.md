# Literal Rules

Literal rules are the simplest form of validation in TypeGuard. If you provide a raw JSON value as a rule, TypeGuard validates that the input is strictly equal (`===`) to that value.

This is useful for flags, status codes, magic numbers, or enforcing specific constants.

## Supported Literals

| JavaScript Type | Rule Example | Validates |
| :--- | :--- | :--- |
| `number` | `123`, `0`, `-5.5` | Exact numeric equality. |
| `boolean` | `true`, `false` | Exact boolean equality. |
| `null` | `null` | Exact `null` value. |

> [!WARNING]
> **Strings are NOT literal rules.**
> A string in a rule position (e.g., `"admin"`) is parsed as a **Type Name** (i.e., "check if value is of type `admin`").
> To match a string literal, you must use the assertion syntax: `"==admin"`.

## Usage Examples

### 1. Status Flags

Enforce that a field must be `true` (e.g., a user must agree to terms).

```typescript
const rule = {
    "agreedToTerms": true
};
// ✓ { "agreedToTerms": true }
// ✗ { "agreedToTerms": false }
```

### 2. Magic Numbers or Versions

```typescript
const rule = {
    "version": 1,
    "platformId": 1024
};
```

### 3. Nullable Fields (via Union)

Combine a literal `null` with other types using a Union (`$.or`) to create nullable fields.

```typescript
// A string OR null
const rule = ["string", null];

// ✓ "hello"
// ✓ null
// ✗ undefined
// ✗ 123
```

## Comparison: Literal vs `$.enum`

If you need to check against **one** specific value, a Literal Rule is the fastest and simplest way.
If you need to check against **multiple** allowed values, use `$.enum`.

```javascript
// Single value (Literal Rule)
"type": 1

// Multiple values (Enum Modifier)
"type": ["$.enum", 1, 2, 3]
```

## Watch Points

1.  **String Confusion**:
    *   `null` (the keyword) validates the value `null`.
    *   `"null"` (the string) validates the type named `null` (which is a built-in type that checks for `null`). In this specific case, they behave identically, but `"boolean"` (type) vs `true` (value) is very different.
2.  **Undefined**:
    *   `undefined` cannot be represented in standard JSON. To check for `undefined`, use the built-in type string `"undefined"` or `"void"`.

