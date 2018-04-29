/*
   +----------------------------------------------------------------------+
   | LiteRT TypeGuard.js Library                                          |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/type-guard/blob/master/LICENSE             |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

export type TypeChecker<T = any> = (x: any) => x is T;

export interface Dict<T> {

    [key: string]: T;
}

export interface CompileOptions {

    /**
     * Stop as a breakpoint before doing checking.
     *
     * ***FOR DEBUG USAGE.***
     */
    "stopOnEntry"?: boolean;
}

export interface CompileResult {

    "source": string;

    "inputVariable": string;
}

export const BuiltInTypes = {
    "void": "void",
    "optional": "optional",
    "array": "array",
    "any": "any",
    "int": "int",
    "uint": "uint",
    "int8": "int8",
    "uint8": "uint8",
    "int16": "int16",
    "uint16": "uint16",
    "int32": "int32",
    "uint32": "uint32",
    "int64": "int64",
    "uint64": "uint64",
    "string": "string",
    "boolean": "boolean",
    "number": "number",
    "object": "object",
    "valid_object": "valid_object",
    "ascii_string": "ascii_string",
    "latin_string": "latin_string",
    "true_value": "true_value",
    "false_value": "false_value",
    "true": "true",
    "false": "false",
    "null": "null",
    "float": "float",
    "numeric": "numeric",
    "undefined": "undefined"
};

function freezeObject(obj: any): void {

    for (let key of Object.keys(obj)) {

        Object.defineProperty(obj, key, {
            writable: false,
            configurable: false
        });
    }
}

export type BuiltInType = keyof typeof BuiltInTypes;

export const FILTERS = {
    BETWEEN: "between",
    LARGER_THAN: "gt",
    LARGER_OR_EQUAL: "ge",
    LOWER_THAN: "lt",
    LOWER_OR_EQUAL: "le",
    EQUAL_TO: "eq",
    NOT_EQUAL: "ne",
    ODD: "odd",
    EVEN: "even",
    TIMES_OF: "timesof"
};

export const FILTER_ON = {
    LENGTH: "length",
    STRING_LENGTH: "string.length",
    ARRAY_LENGTH: "array.length",
    VALUE: "value"
};

export const ADV_TYPE_REL_PREFIX = "$.";

export const AdvancedTypes = {

    $AND: `${ADV_TYPE_REL_PREFIX}and`,
    $OR: `${ADV_TYPE_REL_PREFIX}or`,
    $TUPLE: `${ADV_TYPE_REL_PREFIX}tuple`,
    $ARRAY: `${ADV_TYPE_REL_PREFIX}array`,
    $MAP: `${ADV_TYPE_REL_PREFIX}map`,
    $DICT: `${ADV_TYPE_REL_PREFIX}dict`,
    $STRUCT: `${ADV_TYPE_REL_PREFIX}struct`
};

export const IMPLICIT_SYMBOL = "?";

export interface Compiler {

    compile(
        rule: any,
        opts?: CompileOptions
    ): CompileResult;
}

export interface Compiler4JavaScript {

    compile<T = any>(
        rule: any,
        stopOnEntry?: boolean
    ): TypeChecker<T>;
}

export const KEY_ARRAY_SUFFIX = "->[]";
export const KEY_MAP_SUFFIX = "->{}";
export const KEY_OBJECT_SUFFIX = "->(=)";
export const TYPE_ARRAY_SUFFIX = "[]";
export const TYPE_MAP_SUFFIX = "{}";

export interface Language {

    /**
     * Wrap a code segment into a closure execution.
     *
     * @param paramVar  The name of parameter of closure function
     * @param inputVar  The input of paramater of closure function
     * @param code      The code to be wrapped.
     */
    createClosureExecution(
        paramVar: string,
        inputVar: string,
        code: string
    ): string;

    /**
     * Generate the condition statement of checking variable by built-in types.
     *
     * @param v   The name of variable to be checked.
     * @param t   The name of built-in type
     */
    getBITCondition<K extends keyof typeof BuiltInTypes>(
        v: string,
        t: K | (typeof BuiltInTypes)[K]
    ): string;

    /**
     * Generate the condition statement of checking variable by filter.
     *
     * @param v   The name of variable to be checked.
     * @param f   The expression of filter
     */
    getFilterConditionStatement(v: string, f: string): string;

    /**
     * Generate the statement for getting the keys array of an object.
     *
     * @param objName The name of object variable.
     */
    getObjectKeysArrayStatement(objName: string): string;

    /**
     * Generate the definition statement for a new constant.
     *
     * @param constName The name of new constant.
     * @param val       The value of new constant.
     */
    getConstantDefinition(constName: string, val: string): string;

    /**
     * Check if the elements in array variable are insides the array.
     *
     * @param arrVarName  The name of array vairable.
     * @param arr         The array.
     */
    getStringArrayContainsCondition(
        arrVarName: string,
        arr: string[]
    ): string;

    /**
     * Generate the IF statement.
     *
     * @param condition     The condition statement of IF statement.
     * @param statement     The code to be execute if matched.
     * @param elseStatement The code to be execute if not matched.
     */
    createIfStatement(
        condition: string,
        statement: string,
        elseStatement?: string
    ): string;

    /**
     * The logical NOT operator notation in this language.
     */
    readonly NOT: string;

    /**
     * The `return true;` operation notation in this language.
     */
    readonly RETURN_TRUE: string;

    /**
     * The `return false;` operation notation in this language.
     */
    readonly RETURN_FALSE: string;

    /**
     * The logical AND operator notation in this language.
     */
    readonly AND: string;

    /**
     * The logical TRUE value notation in this language.
     */
    readonly TRUE_VALUE: string;

    /**
     * The logical FALSE value notation in this language.
     */
    readonly FALSE_VALUE: string;

    /**
     * The logical OR operator notation in this language.
     */
    readonly OR: string;

    /**
     * Create the name for a temporary variable.
     *
     * @param index The index of the temporary vairable.
     */
    createTempVariableName(index: number): string;

    /**
     * Escape special charactors in a string.
     *
     * @param s The string to be escaped.
     */
    escape(s: string): string;

    getBooleanCheckStatement(varName: string): string;

    getNumberCheckStatement(varName: string): string;

    getNullCheckStatement(varName: string): string;

    getUndefinedCheckStatement(varName: string): string;

    getNumberValueCheckStatement(varName: string, value: number): string;

    getStringValueCheckStatement(varName: string, value: string): string;

    getRegExpVerifyStatement(v: string, r: string): string;

    getBooleanValueCheckStatement(varName: string, value: number): string;

    createArrayIteration(arr: string, iter: string, body: string): string;

    createMapIteration(arr: string, iter: string, body: string): string;

    getMapValue(mapName: string, keyOrVal: string, isValue?: boolean): string;

    getArrayValue(arrName: string, index: string | number): string;
}

freezeObject(BuiltInTypes);

freezeObject(AdvancedTypes);
