# 快速入门

## 0. 安装

推荐通过npm安装

```sh
npm i -S @litert/typeguard
```

在 Node.js 中使用：

```ts
import * as TyG from "@litert/typeguard";

const tgc = createJavaScriptCompiler();

const isValidString = tgc.compile(
  "string(1,255)"
);

console.log(isValidString("FF")); // true
console.log(isValidString("")); // false
console.log(isValidString(null)); // false
```

## 1. 基本规则

### 1.0. 基本类型（Elemental Types）

以校验整数为例为例：

```ts
tgc.compile("int");
```

其中 `int` 是 TypeGuard 支持的一种基本类型，表示“整数”。

目前有如下基本类型可用：

Type                | 取值范围
--------------------|-----------------------
string              | 字符串
ascii_string        | ASCII 字符串
latin_string        | 拉丁文字符串
hex_string          | 十六进制字符串
int                 | 任意有符号整数
int8                | 8 位有符号整数
int16               | 16 位有符号整数
int32               | 32 位有符号整数
int64               | 64 位有符号整数
uint                | 任意无符号整数
uint8               | 8 位无符号整数
uint16              | 16 位无符号整数
uint32              | 32 位无符号整数
uint64              | 64 位无符号整数
safe_int            | 精度安全的有符号整数
safe_uint           | 精度安全的无符号整数
float               | 浮点数
ufloat              | 无符号浮点数
decimal(M,D)        | M位有效数字，其中D位小数的精确十进制数（字符串）
udecimal(M,D)       | M位有效数字，其中D位小数的精确无符号十进制数（字符串）
number              | 任意有效数值
numeric             | 数值（可以是字符串）
boolean             | 布尔值
true                | 布尔真值
false               | 布尔假值
true_value          | 逻辑真值
false_value         | 逻辑假值
void                | 不存在的值
optional            | 同 void
undefined           | 同 void
required            | 存在的值（非 void ）
any                 | 任意值（即不检查）
array               | 数组
dict                | 字典
null                | NULL值

### 1.1. 基本类型增强校验

部分基本类型支持增强校验

- int/float/number/numberic

这些数值类型支持**取值范围校验**。

```ts
int(-15,89)             // 取值为 -15 ~ 89 的整数
float(-1000.123,-555)   // 取值为 -1000.123 ~ -555 的浮点数
number(123,255.23)      // 取值为 123 ~ 255.23 的实数
numeric(-1234,2222)     // 取值为 -1234 ~ 2222 的数值
```

- string/hex_string/latin_string/ascii_string

这些字符串类型支持**长度校验**

```ts
string                  // 无限长度的字符串
string(1,256)           // 长度为 1 ~ 255 的字符串
string(8)               // 长度为 8 的字符串
```

- 数组表达式（Array）

所有基本类型都支持如下写法，以表示该类型的数组：

> 以字符串 `string` 类型为例。

```ts
string[]        // 字符串数组
string[5]       // 有 5 个元素的字符串数组
string[0,5]     // 有 0 ~ 5 个元素的字符串数组
string(1,8)[3]  // 有 3 个元素的字符串数组，字符串长度为 1 ~ 8
```

- 映射表达式（Mapping）

所有基本类型都支持如下写法，以表示该类型的映射：

```ts
string{}        // 值类型为字符串的 Key-Value 映射
int{}           // 值类型为整数的 Key-Value 映射
```

### 1.2. 字符串增强匹配

对于字符串类型，支持如下的匹配校验语法：

Expression                  | Description
----------------------------|-------------------------------------------
`==text`                    | 内容为 `text` 的字符串
`=text`                     | 内容为 `text` 的字符串
`!=text`                    | 内容不等于 `text` 的字符串
`%=text`                    | 内容为 `text` 的字符串（忽略大小写）
`%!text`                    | 内容不等于 `text` 的字符串（忽略大小写）
`~=/abc/i`                  | 内容匹配正则表达式 `/abc/i` 的字符串
`~/abc/i`                   | 内容匹配正则表达式 `/abc/i` 的字符串
`~!/abc/i`                  | 内容不匹配正则表达式 `/abc/i` 的字符串
`?=text`                    | 内容包含 `text` 的字符串
`?!text`                    | 内容不包含 `text` 的字符串
`*=text`                    | 内容包含 `text` 的字符串（忽略大小写）
`*!text`                    | 内容不包含 `text` 的字符串（忽略大小写）
`^=text`                    | 以 `text` 开头的字符串
`^!text`                    | 不以 `text` 开头的字符串
`$=text`                    | 以 `text` 结束的字符串
`$!text`                    | 不以 `text` 结束的字符串

