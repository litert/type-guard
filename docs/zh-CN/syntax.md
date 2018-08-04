# 语法说明

## 基本类型

### 简单类型

TypeGuard 支持大量内置简单类型，比如：

- `string`
- `ascii_string`
- `latin_string`
- `numeric`（任意数值或者数值字符串）
- `number`（任意数值）
- `float`（不包含 NaN）
- `int`
- `int8`
- `int16`
- `int32`
- `int64`（等价于 int）
- `uint`
- `uint8`
- `uint16`
- `uint32`
- `uint64`（等价于 uint）
- `boolean`
- `array`
- `object`（包含 `null`）
- `valid_object` （不包含 `null`）
- `null`
- `any`（任意类型）
- `false`
- `true`
- `false_value`（任意非真值）
- `true_value`（任意真值）
- `undefined`
- `optional`（等价于 undefined）
- `void`（等价于 undefined）
- ...

```ts
import * as TyG from "@litert/typeguard";

let compiler = TyG.createCompiler4JavaScript();

const isUInt8 = compiler.compile("uint8");
const isBoolean = compiler.compile("boolean");

console.log(isUInt8(123));
console.log(isUInt8(255));
console.log(isUInt8(256));      // 超出 UInt8 的范围
console.log(isBoolean(true));
console.log(isBoolean(null));   // null 不是 boolean 型
console.log(isBoolean(false));
console.log(isBoolean(123));    // 123 不是 boolean 型
```

### 直接量

使用直接量表达式，可以校验数据是否为具体的值：

```js
compiler.compile(123);      // 被校验的变量必须为数值 123（类型上完全匹配）
compiler.compile(null);     // 被校验的变量必须为 null （类型上完全匹配）
compiler.compile(true);     // 被校验的变量必须为布尔值 true （类型上完全匹配）
compiler.compile(false);    // 被校验的变量必须为布尔值 false （类型上完全匹配）
```

### 字符串匹配

要使用字符串校验，可以用一个 `~` 开头的字符串，其后跟字符串的内容：

```js
compiler.compile("=abc"); // 被校验的变量必须为字符串 "abc"
```

### 正则表达式匹配

要使用正则表达式匹配，可以用一个 `~` 开头的字符串，其后跟正则表达式的内容：

```js
compiler.compile("~/^a/i"); // 被校验的变量必须可以被正则表达式 /^a/i 匹配。
compiler.compile("~[a-z]"); // 被校验的变量必须可以被正则表达式 /[a-z]/ 匹配。
```

### 基本校验器

校验器是一个以 `"|"` 开头的字符串，支持对值进行比较，格式为：

```
|<target> <rel> <args...>
```

target 是被校验的目标， rel 是校验的比较方式， args 是校验器的参数。

target 可以是如下值：

- `value` 变量的值
- `length` 变量的值长度（字符串长度或者数组长度）
- `string.length` 字符串变量的长度（会先校验是否为字符串）
- `array.length` 数组变量的长度（会先校验是否为数组）
- 任意简单类型

目前支持如下比较方式：

- `ge n`         值大于或等于 n
- `gt n`         值大于 n
- `le n`         值小于或等于 n
- `lt n`         值小于 n
- `eq n`         值等于 n（建议用直接量代替此校验器，更简单）
- `ne n`         值不等于 n
- `between n m`  值在 n~m 之间（包含 n 和 m）
- `odd`          值是奇数
- `even`         值是偶数
- `timesof n`    值是 n 的倍数

例如：

```js
/**
 * 被校验的值必须大于等于 1 且小于等于 199
 */
compiler.compile("|value between 1 199");

/**
 * 被校验的值必须大于 1
 */
compiler.compile("|value gt 1");

/**
 * 被校验的值必须大于等于 1
 */
compiler.compile("|value ge 1");

/**
 * 被校验的值必须小于 1
 */
compiler.compile("|value lt 1");

/**
 * 被校验的值必须小于等于 1
 */
compiler.compile("|value le 1");

/**
 * 被校验的值必须不等于 1
 */
compiler.compile("|value ne 1");

/**
 * 被校验的值必须等于 1
 */
compiler.compile("|value eq 1");

/**
 * 被校验的值必须是整数且是奇数
 */
compiler.compile("|uint odd");

/**
 * 被校验的值必须是整数且是偶数
 */
compiler.compile("|uint even");

/**
 * 被校验的值必须是整数且是 10 的倍数
 */
compiler.compile("|uint timesof 10");
```

## 高级类型

### 复合类型（Mixed Type）

如果想表达更加复杂的类型，比如既可以是字符串，也可以是整数，则可以写成：

```json
["$.or", "string", "int"]
```

