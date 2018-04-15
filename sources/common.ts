/*
   +----------------------------------------------------------------------+
   | LiteRT TypeGuard.js Library                                          |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/type-guard.js/blob/master/LICENSE          |
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

export interface CompileResult<T = any> {

    "source": string;
}

export const BUILT_IN_TYPES = {
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
    "ascii_char": "ascii_char",
    "latin_char": "latin_char",
    "true_value": "true_value",
    "false_value": "false_value",
    "true": "true",
    "false": "false",
    "null": "null",
    "float": "float",
    "numeric": "numeric"
};

export type BuiltInType = keyof typeof BUILT_IN_TYPES;

export const FILTERS = {
    BETWEEN: "between",
    LARGER_THAN: "gt",
    LARGER_OR_EQUAL: "ge",
    LOWER_THAN: "lt",
    LOWER_OR_EQUAL: "le",
    EQUAL_TO: "eq",
    NOT_EQUAL: "ne"
};

export const FILTER_ON = {
    LENGTH: "length",
    STRING_LENGTH: "string.length",
    ARRAY_LENGTH: "array.length",
    VALUE: "value"
};

export const MIX_TYPE_REL = {

    $AND: "$.and",
    $OR: "$.or",
    $TUPLE: "$.tuple",
    $ARRAY: "$.array",
    $MAP: "$.map",
    $STRICT_MAP: "$.strict_map"
};

export interface Compiler {

    compile<T = any>(
        descriptor: any,
        opts?: CompileOptions
    ): CompileResult<T>;
}

export const KEY_ARRAY_SUFFIX = "->[]";
export const KEY_MAP_SUFFIX = "->{}";
export const KEY_STRICT_MAP_SUFFIX = "->{=}";
export const TYPE_ARRAY_SUFFIX = "[]";
export const TYPE_MAP_SUFFIX = "{}";

export interface Language {

    makeClosureExecution(paramVar: string, inputVar: string, code: string): string;

    /**
     * Get the check condition statement of built-in types.
     * @param v   The name of variable to be checked.
     * @param t   The name of built-in type
     */
    getBITCondition(v: string, t: BuiltInType): string;

    getFilterConditionStatement(v: string, t: string): string;

    createIfStatement(condition: string, statement: string, elseStatement?: string): string;

    readonly not: string;

    readonly returnTrue: string;

    readonly returnFalse: string;

    readonly and: string;

    readonly trueValue: string;

    readonly falseValue: string;

    readonly or: string;

    escape(s: string): string;

    getBooleanCheckStatement(varName: string): string;

    getNumberCheckStatement(varName: string): string;

    getNullCheckStatement(varName: string): string;

    getUndefinedCheckStatement(varName: string): string;

    getNumberValueCheckStatement(varName: string, value: number): string;

    getStringValueCheckStatement(varName: string, value: string): string;

    getRegExpVerifyStatement(v: string, r: string): string;

    getBooleanValueCheckStatement(varName: string, value: number): string;

    createClosureExecution(argName: string, varName: string, body: string): string;

    createArrayIteration(arr: string, iter: string, body: string): string;

    createMapIteration(arr: string, iter: string, body: string): string;

    getMapValue(mapName: string, keyOrVal: string, isValue?: boolean): string;

    getArrayValue(arrName: string, index: string | number): string;
}
