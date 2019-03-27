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
    "dict": {
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

    public compile(type: string, ctx: C.IContext, args: string[]): string {

        let params: number[] = args.map((x) => parseFloat(x));

        if (["float", "number", "ufloat"].includes(type)) {

            if (params.filter((x) => Number.isFinite(x) && !Number.isNaN(x)).length !== args.length) {

                throw new TypeError(`Unknown argument (${args.join(", ")}) for ${type}.`);
            }
        }
        else {

            if (params.filter((x) => Number.isInteger(x)).length !== args.length) {

                throw new TypeError(`Unknown argument (${args.join(", ")}) for ${type}.`);
            }
        }

        switch (type) {

            case "null": {

                return this._lang.isNull(ctx.vName, true);
            }
            case "any": {

                return this._lang.literal(true);
            }
            case "array": {

                return this._isArray(ctx, params);
            }
            case "string": {

                return this._isString(ctx, params);
            }
            case "ascii_string": {

                return this._lang.and([
                    this._isString(ctx, params),
                    this._lang.matchRegExp(ctx.vName, "^[\\u0000-\\u007F]+$")
                ]);
            }
            case "latin_string": {

                return this._lang.and([
                    this._isString(ctx, params),
                    this._lang.matchRegExp(
                        ctx.vName,
                        "^[\\u0000-\\u024F\\u2C60-\\u2C7F]+$"
                    )
                ]);
            }
            case "hex_string": {

                return this._lang.and([
                    this._isString(ctx, params),
                    this._lang.matchRegExp(ctx.vName, "^[0-9A-Fa-f]+$")
                ]);
            }
            case "ufloat": {

                return this._lang.and([
                    this._lang.isNumber(ctx.vName, true),
                    this._lang.gte(ctx.vName, "0")
                ]);
            }
            case "float":
            case "number": {

                return this._isNumber(ctx, params);
            }
            case "int": {

                return this._isInteger(ctx, params);
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
                    this._lang.gte(ctx.vName, "-0x80000000"),
                    this._lang.lte(ctx.vName, "0x7FFFFFFF")
                ]);
            }
            case "int32": {

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(ctx.vName, "-0x8000"),
                    this._lang.lte(ctx.vName, "0x7FFF")
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
            case "true": {

                return this._lang.isTrueValue(ctx.vName);
            }
            case "false_value": {

                return this._lang.isFalseValue(ctx.vName);
            }
            case "void":
            case "optional":
            case "undefined": {

                return this._lang.isUndefined(ctx.vName, true);
            }
            case "required": {

                return this._lang.isUndefined(ctx.vName, false);
            }
            case "dict": {

                return this._lang.isDict(ctx.vName, true);
            }
            case "numeric": {

                return this._lang.isNumeric(ctx.vName, true);
            }
            case "decimal": {

                return this._isDecimal(ctx, params);
            }
            case "udecimal": {

                return this._isDecimal(ctx, params, true);
            }
        }

        throw new TypeError(`Unknown type ${type}.`);
    }

    private _isDecimal(ctx: C.IContext, params: number[], unsigned: boolean = false): string {

        const sign = unsigned ? "" : "[-+]?";
        switch (params.length) {

            default:
            case 0: {

                return this._lang.isNumeric(ctx.vName, true);
            }

            case 1: {

                return this._lang.matchRegExp(
                    ctx.vName,
                    `^${sign}\\d{${params[0]}}$`
                );
            }

            case 2: {

                if (params[0] < params[1]) {

                    throw new RangeError(`Arg 0 should not be larger than arg 1 for decimal.`);
                }

                if (params[1] === 0) {

                    return this._lang.matchRegExp(
                        ctx.vName,
                        `^${sign}\\d{${params[0]}}$`
                    );
                }

                return this._lang.matchRegExp(
                    ctx.vName,
                    `^${sign}\\d{${params[0] - params[1]}}\\.\\d{${params[1]}}$`
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

                return this._lang.and([
                    this._lang.isNumber(ctx.vName, true),
                    this._lang.gte(
                        ctx.vName,
                        this._lang.literal(params[0])
                    ),
                    this._lang.lte(
                        ctx.vName,
                        this._lang.literal(params[1])
                    )
                ]);
            }
        }
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

                return this._lang.and([
                    this._lang.isInteger(ctx.vName, true),
                    this._lang.gte(
                        ctx.vName,
                        this._lang.literal(params[0])
                    ),
                    this._lang.lte(
                        ctx.vName,
                        this._lang.literal(params[1])
                    )
                ]);
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
                        `^${elementRegExp}$`
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
