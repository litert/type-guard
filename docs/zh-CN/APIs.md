# API 说明

## 模块方法 `createJavaScriptLanguageBuilder`

```ts
function createJavaScriptLanguageBuilder(): ILanguageBuilder;
```

创建一个 JavaScript 语言的代码生成器，供编译器对象使用。


## 模块方法 `createInlineCompiler`

```ts
function createInlineCompiler(): IInlineCompiler;
```

创建一个 JavaScript 语言的规则编译器，可以编译规则并生成 JavaScript Lambda 方法，供代码内
直接使用。

## 模块方法 `createCompiler`

```ts
function createCompiler(): ICompiler;
```

创建一个纯粹的规则编译器对象，用于生成代码。

## 接口 `IInlineCompiler`

```ts
interface IInlineCompiler {

    /**
     * 编译规则并返回一个 JavaScript 函数，可直接用于校验数据。
     *
     * @param options 编译选项。
     */
    compile<T>(options: IInlineCompileOptions): C.TypeChecker<T>;

    /**
     * 获取一个预定义类型的校验器函数。
     *
     * @param name 预定义类型的名称。
     */
    getPredefinedType<T>(name: string): C.TypeChecker<T>;

    /**
     * 判断一个预定于类型是否已经定义。
     *
     * @param name 预定义类型的名称。
     */
    hasPredefinedType(name: string): boolean;

    /**
     * 获取所有未定义，但是已经被使用的”预定义类型“的名称列表。
     */
    detectUndefinedTypes(): string[];
}
```

## 接口 `ICompiler`

```ts
interface ICompiler {

    /**
     * 获取一个预定义类型的编译结果。
     *
     * @param name 预定义类型的名称。
     */
    getPredefinedType(name: string): ICompileResult | null;

    /**
     * 编译一条规则，并返回编译结果。
     *
     * @param options   编译选项
     */
    compile(options: ICompileOptions): ICompileResult;
}
```

## 接口 ICompileOptions

```ts
interface ICompileOptions {

    /**
     * 要编译的规则
     */
    "rule": any;

    /**
     * 将该规则定义为一个类型，可以在后面复用。
     */
    "name"?: string;
}
```

## 接口 ICompileResult

```ts
interface ICompileResult {

    /**
     * 校验代码的入口参数信息。
     */
    "arguments": ICompileOutputArgument[];

    /**
     * 存储预定义类型函数的映射对象的变量名。
     */
    "typeSlotName": string;

    /**
     * 编译生成的代码。
     */
    "source": string;

    /**
     * 该代码引用的预定义类型的名称。
     */
    "referredTypes": string[];
}
```

## 接口 IInlineCompileOptions

```ts
interface IInlineCompileOptions extends C.ICompileOptions {

    /**
     * 在检查代码的第一行（端点）暂停，方便调试。
     */
    "stopOnEntry"?: boolean;
}
```
