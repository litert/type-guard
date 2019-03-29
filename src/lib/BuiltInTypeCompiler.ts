import * as C from "./Common";

interface ITypeInfo {

    elemental: boolean;

    forcedString: boolean;

    numeric: boolean;

    hasLength: boolean;

    constructed: boolean;
}

const BUILT_IN_TYPES: Record<string, ITypeInfo> = {
    "string": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": true,
        "constructed": false
    },
    "ascii_string": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": true,
        "constructed": false
    },
    "hex_string": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": true,
        "constructed": false
    },
    "latin_string": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": true,
        "constructed": false
    },
    "numeric": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "safe_int": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "int": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "int8": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "int16": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "int32": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "int64": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "safe_uint": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "uint": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "uint8": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "uint16": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "uint32": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "uint64": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "boolean": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "array": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": true,
        "constructed": true
    },
    "any": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "struct": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": true
    },
    "null": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "undefined": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "void": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "false": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "true": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "false_value": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "true_value": {
        "elemental": true,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "optional": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "required": {
        "elemental": false,
        "forcedString": false,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "decimal": {
        "elemental": true,
        "forcedString": false,
        "numeric": true,
        "hasLength": true,
        "constructed": false
    },
    "number": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "float": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    },
    "udecimal": {
        "elemental": true,
        "forcedString": false,
        "numeric": true,
        "hasLength": true,
        "constructed": false
    },
    "ufloat": {
        "elemental": true,
        "forcedString": true,
        "numeric": false,
        "hasLength": false,
        "constructed": false
    }
};

