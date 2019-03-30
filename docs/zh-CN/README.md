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
struct              | 结构类型（字典、对象、映射）
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

- 混合使用

数组表达式、增强校验、映射表达式可以混合使用：

```
string(12, 32)[]
string(12, 32)[][]
string(12, 32)[5]
string(12, 32){}
string(12, 32){}{}
string(12, 32)[]{}
string(12, 32){}[3,]
```

### 1.2. 数值专用校验器

基本校验器
校验器是一个以 `"|"` 开头的字符串，支持对值进行比较，格式为：

```
|<target> <rel> <...args>
```

`target` 是被校验的目标， `rel` 是校验的比较方式， `args` 是校验器的参数。

`target` 可以是如下值：

- `value` 变量的值
- `length` 变量的值长度（字符串长度或者数组长度）
- `string.length` 字符串变量的长度（会先校验是否为字符串）
- `array.length` 数组变量的长度（会先校验是否为数组）
- 任意基本类型

目前支持如下比较方式：

- `ge n` 值大于或等于 n
- `gt n` 值大于 n
- `le n` 值小于或等于 n
- `lt n` 值小于 n
- `eq n` 值等于 n（建议用直接量代替此校验器，更简单）
- `ne n` 值不等于 n
- `between n m` 值在 n~m 之间（包含 n 和 m）
- `timesof n` 值是 n 的倍数

例如：


```ts
/**
 * 被校验的值必须大于等于 1 且小于等于 199
 */
tgc.compile("|value between 1 199");

/**
 * 被校验的值必须大于 1
 */
tgc.compile("|value gt 1");

/**
 * 被校验的值必须大于等于 1
 */
tgc.compile("|value ge 1");

/**
 * 被校验的值必须小于 1
 */
tgc.compile("|value lt 1");

/**
 * 被校验的值必须小于等于 1
 */
tgc.compile("|value le 1");

/**
 * 被校验的值必须不等于 1
 */
tgc.compile("|value ne 1");

/**
 * 被校验的值必须等于 1
 */
tgc.compile("|value eq 1");

/**
 * 被校验的值必须是整数且是 10 的倍数
 */
tgc.compile("|uint timesof 10");
```

