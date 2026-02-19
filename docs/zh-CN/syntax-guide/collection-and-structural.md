# 集合与结构类型

### 4.1 数组与列表

#### `$.list`（不定长数组）

`$.list` 用于表示元素类型不限、长度不限的数组。

**语法：**

```json
["$.list", elementType]
["$.list", elementType1, elementType2, ...]
```

**示例：**

```ts
// 字符串数组，任意长度
compiler.compile({ rule: ['$.list', 'string'] });
// 匹配：[]、["a"]、["a", "b", "c"]

// 字符串或整数混合数组
compiler.compile({ rule: ['$.list', 'string', 'uint32'] });
// 匹配：[]、["a", 123]、[456, "b"]

// 对象数组
compiler.compile({ rule: ['$.list', { id: 'uint32', name: 'string' }] });
// 匹配：[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### `$.array`（定长/区间长度数组）

`$.array` 用于精确控制数组长度。

**语法：**

```json
["$.array", exactLength, elementType]
["$.array", [minLength, maxLength], elementType]
["$.array", [minLength], elementType]
```

**示例：**

```ts
// 恰好 3 个字符串
compiler.compile({ rule: ['$.array', 3, 'string'] });
// 匹配：["a", "b", "c"]
// 不匹配：["a", "b"]、["a", "b", "c", "d"]

// 2 到 5 个元素
compiler.compile({ rule: ['$.array', [2, 5], 'string'] });
// 匹配：["a", "b"]、["a", "b", "c", "d", "e"]
// 不匹配：["a"]、["a", "b", "c", "d", "e", "f"]

// 至少 2 个元素
compiler.compile({ rule: ['$.array', [2], 'string'] });
// 匹配：["a", "b"]、["a", "b", "c", ...]

// 定长多类型数组
compiler.compile({ rule: ['$.array', 2, 'string', 'int'] });
// 匹配：["a", "b"]、["a", 123]、[456, "b"]、[789, 0]
```

**实际应用场景：**

```ts
// RGB 颜色值数组（恰好 3 个 0-255 整数）
const isRGB = compiler.compile({ rule: ['$.array', 3, 'uint8'] });

// 分页查询结果（最少 1 条，最多 100 条）
const isPageItems = compiler.compile({ 
    rule: ['$.array', [1, 100], { id: 'uint32', title: 'string' }] 
});
```

### 4.2 元组 `$.tuple`

元组用于定义"每个位置元素类型不同"的数组。

**基础语法：**

```json
["$.tuple", type1, type2, ...]
```

**可选元素语法：**

- `...N`：前一个类型连续重复 N 次（可选）
- `...`：前一个类型应用于剩余全部元素（可选）

**示例：**

```ts
// 固定 2 元素：字符串 + 整数
compiler.compile({ rule: ['$.tuple', 'string', 'int'] });
// 匹配：["hello", 123]
// 不匹配：["hello"]、["hello", 123, 456]

// 无限尾部：字符串 + 整数 + 任意多个整数
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...'] });
// 匹配：["hello", 1]、["hello", 1, 2, 3]

// 限定可选元素：字符串 + 整数 + 最多 3 个整数 + 字符串
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...3', 'string'] });
// 匹配：["a", 1, 2, 3, "z"]、["a", 1, "z"]
// 不匹配：["a", 1, 2, 3, 4, "z"]（超过 3 个可选整数）

// 混合可选：字符串 + 整数 + 最多 4 个整数 + 字符串 + 任意多个字符串
compiler.compile({ rule: ['$.tuple', 'string', 'int', '...4', 'string', '...'] });
// 匹配：["a", 1, 2, "z"]、["a", 1, 2, 3, 4, "z", "extra"]
```

**实际应用：**

```ts
// 坐标点：[x, y]
const isPoint2D = compiler.compile({ rule: ['$.tuple', 'float', 'float'] });

