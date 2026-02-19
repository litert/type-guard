## 5. 修饰符（`$.xxx`）

### 5.1 `$.or`

`$.or` 表示**联合类型**，要求数据满足任意一个子规则即通过验证。这是 TypeGuard 的**默认修饰符**，可以省略。

**基础语法**

```json
["$.or", "string", "int"]
["string", "int"]  // 省略 $.or，效果相同
```

**实际应用示例**

```typescript
// 接受字符串或数字
compiler.compile({ rule: ['string', 'number'] });
// ✓ "hello"
// ✓ 123
// ✗ true

// 多类型配置值
compiler.compile({ rule: ['string', 'boolean', 'null'] });
// ✓ "enabled"
// ✓ true
// ✓ null

// 联合对象类型
compiler.compile({ 
    rule: [
        { type: '==success', data: 'string' },
        { type: '==error', code: 'uint32' }
    ]
});
// ✓ { type: "success", data: "ok" }
// ✓ { type: "error", code: 404 }
```

### 5.2 `$.and`

`$.and` 表示**交集条件**，要求数据必须**同时满足**所有子规则才能通过验证。常用于组合类型校验与数值过滤器、字符串断言等约束条件。

**基础语法**

```json
["$.and", rule1, rule2, ...]
```

**实际应用示例**

```typescript
// 整数且在范围内
compiler.compile({ rule: ['$.and', 'int', '|value between 1 100'] });
// ✓ 50
// ✗ 150  // 超出范围
// ✗ 50.5  // 不是整数

// 字符串且满足格式要求
compiler.compile({ rule: ['$.and', 'string', '~=/^[A-Z]{3}\\d{3}$/'] });
// ✓ "ABC123"
// ✗ "abc123"

// 数组且长度受限
compiler.compile({ rule: ['$.and', 'array', '|array.length between 1 10'] });
// ✓ [1, 2, 3]
// ✗ []

// 对象且字段数量受限
compiler.compile({
    rule: ['$.and', { name: 'string', age: 'uint8' }, '|length eq 2']
});
```

### 5.3 `$.not`

`$.not` 表示**否定规则**，要求数据**不得匹配**任意一个子规则，用于排除特定类型或值。

**基础语法**

```json
["$.not", rule1, rule2, ...]
```

**实际应用示例**

```typescript
// 排除字符串和数字 0
compiler.compile({ rule: ['$.not', 'string', 0] });
// ✓ 123
// ✓ true
// ✗ "hello"
// ✗ 0

// 排除特定空值
compiler.compile({ rule: ['$.not', null, undefined] });
// ✓ "anything"
// ✓ 0
// ✗ null

// 与 $.and 组合：非负整数
compiler.compile({ rule: ['$.and', 'int', ['$.not', '|value lt 0']] });
// ✓ 0
// ✓ 100
// ✗ -1
```

### 5.4 `$.string`

`$.string` 启用**字符串输入解释模式**（from-string），常用于处理 URL 查询参数、表单字段或 JSON 字符串。

**基础语法**

```json
["$.string", rule]
```

**工作原理**

1. 输入为字符串时，尝试 `JSON.parse()`。
2. 解析成功后按 `rule` 验证解析结果。
3. 输入非字符串或解析失败时，按原值进入验证。

**实际应用示例**

```typescript
// 字符串数字
compiler.compile({ rule: ['$.string', 'uint32'] });
// ✓ "123"
// ✓ 123
// ✗ "abc"

// JSON 字符串对象
compiler.compile({ rule: ['$.string', { age: 'uint8' }] });
// ✓ "{\"age\":25}"
// ✓ { age: 25 }
// ✗ "{\"age\":\"old\"}"
```
### 5.5 `$.strict`

对象顶层严格匹配：不允许额外字段。

```json
["$.strict", {
    "a": "uint",
    "b": { "c": "string" }
}]
```

> [!NOTE]
> `$.strict` 仅约束当前对象层级的严格性，子对象（如上例中 `b` 的值）默认仍为宽松模式。如需子对象也严格匹配，需在子对象规则上单独使用 `$.strict`。如需递归严格匹配所有层级，请使用 `$.equal`。

### 5.6 `$.equal`

递归严格匹配：对子对象也严格。

```json
["$.equal", {
    "a": "uint",
    "b": { "c": "string" }
}]
```

> [!IMPORTANT]
> `$.equal` 会将严格性递归应用到所有子层级，所有子对象都将自动进行严格匹配，不允许任何额外字段。这与 `$.strict` 只约束当前层级的行为不同。

### 5.7 `$.type`

`$.type` 用于在规则内定义可复用的预定义类型。

**基础语法**

```json
["$.type", "TypeName", rule]
```

**引用语法**

```json
"@TypeName"
"@TypeName(arg1, arg2)"
```

**实际应用示例**

```typescript
compiler.compile({
    rule: {
        a: ['$.type', 'Username', 'string(3,16)'],
        b: '@Username',
        c: '@Username'
    }
});

compiler.addPredefinedType('Email', function(v) {
    return typeof v === 'string' && /^[^@]+@[^@]+$/.test(v);
});

compiler.compile({ rule: '@Email' });
```

> [!TIP]
> 需要跨多个规则复用时，优先使用 `compiler.addPredefinedType()` 全局注册。

### 5.8 `$.enum`（v1.4.0+）

字面量枚举：

```json
["$.enum", "a", "b", 1, true, null]
```

允许成员类型：`string`、`number`、`boolean`、`null`。

> [!NOTE]
> `$.enum` 中的字符串成员是普通字面量值，不会被解释为 `==text` 等其他规则语法，仅进行严格值相等比较。

## 6. 字符串断言规则

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

