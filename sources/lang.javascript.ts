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

import {

    FILTER_ON,
    FILTERS,
    Language,
    BuiltInTypes,
    BuiltInType

} from "./common";

export class JavaScriptLanguage
implements Language {

    /**
     * Get the check condition statement of built-in types.
     * @param v   The name of variable to be checked.
     * @param t   The name of built-in type
     */
    public getBITCondition(v: string, t: BuiltInType): string {

        switch (t) {
        case BuiltInTypes.optional:
        case BuiltInTypes.undefined:
        case BuiltInTypes.void:
            return `(${v} === undefined)`;
        case BuiltInTypes.exists:
            return `(${v} !== undefined)`;
        case BuiltInTypes.any:
            return `(true)`;
        case BuiltInTypes.array:
            return `Array.isArray(${v})`;
        case BuiltInTypes.int:
            return `Number.isInteger(${v})`;
        case BuiltInTypes.uint:
            return `(Number.isInteger(${v}) && ${v} >= 0)`;
        case BuiltInTypes.uint8:
            return `(Number.isInteger(${v}) && ${v} >= 0 && ${v} < 256)`;
        case BuiltInTypes.int8:
            return `(Number.isInteger(${v}) && ${v} >= -128 && ${v} < 128)`;
        case BuiltInTypes.uint16:
            return `(Number.isInteger(${v}) && ${v} >= 0 && ${v} < 65536)`;
        case BuiltInTypes.int16:
            return `(Number.isInteger(${v}) && ${v} >= -32768 && ${v} < 32768)`;
        case BuiltInTypes.uint32:
            return `(Number.isInteger(${v}) && ${v} >= 0 && ${v} < 4294967296)`;
        case BuiltInTypes.int32:
            return `(Number.isInteger(${v}) && ${v} >= -2147483648 && ${v} < 2147483648)`;
        case BuiltInTypes.uint64:
            return `(Number.isInteger(${v}) && ${v} >= 0)`;
        case BuiltInTypes.int64:
            return `Number.isInteger(${v})`;
        case BuiltInTypes.string:
            return `(typeof ${v} === "string")`;
        case BuiltInTypes.ascii_string:
            return `(typeof ${v} === "string" && /^[\\u0000-\\u007F]+$/.test(${v}))`;
        case BuiltInTypes.latin_string:
            return `(typeof ${v} === "string" && /^[\\u0000-\\u024F\\u2C60-\\u2C7F]+$/.test(${v}))`;
        case BuiltInTypes.boolean:
            return `(typeof ${v} === "boolean")`;
        case BuiltInTypes.number:
            return `(typeof ${v} === "number")`;
        case BuiltInTypes.object:
            return `(typeof ${v} === "object")`;
        case BuiltInTypes.valid_object:
            return `(${v} !== null && typeof ${v} === "object")`;
        case BuiltInTypes.true_value:
            return `(${v} ? true : false)`;
        case BuiltInTypes.false_value:
            return `(!${v})`;
        case BuiltInTypes.true:
        case BuiltInTypes.false:
        case BuiltInTypes.null:
            return `(${v} === ${t})`;
        case BuiltInTypes.float:
            return `(typeof ${v} === "number" && ${v} !== NaN)`;
        case BuiltInTypes.numeric:
            return `(typeof ${v} === "number" || (
                typeof ${v} === "string" &&
                /^[-+]?\\d+(\\.\\d+)?$/.test(${v})
            ))`;
        }

        throw new TypeError(`Unknown type "${this.escape(t)}".`);
    }

    public getFilterConditionStatement(
        v: string,
        t: string
    ): string {

        t = t.trim();

        let ret: string[] = [];

        const filter = t.trim().split(" ");

        switch (filter[0]) {
        case FILTER_ON.LENGTH:
            ret.push(`${v} !== null`);
            ret.push(`${v} !== undefined`);
            ret.push(`typeof ${v}.length === "number"`);
            v = `${v}.length`;
            break;
        case FILTER_ON.ARRAY_LENGTH:
            ret.push(`Array.isArray(${v})`);
            v = `${v}.length`;
            break;
        case FILTER_ON.STRING_LENGTH:
            ret.push(`typeof ${v} === "string"`);
            v = `${v}.length`;
            break;
        case FILTER_ON.VALUE:
            // ret.push(`typeof ${v} === "number"`);
            break;
        default:
            throw new TypeError(`Unknown filter target "${filter[0]}".`);
        }

        switch (filter[1]) {
        case FILTERS.BETWEEN:

            if (filter.length !== 4) {
                throw new TypeError(`Filter ${filter[1]} require 2 arguments.`);
            }

            ret.push(`${v} >= ${filter[2]}`);
            ret.push(`${v} <= ${filter[3]}`);

            break;

        case FILTERS.LARGER_THAN:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} > ${filter[2]}`);

            break;

        case FILTERS.LARGER_OR_EQUAL:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} >= ${filter[2]}`);

            break;

        case FILTERS.LOWER_THAN:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} < ${filter[2]}`);

            break;

        case FILTERS.LOWER_OR_EQUAL:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} <= ${filter[2]}`);

            break;

        case FILTERS.EQUAL_TO:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} == ${filter[2]}`);

            break;

        case FILTERS.NOT_EQUAL:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} != ${filter[2]}`);

            break;

        case FILTERS.TIMES_OF:

            if (filter.length !== 3) {
                throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
            }

            ret.push(`${v} % ${filter[2]} === 0`);

            break;

        case FILTERS.ODD:

            ret.push(`${v} % 2 === 1`);

            break;

        case FILTERS.EVEN:

            ret.push(`${v} % 2 === 0`);

            break;

        default:

            throw new TypeError(`Unknown filter type "${filter[1]}".`);
        }

        return `(${ret.join(" && ")})`;
    }

    public createIfStatement(
        condition: string,
        statement: string,
        elseStatement?: string
    ) {
        let ret = `if (${condition}) { ${statement} }`;

        if (elseStatement) {

            ret = `${ret} else { ${elseStatement} }`;
        }

        return ret;
    }

    public get NOT(): string {

        return "!";
    }

    public get RETURN_TRUE(): string {

        return "return true;";
    }

    public get RETURN_FALSE(): string {

        return "return false;";
    }

    public get AND(): string {

        return "&&";
    }

    public get TRUE_VALUE(): string {

        return "true";
    }

    public get FALSE_VALUE(): string {

        return "false";
    }

    public get OR(): string {

        return "||";
    }

    public escape(s: string): string {

        return s.replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/'/g, "\\\'")
                .replace(/\r/g, "\\r")
                .replace(/\n/g, "\\n");
    }

    public createTempVariableName(index: number): string {

        return `var_${index}`;
    }

    public getBooleanCheckStatement(varName: string): string {

        return `typeof ${varName} === "boolean"`;
    }

    public getNumberCheckStatement(varName: string): string {

        return `typeof ${varName} === "number"`;
    }

    public getNullCheckStatement(varName: string): string {

        return `${varName} === null`;
    }

    public getUndefinedCheckStatement(varName: string): string {

        return `${varName} === undefined`;
    }

    public getNumberValueCheckStatement(
        varName: string,
        value: number
    ): string {

        return `${varName} === ${value}`;
    }

    public getStringValueCheckStatement(
        varName: string,
        value: string
    ): string {

        return `${varName} === "${this.escape(value)}"`;
    }

    public getRegExpVerifyStatement(
        v: string,
        r: string
    ): string {

        let m = r.match(/^\/(.+)\/([a-z]*)$/i);

        if (m) {

            return `((new RegExp("${this.escape(m[1])}", "${m[2]}")).test(${v}))`;
        }

        return `((new RegExp("${this.escape(r)}")).test(${v}))`;
    }

    public getBooleanValueCheckStatement(
        varName: string,
        value: number
    ): string {

        return `${varName} === ${value ? "true" : "false"}`;
    }

    public createClosureExecution(
        argName: string,
        varName: string,
        body: string
    ): string {

        return `(function (${argName}) { ${body} })(${varName})`;
    }

    public createArrayIteration(
        arr: string,
        iter: string,
        body: string
    ): string {

        return `for (let ${iter} of ${arr}) { ${body} }`;
    }

    public createMapIteration(
        arr: string,
        iter: string,
        body: string
    ): string {

        return `for (let ${iter} in ${arr}) { ${body} }`;
    }

    public getObjectKeysArrayStatement(
        objName: string
    ): string {

        return `Object.keys(${objName})`;
    }

    public getConstantDefinition(constName: string, val: string): string {

        return `const ${constName} = ${val};`;
    }

    public getCheckKeysEqualCondition(
        objVar: string,
        objKeysVar: string,
        literalKeys: string[],
        referKeys: string[]
    ): string {

        const KEYS: string = `[${literalKeys.map(
            (k) => `"${this.escape(k)}"`
        ).concat(
            referKeys.map((k) => `${objVar}["${this.escape(k)}"]`)
        ).join(", ")}]`;

        return `new Set(${KEYS}.concat(${objKeysVar})).size === ${
            literalKeys.length + referKeys.length
        }`;
    }

    public getMapValue(
        mapName: string,
        keyOrVal: string,
        isValue?: boolean
    ): string {

        if (isValue) {
            return `${mapName}["${this.escape(keyOrVal)}"]`;
        }

        return `${mapName}[${keyOrVal}]`;
    }

    public getArrayValue(
        arrName: string,
        index: string | number
    ): string {

        return `${arrName}[${index}]`;
    }
}

export default JavaScriptLanguage;
