# Custom Types and Argument Calls

Custom types allow you to extend TypeGuard with your own validation logic. While built-in types cover most needs, custom types are essential for domain-specific checks like verifying user IDs in a database, complex string formats (like specialized ISO dates), or logic that requires external context.

## 1. Global Registration (Recommended)

The most common way to define custom types is by registering them globally on the compiler instance. This makes the type available to all rules compiled by that instance.

### Method

```typescript
compiler.addPredefinedType(name, validator);
```

-   **name**: The string name to use in rules (e.g., `'Email'`, `'UserId'`).
-   **validator**: A function that returns `true` (valid) or `false` (invalid). It receives the value to check as the first argument.

### Example: Simple Type

Register a type that checks if a string is a valid email format.

```typescript
compiler.addPredefinedType('Email', (value) => {
    return typeof value === 'string' && value.includes('@');
});

// Usage in rule
const rule = "@Email";
```

### Example: Type with Arguments

You can pass arguments to your validator function. The arguments defined in the rule string are passed to the validator function starting from the second argument.

```typescript
// Define a range checker
compiler.addPredefinedType('range', (value, min, max) => {
    return typeof value === 'number' && value >= min && value <= max;
});

// Usage: Pass arguments in parentheses
const rule = "@range(10, 20)";
```

## 2. Inline Definition (`$.type`)

You can also define a custom type directly within a rule using the `$.type` modifier. This is useful for defining a reusable sub-rule within a single complex schema, without polluting the global namespace.

### Syntax

```json
["$.type", "TypeName", ruleDefinition]
```

Once defined, you can reference it using `@TypeName` anywhere in the same rule structure (even before the definition, due to hoisting behavior, though defining before use is clearer).

### Example

```json
{
    // Define 'ContactInfo' type once
    "primaryContact": ["$.type", "ContactInfo", {
        "name": "string",
        "phone": "string(10,15)"
    }],
    
    // Reuse it
    "emergencyContact": "@ContactInfo",
    "billingContact": "@ContactInfo"
}
```

> [!IMPORTANT]
> **Scope & Uniqueness**: An inline type uses a compiler-level context. Its name must be unique within a single `compile()` call. If you try to define `["$.type", "MyType", ...]` twice in the same rule tree, it will throw an error.

## 3. Argument Syntax and Types

When calling a custom type (or built-in type with arguments), you pass values in parentheses.

```
@TypeName(arg1, arg2, ...)
```

The arguments must be **literals**. Complex expressions, variables, objects, or arrays are **NOT** supported as arguments.

| Argument Type | Syntax Example | Notes |
| :--- | :--- | :--- |
| **String** | `"hello"`, `'world'` | Supports both single and double quotes. |
| **Number** | `123`, `-5.5`, `0xFF` | Supports integers, floats, hex. |
| **Boolean** | `true`, `false` | |
| **Null** | `null` | |

**Invalid calls:**

-   `@MyType([1,2])` (Arrays not allowed)
-   `@MyType({a:1})` (Objects not allowed)
-   `@MyType(1 + 2)` (Expressions not allowed)

## 4. Naming Rules

Custom type names must follow this regex pattern: `^[a-zA-Z0-9_\:\-\.]+$`

Allowed characters:
-   English letters (`a-z`, `A-Z`)
-   Digits (`0-9`)
-   Underscore (`_`)
-   Colon (`:`)
-   Hyphen (`-`)
-   Dot (`.`)

> [!TIP]
> Use namespaced names like `App:User` or `db.ID` to avoid collisions in large projects.

## Watch Points

1.  **Name Collisions**: If you register a global type named `User`, and then define an inline type `["$.type", "User", ...]`, the inline definition takes precedence within that specific rule.
2.  **Performance**: `addPredefinedType` validators are called at runtime during validation. Keep them fast.
3.  **Security**: Do not use `eval` or unsafe code generation inside your validators if they process user input in a way that constructs code from it (though TypeGuard is designed to be safe, your custom logic is your responsibility).

