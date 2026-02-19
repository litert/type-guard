# 字符串断言规则

字符串断言会先确保值是字符串，再进行匹配。

### 6.1 快捷写法

| 表达式 | 说明 |
| --- | --- |
| `==text` / `=text` | 等于 |
| `!=text` | 不等于 |
| `%=text` | 等于（忽略大小写） |
| `%!text` | 不等于（忽略大小写） |
| `~=/re/flags` / `~/re/flags` | 正则匹配 |
| `~!/re/flags` | 正则不匹配 |
| `?=text` | 包含 |
| `?!text` | 不包含 |
| `*=text` | 包含（忽略大小写） |
| `*!text` | 不包含（忽略大小写） |
| `^=text` / `^!text` | 前缀匹配 / 非前缀 |
| `$=text` / `$!text` | 后缀匹配 / 非后缀 |

### 6.2 完整写法

| 表达式 | 等价快捷写法 |
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
| `:start-with-i:text` | 忽略大小写前缀 |
| `:not-start-with-i:text` | 忽略大小写非前缀 |
| `:end-with:text` | `$=text` |
| `:not-end-with:text` | `$!text` |
| `:end-with-i:text` | 忽略大小写后缀 |
| `:not-end-with-i:text` | 忽略大小写非后缀 |

### 6.3 使用示例

```typescript
// 等于检查
compiler.compile({ rule: '==hello' });
// ✓ "hello"
// ✗ "Hello", "world"

// 忽略大小写等于
compiler.compile({ rule: '%=hello' });
// ✓ "hello", "HELLO", "HeLLo"
// ✗ "world"

// 正则匹配：邮箱格式
compiler.compile({ rule: '~=/^[^@]+@[^@]+\\.[^@]+$/' });
// ✓ "user@example.com"
// ✗ "invalid.email"

// 包含检查
compiler.compile({ rule: '?=@gmail' });
// ✓ "user@gmail.com", "admin@gmail.co.uk"
// ✗ "user@yahoo.com"

// 前缀匹配：URL 协议
compiler.compile({ rule: '^=https://' });
// ✓ "https://example.com"
// ✗ "http://example.com"

// 后缀匹配：文件扩展名
compiler.compile({ rule: '$=.json' });
// ✓ "config.json", "data.json"
// ✗ "config.yaml"

// 组合使用：API 路径验证
compiler.compile({ 
    rule: {
        method: ['$.enum', 'GET', 'POST', 'PUT', 'DELETE'],
        path: ['$.and', 'string', '^=/api/']
    }
});
// ✓ { method: "GET", path: "/api/users" }
// ✗ { method: "GET", path: "/admin/users" }
```