这是一个 JSON 数组，但是并不表示这是一个数组类型，而是表示这是一个复合类型，其中第一个
元素是一个修饰符，它是一个以 `$.` 开头的字符串，成为类型。

修饰符，表示这个复合类型的效果，这种修饰符有好几种，后面会一个个展开说明，此处就不一一
列出了。

可以看出 `$.or` 表示后面的类型可以组合使用，组合关系为“或”。

> 如果省略修饰符，则默认使用 `$.or` 修饰符，例如上面的例子还可以简写为：
>
> ```json
> ["string", "int"]
> ```

### 组合类型（Combined Type）

如果要判断一个变量是一个值在 15 ~ 25 之间的整数，怎么描述呢？可以使用 `$.and` 修饰符
构造一个组合类型：

```json
["$.and", "int", "|value between 15 25"]
```

表示被校验的值必须是一个整数，且取值范围在 15 和 25 之间（包括）。

### 可选类型（Optional Type）

基于复合类型，我们可以将多种类型用 `$.or` 修饰符组合起来使用，其中最特殊的莫过于
`void`（还有两个别名 `undefined`、`optional`），它表示被校验的变量为空或者不存在。

在 JavaScript 中它表示未定义，在 PHP 中它等价于 `null`。可以使用它与其它类型组合，
表示一个可选类型，例如：

```json
["void", "string"]
```

可以校验一个变量是未定义或者是字符串。当然，单独使用并没有什么意义，一般用于其它高级
类型中，用于元素校验或者属性校验。

这里要说明的是，对于基本类型，可以将上面的表达式简写为 `"?string"`，即在基本类型前面加
一个问号 `?`。

> 甚至可以写 `"?void"`，表示可选的 void 类型，虽然没有任何意义。

### 枚举类型（Enum Type）

配合 `$.or` 修饰符和直接量表达式或者字符串匹配表达式，可以实现值的枚举匹配：

```json
["=a", "=b", "=c"]
```

表示被校验的值只能是字符串 `"a"`，`"b"` 或 `"c"` 中的一种。同理，对其它直接量也可以：

```json
[1, 2, 3, 4]
```

表示被校验的值只能是 1~4 这四个整数。

### 对象（Object，宽松模式的对象校验）

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

可以看出，这种校验仅仅判断这是否一个对象，且包含属性 `name` 和 `age`，并校验其类型，
但不排斥其它多余的属性。这是对象校验的宽松模式。这种类型称为“**对象**”。

如果其中有可以省略的属性，则可以在属性名称后面加一个问号 `?`，表示这个属性是可选的：

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

因为其中的 `age` 属性是可选的。但是不能匹配

```json
{"name":"Angus","age":"24"}
```

因为 `age` 被指定为 `uint8` 类型（或 `void`），不能是别的类型。事实上上面的类型
也可以写成：

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

三种写法效果一致。

### 结构（Structure，严格模式的对象校验）

大部分情况下，使用对象的宽松模式会比较高效率，但是也有需要准确匹配属性表，排除多余属性
的情况。TypeGuard 也支持对象校验的严格模式，但是要借助 `$.struct` 修饰符，例如：

```json
["$.struct", {
    "name": "string",
    "age": "uint8",
    "father": {
        "name": "string",
        "age": "uint8"
    }
}]
```

`$.struct` 修饰符表示这个对象必须严格匹配属性名称，不能多也不能少。和宽松模式大同小异，
只是不能有多余的属性。这个例子无法匹配：

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

因为多了一个 `gender` 属性，它不在定义范围内。这种类型称为“**结构**”。

> 与宽松模式相比，严格模式要进行更多的校验，但是效率上并不会相差太大，请适当使用。

**但是必须注意的是，`$.struct` 修饰符只对直接子属性生效**。例如上面的例子，仍然可以
匹配下面的内容：

```json
{
    "name": "Edith",
    "age": 24,
    "father": {
        "name": "Mark",
        "age": 48,
        "birthday": "1970-10-22",
    }
}
```

因为 `father` 属性的类型并没有被指定为**结构**。如果要对 `father` 也进行严格校验，
须写成：

```json
["$.struct", {
    "name": "string",
    "age": "uint8",
    "father": ["$.struct", {
        "name": "string",
        "age": "uint8"
    }]
}]
```

这样写似乎过于烦琐，确实。实际上，`$.struct` 修饰符一般只在对象的最外层使用，而在对象
内部使用的话，可以使用 `->(=)` 后缀简化表达式，例如：

```json
{
    "a": "string",
    "b": ["$.struct", {
        "c": "uint32",
        "d?": "ascii_string"
    }],
    "e?": ["$.struct", {
        "f": "boolean"
    }]
}
```

可以简写为：

