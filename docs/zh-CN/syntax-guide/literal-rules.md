# 字面量规则

字面量规则是 TypeGuard 中最简单的验证形式。如果你提供一个原始的 JSON 值作为规则，TypeGuard 将验证输入是否严格等于 (`===`) 该值。

这对于标志位、状态码、魔术数字或强制特定常量非常有用。

## 支持的字面量

| JavaScript 类型 | 规则示例 | 验证内容 |
| :--- | :--- | :--- |
| `number` | `123`, `0`, `-5.5` | 数值的精确相等。 |
| `boolean` | `true`, `false` | 布尔值的精确相等。 |
| `null` | `null` | 精确的 `null` 值。 |

> [!WARNING]
> **字符串不是字面量规则。**
> 规则位置的字符串（例如 `"admin"`）会被解析为**类型名称**（即“检查是否为 `admin` 类型”）。
> 要匹配字符串字面量，你必须使用断言语法：`"==admin"`。

## 使用示例

### 1. 状态标志

强制某个字段必须为 `true`（例如，用户必须同意条款）。

```typescript
const rule = {
    "agreedToTerms": true
};
// ✓ { "agreedToTerms": true }
// ✗ { "agreedToTerms": false }
```

### 2. 魔术数字或版本

```typescript
const rule = {
    "version": 1,
    "platformId": 1024
};
```

### 3. 可空字段（通过联合）

通过联合（`$.or`）将字面量 `null` 与其他类型结合，创建可空字段。

```typescript
// 字符串 OR null
const rule = ["string", null];

// ✓ "hello"
// ✓ null
// ✗ undefined
// ✗ 123
```

## 字面量与 `$.enum` 的对比

如果你需要检查**一个**特定的值，字面量规则是最快速、最简单的。
如果你需要检查**多个**允许的值，请使用 `$.enum`。

```javascript
// 单一值 (Literal Rule)
"type": 1

// 多个值 (Enum Modifier)
"type": ["$.enum", 1, 2, 3]
```

## 注意事项

1.  **字符串混淆**：
    *   `null` (关键字) 验证值 `null`。
    *   `"null"` (字符串) 验证名为 `null` 的类型（这是一个检查 `null` 的内建类型）。在这个特定情况下，它们的行为相同，但 `"boolean"` (类型) vs `true` (值) 完全不同。
2.  **Undefined**：
    *   `undefined` 无法在标准 JSON 中表示。要检查 `undefined`，请使用内建类型字符串 `"undefined"` 或 `"void"`。

