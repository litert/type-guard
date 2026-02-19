# 语法糖与简写规则

### 8.1 前缀

| 前缀语法 | 等价形式 | 说明 | 示例 |
|----------|----------|------|------|
| `?type` | `["$.or", "void", type]` | 可选类型，允许 undefined | `"?string"`<br>`"?uint32"` |
| `!type` | `["$.not", type]` | 否定类型，不允许该类型 | `"!string"`<br>`"!null"` |
| `@TypeName` | 引用自定义类型 | 引用已注册或内联定义的类型 | `"@IPv4"`<br>`"@Email"` |
| `@TypeName(args)` | 带参数的类型引用 | 传递参数给自定义类型 | `"@range(1,100)"`<br>`"@enum(a,b,c)"` |

**使用示例**

```typescript
// ?type: 可选类型
compiler.compile({ rule: { name: 'string', age: '?uint8' } });
// ✓ { name: "alice", age: 25 }
// ✓ { name: "bob" }  // age 可省略

// !type: 否定类型
compiler.compile({ rule: ['!string', '!null'] });
// ✓ 123, true, []
// ✗ "hello", null

// @TypeName: 引用自定义类型
compiler.addPredefinedType('IPv4', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
compiler.compile({ rule: '@IPv4' });
// ✓ "192.168.1.1"

// @TypeName(args): 带参数引用
compiler.addPredefinedType('trim_string', (v, min, max) => 
    typeof v === 'string' && v.trim().length >= min && v.trim().length <= max
);
compiler.compile({ rule: '@trim_string(2,16)' });
// ✓ "  hello  " (trim 后长度为 5)
```

### 8.2 后缀

| 后缀语法 | 等价形式 | 说明 | 示例 |
|----------|----------|------|------|
| `type[]` | `["$.list", type]` | 不定长列表（任意长度） | `"string[]"`<br>`"uint32[]"` |
| `type[N]` | `["$.array", N, type]` | 定长数组（恰好 N 个元素） | `"string[3]"`<br>`"int[5]"` |
| `type[N,M]` | `["$.array", [N,M], type]` | 区间长度数组（N 到 M 个元素） | `"string[1,5]"`<br>`"uint[2,10]"` |
| `type[N,]` | `["$.array", [N], type]` | 最小长度数组（至少 N 个元素） | `"string[1,]"`<br>`"int[3,]"` |
| `type{}` | `["$.map", type]` | 映射（对象值类型约束） | `"string{}"`<br>`"uint32{}"` |

**使用示例**

```typescript
// type[]: 不定长列表
compiler.compile({ rule: 'string[]' });
// ✓ [], ["a"], ["a", "b", "c"]

// type[N]: 定长数组
compiler.compile({ rule: 'uint8[3]' });
// ✓ [1, 2, 3]
// ✗ [1, 2], [1, 2, 3, 4]

// type[N,M]: 区间长度数组
compiler.compile({ rule: 'string[2,5]' });
// ✓ ["a", "b"], ["a", "b", "c", "d", "e"]
// ✗ ["a"], ["a", "b", "c", "d", "e", "f"]

// type[N,]: 最小长度数组
compiler.compile({ rule: 'int[1,]' });
// ✓ [1], [1, 2, 3, ...]
// ✗ []

// type{}: 映射类型
compiler.compile({ rule: 'number{}' });
// ✓ { a: 1, b: 2 }
// ✗ { a: 1, b: "2" }  // 值必须都是 number
```

### 8.3 对象键语法糖

对象键语法糖允许在对象规则的键名上使用特殊后缀，简化常见结构类型的定义。这些语法糖是 TypeGuard 的高频特性，能大幅提升规则的可读性。

#### 8.3.1 基础语法表

| 语法糖 | 等价形式 | 说明 | 适用场景 |
|--------|----------|------|----------|
| `field?` | 可选字段 | 字段可以存在或不存在 | 可选配置项、可选属性 |
| `field->[]` | `["$.list", ...]` | 字段值为不定长列表 | 标签数组、评论列表 |
| `field->[N]` | `["$.array", N, ...]` | 字段值为定长数组 | RGB 颜色、坐标点 |
| `field->[N,M]` | `["$.array", [N,M], ...]` | 字段值为区间长度数组 | 分页结果、批量数据 |
| `field->[N,]` | `["$.array", [N], ...]` | 字段值为最小长度数组 | 至少一项的列表 |
| `field->{}` | `["$.map", ...]` | 字段值为映射对象 | 键值对配置、字典 |
| `field->()` | `["$.strict", ...]` | 字段值严格匹配（不允许额外键） | 精确结构验证 |
| `field->(=)` | `["$.equal", ...]` | 字段值递归严格匹配 | 深度结构验证 |

