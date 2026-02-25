# Practical Examples

This chapter provides complete examples of validation rules for common real-world scenarios.

## 1. REST API Query Parameters

Validating query parameters for a listing API (e.g., `GET /users`).

- **Strict**: No unexpected parameters allowed.
- **Pagination**: `page`, `pageSize` with ranges.
- **Search**: optional `q` string.
- **Sorting**: `sort` enum.

```json
["$.strict", {
    "page?": "uint32(1,)",               // Min 1
    "pageSize?": "uint8(1,100)",         // 1-100 items per page
    "q?": "string(0,100)",               // Search keyword max 100 chars
    "sort?": ["$.enum", "asc", "desc"],  // Sort direction
    "orderBy?": ["$.enum", "id", "created_at", "name"]
}]
```

## 2. API JSON Body (User Registration)

Validating a JSON payload for creating a new user.

- **Email**: Regex validation.
- **Password**: Min length.
- **Age**: Optional, restricted range.
- **Tags**: List of strings.

```json
["$.strict", {
    "username": "string(3, 32)",
    "email": "~=^[^@]+@[^@]+\\.[^@]+$",
    "password": "string(8, 128)",
    "age?": "uint8(13, 120)",
    "tags->[]": "string(1, 20)",         // Array of tags
    "newsletter?": "boolean"
}]
```

## 3. JWT Payload Structure

Validating the decoded payload of a JSON Web Token.

- **Standard Claims**: `iss`, `sub`, `aud`, `exp`.
- **Custom Claims**: `roles`, `permissions`.

```json
{
    "iss": "string",
    "sub": "string",
    "aud": ["$.or", "string", ["$.list", "string"]], // Audience can be string or list
    "exp": "uint(0,)",                                // Expiration (timestamp)
    "iat?": "uint(0,)",
    "roles->[]": "string",
    "scope?": "string"
}
```

## 4. Configuration File

Validating an application configuration object (e.g., from `config.json`).

- **Environment**: Enum.
- **Deep Structure**: Database config.
- **Recursively Strict**: `$.equal` ensures no typos in nested keys.

```json
["$.equal", {
    "env": ["$.enum", "development", "staging", "production"],
    "port": "uint16(1024, 65535)",
    "database": {
        "host": "string",
        "port": "uint16",
        "pool": {
            "min": "uint8",
            "max": "uint8"
        }
    },
    "features->{}?": "boolean" // Map: feature flags (key=string, val=bool)
}]
```

## 5. Form Data (JSON String)

Validating a JSON string submitted from a frontend form (e.g., hidden input).

- **$.string**: Parses the string first.
- **Validation**: Checks the parsed object.

```json
["$.string", ["$.strict", {
    "productId": "uint",
    "quantity": "uint(1, 10)",
    "options->{Val}": "string"
}]]
```

## 6. Discriminated Union (Events)

Validating an event object that could be one of several types.

- **Discriminator**: `type` field.
- **$.or**: Matches one of the object shapes.

```json
["$.or",
    // Login Event
    {
        "type": "==login",
        "userId": "uint",
        "timestamp": "uint"
    },
    // Purchase Event
    {
        "type": "==purchase",
        "userId": "uint",
        "amount": "uint",
        "currency": ["$.enum", "USD", "EUR", "CNY"]
    },
    // Pageview Event
    {
        "type": "==pageview",
        "url": "~=^https?://",
        "duration?": "uint"
    }
]
```
