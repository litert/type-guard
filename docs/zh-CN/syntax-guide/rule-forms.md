# 规则形态总览

TypeGuard 的规则输入是一个 JSON 可表达的结构，核心形态如下：

- 字符串规则：`"string"`、`"uint32"`、`"@MyType(1,2)"`、`"==hello"`
- 字面量规则：`123`、`true`、`false`、`null`
- 对象规则：`{ "name": "string", "age?": "uint8" }`
- 数组修饰规则：`["$.array", 3, "string"]`
- 复合规则：`["$.or", "string", "int"]`

