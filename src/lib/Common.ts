/*
 * Copyright 2019 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type TypeChecker<T> = (v: unknown) => v is T;

export interface ICompileOutputArgument {

    /**
     * The name of argument.
     */
    "name": string;

    /**
     * The type of argument.
     */
    "type": string;
}

export interface ICompileResult {

    /**
     * The arguments of checker.
     */
    "arguments": ICompileOutputArgument[];

    /**
     * The source code of checker.
     */
    "source": string;

    /**
     * The trace points list. Only available when the `traceable` is set to
     * `true`.
     */
    "tracePoints": string[];

    /**
     * Extra data.
     */
    "extras": Record<string, any>;
}

export interface ICompileOptions {

    /**
     * The rules to be compiled.
     */
    "rules": any;

    /**
     * Add a breakpoint at the entry of checker code.
     *
     * @default false
     */
    "stopOnEntry"?: boolean;

    /**
     * Throw an exception while check failed, instead of return FALSE.
     *
     * @default false.
     */
    "traceable"?: boolean;
}

export interface ILanguageBuilder {

    varName(index: number | string): string;

    or(conditions: string[]): string;

    and(conditions: string[]): string;

    eq(a: string, b: string | number): string;

    ne(a: string, b: string): string;

    gt(a: string, b: string): string;

    gte(a: string, b: string): string;

    lt(a: string, b: string): string;

    lte(a: string, b: string): string;

    not(a: string): string;

    lowerCase(a: string): string;

    /**
     * a % b
     * @param a
     * @param b
     */
    modOf(a: string, b: string): string;

    literal(val: string | boolean | number): string;

    /**
     * Get the statement checking if a string expression includes a given
     * string expression.
     *
     * @param varName       The name of string variable to be searched.
     * @param match         The given string to match.
     */
    instr(
        expr: string,
        match: string
    ): string;

    /**
     * Get the statement checking if a string expression starts with a given
     * string expression.
     *
     * @param varName       The name of string variable to be searched.
     * @param match         The given string to match.
     */
    startsWith(
        expr: string,
        match: string
    ): string;

    /**
     * Get the statement checking if a string expression ends with a given
     * string expression.
     *
     * @param varName       The name of string variable to be searched.
     * @param match         The given string to match.
     */
    endsWith(
        expr: string,
        match: string
    ): string;

    /**
     * Get the statement checking if a string expression matches a given regular
     * expression.
     *
     * @param expr          The expression to be checked.
     * @param regExp        The regular expression.
     */
    matchRegExp(
        expr: string,
        regExp: string
    ): string;

    /**
     * Get the statement checking if an expression is a null value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isNull(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a undefined value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isUndefined(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a string value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isString(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a dictionary.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isDict(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is an integer value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isInteger(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a boolean value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isBoolean(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a numeric value.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isNumeric(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is a number.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isNumber(expr: string, positive: boolean): string;

    /**
     * Get the statement checking if an expression is an array.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isArray(expr: string, positive: boolean): string;

    /**
     * Get the statement of the length of an array.
     *
     * @param expr The expression of an array.
     */
    arrayLength(expr: string): string;

    /**
     * Get the statement of the length of a string.
     *
     * @param expr The expression of a string.
     */
    stringLength(expr: string): string;

    /**
     * Get the statement of the keys list of an dicitionary.
     *
     * @param expr The expression of dictionary.
     */
    keys(expr: string): string;

    forEach(
        arrayName: string,
        itemName: string,
        forBody: string
    ): string;

    ifThen(
        condition: string,
        ifBody: string,
        elseBody?: string
    ): string;

    forIn(
        objectName: string,
        keyName: string,
        itemName: string,
        forBody: string
    ): string;

    fieldIndex(
        objectName: string,
        key: string
    ): string;

    arrayIndex(
        arrayName: string,
        index: string | number
    ): string;

    closure(
        params: string[],
        args: string[],
        body: string
    ): string;

    readonly literalFalse: string;

    readonly literalTrue: string;

    readonly maxSafeInteger: string;

    readonly minSafeInteger: string;

    /**
     * Check if a expression is a true-equal value.
     *
     * @param expr  The expression to be checked.
     */
    isTrueValue(expr: string): string;

    /**
     * Check if a expression is a false-equal value.
     *
     * @param expr  The expression to be checked.
     */
    isFalseValue(expr: string): string;

    returnValue(expr: string): string;

    series(statements: string[]): string;
}

export interface IBuiltInTypeCompiler {

    /**
     * Check if a type is a built-in type.
     *
     * @param type The type to be checked.
     */
    isBuiltInType(type: string): boolean;

    compile(type: string, ctx: IContext, args: string[]): string;

    /**
     * Check if a type is number type.
     *
     * @param type The type to be checked.
     */
    isNumberType(type: string): boolean;

    /**
     * Check if a type has length property.
     *
     * @param type The type to be checked.
     */
    hasLength(type: string): boolean;

    isForcedStringType(type: string): boolean;

    isConstructed(type: string): boolean;

    isElemental(type: string): boolean;
}

export interface IFilterCompiler {

    compile(rule: string, ctx: IContext): string;
}

export interface ICompiler {

    compileChecker(options: ICompileOptions): ICompileResult;
}

export const MODIFIER_PREFIX = "$.";

export const FILTER_PREFIX = "|";

export const IMPLICIT_SYMBOL = "?";

export const KEY_MAP_SUFFIX = "->{}";

export const KEY_ARRAY_SUFFIX = "->[]";

export const KEY_STRICT_SUFFIX = "->(=)";

export enum EFlags {

    FROM_STRING,
    STRICT,
    OPTIONAL,
    REQUIRED
}

export enum EFlagValue {

    NO,
    YES,
    INHERIT
}

export interface IContextData {

    vName: string;

    flags: Record<string, EFlagValue>;
}

export interface IContext extends IContextData {

    trace: boolean;

    tracePoint: number;

    vCursor: number;

    stack: IContextData[];

    trap(): void;

    untrap(): void;
}
