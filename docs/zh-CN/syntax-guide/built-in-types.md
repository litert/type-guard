# 基础类型（Built-in Types）

来源：`src/lib/BuiltInTypes.ts` 与 `src/lib/BuiltInTypeCompiler.ts`。

### 2.1 类型列表

| 类别 | 类型 | 说明 |
| --- | --- | --- |
| 字符串 | `string` | 任意字符串 |
|  | `ascii_string` | ASCII 字符串 |
|  | `latin_string` | 拉丁字符集字符串 |
|  | `hex_string` | 十六进制字符串 |
| 整数 | `int` | 有符号整数 |
|  | `int8` / `int16` / `int32` / `int64` | 位宽整数（`int64` 在 JS 中按整数语义校验） |
|  | `safe_int` | JS 安全整数范围 |
| 无符号整数 | `uint` | 无符号整数 |
|  | `uint8` / `uint16` / `uint32` / `uint64` | 位宽无符号整数 |
|  | `safe_uint` | JS 安全无符号整数范围 |
| 数值 | `number` | 任意 number |
|  | `float` | 浮点数/整数（number） |
|  | `ufloat` | 非负 number |
|  | `numeric` | 数值或可解析数值字符串 |
| 十进制字符串 | `decimal` | 十进制字符串，可传 `(M,D)` |
|  | `udecimal` | 无符号十进制字符串，可传 `(M,D)` |
| 布尔 | `boolean` | `true` / `false` |
|  | `true` / `false` | 布尔字面量 |
|  | `true_value` / `false_value` | 逻辑真/逻辑假 |
| 结构 | `array` | 任意数组 |
|  | `struct` | 任意对象结构 |
| 特殊 | `null` | null |
|  | `undefined` / `void` / `optional` | undefined（同义） |
|  | `required` | 非 undefined |
|  | `any` | 任意值（总是通过） |

### 2.2 参数规则

#### 数值范围参数

适用于：`int`、`float`、`number`、`numeric`。

> [!WARNING]
> `uint` 及其位宽变体（`uint8`、`uint16`、`uint32`、`uint64`、`safe_uint`）**不支持**范围参数。
> 如需约束无符号整数范围，请使用 `["$.and", "uint", "|value between min max"]` 或数值过滤器。

**语法与示例：**

```ts
// 有符号整数范围
compiler.compile({ rule: 'int(-10, 20)' });   // -10 到 20
compiler.compile({ rule: 'int(-10,)' });      // 大于等于 -10
compiler.compile({ rule: 'int(,20)' });       // 小于等于 20

// 浮点数范围
compiler.compile({ rule: 'float(0.0, 1.0)' });
compiler.compile({ rule: 'number(1.5, 99.9)' });

// 数值字符串范围
compiler.compile({ rule: 'numeric(-100, 100)' });
```

#### 字符串长度参数

适用于：`string`、`ascii_string`、`latin_string`、`hex_string`。

**语法与示例：**

```ts
// 固定长度
compiler.compile({ rule: 'string(8)' });      // 恰好 8 个字符

// 长度范围
compiler.compile({ rule: 'string(1, 32)' });  // 1 到 32 个字符

// 最小长度
compiler.compile({ rule: 'string(3,)' });     // 至少 3 个字符
```

**实际应用：**

```ts
// 用户名校验：3-16 位 ASCII 字符
const isUsername = compiler.compile({ rule: 'ascii_string(3,16)' });

// 验证码：恰好 6 位数字（配合正则）
const isCaptcha = compiler.compile({ rule: ['$.and', 'string(6)', '~=/^\\d{6}$/'] });
```

#### 十进制参数

适用于：`decimal`、`udecimal`（字符串形式的精确十进制数）。

**语法：**

- `decimal(M)`：总位数不超过 M 位
- `decimal(M,D)`：总位数 M 位，其中小数位 D 位

**示例：**

```ts
// 金额：最多 10 位数字，小数点后 2 位
compiler.compile({ rule: 'decimal(10,2)' });  // "12345678.90"

// 无符号金额
compiler.compile({ rule: 'udecimal(12,4)' });

// 整数形式（小数位为 0）
compiler.compile({ rule: 'decimal(8,0)' });   // "-1234567"
```

> [!NOTE]
> 编译器选项 `ignoreInvalidArgs` 控制对不接受参数的类型（如 `boolean`、`any`、`void`、`uint8` 等）传入参数时的行为：
> - 默认 `true`：忽略多余参数（兼容旧代码）
> - 设为 `false`：抛出 `SyntaxError`（推荐新项目使用，尽早发现错误）
>
> 该选项在 `createInlineCompiler(opts)` 和 `createCompiler(lang, opts)` 中传入。详见 [API Reference](../api-reference.md)。

