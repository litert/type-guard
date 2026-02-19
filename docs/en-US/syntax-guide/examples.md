# Practical Examples

### 10.1 API input validation

```json
["$.strict", {
    "page?": "uint32",
    "pageSize?": "uint8(1,100)",
    "query?": "string(0,128)",
    "filters->{}?": "string"
}]
```

### 10.2 Form string input validation

```json
["$.string", ["$.strict", {
    "age": "uint8(1,120)",
    "email": "~=^[^@]+@[^@]+\\.[^@]+$"
}]]
```

### 10.3 Config file validation (with enum)

```json
["$.equal", {
    "mode": ["$.enum", "dev", "test", "prod"],
    "port": "uint16(1,65535)",
    "features->{}?": "boolean"
}]
```