### 1.3. 字符串专用校验器

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
tgc.compile(123);      // 被校验的变量必须为数值 123（类型上完全匹配）
tgc.compile(null);     // 被校验的变量必须为 null （类型上完全匹配）
tgc.compile(true);     // 被校验的变量必须为布尔值 true （类型上完全匹配）
tgc.compile(false);    // 被校验的变量必须为布尔值 false （类型上完全匹配）
```

## 3. 对象校验

### 3.1. 基本用法

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

### 3.2. 可选属性

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

### 3.3. 属性简化表达式

如果要表达一个对象的其中一个属性是个数组，例如：

```json
{
    "friends": "string[]"
}
```

可以写作

```json
{
    "friends->[]": "string"
}
```

当然这看起来没什么用，可能还不如前者直观，但如果数组的元素类型是个对象，那就会方便很多了：

```json
{
    "friends->[]": {
        "name": "string",
        "age": "uint8"
    }
}
```

还可以支持定长数组：

```json
{
    "friends->[5]": {
        "name": "string",
        "age": "uint8"
    }
}
```

```json
{
    "friends->[3,5]": {
        "name": "string",
        "age": "uint8"
    }
}
```

同理也支持映射：

```json
{
    "friends->{}": {
        "name": "string",
        "age": "uint8"
    }
}
```

### 3.4. 剩余映射（Rest Mapping）

如果有一种对象，它是有几个固定属性的映射。

比如：

```json
{
    "total": 123,
    "ccc": "fsdfasfdas",
    "aaa": "ccasdsada"
}
```

规则可以写作如下：

```json
{
    "total": "uint32",
    "$.map": "string"
}
```

## 4. 高级类型

高级类型有很多种，它们的特征都是用一个 JSON 数组包裹，第一个元素是一个以 `$.` 开头的字符串。第一个元素是这个类型的修饰符，表示这个类型的作用。

修饰符有很多种，下面会一一介绍。

> 如果第一个元素，即修饰符被省略，则默认为 `$.or` 修饰符。

### 4.1. `$.or` 修饰符——复合类型（Mixed Type）

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
>
> > 此处 `$.or` 可以省略，因为对于高级类型，在省略修饰符的时候，默认是复合类型。
>
> #### 特殊应用——可选类型
>
> 利用复合类型，可以实现可选类型。例如一个可选的字符串类型：（下面三种写法等价）
>
> ```json
> ["$.or", "void", "string"]
> ["$.or", "optional", "string"]
> ["$.or", "undefined", "string"]
> ```
>
> 如果与 `void`、`optional`、`undefined` 混用的是一个基本类型，例如 `int`，那么可以简写
> 为 `?int`，还可以使用增强校验和数组、映射表达式：
>
> - `?int(-123, 123)`
> - `?int{}`
> - `?int[]`
> - `?int(-123, 123)[32]`
> - `?int(-123, 123){}`
>
> > 甚至可以写 "?void"，表示可选的 void 类型，虽然没有任何意义。

### 4.2. `$.and` 修饰符——组合类型（Combined Type）

如何判断一个变量是一个值在 15 ~ 25 之间的整数？可以使用 `$.and` 修饰符 构造一个组合类型：

```json
["$.and", "int", "|value between 15 25"]
```

表示被校验的值必须是一个整数，且取值范围在 15 和 25 之间（包括）。

> 当然现在也可以用 `|int between 15 25` 或者 `int(15, 25)` 来表示了。

### 4.3. `$.string` 修饰符——字符串识别

对于下列规则：

```json
{
    "quantity": "uint8",
    "product_id": "uint32"
}
```

验证以下内容时没有问题：

```json
{
    "quantity": 7,
    "product_id": 212931931
}
```

但是如果这样的，那就不行了：

```json
{
    "quantity": "7",
    "product_id": "212931931"
}
```

当然，并不是说规则校验器不合理，它确实做了它应该做的事。但很多时候，我们进行数据校验的时候，
会遇到数据都是字符串的情况（例如来自 QueryString 或者 `x-www-form-urlencoded` 编码的
数据，那么就几乎无法使用迄今为止我们介绍过的 TypeGuard 语法进行精确校验了。

为此，我们需要使用一个叫 `$.string` 的修饰符，它表示，它修饰的规则，所要校验的数据（可能）是
以字符串形式表述的。以上面的规则威力，改写为：

```json
["$.string", {
    "quantity": "uint8",
    "product_id": "uint32"
}]
```

再对前面的两份数据进行校验，成功！

### 4.4. `$.list` 修饰符——列表类型（不定长数组）

对于基本类型，可以使用这样的语法来表示对应的数组：

```json
string[]
```

那如果是个对象呢？如果是个高级类型呢？比如：

```json
{
    "name": "string",
    "age": "uint8"
}
```

这时候就可以用 `$.list` 修饰符实现：

```json
["$.list", {
    "name": "string",
    "age": "uint8"
}]
```

所以， `string[]` 也等价于

```json
["$.list", "string"]
```

复合类型的数组：

```json
["$.list", ["string", "uint"]]
```

### 4.5. `$.array` 修饰符——数组类型（有限长度的数组）

上一节介绍了 `$.list` 修饰符，如果是定长数组该怎么写？用基本校验器？

```json
[
    "$.and",
    ["$.list", {
        "name": "string",
        "age": "uint8"
    }],
    "|array.length eq 5"
]
```

太麻烦了，可以使用 `$.array` 简化为：

```json
[
    "$.array",
    5,
    {
        "name": "string",
        "age": "uint8"
    }
]
```

或者变长数组（长度为 2 ~ 32）

```json
[
    "$.array",
    [2, 32],
    {
        "name": "string",
        "age": "uint8"
    }
]
```

### 4.6. `$.map` 修饰符——映射类型（Mapping）

和数组类型相似，复杂结构的映射可以写作如下：

对象类型的映射：

```json
["$.map", {
    "name": "string",
    "age": "uint8"
}]
```

复合类型的映射：

```json
["$.map", ["string", "uint"]]
```

### 4.7. `$.dict` 修饰符——字典类型（Dictionary）

字典和映射相似，但是字典是给定 key 列表的。

对象类型的映射：

> 对于 `key` 有且只能由 `Mick`、`Mick`、`Jack` 三个取值。

```json
["$.dict", ["Mick", "Sarah", "Jack"], {
    "name": "string",
    "age": "uint8"
}]
```

可以匹配

```json
{
    "Mick": {
        "name": "Mick",
        "age": 32
    },
    "Sarah": {
        "name": "Sarah",
        "age": 21
    },
    "Jack": {
        "name": "Jack",
        "age": 19
    }
}
```

如果改成如下：


```json
["$.dict", ["Mick", "Sarah", "Jack"], ["void", {
    "name": "string",
    "age": "uint8"
}]]
```

则可以匹配

```json
{
    "Mick": {
        "name": "Mick",
        "age": 32
    }
}
```

但是不能拿匹配

```json
{
    "Lily": {
        "name": "Lily",
        "age": 23
    }
}
```

因为，Key `Lily` 不在许可范围内。

### 4.8. `$.tuple` 修饰符——元组

#### 4.8.1. 定长元组

元组是一种特殊的数组，它可以规定数组的每一个元素的类型。元组使用 $.tuple 修饰符构造

```json
["$.tuple", "string", "uint8"]
```

表示这是一个有且只有两个元素的数组，第一个元素为字符串，第二个元素为8位整数，可以匹配

```json
["a", 123]
```

但是不能匹配

```json
["a", "123"]
```

如果有连续多个相同类型，可以简写为

```json
["$.tuple", "int", "uint32", "...32", "string"]
```

表示第一个元素是 `int`，第 2 ~ 33 个元素是 `uint32`，最后一个元素是 `string`。

#### 4.8.2. 无限长度元组

以上元组是固定长度的数组。如果只想规定数组的前几个元素，那么可以用

```json
["$.tuple", "int", "string", "uint32", "..."]
```

> 这是个无限长度的元组。

那么，除了第一个和第二个元素分别是 `int` 和 `string` 类型，剩下的元素都是 `uint32` 类型。

> 以下情况会报错
>
> ```json
> ["$.tuple", "..."] // 未知类型
> ```

甚至可以这么写，

```json
["$.tuple", "int", "uint32", "...32", "string", "..."]
```

表示第一个元素是 `int`，第 2 ~ 33 个元素是 `uint32`，剩下的所有元素都是 `string`。

### 4.9. `$.strict` 修饰符——对象精确匹配

前面提到，对象校验只是检查规则里描述的每个属性是否合法，其他多余的属性是忽略掉，不检查的。

而如果要禁止多余的属性，则可以使用 `$.strict` 修饰符：

```json
["$.strict", {
    "name": "string",
    "age": "uint8",
    "friends->[]": {
        "name": "string",
        "age": "uint8"
    }
}]
```

则只能匹配如：

```json
{
    "name": "Mick",
    "age": 32,
    "friends": []
}
```

而无法匹配

```json
{
    "name": "Mick",
    "age": 32,
    "gender": "Male",
    "friends": []
}
```

因为 `gender` 属性不在规则列表内。

这里需要注意一点，`$.strict` 不对属性子对象生效，比如上面的规则，仍然可以校验下面的结构：

```json
{
    "name": "Mick",
    "age": 32,
    "friends": [{
        "name": "Sarah",
        "age": 21,
        "gender": "Female"
    }]
}
```

## 4.10. `$.equal` 修饰符——对象完全匹配

`$.equal` 的作用和 `$.strict` 完全一样，除了一点：它对属性子对象也生效。

## 4.11. `$.type` 修饰符——命名类型

如果有一个稍微有点复杂的类型，在一个结构内到处引用，那么可以将之定义为“预定义类型”。

例如：

```ts
tgc.compile({
    "a": ["$.type", "MyType", "string[32]"],
    "b": "@MyType",
    "c": "@MyType"
});
```

这段代码注册了一个名为 `MyType` 的预定义类型。然后通过 @ 符号加预定义类型名称引用这个类型。

预定义类型有几个注意事项：

1.  定义后可以在多次编译过程中反复使用：

    ```ts
    tgc.compile(["$.type", "MyType", "string[32]"]);

    tgc.compile({
        "a": "@MyType",
        "b": "@MyType",
        "c": "@MyType"
    });
    ```

2.  类型名称不能为空字符串，只能包含字母、数字、下划线，且严格区分大小写。
3.  同一个类型名称不得重复定义。
