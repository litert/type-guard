# String Assertion Rules

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