#### 8.3.2 可选字段 `field?`

```typescript
// 可选年龄字段
compiler.compile({ 
    rule: {
        name: 'string',
        age?: 'uint8'
    }
});
// ✓ { name: "alice" }
// ✓ { name: "bob", age: 25 }

// 多个可选字段
compiler.compile({ 
    rule: {
        id: 'uint32',
        'email?': 'string',
        'phone?': 'string',
        'address?': 'string'
    }
});
```

#### 8.3.3 列表字段 `field->[]`

```typescript
// 不定长标签列表
compiler.compile({ 
    rule: {
        title: 'string',
        'tags->[]': 'string'
    }
});
// ✓ { title: "Post", tags: [] }
// ✓ { title: "Post", tags: ["tech", "js"] }

// 对象列表
compiler.compile({ 
    rule: {
        'users->[]': {
            id: 'uint32',
            name: 'string'
        }
    }
});
// ✓ { users: [{ id: 1, name: "alice" }, { id: 2, name: "bob" }] }
```

#### 8.3.4 数组字段 `field->[N]` / `field->[N,M]` / `field->[N,]`

```typescript
// 定长数组：RGB 颜色
compiler.compile({ 
    rule: {
        name: 'string',
        'color->[3]': 'uint8'
    }
});
// ✓ { name: "red", color: [255, 0, 0] }
// ✗ { name: "red", color: [255, 0] }

// 区间长度数组：1-5 个角色
compiler.compile({ 
    rule: {
        username: 'string',
        'roles->[1,5]': 'string'
    }
});
// ✓ { username: "admin", roles: ["admin", "moderator"] }
// ✗ { username: "admin", roles: [] }

// 最小长度数组：至少一个技能
compiler.compile({ 
    rule: {
        name: 'string',
        'skills->[1,]': 'string'
    }
});
// ✓ { name: "alice", skills: ["js", "ts", "python"] }
// ✗ { name: "bob", skills: [] }
```

#### 8.3.5 映射字段 `field->{}`

```typescript
// 字符串键值对
compiler.compile({ 
    rule: {
        name: 'string',
        'metadata->{}': 'string'
    }
});
// ✓ { name: "config", metadata: { author: "alice", version: "1.0" } }
// ✗ { name: "config", metadata: { count: 123 } }  // 值必须是字符串

// 数值配置映射
compiler.compile({ 
    rule: {
        'settings->{}': 'number'
    }
});
// ✓ { settings: { timeout: 3000, retries: 5 } }
```

#### 8.3.6 严格字段 `field->()` 与 `field->(=)`

```typescript
// field->(): 单层严格匹配
compiler.compile({ 
    rule: {
        'config->()': {
            host: 'string',
            port: 'uint16'
        }
    }
});
// ✓ { config: { host: "localhost", port: 3000 } }
// ✗ { config: { host: "localhost", port: 3000, debug: true } }  // 不允许 debug

// field->(=): 递归严格匹配
compiler.compile({ 
    rule: {
        'settings->(=)': {
            db: {
                host: 'string',
                port: 'uint16'
            }
        }
    }
});
// ✓ { settings: { db: { host: "localhost", port: 5432 } } }
// ✗ { settings: { db: { host: "localhost", port: 5432, pool: 10 } } }  // db 不允许额外键
```

#### 8.3.7 组合使用

多个语法糖可以组合使用，创建复杂结构：

```typescript
compiler.compile({ 
    rule: {
        id: 'uint32',
        title: 'string',
        'author?': 'string',                    // 可选
        'tags->[]': 'string',                   // 不定长列表
        'comments->[0,100]': {                  // 最多 100 条评论
            user: 'string',
            content: 'string',
            'replies->[0,10]': {                // 每条评论最多 10 条回复
                user: 'string',
                content: 'string'
            }
        },
        'metadata->{}?': 'string',              // 可选的字符串映射
        'settings->()': {                       // 严格配置对象
            visible: 'boolean',
            pinned: 'boolean'
        }
    }
});
```

> [!TIP]
> 对象键语法糖可以显著减少规则的嵌套层次和冗余代码，是编写清晰、易维护规则的关键技巧。在实际项目中，推荐优先使用这些语法糖而非等价的完整形式。

