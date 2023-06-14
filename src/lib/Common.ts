/*
 * Copyright 2023 Angus Fenying <fenying@litert.org>
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

export type ITypeChecker<T> = (v: unknown, errorTraces?: string[]) => v is T;
export type IPreDefinedTypeChecker<T> = (v: unknown, ...args: any[]) => v is T;

/**
 * @deprecated Use `ITypeChecker` instead.
 */
export type TypeChecker<T> = ITypeChecker<T>;

export interface ICompileOutputArgument {

    /**
     * The name of argument.
     */
    'name': string;

    /**
     * The type of argument.
     */
    'type': string;

    'initial': string;
}

export interface ICompileResult {

    /**
     * The arguments of checker.
     */
    'arguments': ICompileOutputArgument[];

    /**
     * The variable name of pre-defined type checkers.
     */
    'typeSlotName': string;

    /**
     * The source code of checker.
     */
    'source': string;

    /**
     * The predefined types used by this type.
     */
    'referredTypes': string[];
}

export interface ICompileOptions {

    /**
     * The rules to be compiled.
     */
    'rule': any;

    /**
     * Give this type a name, so it could be used as a pre-defined type.
     */
    'name'?: string;

    /**
     * Enable adding failed asserts tracing info to the second argument.
     *
     * @default false
     */
    'traceErrors'?: boolean;
}

export interface ILanguageBuilder {

    /**
     * Produce a switch-case statement.
     *
     * @param expr  The switch base value
     * @param cases The cases
     */
    switchCase(expr: string, cases: string[]): string;

    /**
     * Produce a `case "x": {}` statement.
     *
     * @param cond The conditions
     * @param expr The statements
     */
    caseIf(cond: string[], expr: string): string;

    orAddTrace(
        expr: string,
        vTrace: string,
        vTraceStack: string,
        path: string,
    ): string;

    addTrace(
        vTrace: string,
        vTraceStack: string,
        path: string,
    ): string;

    stringTemplateVar(varExpr: string): string;

    numberTemplateVar(varExpr: string): string;

    escape(str: string): string;

    caseDefault(expr: string): string;

    array(v: any[]): string;

    /**
     * Check if an array is belong to a set.
     *
     * @param a The array
     * @param b The set.
     */
    arrayInSet(a: string, b: string): string;

    /**
     * Get the statement of calling a function.
     *
     * @param fnName    The name of function to be called.
     * @param args      The arguments for function.
     */
    call(fnName: string, ...args: string[]): string;

    varName(index: number | string): string;

    or(conditions: string[]): string;

    and(conditions: string[]): string;

    eq(a: string, b: string | number): string;

    ifElseOp(cond: string, a: string | number, b: string | number): string;

    ne(a: string, b: string | number): string;

    gt(a: string, b: string | number): string;

    gte(a: string, b: string | number): string;

    lt(a: string, b: string | number): string;

    lte(a: string, b: string | number): string;

    not(a: string): string;

    lowerCase(a: string): string;

    /**
     * a % b
     * @param a
     * @param b
     */
    modOf(a: string, b: string): string;

    literal(val: string | boolean | number | null): string;

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
     * Get the statement checking if an expression is a structure.
     *
     * > All `map`, `dict`, `object` should be of this type.
     *
     * @param expr      The expression to be checked.
     * @param positive  Assert positive or negative.
     */
    isStructure(expr: string, positive: boolean): string;

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
     * Get the statement of the keys list of an dictionary.
     *
     * @param expr The expression of dictionary.
     */
    keys(expr: string): string;

    forEach(
        arrayName: string,
        elName: string,
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

    add(
        expr1: string | number,
        expr2: string | number,
    ): string;

    arraySlice(
        arrayName: string,
        start: string | number,
        end?: string | number
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

    str2Int(expr: string): string;

    str2Float(expr: string): string;

    str2Bool(expr: string): string;

    returnValue(expr: string): string;

    series(statements: string[]): string;
}

export interface ICompiler {

    /**
     * Get the pre-defined type compilation result.
     *
     * @param name The name of type.
     */
    getPredefinedType(name: string): ICompileResult | null;

    /**
     * Compile the rule.
     *
     * @param options   The compile options.
     */
    compile(options: ICompileOptions): ICompileResult;
}
