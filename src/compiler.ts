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
    ADV_TYPE_PREFIX,
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
        /^\|(\w+|string\.length|array\.length) \w+( [-+]?\d+(\.\d+)?)*$/.test(
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
                    !theType[0].startsWith(ADV_TYPE_PREFIX)
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
    private _isKeyWithStructureSuffix(key: string): boolean {

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

    private _removeKeyStructureSuffix(key: string): string {

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
    private _getConditionStatementByObject(
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

        const keyList: Dict<boolean> = {};

        for (let key of keys) {

            let keyType = theType[key];
            let isOptional = false;

            if (key.endsWith(IMPLICIT_SYMBOL)) {

                key = key.slice(0, -1);
                isOptional = true;
            }

            /**
             * Ignore $.virtual in non-strict object mode.
             */
            if (key.startsWith(AdvancedTypes.$VIRTUAL)) {

                key = key.substr(AdvancedTypes.$VIRTUAL.length);
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
            else if (this._isKeyWithStructureSuffix(key)) {

                keyType = [AdvancedTypes.$STRUCT, keyType];
                key = this._removeKeyStructureSuffix(key);
            }

            if (key.startsWith(AdvancedTypes.$VIRTUAL)) {

                key = key.slice(AdvancedTypes.$VIRTUAL.length);
                isOptional = true;
            }

            if (isOptional && !this._isOptionalType(keyType)) {

                keyType = [
                    AdvancedTypes.$OR,
                    BuiltInTypes.optional,
                    keyType
                ];
            }

            if (key.startsWith(AdvancedTypes.$VALUEOF)) {

                const refKey = this._lang.getMapValue(
                    varName,
                    key.slice(AdvancedTypes.$VALUEOF.length),
                    true
                );

                ret.push(`(${this._lang.getBITCondition(
                    refKey,
                    BuiltInTypes.string
                )} ${this._lang.OR} ${this._lang.getBITCondition(
                    refKey,
                    BuiltInTypes.number
                )})`);

                key = this._lang.getMapValue(
                    varName,
                    refKey,
                    false
                );
            }
            else {

                if (keyList[key]) {

                    throw new ReferenceError(
                        `Duplicated key "${key}" in schema.`
                    );
                }

                keyList[key] = true;

                key = this._lang.getMapValue(
                    varName,
                    key,
                    true
                );
            }

            ret.push(this._getConditionStatement(
                ctx,
                key,
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
    private _getConditionStatementBy$Structure(
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

        let literalKeys: string[] = [];
        let referKeys: string[] = [];

        for (let key of keys) {

            let keyType = theType[key];
            let isOptional = false;
            let isVirtual = false;

            if (key.endsWith(IMPLICIT_SYMBOL)) {

                key = key.slice(0, -1);
                isOptional = true;
            }

            if (key.startsWith(AdvancedTypes.$VIRTUAL)) {

                key = key.substr(AdvancedTypes.$VIRTUAL.length);
                isVirtual = true;
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
            else if (this._isKeyWithStructureSuffix(key)) {

                keyType = [AdvancedTypes.$STRUCT, keyType];
                key = this._removeKeyStructureSuffix(key);
            }

            if (isOptional) {

                keyType = this._isOptionalType(keyType) ? keyType : [
                    AdvancedTypes.$OR,
                    BuiltInTypes.optional,
                    keyType
                ];
            }
/*
            if (
                keyType === FILED_ASSERT_RESULT &&
                key.startsWith(AdvancedTypes.$ASSERT)
            ) {
                const refKey = this._lang.getMapValue(
                    varName,
                    key.slice(AdvancedTypes.$ASSERT.length),
                    true
                );

                referKeys.push(key.slice(AdvancedTypes.$ASSERT.length));

                ret.push(`(${this._lang.NOT}${this._lang.getBITCondition(
                    refKey,
                    BuiltInTypes.void
                )})`);

                continue;
            }
*/
            if (key.startsWith(AdvancedTypes.$VALUEOF)) {

                referKeys.push(key.slice(AdvancedTypes.$VALUEOF.length));

                const refKey = this._lang.getMapValue(
                    varName,
                    key.slice(AdvancedTypes.$VALUEOF.length),
                    true
                );

                ret.push(`(${this._lang.getBITCondition(
                    refKey,
                    BuiltInTypes.string
                )} ${this._lang.OR} ${this._lang.getBITCondition(
                    refKey,
                    BuiltInTypes.number
                )})`);

                key = this._lang.getMapValue(
                    varName,
                    refKey,
                    false
                );
            }
            else {

                if (!isVirtual) {

                    literalKeys.push(key);
                }

                key = this._lang.getMapValue(
                    varName,
                    key,
                    true
                );
            }

            ret.push(this._getConditionStatement(
                ctx,
                key,
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
                this._lang.getCheckKeysEqualCondition(
                    $objName,
                    $objKeys,
                    literalKeys,
                    referKeys
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

            return this._getConditionStatementBy$Structure(
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

            return `(${this._lang.getUndefinedCheckStatement(
                varName
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