export class BuiltInTypeCompiler
implements C.IBuiltInTypeCompiler {

    public constructor(
        private _lang: C.ILanguageBuilder
    ) {}

    public isNumberType(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].forcedString;
    }

    public isForcedStringType(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].forcedString;
    }

    public isConstructed(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].constructed;
    }

    public isElemental(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].elemental;
    }

    public hasLength(type: string): boolean {

        return this.isBuiltInType(type) && BUILT_IN_TYPES[type].hasLength;
    }

    public isBuiltInType(type: string): boolean {

        return BUILT_IN_TYPES[type] !== undefined;
    }

    public compile(type: string, ctx: C.IContext, args: number[]): string {

        switch (type) {

            case "null": {

                return this._lang.isNull(ctx.vName, true);
            }
            case "any": {

                return this._lang.literal(true);
            }
            case "array": {

                return this._isArray(ctx, args);
            }
            case "string": {

                return this._isString(ctx, args);
            }
            case "ascii_string": {

                return this._isString(
                    ctx,
                    args,
                    "[\\u0000-\\u007F]"
                );
            }
            case "latin_string": {

                return this._isString(
                    ctx,
                    args,
                    "[\\u0000-\\u024F\\u2C60-\\u2C7F]"
                );
            }
            case "hex_string": {

                return this._isString(ctx, args, "[0-9A-Fa-f]");
            }
            case "ufloat": {

                return this._lang.and([
                    this._lang.isNumber(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0")
                ]);
            }
            case "float":
            case "number": {

                return this._isNumber(ctx, args);
            }
            case "int": {

                return this._isInteger(ctx, args);
            }
            case "int64": {

                return this._lang.isInteger(ctx.vName, true);
            }
            case "int8": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "-0x80"),
                    this._lang.lte(ctx.vName, "0x7F")
                ]);
            }
            case "int16": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "-0x8000"),
                    this._lang.lte(ctx.vName, "0x7FFF")
                ]);
            }
            case "int32": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "-0x80000000"),
                    this._lang.lte(ctx.vName, "0x7FFFFFFF")
                ]);
            }
            case "safe_int": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, this._lang.minSafeInteger),
                    this._lang.lte(ctx.vName, this._lang.maxSafeInteger)
                ]);
            }
            case "uint":
            case "uint64": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0")
                ]);
            }
            case "uint8": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0"),
                    this._lang.lte(ctx.vName, "0xFF")
                ]);
            }
            case "uint16": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0"),
                    this._lang.lte(ctx.vName, "0xFFFF")
                ]);
            }
            case "uint32": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0"),
                    this._lang.lte(ctx.vName, "0xFFFFFFFF")
                ]);
            }
            case "safe_uint": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0"),
                    this._lang.lte(ctx.vName, this._lang.maxSafeInteger)
                ]);
            }
            case "boolean": {

                return this._lang.isBoolean(ctx.vName, true);
            }
            case "true": {

                return this._lang.eq(ctx.vName, this._lang.literal(true));
            }
            case "false": {

                return this._lang.eq(ctx.vName, this._lang.literal(false));
            }
            case "true_value": {

                return this._lang.isTrueValue(ctx.vName);
            }
            case "false_value": {

                return this._lang.isFalseValue(ctx.vName);
            }
            case "void":
            case "optional":
            case "undefined": {

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
            case "required": {

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
            case "struct": {

                return this._lang.isStrucutre(ctx.vName, true);
            }
            case "numeric": {

                return this._lang.isNumeric(ctx.vName, true);
            }
            case "decimal": {

                return this._isDecimal(ctx, args);
            }
            case "udecimal": {

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

                return this._lang.and([
                    this._lang.isArray(ctx.vName, true),
                    this._lang.eq(
                        this._lang.arrayLength(ctx.vName),
                        this._lang.literal(params[0])
                    )
                ]);
            }
            case 2: {

                if (params[0] > params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for array.`);
                }

                return this._lang.and([
                    this._lang.isArray(ctx.vName, true),
                    this._lang.gte(
                        this._lang.arrayLength(ctx.vName),
                        this._lang.literal(params[0])
                    ),
                    this._lang.lte(
                        this._lang.arrayLength(ctx.vName),
                        this._lang.literal(params[1])
                    )
                ]);
            }
        }
    }

    private _isNumber(ctx: C.IContext, params: number[]): string {

        switch (params.length) {
            default:
            case 0: {

                return this._lang.isNumber(ctx.vName, true);
            }
            case 2: {

                if (params[0] > params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for number.`);
                }

                const result: string[] = [
                    this._lang.isNumber(ctx.vName, true)
                ];

                if (this._checkValidNumber(params[0], `Invalid argument "${params[0]}".`)) {

                    result.push(this._lang.gte(
                        ctx.vName,
                        params[0]
                    ));
                }

                if (this._checkValidNumber(params[1], `Invalid argument "${params[1]}".`)) {

                    result.push(this._lang.lte(
                        ctx.vName,
                        params[1]
                    ));
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

    private _checkValidInteger(v: number, msg: string): boolean {

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

    private _isInteger(ctx: C.IContext, params: number[]): string {

        switch (params.length) {
            default:
            case 0: {

                return this._lang.isInteger(ctx.vName, true);
            }
            case 2: {

                if (params[0] > params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for number.`);
                }

                const result: string[] = [
                    this._lang.isInteger(ctx.vName, true)
                ];

                if (this._checkValidInteger(params[0], `Invalid argument "${params[0]}".`)) {

                    result.push(this._lang.gte(
                        ctx.vName,
                        this._lang.literal(params[0])
                    ));
                }

                if (this._checkValidInteger(params[1], `Invalid argument "${params[1]}".`)) {

                    result.push(this._lang.lte(
                        ctx.vName,
                        this._lang.literal(params[1])
                    ));
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

                return this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    elementRegExp ? this._lang.matchRegExp(
                        ctx.vName,
                        `^${elementRegExp}{${params[0]}}$`
                    ) : this._lang.eq(
                        this._lang.stringLength(ctx.vName),
                        this._lang.literal(params[0])
                    )
                ]);
            }

            case 2: {

                if (params[0] > params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for string.`);
                }

                if (elementRegExp) {

                    return this._lang.and([
                        this._lang.isString(ctx.vName, true),
                        this._lang.matchRegExp(
                            ctx.vName,
                            `^${elementRegExp}{${params[0]},${params[1]}}$`
                        )
                    ]);
                }

                return this._lang.and([
                    this._lang.isString(ctx.vName, true),
                    this._lang.gte(
                        this._lang.stringLength(ctx.vName),
                        this._lang.literal(params[0])
                    ),
                    this._lang.lte(
                        this._lang.stringLength(ctx.vName),
                        this._lang.literal(params[1])
                    )
                ]);
            }
        }
    }
}
