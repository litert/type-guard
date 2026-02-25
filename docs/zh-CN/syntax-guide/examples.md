# 实战示例

本章提供了针对常见现实场景的验证规则及其用完整示例。

## 1. REST API 查询参数

验证列表 API 的查询参数（例如 `GET /users`）。

- **严格模式**：不允许非预期的参数。
- **分页**：`page`, `pageSize` 及其范围。
- **搜索**：可选的 `q` 字符串。
- **排序**：`sort` 枚举。

```json
["$.strict", {
    "page?": "uint32(1,)",               // 最小值为 1
    "pageSize?": "uint8(1,100)",         // 每页 1-100 条
    "q?": "string(0,100)",               // 搜索关键词最长 100 字符
    "sort?": ["$.enum", "asc", "desc"],  // 排序方向
    "orderBy?": ["$.enum", "id", "created_at", "name"]
}]
```

## 2. API JSON Body (用户注册)

验证创建新用户的 JSON 载荷。

- **Email**: 正则验证。
- **Password**: 最小长度。
- **Age**: 可选，限制范围。
- **Tags**: 字符串列表。

```json
["$.strict", {
    "username": "string(3, 32)",
    "email": "~=^[^@]+@[^@]+\\.[^@]+$",
    "password": "string(8, 128)",
    "age?": "uint8(13, 120)",
    "tags->[]": "string(1, 20)",         // 标签数组
    "newsletter?": "boolean"
}]
```

## 3. JWT 载荷结构

验证解码后的 JSON Web Token 载荷。

- **标准声明**: `iss`, `sub`, `aud`, `exp`。
- **自定义声明**: `roles`, `scope`。

```json
{
    "iss": "string",
    "sub": "string",
    "aud": ["$.or", "string", ["$.list", "string"]], // 接受者可以是字符串或列表
    "exp": "uint(0,)",                                // 过期时间 (时间戳)
    "iat?": "uint(0,)",
    "roles->[]": "string",
    "scope?": "string"
}
```

## 4. 配置文件

验证应用程序配置对象（例如来自 `config.json`）。

- **环境**: 枚举。
- **深层结构**: 数据库配置。
- **递归严格**: `$.equal` 确保嵌套键中没有拼写错误。

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
    "features->{}?": "boolean" // Map: 功能标志 (key=string, val=bool)
}]
```

## 5. 表单数据 (JSON 字符串)

验证从前端表单提交的 JSON 字符串（例如隐藏输入框）。

- **$.string**: 首先解析字符串。
- **验证**: 检查解析后的对象。

```json
["$.string", ["$.strict", {
    "productId": "uint",
    "quantity": "uint(1, 10)",
    "options->{}?": "string"
}]]
```

## 6. 说明符联合 (事件)

验证可能是几种类型之一的事件对象。

- **说明符**: `type` 字段。
- **$.or**: 匹配对象形状之一。

```json
["$.or",
    // 登录事件
    {
        "type": "==login",
        "userId": "uint",
        "timestamp": "uint"
    },
    // 购买事件
    {
        "type": "==purchase",
        "userId": "uint",
        "amount": "uint",
        "currency": ["$.enum", "USD", "EUR", "CNY"]
    },
    // 页面访问事件
    {
        "type": "==pageview",
        "url": "~=^https?://",
        "duration?": "uint"
    }
]
```
