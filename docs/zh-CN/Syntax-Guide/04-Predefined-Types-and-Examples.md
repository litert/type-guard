## 9. 预定义类型与参数调用

### 9.1 内联定义

```json
{
    "a": ["$.type", "MyType", "string(1,32)"],
    "b": "@MyType"
}
```

注意，在同一个编译器上下文中，内联定义的预定义类型名称**必须唯一，不能重复定义相同名称的类型**。因此，其实通过代码手动注册和管理自定义预定义类型是更常见的做法，尤其是在需要复用或共享类型定义的场景中。

### 9.2 JavaScript 注册

```ts
compiler.addPredefinedType('enum', (v: unknown, ...args: unknown[]) =>
    args.includes(v)
);
```

规则中调用：

```json
"@enum(1, 2, 3, \"ok\", true, null)"
```

### 9.3 参数字面量类型

`@TypeName(...)` 的参数仅支持：

- 字符串（单引号或双引号）
- 数字（含负数、十六进制）
- 布尔值
- `null`

预定义类型名称允许字符：字母、数字、下划线、冒号、连字符、点。

## 10. 实战示例

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