```json
{
    "a": "string",
    "b->(=)": {
        "c": "uint32",
        "d?": "ascii_string"
    },
    "e->(=)?": {
        "f": "boolean"
    }
}
```

因此上面的例子可以简化为：


```json
["$.struct", {
    "name": "string",
    "age": "uint8",
    "father->(=)": {
        "name": "string",
        "age": "uint8"
    }
}]
```

> 最外层的 `$.struct` 是无法去除的。

### 数组（Array）

TypeGuard 支持数组类型，描述方式有两种，对于基本类型的数组，可以简写成如下形式：

- `"string[]"`
- `"uint[]"`
- `"boolean[]"`
- `"string[][]"`
- `"string[][][]"`

但是如果是高级类型，则须使用 `$.array` 修饰符：

```json
["$.array", {
    "a": "string"
}]
```

而如果是用于对象的属性，则可以简写如下：

```json
{
    "name": "string",
    "friends->[]": {
        "name": "string",
        "age": "uint8"
    }
}
```

等价于：

```json
{
    "name": "string",
    "friends": ["$.array", {
        "name": "string",
        "age": "uint8"
    }]
}
```

### 映射（Mapping）

映射是指一种所有属性都有相同类型的对象，用 TypeScript 的语法定义如下：

```ts
interface Map<T> {

    [key: string | number]: T;
}
```

在 TypeGuard 中则使用修饰符 `$.map` 构造该类型：

```json
["$.map", "string"]
```

可以匹配一个*所有属性的值都是字符串的对象*，例如：

```json
{
    "a": "b",
    "b": "c",
    "c": "d"
}
```

如果是基本类型，可以简化为 `"string{}"`、`"uint8{}"`。

而如果是用于对象的属性，则可以简写如下：

```json
{
    "name": "string",
    "friends->{}": {
        "gender": "string",
        "age": "uint8"
    }
}
```

等价于：

```json
{
    "name": "string",
    "friends": ["$.map", {
        "name": "string",
        "age": "uint8"
    }]
}
```

### 字典（Dictionary）

和映射相似，字典也是一种映射类型，但是它限制映射的属性名称，例如：要求映射的属性名称
只能是 `"a"`，`"b"`，`"c"` 三种，不能是其它的值。使用 `$.map` 是无法限制的。
字典就是用来解决这个问题的：

```json
["$.dict", ["a", "b", "c"], {
    "type": "string",
    "url": "string"
}]
```

可以匹配

```json
{
    "a": {"type": "git", "url": "https://github.com"},
    "c": {"type": "svn", "url": "https://xxxx.com"}
}
```

但是不能匹配

```json
{
    "a": {"type": "git", "url": "https://github.com"},
    "d": {"type": "svn", "url": "https://xxxx.com"}
}
```

因为属性 `"d"` 不在定义的许可范围内。

### 元组（Tuple）

元组是一种特殊的数组，它可以规定数组的每一个元素的类型。元组使用 `$.tuple` 修饰符构造

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

## 进阶使用

### 混合使用

`$.map`、`$.dict`、`$.array` 修饰符后面可以有多个元素，例如：

```json
["$.array", "string", "uint8"]
```

表示数组元素既可以是字符串也可以是8位整数，即等价于：

```json
["$.array", ["$.or", "string", "uint8"]]
```

还可以使用

```json
["$.map", "$.array", "string"]
```

即一个字符串数组类型的映射，相当于：

```json
["$.map", ["$.array", "string"]]
```

可以简化为：

```json
["$.map", "string[]"]
```

进一步简化为：`"string[]{}"`

### 对象的属性名引用

在对象中，可以通过 `$.valueof` 语法将一个属性的值作为另一个属性的名称，例如：

```json
{
    "a": ["=hello", "=world"],
    "$.valueof:a": "boolean"
}
```

表示第二个属性的名称必须是属性 a 的值，也就是说，如果 a == "hello"，则必须有一个名为
"hello" 的布尔型属性，如果 a == "world"，则必须有一个名为 "world" 的布尔型属性。

### 对象的属性存在性断言

在对象中，可以通过 `$.valueof` 语法，将一个属性的值作为另一个属性的名称，并断言该属性
必须存在（不为 `undefined`）：

```json
{
    "a": ["=hello", "=world"],
    "$.valueof:a": "exists",
    "$.virtual:hello": "string",
    "$.virtual:world": "uint32"
}
```

此处将 `$.valueof:a` 的值设置为 `exists`，表示属性不能为 `undefined`。
因此 `hello` 或者 `world` 中必须有一个存在。

> 将 `hello` 和 `world` 设置为 `virtual` 属性，这样表示他们被用于存在性断言。
> `virtual` 属性默认是可选的。