Expression                  | Description
----------------------------|-------------------------------------------
`:equal:text`               | 内容为 `text` 的字符串
`:not-equal:text`           | 内容不等于 `text` 的字符串
`:equal-i:text`             | 内容为 `text` 的字符串（忽略大小写）
`:not-equal-i:text`         | 内容不等于 `text` 的字符串（忽略大小写）
`:match:/abc/i`             | 内容匹配正则表达式 `/abc/i` 的字符串
`:not-match:/abc/i`         | 内容不匹配正则表达式 `/abc/i` 的字符串
`:include:text`             | 内容包含 `text` 的字符串
`:not-include:text`         | 内容不包含 `text` 的字符串
`:include-i:text`           | 内容包含 `text` 的字符串（忽略大小写）
`:not-include-i:text`       | 内容不包含 `text` 的字符串（忽略大小写）
`:start-with:text`          | 以 `text` 开头的字符串
`:not-start-with:text`      | 不包以 `text` 开头的字符串
`:start-with-i:text`        | 以 `text` 开头的字符串（忽略大小写）
`:not-start-with-i:text`    | 不以 `text` 开头的字符串（忽略大小写）
`:end-with:text`            | 以 `text` 结束的字符串
`:not-end-with:text`        | 不包以 `text` 结束的字符串
`:end-with-i:text`          | 以 `text` 结束的字符串（忽略大小写）
`:not-end-with-i:text`      | 不以 `text` 结束的字符串（忽略大小写）

## 2. 字面量

使用字面量表达式，可以校验数据是否为具体的值：

> 只支持 `null`，`number`，`boolean` 类型的字面量。

```ts
compiler.compile(123);      // 被校验的变量必须为数值 123（类型上完全匹配）
compiler.compile(null);     // 被校验的变量必须为 null （类型上完全匹配）
compiler.compile(true);     // 被校验的变量必须为布尔值 true （类型上完全匹配）
compiler.compile(false);    // 被校验的变量必须为布尔值 false （类型上完全匹配）
```

## 3. 对象校验

TypeGuard 支持对一个对象的属性极其类型进行校验，例如：

```json
{
    "name": "string",
    "age": "uint8",
    "father": {
        "name": "string",
        "age": "uint8"
    }
}
```

可以匹配下面的数据：

```json
{
    "name": "Angus",
    "age": 24,
    "father": {
        "name": "Elvis",
        "age": 46
    }
}
```

和

```json
{
    "name": "Edith",
    "age": 24,
    "gender": "female",
    "father": {
        "name": "Mark",
        "age": 48
    }
}
```

可以看出，这种校验仅仅判断这是否一个对象，且包含属性 `name` 和 `age`，并校验其类型， 但不排斥其它多余的属性。这是对象校验的宽松模式。这种类型称为“对象”。

如果其中有可以省略的属性，则可以在属性名称后面加一个问号 ?，表示这个属性是可选的：

```json
{
    "name": "string",
    "age?": "uint8"
}
```

既可以匹配

```json
{"name":"Angus","age":24}
```

也可以匹配

```json
{"name":"Angus"}
```

因为其中的 age 属性是可选的。但是不能匹配

```json
{"name":"Angus","age":"24"}
```

因为 age 被指定为 uint8 类型（或 void），不能是别的类型。事实上上面的类型 也可以写成：

```json
{
    "name": "string",
    "age": ["void", "uint8"]
}
```

又或者：

```json
{
    "name": "string",
    "age": "?uint8"
}
```

> `?uint8` 这种省略表达式参考 **4.1. 复合类型（Mixed-Type）**

三种写法效果一致。

## 4. 高级类型

高级类型有很多种，它们的特征都是用一个 JSON 数组包裹，第一个元素是一个以 `$.` 开头的字符串。第一个元素是这个类型的修饰符，表示这个类型的作用。

修饰符有很多种，下面会一一介绍。

> 如果第一个元素，即修饰符被省略，则默认为 `$.or` 修饰符。

### 4.1. 复合类型（Mixed Type）

如果想表达更加复杂的类型，比如既可以是字符串，也可以是整数，则可以写成：

```json
["$.or", "string", "int"]
```

这是一个 JSON 数组，但是并不表示这是一个数组类型，而是表示这是一个复合类型。

可以看出 `$.or` 表示后面的类型可以组合使用，组合关系为“或”。

> #### 特殊应用——枚举
>
> 利用复合类型，可以实现枚举类型。例如字符串枚举：
>
> ```json
> ["$.or", "=a", "=b", "=c"]
> ```
>
> 或者整数枚举（字面量匹配）
>
> ```json
> [2, 4, 8, 16]
> ```


### 4.2. 组合类型（Combined Type）

如果想表达更加复杂的类型，比如既可以是字符串，也可以是整数，则可以写成：

```json
["$.or", "string", "int"]
```

这是一个 JSON 数组，但是并不表示这是一个数组类型，而是表示这是一个复合类型。

可以看出 `$.or` 表示后面的类型可以组合使用，组合关系为“或”。