// CSV 行：第一列是 ID，后续任意列
const isCSVRow = compiler.compile({ rule: ['$.tuple', 'uint32', 'string', '...'] });
```

### 4.3 映射 `$.map`

`$.map` 修饰符用于创建映射类型（Map），要求数据为纯对象，所有键的值必须符合指定的值规则。

**基础语法**

```json
["$.map", "string"]
```

验证一个对象，要求所有键的值都是字符串类型。

**带键类型约束**

```json
["$.map", "string", "uint32"]
```

第三个参数指定键的类型规则（本例要求键为 uint32）。

**实际应用示例**

```typescript
// 配置项映射：键为任意字符串，值为 number
const configRule = ["$.map", "number"];
// ✓ { "timeout": 3000, "retries": 5 }
// ✗ { "timeout": "3000" }  // 值不是 number

// 用户权限表：键为用户 ID（uint32），值为角色字符串
const permissionsRule = ["$.map", "string", "uint32"];
// ✓ { "1001": "admin", "1002": "user" }
// ✗ { "user1": "admin" }  // 键不是 uint32
```

**作为剩余键规则（Rest Mapping）**

`$.map` 可用于对象中定义未明确指定的键的验证规则：

```json
{
    "id": "uint32",
    "$.map": "string"
}
```

此规则要求对象必须包含 `id` 键（类型为 uint32），其他所有键的值必须是字符串。

> [!IMPORTANT]
> 一个对象规则中只能使用一个 `$.map` 作为剩余键规则。

### 4.4 字典 `$.dict`

`$.dict` 修饰符用于验证对象必须包含指定的键，每个指定键的值必须符合相同的类型规则。

**基础语法**

```json
["$.dict", ["a", "b"], "string"]
```

要求对象必须包含键 `a` 和 `b`，它们的值都必须是字符串类型。默认**允许额外的键存在**。

**实际应用示例**

```typescript
// API 响应头验证：必须包含 content-type 和 authorization
const headersRule = ["$.dict", ["content-type", "authorization"], "string"];
// ✓ { "content-type": "application/json", "authorization": "Bearer xxx" }
// ✓ { "content-type": "text/html", "authorization": "Basic yyy", "cache-control": "no-cache" }  // 允许额外键
// ✗ { "content-type": "application/json" }  // 缺少 authorization
```

**严格模式字典**

如果不希望允许额外的键，可结合 `$.strict` 修饰符：

```json
["$.strict", "$.dict", ["a", "b"], "string"]
```

此规则要求对象**只能**包含键 `a` 和 `b`，不允许任何额外的键。

```typescript
// 严格的配置项验证
const strictConfigRule = ["$.strict", "$.dict", ["host", "port"], "string"];
// ✓ { "host": "localhost", "port": "3000" }
// ✗ { "host": "localhost", "port": "3000", "protocol": "http" }  // 不允许额外的 protocol 键
```

### 4.5 对象规则

对象规则使用 JSON 对象字面量语法，直接定义每个键的类型规则。

**基础对象（宽松模式）**

```json
{
    "name": "string",
    "age": "uint8"
}
```

此规则要求对象必须包含 `name`（字符串）和 `age`（uint8）两个键，**默认允许额外的键存在**。

**可选键**

在键名后添加 `?` 表示该键为可选：

```json
{
    "name": "string",
    "age?": "uint8"
}
```

此规则要求对象必须包含 `name` 键，`age` 键可以存在也可以不存在。

**实际应用示例**

```typescript
// 用户资料验证
const userProfileRule = {
    "username": "string",
    "email": "string",
    "age?": "uint8",       // 年龄可选
    "phone?": "string"     // 电话可选
};
// ✓ { "username": "alice", "email": "alice@example.com" }
// ✓ { "username": "bob", "email": "bob@example.com", "age": 25 }
// ✗ { "username": "charlie" }  // 缺少必需的 email

// 嵌套对象
const orderRule = {
    "orderId": "string",
    "customer": {
        "name": "string",
        "address": "string"
    },
    "items": ["$.array", {
        "productId": "string",
        "quantity": "uint32"
    }]
};
```

> [!TIP]
> 如果需要禁止额外的键，请使用 `$.strict` 修饰符（见 [5.5 节](./modifiers.md#55-strict)）；如果需要值完全相等检查，请使用 `$.equal` 修饰符（见 [5.6 节](./modifiers.md#56-equal)）。

