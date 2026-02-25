# 自定义类型与参数调用

自定义类型允许你使用自己的验证逻辑扩展 TypeGuard。虽然内建类型涵盖了大多数需求，但对于诸如验证数据库中的用户 ID、复杂的字符串格式（如特定的 ISO 日期）或需要外部上下文的逻辑等特定领域检查，自定义类型是必不可少的。

## 1. 全局注册（推荐）

定义自定义类型的最常见方法是在编译器实例上全局注册它们。这使得该类型可用于该实例编译的所有规则。

### 方法

```typescript
compiler.addPredefinedType(name, validator);
```

-   **name**: 规则中使用的字符串名称（例如 `'Email'`, `'UserId'`）。
-   **validator**: 返回 `true`（有效）或 `false`（无效）的函数。它接收要检查的值作为第一个参数。

### 示例：简单类型

注册一个检查字符串是否为有效电子邮件格式的类型。

```typescript
compiler.addPredefinedType('Email', (value) => {
    return typeof value === 'string' && value.includes('@');
});

// 在规则中使用
const rule = "@Email";
```

### 示例：带参数的类型

你可以将参数传递给你的验证器函数。规则字符串中定义的参数将从第二个参数开始传递给验证器函数。

```typescript
// 定义一个范围检查器
compiler.addPredefinedType('range', (value, min, max) => {
    return typeof value === 'number' && value >= min && value <= max;
});

// 用法：在括号中传递参数
const rule = "@range(10, 20)";
```

## 2. 内联定义 (`$.type`)

你也可以使用 `$.type` 修饰器直接在规则内定义自定义类型。这对于在一个复杂的模式中定义可重用的子规则非有用，而无需污染全局命名空间。

### 语法

```json
["$.type", "TypeName", ruleDefinition]
```

一旦定义，你可以在同一个规则结构中的任何地方使用 `@TypeName` 引用它（由于提升行为，甚至可以在定义之前引用，尽管先定义后使用更加清晰）。

### 示例

```json
{
    // 定义 'ContactInfo' 类型一次
    "primaryContact": ["$.type", "ContactInfo", {
        "name": "string",
        "phone": "string(10,15)"
    }],
    
    // 复用它
    "emergencyContact": "@ContactInfo",
    "billingContact": "@ContactInfo"
}
```

> [!IMPORTANT]
> **作用域与唯一性**：内联类型使用编译器级别的上下文。其名称在单个 `compile()` 调用中必须唯一。如果你尝试在同一个规则树中定义 `["$.type", "MyType", ...]` 两次，它将抛出错误。

## 3. 参数语法与类型

调用自定义类型（或带参数的内建类型）时，你在括号中传递值。

```
@TypeName(arg1, arg2, ...)
```

参数必须是**字面量**。不支持复杂表达式、变量、对象或数组作为参数。

| 参数类型 | 语法示例 | 说明 |
| :--- | :--- | :--- |
| **字符串** | `"hello"`, `'world'` | 支持单引号和双引号。 |
| **数值** | `123`, `-5.5`, `0xFF` | 支持整数、浮点数、十六进制。 |
| **布尔值** | `true`, `false` | |
| **Null** | `null` | |

**无效调用：**

-   `@MyType([1,2])` (不允许数组)
-   `@MyType({a:1})` (不允许对象)
-   `@MyType(1 + 2)` (不允许表达式)

## 4. 命名规则

自定义类型名称必须遵循此正则表达式模式：`^[a-zA-Z0-9_\:\-\.]+$`

允许字符：
-   英文字母 (`a-z`, `A-Z`)
-   数字 (`0-9`)
-   下划线 (`_`)
-   冒号 (`:`)
-   连字符 (`-`)
-   点 (`.`)

> [!TIP]
> 在大型项目中使用命名空间名称（如 `App:User` 或 `db.ID`）以避免冲突。

## 注意事项

1.  **名称冲突**：如果你注册了一个名为 `User` 的全局类型，然后定义了一个内联类型 `["$.type", "User", ...]`，那么在该特定规则中，内联定义优先。
2.  **性能**：`addPredefinedType` 验证器在运行时验证期间被调用。保持它们快速。
3.  **安全性**：如果有基于用户输入构建代码的逻辑（虽然 TypeGuard 被设计为安全的，但自定义逻辑是你自己的责任），不要在验证器中使用 `eval` 或不安全的代码生成。

