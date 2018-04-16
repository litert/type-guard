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

import {
    BUILT_IN_TYPES,
    MIX_TYPE_REL,
    CompileOptions,
    Compiler,
    Dict,
    CompileResult,
    BuiltInType,
    KEY_MAP_SUFFIX,
    KEY_ARRAY_SUFFIX,
    TYPE_ARRAY_SUFFIX,
    TYPE_MAP_SUFFIX,
    Language
} from "./common";

class CompileContext {

    public funcs: Dict<string>;

    private _counter: number;

    public constructor() {

        this.funcs = {};

        this._counter = 0;
    }

    public createTempVariableName(): string {

        return `var_${this._counter++}`;
    }
}

interface Statements {

    $deny: string;

    $not: string;

    $allow: string;
}

class CompilerImpl
implements Compiler {

    private _lang: Language;

    public constructor(lang: Language) {

        this._lang = lang;
    }

    /**
     * Check if the type is a filter.
     *
     * @param type The type to be check.
     */
    private _isFilter(filter: string): boolean {

        return filter[0] === "|" &&
                /^\|(length|value|string\.length|array\.length) \w+( [-+]?\d+(\.\d+)?)*$/.test(
                    filter
                );
    }

    /**
     * Check if the type is a RegExp value.
     *
     * @param type The type to be check.
     */
    private _isRegExp(regexp: string): boolean {

        return regexp[0] === "~";
    }

    /**
     * Check if the type is a string value.
     *
     * @param type The type to be check.
     */
    private _isString(str: string): boolean {

        return str[0] === "=";
    }

    /**
     * Check if the type is a simple array type, e.g. string[].
     *
     * @param type The type to be check.
     */
    private _isSimpleArrayType(type: string): boolean {

        return type.endsWith(TYPE_ARRAY_SUFFIX);
    }

    /**
     * Check if the type is a simple map type, e.g. string{}.
     *
     * @param type The type to be check.
     */
    private _isSimpleMapType(type: string): boolean {

        return type.endsWith(TYPE_MAP_SUFFIX);
    }

    private _getSimpleMapElementType(type: string): string {

        return type.slice(0, -TYPE_MAP_SUFFIX.length);
    }

    private _getSimpleArrayElementType(type: string): string {

        return type.slice(0, -TYPE_ARRAY_SUFFIX.length);
    }

    private _isKeyWithMapSuffix(key: string): boolean {

        return key.endsWith(KEY_MAP_SUFFIX);
    }

    private _isKeyWithArraySuffix(key: string): boolean {

        return key.endsWith(KEY_ARRAY_SUFFIX);
    }

    private _removeKeyArraySuffix(key: string): string {

        return key.slice(0, -KEY_ARRAY_SUFFIX.length);
    }

    private _removeKeyMapSuffix(key: string): string {

        return key.slice(0, -KEY_MAP_SUFFIX.length);
    }

    /**
     * Check if the type is built-in.
     *
     * @param type The type to be check.
     */
    private _isBuiltInType(type: string): type is BuiltInType {

        // @ts-ignore
        return BUILT_IN_TYPES[type] === type;
    }

    private _getArrayConditionStatement(
        ctx: CompileContext,
        varName: string,
        theType: string
    ): string {

        if (theType === "any") {

            return this._lang.getBITCondition(varName, "array");
        }

        let $iter = ctx.createTempVariableName();
        let $argName = ctx.createTempVariableName();

        return this._lang.createClosureExecution(
            $argName,
            varName,
            this._lang.createIfStatement(
                this._lang.getBITCondition($argName, "array"),
                `${this._lang.createArrayIteration(
                    $argName,
                    $iter,
                    this._getCheckStatement(
                        ctx,
                        $iter,
                        theType,
                    )
                )}
                ${this._lang.returnTrue}`,
                this._lang.returnFalse
            )
        );
    }

    private _getMapConditionStatement(
        ctx: CompileContext,
        varName: string,
        theType: string
    ): string {

        if (theType === "any") {

            return this._lang.getBITCondition(varName, "valid_object");
        }

        let $key = ctx.createTempVariableName();
        let $argName = ctx.createTempVariableName();

        return this._lang.createClosureExecution(
            $argName,
            varName,
            this._lang.createIfStatement(
                `${this._lang.not}${this._lang.getBITCondition($argName, "array")}
                ${this._lang.and}
                ${this._lang.getBITCondition($argName, "valid_object")}`,
                `${this._lang.createMapIteration(
                    $argName,
                    $key,
                    this._getCheckStatement(
                        ctx,
                        this._lang.getMapValue($argName, $key),
                        theType
                    )
                )}
                ${this._lang.returnTrue}`,
                this._lang.returnFalse
            )
        );
    }

    private _getConditionStatementByObject(
        ctx: CompileContext,
        varName: string,
        theType: Dict<any>
    ): string {

        let keys = Object.keys(theType);

        let ret: string[] = [
            this._lang.getBITCondition(
                varName,
                "valid_object"
            )
        ];

        for (let key of keys) {

            if (this._isKeyWithArraySuffix(key)) {

                ret.push(this._getArrayConditionStatement(
                    ctx,
                    this._lang.getMapValue(
                        varName,
                        this._removeKeyArraySuffix(key),
                        true
                    ),
                    theType[key]
                ));
            }
            else if (this._isKeyWithMapSuffix(key)) {

                ret.push(this._getMapConditionStatement(
                    ctx,
                    this._lang.getMapValue(
                        varName,
                        this._removeKeyMapSuffix(key),
                        true
                    ),
                    theType[key]
                ));
            }
            else {

                ret.push(this._getConditionStatement(
                    ctx,
                    this._lang.getMapValue(
                        varName,
                        key,
                        true
                    ),
                    theType[key]
                ));
            }
        }

        return `(${ret.join(` ${this._lang.and} `)})`;
    }

    private _getConditionStatementByArray(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.falseValue;
        }

        switch (theType[0]) {
        default:

            return this._getConditionStatementBy$Or(
                ctx,
                varName,
                theType
            );

        case MIX_TYPE_REL.$OR:

            return this._getConditionStatementBy$Or(
                ctx,
                varName,
                theType.slice(1)
            );

        case MIX_TYPE_REL.$AND:

            return this._getConditionStatementBy$And(
                ctx,
                varName,
                theType.slice(1)
            );

        case MIX_TYPE_REL.$TUPLE:

            return this._getConditionStatementBy$Tuple(
                ctx,
                varName,
                theType.slice(1)
            );

        case MIX_TYPE_REL.$MAP:

            return this._getConditionStatementBy$Map(
                ctx,
                varName,
                theType.slice(1)
            );

        case MIX_TYPE_REL.$ARRAY:

            return this._getConditionStatementBy$Array(
                ctx,
                varName,
                theType.slice(1)
            );
        }
    }

    private _getConditionStatementBy$Map(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length !== 1) {

            throw new TypeError("$.map can only has one argument.");
        }

        return this._getMapConditionStatement(
            ctx,
            varName,
            theType[0]
        );
    }

    private _getConditionStatementBy$Array(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length !== 1) {

            throw new TypeError("$.array can only has one argument.");
        }

        return this._getArrayConditionStatement(
            ctx,
            varName,
            theType[0]
        );
    }

    private _getConditionStatementBy$And(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.falseValue;
        }

        let ret: string[] = [];

        for (let subType of theType) {

            ret.push(this._getConditionStatement(
                ctx,
                varName,
                subType
            ));
        }

        return `(${ret.join(` ${this._lang.and} `)})`;
    }

    private _getConditionStatementBy$Tuple(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        let ret: string[] = [
            this._getConditionStatementByString(
                ctx,
                varName,
                `|array.length eq ${theType.length}`
            )
        ];

        for (let i = 0; i < theType.length; i++) {

            ret.push(this._getConditionStatement(
                ctx,
                this._lang.getArrayValue(varName, i),
                theType[i]
            ));
        }

        return `(${ret.join(` ${this._lang.and} `)})`;
    }

    private _getConditionStatementBy$Or(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.falseValue;
        }

        let ret: string[] = [];

        for (let subType of theType) {

            ret.push(this._getConditionStatement(
                ctx,
                varName,
                subType
            ));
        }

        return `(${ret.join(` ${this._lang.or} `)})`;
    }

    private _getConditionStatementByString(
        ctx: CompileContext,
        varName: string,
        theType: string
    ): string {

        if (this._isSimpleArrayType(theType)) {

            return this._getArrayConditionStatement(
                ctx,
                varName,
                this._getSimpleArrayElementType(theType)
            );
        }

        if (this._isSimpleMapType(theType)) {

            return this._getMapConditionStatement(
                ctx,
                varName,
                this._getSimpleMapElementType(theType)
            );
        }

        if (this._isBuiltInType(theType)) {

            return this._lang.getBITCondition(varName, theType);
        }

        if (this._isString(theType)) {

            return this._lang.getStringValueCheckStatement(
                varName,
                theType.substr(1)
            );
        }

        if (this._isRegExp(theType)) {

            return this._lang.getRegExpVerifyStatement(
                varName,
                theType.substr(1)
            );
        }

        if (this._isFilter(theType)) {

            return this._lang.getFilterConditionStatement(
                varName,
                theType.substr(1)
            );
        }

        throw new TypeError(`Unknown type descriptor "${this._lang.escape(
            theType
        )}".`);
    }

    /**
     * Get the judge condition statement of type structure description.
     *
     * @param ctx      The context object of compilation.
     * @param varName  The name of variable input to be verified.
     * @param theType  The type structure description.
     */
    private _getConditionStatement(
        ctx: CompileContext,
        varName: string,
        theType: any
    ): string {

        switch (typeof theType) {
        case "string":

            return this._getConditionStatementByString(
                ctx,
                varName,
                theType
            );

        case "object":

            if (theType === null) {

                return `(${this._lang.getNullCheckStatement(varName)})`;
            }

            if (Array.isArray(theType)) {

                return this._getConditionStatementByArray(
                    ctx,
                    varName,
                    theType
                );
            }

            return this._getConditionStatementByObject(
                ctx,
                varName,
                theType
            );

        case "number":

            return `(${this._lang.getNumberValueCheckStatement(
                varName,
                theType
            )})`;

        case "boolean":

            return `(${this._lang.getBooleanValueCheckStatement(
                varName,
                theType
            )})`;

        case "undefined":

            return `(${this._lang.getBooleanValueCheckStatement(
                varName,
                theType
            )})`;

        default:

            throw new TypeError(
                `Unacceptable type "${typeof theType}" of type description.`
            );
        }
    }

    private _getStatements(positive: boolean): Statements {

        return positive ? {
            "$deny": this._lang.returnTrue,
            "$allow": this._lang.returnFalse,
            "$not": ""
        } : {
            "$deny": this._lang.returnFalse,
            "$allow": this._lang.returnTrue,
            "$not": this._lang.not
        };
    }

    private _getCheckStatement(
        ctx: CompileContext,
        varName: string,
        theType: any,
        positive: boolean = false
    ): string {

        const $st = this._getStatements(positive);

        return this._lang.createIfStatement(
            `${$st.$not}${this._getConditionStatement(
                ctx,
                varName,
                theType
            )}`,
            $st.$deny
        );
    }

    public compile(
        descriptor: any,
        opts?: CompileOptions
    ): CompileResult {

        let ctx = new CompileContext();

        const source = this._getConditionStatement(
            ctx,
            "input",
            descriptor
        );

        return { source };
    }
}

export function createCompiler(lang: Language): Compiler {

    return new CompilerImpl(lang);
}
