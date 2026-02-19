# 数值过滤器（`|...`）

语法：

```text
|<target> <rel> <args...>
```

### 7.1 target

过滤器的 `target` 指定对数据的哪个属性进行比较。

| Target | 说明 | 适用场景 | 示例 |
|--------|------|----------|------|
| `value` | 数据值本身 | 用于数值类型 | `\|value gt 100` |
| `length` | 对象的键数量或数组长度 | 用于对象或数组 | `\|length eq 3` |
| `string.length` | 字符串长度（字符数） | 用于字符串 | `\|string.length between 3 10` |
| `array.length` | 数组长度（元素数量） | 用于数组 | `\|array.length le 100` |
| 内建数值类型 | 先验证类型，再比较值 | 类型+范围约束 | `\|uint lt 256`<br>`\|int between -100 100` |

**使用示例**

```typescript
// value: 检查数值本身
compiler.compile({ rule: ['$.and', 'number', '|value gt 0'] });
// ✓ 1, 100.5
// ✗ 0, -1

// length: 检查对象键数量
compiler.compile({ rule: ['$.and', 'struct', '|length between 1 5'] });
// ✓ { a: 1 }
// ✓ { a: 1, b: 2, c: 3 }
// ✗ {}

// string.length: 检查字符串长度
compiler.compile({ rule: ['$.and', 'string', '|string.length ge 5'] });
// ✓ "hello"
// ✗ "hi"

// array.length: 检查数组长度
compiler.compile({ rule: ['$.and', 'array', '|array.length le 10'] });
// ✓ [1, 2, 3]
// ✗ [1, 2, ... 20 个元素]

// 内建类型: 类型验证 + 范围约束
compiler.compile({ rule: '|uint lt 256' });
// ✓ 0, 1, 255
// ✗ 256, -1, "123"
```

### 7.2 比较符

| 比较符 | 别名 | 说明 | 示例 |
|--------|------|------|------|
| `gt` | `>` | 大于 | `\|value gt 100` |
| `ge` | `gte`, `>=` | 大于等于 | `\|value ge 1` |
| `lt` | `<` | 小于 | `\|value lt 255` |
| `le` | `lte`, `<=` | 小于等于 | `\|length le 16` |
| `eq` | `==` | 等于 | `\|value eq 42` |
| `ne` | `!=` | 不等于 | `\|value ne 0` |
| `between a b` | — | 在范围 [a, b] 内（闭区间） | `\|value between 1 199` |
| `timesof n` | — | 是 n 的倍数 | `\|uint timesof 10` |

**使用示例**

```json
"|value between 1 199"
"|value gt 1"
"|length le 16"
"|string.length ge 3"
"|array.length between 1 10"
"|uint timesof 10"
```

> [!WARNING]
> 过滤器中的比较参数必须是有效的数值字符串，否则会抛出 `TypeError`。

