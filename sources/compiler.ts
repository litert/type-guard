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
    BuiltInTypes,
    AdvancedTypes,
    CompileOptions,
    Compiler,
    Dict,
    CompileResult,
    BuiltInType,
    KEY_MAP_SUFFIX,
    KEY_ARRAY_SUFFIX,
    TYPE_ARRAY_SUFFIX,
    TYPE_MAP_SUFFIX,
    Language,
    IMPLICIT_SYMBOL,
    ADV_TYPE_REL_PREFIX,
    KEY_OBJECT_SUFFIX
} from "./common";

class CompileContext {

    public funcs: Dict<string>;

    private _counter: number;

    private _lang: Language;

    public constructor(lang: Language) {

        this.funcs = {};

        this._counter = 0;

        this._lang = lang;
    }

    public createTempVariableName(): string {

        return this._lang.createTempVariableName(this._counter++);
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

    private _isOptionalType(theType: any): boolean {

        if (typeof theType === "string") {

            switch (theType) {
            case BuiltInTypes.void:
            case BuiltInTypes.optional:
                return true;
            default:
                return theType.startsWith(IMPLICIT_SYMBOL);
            }
        }

        if (Array.isArray(theType)) {

            if (
                (
                    theType[0] === AdvancedTypes.$OR ||
                    typeof theType[0] !== "string" ||
                    !theType[0].startsWith(ADV_TYPE_REL_PREFIX)
                ) &&
                (
                    theType.indexOf(BuiltInTypes.optional) !== -1 ||
                    theType.indexOf(BuiltInTypes.void) !== -1
                )
            ) {
                return true;
            }
        }

        return false;
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

    /**
     * Check if the key of object is ending with "->{}".
     *
     * @param key The key to be checked.
     */
    private _isKeyWithMapSuffix(key: string): boolean {

        return key.endsWith(KEY_MAP_SUFFIX);
    }

    /**
     * Check if the key of object is ending with "->(=)".
     *
     * @param key The key to be checked.
     */
    private _isKeyWithObjectSuffix(key: string): boolean {

        return key.endsWith(KEY_OBJECT_SUFFIX);
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

    private _removeKeyObjectSuffix(key: string): string {

        return key.slice(0, -KEY_OBJECT_SUFFIX.length);
    }

    /**
     * Check if the type is built-in.
     *
     * @param type The type to be check.
     */
    private _isBuiltInType(type: string): type is BuiltInType {

        // @ts-ignore
        return BuiltInTypes[type] === type;
    }

    private _getArrayConditionStatement(
        ctx: CompileContext,
        varName: string,
        theType: any
    ): string {

        if (theType === BuiltInTypes.any) {

            return this._lang.getBITCondition(varName, BuiltInTypes.array);
        }

        let $iter = ctx.createTempVariableName();
        let $argName = ctx.createTempVariableName();

        return this._lang.createClosureExecution(
            $argName,
            varName,
            this._lang.createIfStatement(
                this._lang.getBITCondition($argName, BuiltInTypes.array),
                `${this._lang.createArrayIteration(
                    $argName,
                    $iter,
                    this._getCheckStatement(
                        ctx,
                        $iter,
                        theType,
                    )
                )}
                ${this._lang.RETURN_TRUE}`,
                this._lang.RETURN_FALSE
            )
        );
    }

    private _getMapConditionStatement(
        ctx: CompileContext,
        varName: string,
        theType: any
    ): string {

        if (theType === BuiltInTypes.any) {

            return this._lang.getBITCondition(
                varName,
                BuiltInTypes.valid_object
            );
        }

        let $key = ctx.createTempVariableName();
        let $argName = ctx.createTempVariableName();

        return this._lang.createClosureExecution(
            $argName,
            varName,
            this._lang.createIfStatement(
                `${this._lang.NOT}${this._lang.getBITCondition(
                    $argName, BuiltInTypes.array
                )}
                ${this._lang.AND}
                ${this._lang.getBITCondition(
                    $argName,
                    BuiltInTypes.valid_object
                )}`,
                `${this._lang.createMapIteration(
                    $argName,
                    $key,
                    this._getCheckStatement(
                        ctx,
                        this._lang.getMapValue($argName, $key),
                        theType
                    )
                )}
                ${this._lang.RETURN_TRUE}`,
                this._lang.RETURN_FALSE
            )
        );
    }

    private _getDictConditionStatement(
        ctx: CompileContext,
        varName: string,
        keys: string[],
        theType: any
    ): string {

        if (theType === BuiltInTypes.any) {

            return this._lang.getBITCondition(
                varName,
                BuiltInTypes.valid_object
            );
        }

        let $key = ctx.createTempVariableName();
        let $argName = ctx.createTempVariableName();

        return this._lang.createClosureExecution(
            $argName,
            varName,
            this._lang.createIfStatement(
                `${this._lang.NOT}${this._lang.getBITCondition(
                    $argName, BuiltInTypes.array
                )}
                ${this._lang.AND}
                ${this._lang.getBITCondition(
                    $argName,
                    BuiltInTypes.valid_object
                )}`,
                `${this._lang.createMapIteration(
                    $argName,
                    $key,
                    `switch (${$key}) {
                    ${keys.map(
                        (k) => `case "${this._lang.escape(k)}":`
                    ).join(" ")} break;
                    default: return false;
                    }
                    ${this._getCheckStatement(
                        ctx,
                        this._lang.getMapValue($argName, $key),
                        theType
                    )}`
                )}
                ${this._lang.RETURN_TRUE}`,
                this._lang.RETURN_FALSE
            )
        );
    }

    /**
     * Get condition statement of a non-strict structure.
     *
     * @param ctx       The context object.
     * @param varName   The name of variable to be checked.
     * @param theType   The type to be checked.
     */
    private _getConditionStatementByStructure(
        ctx: CompileContext,
        varName: string,
        theType: Dict<any>
    ): string {

        let keys = Object.keys(theType);

        let ret: string[] = [
            /**
             * First check if the variable is structure-like.
             */
            this._lang.getBITCondition(
                varName,
                BuiltInTypes.valid_object
            )
        ];

        for (let key of keys) {

            let keyType = theType[key];
            let isOptional = false;

            if (key.endsWith(IMPLICIT_SYMBOL)) {

                key = key.slice(0, -1);
                isOptional = true;
            }

            if (this._isKeyWithArraySuffix(key)) {

                keyType = [AdvancedTypes.$ARRAY, keyType];
                key = this._removeKeyArraySuffix(key);
            }
            else if (this._isKeyWithMapSuffix(key)) {

                keyType = [AdvancedTypes.$MAP, keyType];
                key = this._removeKeyMapSuffix(key);
            }
            else if (this._isKeyWithObjectSuffix(key)) {

                keyType = [AdvancedTypes.$STRUCT, keyType];
                key = this._removeKeyObjectSuffix(key);
            }

            if (isOptional) {

                keyType = this._isOptionalType(keyType) ? keyType : [
                    AdvancedTypes.$OR,
                    BuiltInTypes.optional,
                    keyType
                ];
            }

            ret.push(this._getConditionStatement(
                ctx,
                this._lang.getMapValue(
                    varName,
                    key,
                    true
                ),
                keyType
            ));
        }

        return `(${ret.join(` ${this._lang.AND} `)})`;
    }

    /**
     * Get condition statement of a strict structure.
     *
     * @param ctx       The context object.
     * @param varName   The name of variable to be checked.
     * @param theType   The type to be checked.
     */
    private _getConditionStatementBy$Object(
        ctx: CompileContext,
        varName: string,
        theType: any
    ): string {

        if (
            theType.length !== 1 ||
            typeof theType[0] !== "object" ||
            Array.isArray(theType[0])
        ) {

            throw new TypeError(
                "$.struct can only work with one object argument."
            );
        }

        theType = theType[0];

        let keys = Object.keys(theType);

        const $objName = ctx.createTempVariableName();
        const $objKeys = ctx.createTempVariableName();

        let ret: string[] = [
            /**
             * First check if the variable is structure-like.
             */
            this._lang.getBITCondition(
                varName,
                BuiltInTypes.valid_object
            )
        ];

        let finalKeys: string[] = [];

        for (let key of keys) {

            let keyType = theType[key];
            let isOptional = false;

            if (key.endsWith(IMPLICIT_SYMBOL)) {

                key = key.slice(0, -1);
                isOptional = true;
            }

            if (this._isKeyWithArraySuffix(key)) {

                keyType = [AdvancedTypes.$ARRAY, keyType];
                key = this._removeKeyArraySuffix(key);
            }
            else if (this._isKeyWithMapSuffix(key)) {

                keyType = [AdvancedTypes.$MAP, keyType];
                key = this._removeKeyMapSuffix(key);
            }
            else if (this._isKeyWithObjectSuffix(key)) {

                keyType = [AdvancedTypes.$STRUCT, keyType];
                key = this._removeKeyObjectSuffix(key);
            }

            if (isOptional) {

                keyType = this._isOptionalType(keyType) ? keyType : [
                    AdvancedTypes.$OR,
                    BuiltInTypes.optional,
                    keyType
                ];
            }

            finalKeys.push(key);

            ret.push(this._getConditionStatement(
                ctx,
                this._lang.getMapValue(
                    varName,
                    key,
                    true
                ),
                keyType
            ));
        }

        ret.splice(1, 0, this._lang.createClosureExecution(
            $objName,
            varName,
            `${this._lang.getConstantDefinition(
                $objKeys,
                this._lang.getObjectKeysArrayStatement($objName)
            )}
            ${this._lang.createIfStatement(
                this._lang.getStringArrayContainsCondition(
                    $objKeys,
                    finalKeys
                ),
                this._lang.RETURN_TRUE,
                this._lang.RETURN_FALSE
            )}`
        ));

        return `(${ret.join(` ${this._lang.AND} `)})`;
    }

    private _getConditionStatementByArray(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.FALSE_VALUE;
        }

        switch (theType[0]) {
        default:

            return this._getConditionStatementBy$Or(
                ctx,
                varName,
                theType
            );

        case AdvancedTypes.$OR:

            return this._getConditionStatementBy$Or(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$AND:

            return this._getConditionStatementBy$And(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$TUPLE:

            return this._getConditionStatementBy$Tuple(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$MAP:

            return this._getConditionStatementBy$Map(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$STRUCT:

            return this._getConditionStatementBy$Object(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$DICT:

            return this._getConditionStatementBy$Dict(
                ctx,
                varName,
                theType.slice(1)
            );

        case AdvancedTypes.$ARRAY:

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

        if (theType.length < 1) {

            throw new TypeError("MAP syntax: $.map <element_type>.");
        }

        return this._getMapConditionStatement(
            ctx,
            varName,
            theType.length === 1 ? theType[0] : theType
        );
    }

    private _getConditionStatementBy$Dict(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length < 2) {

            throw new TypeError("DICT syntax: $.dict <keys> <element_type>.");
        }

        const keys: string[] = theType[0];

        if (!Array.isArray(keys)) {

            throw new TypeError(
                "Keys of DICT must be a non-empty string array."
            );
        }

        for (let item of keys) {

            if (typeof item !== "string") {

                throw new TypeError(
                    "Keys of DICT must be a non-empty string array."
                );
            }
        }

        return this._getDictConditionStatement(
            ctx,
            varName,
            keys,
            theType.length === 2 ? theType[1] : theType.slice(1)
        );
    }

    private _getConditionStatementBy$Array(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length < 1) {

            throw new TypeError("ARRAY syntax: $.array <element_type>.");
        }

        return this._getArrayConditionStatement(
            ctx,
            varName,
            theType.length === 1 ? theType[0] : theType.slice(0)
        );
    }

    private _getConditionStatementBy$And(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.FALSE_VALUE;
        }

        let ret: string[] = [];

        for (let subType of theType) {

            ret.push(this._getConditionStatement(
                ctx,
                varName,
                subType
            ));
        }

        return `(${ret.join(` ${this._lang.AND} `)})`;
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

        return `(${ret.join(` ${this._lang.AND} `)})`;
    }

    private _getConditionStatementBy$Or(
        ctx: CompileContext,
        varName: string,
        theType: any[]
    ): string {

        if (theType.length === 0) {

            return this._lang.FALSE_VALUE;
        }

        let ret: string[] = [];

        for (let subType of theType) {

            ret.push(this._getConditionStatement(
                ctx,
                varName,
                subType
            ));
        }

        return `(${ret.join(` ${this._lang.OR} `)})`;
    }

    private _getConditionStatementByString(
        ctx: CompileContext,
        varName: string,
        theType: string
    ): string {

        if (theType[0] === IMPLICIT_SYMBOL) {

            return this._getConditionStatementByArray(
                ctx,
                varName,
                ["void", theType.substr(1)]
            );
        }

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

        throw new TypeError(`Unknown type schema "${this._lang.escape(
            theType
        )}".`);
    }

    /**
     * Get the judge condition statement of type structure schema.
     *
     * @param ctx      The context object of compilation.
     * @param varName  The name of variable input to be verified.
     * @param theType  The type structure schema.
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

            return this._getConditionStatementByStructure(
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
                `Unacceptable type "${typeof theType}" of type schema.`
            );
        }
    }

    private _getStatements(positive: boolean): Statements {

        return positive ? {
            "$deny": this._lang.RETURN_TRUE,
            "$allow": this._lang.RETURN_FALSE,
            "$not": ""
        } : {
            "$deny": this._lang.RETURN_FALSE,
            "$allow": this._lang.RETURN_TRUE,
            "$not": this._lang.NOT
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
        schema: any,
        opts?: CompileOptions
    ): CompileResult {

        let ctx = new CompileContext(this._lang);

        const inputVariable = ctx.createTempVariableName();

        const source = this._getConditionStatement(
            ctx,
            inputVariable,
            schema
        );

        return { source, inputVariable };
    }
}

export function createCompiler(lang: Language): Compiler {

    return new CompilerImpl(lang);
}
