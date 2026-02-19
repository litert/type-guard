# 实战示例

### 10.1 API 入参校验

```json
["$.strict", {
    "page?": "uint32",
    "pageSize?": "uint8(1,100)",
    "query?": "string(0,128)",
    "filters->{}?": "string"
}]
```

### 10.2 表单字符串输入校验

```json
["$.string", ["$.strict", {
    "age": "uint8(1,120)",
    "email": "~=^[^@]+@[^@]+\\.[^@]+$"
}]]
```

### 10.3 配置文件校验（包含枚举）

```json
["$.equal", {
    "mode": ["$.enum", "dev", "test", "prod"],
    "port": "uint16(1,65535)",
    "features->{}?": "boolean"
}]
```
