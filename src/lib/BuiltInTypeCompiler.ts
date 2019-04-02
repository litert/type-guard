/**
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

import * as C from "./Common";
import * as B from "./BuiltInTypes";

interface ITypeInfo {

    elemental: boolean;

    constructed: boolean;

    string: boolean;

    kind: string;
}

const BUILT_IN_TYPES: Record<string, ITypeInfo> = {
    [B.STRING]: {
        "kind": "string",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.ASCII_STRING]: {
        "kind": "string",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.HEX_STRING]: {
        "kind": "string",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.LATIN_STRING]: {
        "kind": "string",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.NUMERIC]: {
        "kind": "number",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.SAFE_INT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.INT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.INT8]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.INT16]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.INT32]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.INT64]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.SAFE_UINT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UINT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UINT8]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UINT16]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UINT32]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UINT64]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.BOOLEAN]: {
        "kind": "boolean",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.ARRAY]: {
        "kind": "array",
        "string": false,
        "constructed": true,
        "elemental": false
    },
    [B.ANY]: {
        "kind": "unknown",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.STRUCT]: {
        "kind": "struct",
        "string": false,
        "constructed": true,
        "elemental": false
    },
    [B.NULL]: {
        "kind": "null",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.UNDEFINED]: {
        "kind": "void",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.VOID]: {
        "kind": "void",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.FALSE]: {
        "kind": "boolean",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.TRUE]: {
        "kind": "boolean",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.FALSE_VALUE]: {
        "kind": "unknown",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.TRUE_VALUE]: {
        "kind": "unknown",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.OPTIONAL]: {
        "kind": "void",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.REQUIRED]: {
        "kind": "unknown",
        "string": false,
        "constructed": false,
        "elemental": false
    },
    [B.DECIMAL]: {
        "kind": "number",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.NUMBER]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.FLOAT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    },
    [B.UDECIMAL]: {
        "kind": "number",
        "string": true,
        "constructed": false,
        "elemental": true
    },
    [B.UFLOAT]: {
        "kind": "number",
        "string": false,
        "constructed": false,
        "elemental": true
    }
};

export class BuiltInTypeCompiler
implements C.IBuiltInTypeCompiler {

    public constructor(
        private _lang: C.ILanguageBuilder
    ) {}

    public isStringType(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].string;
    }

    public isConstructed(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].constructed;
    }

    public isElemental(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].elemental;
    }

    public isBuiltInType(type: string): boolean {

        return BUILT_IN_TYPES[type] !== undefined;
    }

    public compile(type: string, ctx: C.IContext, args: number[]): string {

        const fromString = !!(ctx.flags[C.EFlags.FROM_STRING] &&
                            this.isBuiltInType(type) && (
                                BUILT_IN_TYPES[type].kind === "number" ||
                                BUILT_IN_TYPES[type].kind === "boolean" ||
                                BUILT_IN_TYPES[type].kind === "null"
                            ));

        switch (type) {

            case B.NULL: {

                if (fromString) {

                    return this._lang.or([
                        this._lang.isNull(ctx.vName, true),
                        this._lang.eq(
                            ctx.vName,
                            this._lang.literal("null")
                        )
                    ]);
                }

                return this._lang.isNull(ctx.vName, true);
            }
            case B.ANY: {

                return this._lang.literal(true);
            }
            case B.ARRAY: {

                return this._isArray(ctx, args);
            }
            case B.STRING: {

                return this._isString(ctx, args);
            }
            case B.ASCII_STRING: {

                return this._isString(
                    ctx,
                    args,
                    "[\\u0000-\\u007F]"
                );
            }
            case B.LATIN_STRING: {

                return this._isString(
                    ctx,
                    args,
                    "[\\u0000-\\u024F\\u2C60-\\u2C7F]"
                );
            }
            case B.HEX_STRING: {

                return this._isString(ctx, args, "[0-9A-Fa-f]");
            }
            case B.UFLOAT: {

                return this._isNumber(ctx, [0, NaN], fromString);
            }
            case B.FLOAT:
            case B.NUMBER: {

                return this._isNumber(ctx, args, fromString);
            }
            case B.INT: {

                return this._isInteger(ctx, args, fromString);
            }
            case B.INT64: {

                return this._isInteger(ctx, [], fromString);
            }
            case B.INT8: {

                return this._isInteger(ctx, [-0x80, 0x7F], fromString);
            }
            case B.INT16: {

                return this._isInteger(ctx, [-0x8000, 0x7FFF], fromString);
            }
            case B.INT32: {

                return this._isInteger(
                    ctx,
                    [-0x80000000, 0x7FFFFFFF],
                    fromString
                );
            }
            case B.SAFE_INT: {

                return this._isInteger(
                    ctx,
                    [this._lang.minSafeInteger, this._lang.maxSafeInteger],
                    fromString
                );
            }
            case B.UINT:
            case B.UINT64: {

                return this._isInteger(
                    ctx,
                    [0, NaN],
                    fromString
                );
            }
            case B.UINT8: {

                return this._isInteger(
                    ctx,
                    [0, 0xFF],
                    fromString
                );
            }
            case B.UINT16: {

                return this._isInteger(
                    ctx,
                    [0, 0xFFFF],
                    fromString
                );
            }
            case B.UINT32: {

                return this._isInteger(
                    ctx,
                    [0, 0xFFFFFFFF],
                    fromString
                );
            }
            case B.SAFE_UINT: {

                return this._isInteger(
                    ctx,
                    [0, this._lang.maxSafeInteger],
                    fromString
                );
            }
            case B.BOOLEAN: {

                if (fromString) {

                    return this._lang.or([
                        this._lang.isBoolean(ctx.vName, true),
                        this._lang.isBoolean(
                            this._lang.str2Bool(ctx.vName),
                            true
                        )
                    ]);
                }

                return this._lang.isBoolean(ctx.vName, true);
            }
            case B.TRUE: {

                if (fromString) {

                    return this._lang.or([
                        this._lang.eq(ctx.vName, this._lang.literal(true)),
                        this._lang.eq(
                            this._lang.str2Bool(ctx.vName),
                            this._lang.literal(true)
                        )
                    ]);
                }

                return this._lang.eq(ctx.vName, this._lang.literal(true));
            }
            case B.FALSE: {

                if (fromString) {

                    return this._lang.or([
                        this._lang.eq(ctx.vName, this._lang.literal(false)),
                        this._lang.eq(
                            this._lang.str2Bool(ctx.vName),
                            this._lang.literal(false)
                        )
                    ]);
                }

                return this._lang.eq(ctx.vName, this._lang.literal(false));
            }
            case B.TRUE_VALUE: {

                return this._lang.isTrueValue(ctx.vName);
            }
            case B.FALSE_VALUE: {

                return this._lang.isFalseValue(ctx.vName);
            }
            case B.VOID:
            case B.OPTIONAL:
            case B.UNDEFINED: {

                if (ctx.flags[C.EFlags.REQUIRED]) {

                    throw new Error(
                        `Conflicted: Can not use "optional" with "required" type.`
                    );
                }

                if (ctx.flags[C.EFlags.OPTIONAL]) {

                    return this._lang.literal(true);
                }

                ctx.flags[C.EFlags.OPTIONAL] = C.EFlagValue.YES;

                return this._lang.isUndefined(ctx.vName, true);
            }
            case B.REQUIRED: {

                if (ctx.flags[C.EFlags.OPTIONAL]) {

                    throw new Error(
                        `Conflicted: Can not use "required" with "optional" type.`
                    );
                }

                if (ctx.flags[C.EFlags.REQUIRED]) {

                    return this._lang.literal(true);
                }

                ctx.flags[C.EFlags.REQUIRED] = C.EFlagValue.YES;

                return this._lang.isUndefined(ctx.vName, false);
            }
            case B.STRUCT: {

                return this._lang.isStrucutre(ctx.vName, true);
            }
            case B.NUMERIC: {

                if (args.length) {

                    return this._isNumber(ctx, args, true);
                }

                return this._lang.isNumeric(ctx.vName, true);
            }
            case B.DECIMAL: {

                return this._isDecimal(ctx, args);
            }
            case B.UDECIMAL: {

                return this._isDecimal(ctx, args, true);
            }
        }

        throw new TypeError(`Unknown type ${type}.`);
    }

    private _isDecimal(ctx: C.IContext, params: number[], unsigned: boolean = false): string {

        if (params[0] <= 0) {

            throw new RangeError(`Arg 0 can not be zero for decimal.`);
        }

        const sign = unsigned ? "" : "[-+]?";
        switch (params.length) {

            default:
            case 0: {

                return this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    this._lang.matchRegExp(
                        ctx.vName,
                        `^${sign}([1-9]\\d*|0)(\\.\\d+)?$`
                    )
                ]);
            }

            case 1: {

                return this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    this._lang.matchRegExp(
                        ctx.vName,
                        `^${sign}([1-9]\\d*|0)(\\.\\d+)?$`
                    ),
                    this._lang.ifElseOp(
                        this._lang.instr(ctx.vName, this._lang.literal(".")),
                        this._lang.lte(
                            this._lang.stringLength(ctx.vName),
                            params[0] + 1
                        ),
                        this._lang.lte(
                            this._lang.stringLength(ctx.vName),
                            params[0]
                        )
                    )
                ]);
            }

            case 2: {

                if (params[0] < params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for decimal.`);
                }

                if (params[1] === 0) {

                    return this._lang.and([
                        this._lang.isString(ctx.vName, true),
                        this._lang.matchRegExp(
                            ctx.vName,
                            `^${sign}([1-9]\\d{0,${params[0] - 1}}|0)$`
                        )
                    ]);
                }

                if (params[0] === params[1]) {

                    return this._lang.and([
                        this._lang.isString(ctx.vName, true),
                        this._lang.matchRegExp(
                            ctx.vName,
                            `^${sign}0\\.\\d{${params[1]}}$`
                        )
                    ]);
                }

                return this._lang.matchRegExp(
                    ctx.vName,
                    `^${sign}([1-9]\\d{0,${params[0] - params[1] - 1}}|0)\\.\\d{${params[1]}}$`
                );
            }
        }
    }

    private _isArray(ctx: C.IContext, params: number[]): string {

        switch (params.length) {
            default:
            case 0: {

                return this._lang.isArray(ctx.vName, true);
            }
            case 1: {

                if (!Number.isInteger(params[0]) || params[0] < 0) {

                    throw new Error(`Invalid argument "${params[0]}" for array.`);
                }

                return this._lang.and([
                    this._lang.isArray(ctx.vName, true),
                    this._lang.eq(
                        this._lang.arrayLength(ctx.vName),
                        params[0]
                    )
                ]);
            }
            case 2: {

                if (!Number.isInteger(params[0]) || params[0] < 0) {

                    throw new Error(`Invalid argument "${params[0]}" for array.`);
                }

                const result: string[] = [

                    this._lang.isArray(ctx.vName, true),
                    this._lang.gte(
                        this._lang.arrayLength(ctx.vName),
                        params[0]
                    )
                ];

                if (this._checkValidUInteger(
                    params[1],
                    `Invalid argument "${params[1]}" for array.`
                )) {

                    if (params[0] > params[1]) {

                        throw new RangeError(
                            `Arg 0 should not be larger than arg 1 for array.`
                        );
                    }

                    result.push(
                        this._lang.lte(
                            this._lang.arrayLength(ctx.vName),
                            params[1]
                        )
                    );
                }

                return this._lang.and(result);
            }
        }
    }

    private _isNumber(
        ctx: C.IContext,
        params: number[],
        fromString: boolean
    ): string {

        const result: string[] = [
            this._lang.isNumber(ctx.vName, true)
        ];

        switch (params.length) {
            default:
            case 0: {

                if (fromString) {

                    result.push(this._lang.and([
                        this._lang.isString(ctx.vName, true),
                        this._lang.matchRegExp(
                            ctx.vName,
                            "^[-+]?\\d+(\\.\\d+)?$"
                        )
                    ]));
                }

                return this._lang.or(result);
            }
            case 2: {

                let vName = ctx.vName;

                if (fromString) {

                    ctx.trap(true);
                    vName = this._lang.varName(ctx.vCursor++);
                }

                if (this._checkValidNumber(params[0], `Invalid argument "${params[0]}".`)) {

                    result.push(this._lang.gte(
                        vName,
                        params[0]
                    ));
                }

                if (this._checkValidNumber(params[1], `Invalid argument "${params[1]}".`)) {

                    if (params[0] > params[1]) {

                        throw new RangeError(`Arg 0 should not be larger than arg 1 for number.`);
                    }

                    result.push(this._lang.lte(
                        vName,
                        params[1]
                    ));
                }

                if (result.length === 1) {

                    throw new SyntaxError(
                        `Invalid syntax of integer.`
                    );
                }

                if (fromString) {

                    ctx.untrap();

                    return this._lang.and([
                        this._lang.or([
                            result[0],
                            this._lang.and([
                                this._lang.isString(ctx.vName, true),
                                this._lang.matchRegExp(
                                    ctx.vName,
                                    "^[-+]?\\d+(\\.\\d+)?$"
                                )
                            ])
                        ]),
                        result.length === 3 ? this._lang.closure(
                            [vName],
                            [this._lang.str2Float(ctx.vName)],
                            this._lang.returnValue(
                                this._lang.and(result.slice(1))
                            )
                        ) : result[1].replace(vName, this._lang.str2Float(ctx.vName))
                    ]);
                }

                return this._lang.and(result);
            }
        }
    }

    private _checkValidNumber(v: number, msg: string): boolean {

        if (Number.isNaN(v)) {

            return false;
        }

        if (Number.isFinite(v)) {

            return true;
        }

        throw new TypeError(msg);
    }

    private _checkValidInteger(v: number | string, msg: string): boolean {

        if (typeof v === "string") {

            v = parseFloat(v);
        }

        if (Number.isNaN(v)) {

            return false;
        }

        if (Number.isInteger(v)) {

            return true;
        }

        throw new TypeError(msg);
    }

    private _checkValidUInteger(v: number, msg: string): boolean {

        if (Number.isNaN(v)) {

            return false;
        }

        if (Number.isInteger(v) && v > -1) {

            return true;
        }

        throw new TypeError(msg);
    }

    private _isInteger(
        ctx: C.IContext,
        params: Array<string | number>,
        fromString: boolean
    ): string {

        const result: string[] = [
            this._lang.isInteger(ctx.vName, true)
        ];

        switch (params.length) {
            default:
            case 0: {

                if (fromString) {

                    result.push(this._lang.and([
                        this._lang.isString(ctx.vName, true),
                        this._lang.matchRegExp(
                            ctx.vName,
                            "^[-+]?\\d+$"
                        )
                    ]));
                }

                return this._lang.or(result);
            }
            case 2: {

                let vName = ctx.vName;

                if (fromString) {

                    ctx.trap(true);
                    vName = this._lang.varName(ctx.vCursor++);
                }

                if (this._checkValidInteger(
                    params[0],
                    `Invalid argument "${params[0]}" for integer.`
                )) {

                    result.push(this._lang.gte(
                        vName,
                        params[0]
                    ));
                }

                if (this._checkValidInteger(
                    params[1],
                    `Invalid argument "${params[1]}" for integer.`
                )) {

                    if (params[0] > params[1]) {

                        throw new RangeError(
                            `Arg 0 should not be larger than arg 1 for number.`
                        );
                    }

                    result.push(this._lang.lte(
                        vName,
                        params[1]
                    ));
                }

                if (result.length === 1) {

                    throw new SyntaxError(
                        `Invalid syntax of integer.`
                    );
                }

                if (fromString) {

                    ctx.untrap();

                    return this._lang.and([
                        this._lang.or([
                            result[0],
                            this._lang.and([
                                this._lang.isString(ctx.vName, true),
                                this._lang.matchRegExp(
                                    ctx.vName,
                                    "^[-+]?\\d+$"
                                )
                            ])
                        ]),
                        result.length === 3 ? this._lang.closure(
                            [vName],
                            [this._lang.str2Int(ctx.vName)],
                            this._lang.returnValue(
                                this._lang.and(result.slice(1))
                            )
                        ) : result[1].replace(vName, this._lang.str2Int(ctx.vName))
                    ]);
                }

                return this._lang.and(result);
            }
        }
    }

    private _isString(
        ctx: C.IContext,
        params: number[],
        elementRegExp?: string
    ): string {

        switch (params.length) {

            default:
            case 0: {

                return elementRegExp ? this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    this._lang.matchRegExp(
                        ctx.vName,
                        `^${elementRegExp}*$`
                    )
                ]) : this._lang.isString(ctx.vName, true);
            }

            case 1: {

                if (!Number.isInteger(params[0]) || params[0] < 0) {

                    throw new Error(`Invalid argument "${params[0]}" for string.`);
                }

                return this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    elementRegExp ? this._lang.matchRegExp(
                        ctx.vName,
                        `^${elementRegExp}{${params[0]}}$`
                    ) : this._lang.eq(
                        this._lang.stringLength(ctx.vName),
                        params[0]
                    )
                ]);
            }

            case 2: {

                if (!Number.isInteger(params[0]) || params[0] < 0) {

                    throw new Error(`Invalid argument "${params[0]}" for string.`);
                }

                const result: string[] = [

                    this._lang.isString(ctx.vName, true)
                ];

                if (elementRegExp) {

                    if (this._checkValidUInteger(
                        params[1],
                        `Invalid argument "${params[1]}" for string.`
                    )) {

                        if (params[0] > params[1]) {

                            throw new RangeError(
                                `Arg 0 should not be larger than arg 1 for string.`
                            );
                        }

                        result.push(this._lang.matchRegExp(
                            ctx.vName,
                            `^${elementRegExp}{${params[0]},${params[1]}}$`
                        ));
                    }
                    else {

                        result.push(this._lang.matchRegExp(
                            ctx.vName,
                            `^${elementRegExp}{${params[0]},}}$`
                        ));
                    }
                }
                else {

                    if (this._checkValidUInteger(
                        params[1],
                        `Invalid argument "${params[1]}" for string.`
                    )) {

                        if (params[0] > params[1]) {

                            throw new RangeError(
                                `Arg 0 should not be larger than arg 1 for string.`
                            );
                        }

                        result.push(
                            this._lang.gte(
                                this._lang.stringLength(ctx.vName),
                                params[0]
                            ),
                            this._lang.lte(
                                this._lang.stringLength(ctx.vName),
                                params[1]
                            )
                        );
                    }
                    else {

                        result.push(
                            this._lang.gte(
                                this._lang.stringLength(ctx.vName),
                                this._lang.literal(params[0])
                            )
                        );
                    }

                }

                return this._lang.and(result);
            }
        }
    }
}
