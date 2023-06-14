/**
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

import * as I from './Internal';
import * as C from './Common';
import * as M from './Modifiers';
import { Context } from './Context';
import * as B from './BuiltInTypes';
import { BuiltInTypeCompiler } from './BuiltInTypeCompiler';
import { FilterCompiler } from './FilterCompiler';

class Compiler implements C.ICompiler {

    private _defTypes: Record<string, C.ICompileResult>;

    public constructor(
        private readonly _lang: C.ILanguageBuilder,
        private readonly _builtInTypes: I.IBuiltInTypeCompiler,
        private readonly _filters: I.IFilterCompiler
    ) {
        this._defTypes = {};
    }

    public getPredefinedType(name: string): C.ICompileResult | null {

        if (this._defTypes[name]) {

            return this._defTypes[name];
        }

        return null;
    }

    private _addTrace(ctx: I.IContext): string {

        if (!ctx.vTraceName) {

            return this._lang.literalFalse;
        }

        return this._lang.addTrace(
            ctx.vTraceName,
            ctx.vTracePrefix,
            ctx.tracePath
        );
    }

    private _addTraceOr(ctx: I.IContext, expr: string, subPath: string = ''): string {

        if (!ctx.vTraceName) {

            return expr;
        }

        return this._lang.orAddTrace(
            expr,
            ctx.vTraceName,
            ctx.vTracePrefix,
            `${ctx.tracePath}${subPath}`
        );
    }

    public compile(options: C.ICompileOptions): C.ICompileResult {

        const referredTypes: Record<string, true> = {};

        const ctx: I.IContext = new Context(
            this._lang.varName('entry'),
            options.traceErrors ? this._lang.varName('failedAsserts') : '',
            options.traceErrors ? this._lang.varName('tracePrefix') : '',
            this._lang.varName('types'),
            referredTypes
        );

        if (options.name) {

            this._compile(
                ctx,
                [M.TYPE, options.name, options.rule]
            );

            return this._defTypes[options.name];
        }
        else {

            const ret: C.ICompileResult = {

                source: '',
                arguments: [{
                    'name': ctx.vName,
                    'type': 'unknown',
                    'initial': ''
                }],
                typeSlotName: ctx.typeSlotName,
                referredTypes: []
            };

            if (ctx.vTraceName) {

                ret.arguments.push({
                    'name': ctx.vTraceName,
                    'type': 'string[]',
                    'initial': '[]'
                });

                ret.arguments.push({
                    'name': ctx.vTracePrefix,
                    'type': 'string',
                    'initial': this._lang.literal('data')
                });
            }

            ret.source = this._compile(
                ctx,
                options.rule
            );

            ret.referredTypes = Object.keys(ctx.referredTypes);

            return ret;
        }
    }

    private _compile(ctx: I.IContext, rules: any): string {

        switch (typeof rules) {
            case 'string':

                return this._compileStringRule(ctx, rules);

            case 'boolean':

                if (ctx.flags[I.EFlags.FROM_STRING]) {

                    return this._lang.or([
                        this._lang.eq(
                            ctx.vName,
                            this._lang.literal(rules)
                        ),
                        this._lang.eq(
                            this._lang.str2Bool(ctx.vName),
                            this._lang.literal(rules)
                        )
                    ]);
                }

                return this._lang.eq(
                    ctx.vName,
                    this._lang.literal(rules)
                );

            case 'number':

                if (ctx.flags[I.EFlags.FROM_STRING]) {

                    return this._lang.or([
                        this._lang.eq(
                            ctx.vName,
                            this._lang.literal(rules)
                        ),
                        this._lang.eq(
                            this._lang.str2Float(ctx.vName),
                            this._lang.literal(rules)
                        )
                    ]);
                }

                return this._lang.eq(
                    ctx.vName,
                    this._lang.literal(rules)
                );

            case 'object':

                if (Array.isArray(rules)) {

                    return this._compileModifiedRule(ctx, rules);
                }
                else if (rules === null) {

                    if (ctx.flags[I.EFlags.FROM_STRING]) {

                        return this._lang.or([
                            this._lang.isNull(ctx.vName, true),
                            this._lang.eq(
                                ctx.vName,
                                this._lang.literal('null')
                            )
                        ]);
                    }

                    return this._lang.isNull(ctx.vName, true);
                }

                return this._compileStructuredRule(ctx, rules);

            case 'undefined':

                return this._lang.isUndefined(ctx.vName, true);

            default:
                break;
        }

        throw new TypeError('Unknown rules.');
    }

    private _compileStringRule(ctx: I.IContext, rule: string): string {

        const strAssert = this._useStringAssert(ctx, rule);

        if (strAssert !== false) {

            return this._lang.and([
                this._lang.isString(ctx.vName, true),
                strAssert
            ]);
        }

        if (rule.startsWith(I.IMPLICIT_SYMBOL)) {

            return this._lang.or([
                this._builtInTypes.compile(B.VOID, ctx, []),
                this._compileStringRule(ctx, rule.slice(1))
            ]);
        }

        if (rule.startsWith(I.NEGATIVE_SYMBOL)) {

            return this._lang.not(this._compileStringRule(ctx, rule.slice(1)));
        }

        let regResult: RegExpMatchArray | null = /\[\s*(\d*|\d+\s*,\s*\d*)\s*\]$/.exec(rule);

        /**
         * For rules like `xxx[123]` or `xxx[1,5]` or `xxx[1,]`.
         */
        if (regResult) {

            if (regResult[1]) {

                const range = regResult[1].split(',').map((x) => parseInt(x.trim()));

                if (range.length === 1) {

                    /**
                     * For rules like `xxx[123]`.
                     */
                    return this._compileModifiedRule(ctx, [
                        M.ARRAY,
                        range[0],
                        rule.slice(0, regResult.index)
                    ]);
                }
                else if (Number.isNaN(range[1])) {

                    /**
                     * For rules like `xxx[1,]`.
                     */
                    return this._compileModifiedRule(ctx, [
                        M.ARRAY,
                        [range[0]],
                        rule.slice(0, regResult.index)
                    ]);
                }
                else {

                    /**
                     * For rules like `xxx[1,5]`.
                     */
                    return this._compileModifiedRule(ctx, [
                        M.ARRAY,
                        range,
                        rule.slice(0, regResult.index)
                    ]);
                }
            }
            else {

                /**
                 * For rules like `xxx[]`.
                 */
                return this._compileModifiedRule(ctx, [
                    M.LIST,
                    rule.slice(0, regResult.index)
                ]);
            }
        }

        if (rule.endsWith(I.MAP_SUFFIX)) {

            /**
             * For rules like `xxx{}`.
             */
            return this._lang.and([
                this._compileModifiedRule(ctx, [
                    M.MAP,
                    rule.slice(0, -2)
                ])
            ]);
        }

        if (rule.startsWith(I.PRE_DEF_TYPE_SYMBOL)) {

            return this._usePredefinedType(ctx, rule.slice(1));
        }

        regResult = /^(\w+)(\(\s*(-?\d+(\.\d+)?)?\s*,?\s*(-?\d+(\.\d+)?)?\s*\))?$/.exec(rule);

        /**
         * For built-in-type rules like:
         *
         * - `string(20)`
         * - `string(20, 30)`
         * - `string`
         * - `int(12, 34)`
         */
        if (regResult) {

            if (regResult[2]) {

                const args = regResult[2].slice(1, -1).trim().split(',').map(
                    (x) => parseFloat(x.trim())
                );

                return this._builtInTypes.compile(
                    regResult[1],
                    ctx,
                    args
                );
            }

            return this._builtInTypes.compile(
                regResult[1],
                ctx,
                []
            );
        }

        if (rule.startsWith(I.FILTER_PREFIX)) {

            return this._filters.compile(rule, ctx);
        }

        throw new TypeError(`Unknown type "${rule}".`);
    }

    private _usePredefinedType(
        ctx: I.IContext,
        typeName: string
    ): string {

        this._validateTypeName(typeName);

        ctx.referredTypes[typeName] = true;

        return this._lang.call(
            this._lang.fieldIndex(
                ctx.typeSlotName,
                this._lang.literal(typeName)
            ),
            ctx.vName
        );
    }

    private _useStringAssert(
        ctx: I.IContext,
        rule: string
    ): string | false {

        const assertRule = /^:([-\w]+):/.exec(rule);

        const offset = assertRule ? assertRule[1].length + 2 : 2;

        switch ((assertRule?.[1]) ?? rule.slice(0, 2)) {
            case '==':
            case 'equal':

                return this._lang.eq(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                );

            case '%=':
            case 'equal-i':

                return this._lang.eq(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                );

            case '!=':
            case 'not-equal':

                return this._lang.ne(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                );

            case '%!':
            case 'not-equal-i':

                return this._lang.ne(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                );

            case '~=':
            case 'match':

                return this._lang.matchRegExp(
                    ctx.vName,
                    rule.slice(offset)
                );

            case '~!':
            case 'not-match':

                return this._lang.not(this._lang.matchRegExp(
                    ctx.vName,
                    rule.slice(offset)
                ));

            case '?=':
            case 'include':

                return this._lang.instr(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                );

            case '?!':
            case 'not-include':

                return this._lang.not(this._lang.instr(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                ));

            case '*=':
            case 'include-i':

                return this._lang.instr(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                );

            case '*!':
            case 'not-include-i':

                return this._lang.not(this._lang.instr(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                ));

            case '^=':
            case 'start-with':

                return this._lang.startsWith(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                );

            case 'start-with-i':

                return this._lang.startsWith(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                );

            case '^!':
            case 'not-start-with':

                return this._lang.not(this._lang.startsWith(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                ));

            case 'not-start-with-i':

                return this._lang.not(this._lang.startsWith(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                ));

            case '$=':
            case 'end-with':

                return this._lang.endsWith(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                );

            case 'end-with-i':

                return this._lang.endsWith(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                );

            case '$!':
            case 'not-end-with':

                return this._lang.not(this._lang.endsWith(
                    ctx.vName,
                    this._lang.literal(rule.slice(offset))
                ));

            case 'not-end-with-i':

                return this._lang.not(this._lang.endsWith(
                    this._lang.lowerCase(ctx.vName),
                    this._lang.literal(rule.slice(offset).toLowerCase())
                ));

            default:

                if (rule.startsWith('=')) {

                    return this._lang.eq(ctx.vName, this._lang.literal(rule.slice(1)));
                }

                if (rule.startsWith('~')) {

                    return this._lang.matchRegExp(ctx.vName, rule.slice(1));
                }
        }

        return false;
    }

    private _compileModifiedRule(ctx: I.IContext, rules: any[]): string {

        if (!rules.length) {

            throw new TypeError('Unknown type "[]".');
        }

        /**
         * By default, use OR modifier.
         */
        if (
            typeof rules[0] !== 'string' ||
            !rules[0].startsWith(I.MODIFIER_PREFIX)
        ) {

            if (rules.length === 1) {

                return this._compile(ctx, rules[0]);
            }

            rules.unshift(M.OR);
        }

        switch (rules[0]) {
            case M.NOT: {

                return this._lang.not(this._compileModifiedRule(
                    ctx,
                    rules.slice(1)
                ));
            }
            case M.OR: {

                return this._compileModifierOR(ctx, rules.slice(1));
            }
            case M.AND: {

                return this._compileModifierAND(ctx, rules.slice(1));
            }
            case M.LIST: {

                return this._compileModifierLIST(ctx, rules.slice(1));
            }
            case M.ARRAY: {

                return this._compileModifierARRAY(ctx, rules.slice(1));
            }
            case M.DICT: {

                return this._compileModifierDICT(ctx, rules.slice(1));
            }
            case M.MAP: {

                return this._compileModifierMAP(ctx, rules.slice(1));
            }
            case M.TUPLE: {

                return this._compileModifierTUPLE(ctx, rules.slice(1));
            }
            case M.EQUAL: {

                return this._compileModifierEQUAL(ctx, rules.slice(1));
            }
            case M.STRICT: {

                return this._compileModifierSTRICT(ctx, rules.slice(1));
            }
            case M.STRING: {

                return this._compileModifierSTRING(ctx, rules.slice(1));
            }
            case M.TYPE: {

                return this._compileModifierTYPE(ctx, rules.slice(1));
            }
            case M.ENUM: {

                return this._compileModifierEnum(ctx, rules.slice(1));
            }
        }

        throw new TypeError(`Unknown modifier "${rules[0]}".`);
    }

    private _compileModifierSTRING(ctx: I.IContext, rules: any[]): string {

        ctx.trap();

        ctx.flags[I.EFlags.FROM_STRING] = I.EFlagValue.ELEMENT_INHERIT;

        const result = this._compileModifiedRule(ctx, rules);

        ctx.popUp();

        return result;
    }

    private _compileModifierOR(ctx: I.IContext, rules: any[]): string {

        const result: string[] = [];

        for (const r of rules) {

            ctx.trap();

            result.push(this._compile(ctx, r));

            ctx.popUp();
        }

        return this._lang.or(result);
    }

    private _compileModifierAND(ctx: I.IContext, rules: any[]): string {

        return this._lang.and(
            rules.map((rule) => this._compile(ctx, rule))
        );
    }

    private _compileModifierLIST(ctx: I.IContext, rules: any[], traceOffset: number = 0): string {

        const result: string[] = [];

        if (!ctx.flags[I.EFlags.ARRAY]) {

            result.push(this._lang.isArray(ctx.vName, true));

            ctx.flags[I.EFlags.ARRAY] = I.EFlagValue.INHERIT;
        }

        ctx.trap(true);

        const CLOSURE_ARG = ctx.vName;

        const CLOSURE_PARAM = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);
        const vIter = this._lang.varName(ctx.vCursor++);
        ctx.tracePath = `${ctx.tracePath}[${this._lang.numberTemplateVar(
            traceOffset ? this._lang.add(traceOffset, vIter) : vIter
        )}]`;

        if (rules[0] !== B.ANY) {

            result.push(this._lang.closure(
                [CLOSURE_PARAM],
                [CLOSURE_ARG],
                this._lang.series([
                    // eslint-disable-next-line @litert/rules/disable-for-each-method
                    this._lang.forEach(
                        CLOSURE_PARAM, vIter, ctx.vName, this._lang.ifThen(
                            this._lang.not(this._compile(ctx, rules)),
                            this._lang.returnValue(this._addTrace(ctx))
                        )
                    ),
                    this._lang.returnValue(this._lang.literal(true))
                ])
            ));
        }

        ctx.popUp();

        return this._lang.and(result);
    }

    private _compileModifierARRAY(ctx: I.IContext, rules: any[], traceOffset: number = 0): string {

        let a: number = 0;
        let b: number = -1;

        if (Number.isInteger(rules[0]) && rules[0] >= 0) {

            a = rules[0];
        }
        else if (Array.isArray(rules[0])) {

            switch (rules[0].length) {

                default:
                case 0: {

                    throw new TypeError(`Invalid arguments "${
                        JSON.stringify(rules[0])
                    }" for array.`);
                }
                case 1: {

                    a = rules[0][0];
                    b = 0xFFFFFFFF;

                    if (!Number.isInteger(a) || a < 0) {

                        throw new TypeError(`Invalid arguments "${
                            JSON.stringify(rules[0])
                        }" for array.`);
                    }

                    break;
                }
                case 2: {

                    a = rules[0][0];
                    b = rules[0][1];

                    if (
                        (!Number.isInteger(a) || a < 0) ||
                        (!Number.isInteger(b) || b < 0) ||
                        a > b
                    ) {

                        throw new TypeError(`Invalid arguments "${
                            JSON.stringify(rules[0])
                        }" for array.`);
                    }

                    if (a === b) {

                        b = -1;
                    }
                }
            }
        }
        else {

            throw new TypeError(`Invalid arguments "${
                JSON.stringify(rules[0])
            }" for array.`);
        }

        const result: string[] = [];

        if (!ctx.flags[I.EFlags.ARRAY]) {

            result.push(this._lang.isArray(ctx.vName, true));

            ctx.flags[I.EFlags.ARRAY] = I.EFlagValue.INHERIT;
        }

        ctx.trap(true);

        const CLOSURE_ARG = ctx.vName;

        const CLOSURE_PARAM = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);
        const vIter = this._lang.varName(ctx.vCursor++);
        ctx.tracePath = `${ctx.tracePath}[${this._lang.numberTemplateVar(
            traceOffset ? this._lang.add(traceOffset, vIter) : vIter
        )}]`;

        switch (b) {
            case -1: {

                result.push(
                    this._lang.eq(this._lang.arrayLength(CLOSURE_ARG), a)
                );
                break;
            }
            case 0xFFFFFFFF: {

                result.push(
                    this._lang.gte(this._lang.arrayLength(CLOSURE_ARG), a)
                );
                break;
            }
            default: {

                result.push(
                    this._lang.gte(this._lang.arrayLength(CLOSURE_ARG), a),
                    this._lang.lte(this._lang.arrayLength(CLOSURE_ARG), b)
                );
                break;
            }
        }

        if (rules[1] !== B.ANY) {

            result.push(this._lang.closure(
                [CLOSURE_PARAM],
                [CLOSURE_ARG],
                this._lang.series([
                    // eslint-disable-next-line @litert/rules/disable-for-each-method
                    this._lang.forEach(
                        CLOSURE_PARAM, vIter, ctx.vName, this._lang.ifThen(
                            this._lang.not(this._compile(ctx, rules.slice(1))),
                            this._lang.returnValue(this._addTrace(ctx))
                        )
                    ),
                    this._lang.returnValue(this._lang.literal(true))
                ])
            ));
        }

        ctx.popUp();

        return this._lang.and(result);
    }

    private _compileModifierTUPLE(ctx: I.IContext, rules: any[]): string {

        const result: string[] = [];

        if (!ctx.flags[I.EFlags.ARRAY]) {

            result.push(this._lang.isArray(ctx.vName, true));

            ctx.flags[I.EFlags.ARRAY] = I.EFlagValue.INHERIT;
        }

        let type!: any;
        let dots: string;
        let i: number = 0;

        const types = rules.slice();
        let tupleLength = 0;
        let tupleLengthMin = 0;

        while (1) {

            type = types.shift();

            if (type === undefined) {

                break;
            }

            if (typeof type === 'string' && type.startsWith('...')) {

                throw new TypeError(`Invalid syntax for tuple: ${JSON.stringify(rules)}`);
            }

            if (typeof types[0] === 'string' && types[0].startsWith('...')) {

                ctx.trap();

                dots = types.shift();

                if (dots === '...') {

                    /**
                     * No more elements because "..." means all rest elements.
                     */
                    if (types.length) {

                        throw new TypeError(`Invalid syntax for tuple: ${JSON.stringify(rules)}`);
                    }

                    ctx.vName = this._lang.arraySlice(ctx.vName, i);

                    if (type !== 'any') {

                        result.push(this._compileModifierLIST(
                            ctx, type, i
                        ));
                    }

                    tupleLengthMin = tupleLength;
                    tupleLength = -1;
                }
                else if (!/^\d+$/.test(dots.slice(3))) {

                    throw new TypeError(`Invalid syntax for tuple: ${dots}`);
                }
                else {

                    const length = parseInt(dots.slice(3));

                    if (length === 0) {

                        throw new TypeError(`Invalid syntax for tuple: ${dots}`);
                    }
                    else if (length === 1) {

                        const vName = ctx.vName;

                        ctx.tracePath = `${ctx.tracePath}[${i}]`;
                        ctx.vName = this._lang.arrayIndex(vName, i++);
                        result.push(this._addTraceOr(
                            ctx,
                            this._compile(ctx, type),
                        ));
                    }
                    else {

                        ctx.vName = this._lang.arraySlice(ctx.vName, i, i + length);

                        result.push(this._compileModifierARRAY(
                            ctx, [length, type], i
                        ));

                        i += length;
                    }

                    tupleLength += length;
                }
            }
            else {

                ctx.trap(true);

                ctx.tracePath = `${ctx.tracePath}[${i}]`;
                ctx.vName = this._lang.arrayIndex(ctx.vName, i++);
                result.push(this._addTraceOr(
                    ctx,
                    this._compile(ctx, type),
                ));
                tupleLength++;
            }

            ctx.popUp();
        }

        if (tupleLength >= 0) {

            result.splice(1, -1, this._addTraceOr(
                ctx,
                this._lang.eq(
                    this._lang.arrayLength(ctx.vName),
                    tupleLength
                ),
                '.length'
            ));
        }
        else if (tupleLengthMin >= 0) {

            result.splice(1, -1, this._addTraceOr(
                ctx,
                this._lang.gte(
                    this._lang.arrayLength(ctx.vName),
                    tupleLengthMin
                ),
                '.length'
            ));
        }

        return this._lang.and(result);
    }

    private _validateTypeName(name: unknown): void {

        if (typeof name !== 'string' || !I.RE_VALID_CUSTOM_TYPE_NAME.test(name)) {

            throw new TypeError(`Invalid name ${
                JSON.stringify(name)
            } for a pre-defined type.`);
        }
    }

    private _compileModifierTYPE(ctx: I.IContext, rules: any[]): string {

        this._validateTypeName(rules[0]);

        if (this._defTypes[rules[0]]) {

            throw new Error(`Duplicated name ${JSON.stringify(rules[0])} for a pre-defined type.`);
        }

        this._defTypes[rules[0]] = this.compile({
            rule: rules.slice(1),
            traceErrors: !!ctx.vTraceName
        });

        return this._usePredefinedType(ctx, rules[0]);
    }

    private _compileModifierSTRICT(ctx: I.IContext, rules: any[]): string {

        ctx.trap();

        if (rules.length === 1) {

            rules = rules[0];
        }

        ctx.flags[I.EFlags.STRICT] = I.EFlagValue.INHERIT;

        const ret = this._compile(ctx, rules);

        ctx.popUp();

        return ret;
    }

    private _compileModifierEQUAL(ctx: I.IContext, rules: any[]): string {

        ctx.trap();

        if (rules.length === 1) {

            rules = rules[0];
        }

        ctx.flags[I.EFlags.STRICT] = I.EFlagValue.ELEMENT_INHERIT;

        const ret = this._compile(ctx, rules);

        ctx.popUp();

        return ret;
    }

    private _compileModifierMAP(ctx: I.IContext, rules: any[]): string {

        if (rules.length === 1) {

            rules = rules[0];
        }

        ctx.trap(true);

        const vCArg = ctx.vName;

        const vCParam = this._lang.varName(ctx.vCursor++);

        const vKey = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);
        ctx.tracePath = `${ctx.tracePath}[${this._lang.stringTemplateVar(vKey)}]`;

        const result = this._lang.and([
            this._lang.isStructure(vCArg, true),
            this._lang.closure(
                [vCParam],
                [vCArg],
                this._lang.series([
                    this._lang.forIn(
                        vCParam, vKey, ctx.vName, this._lang.ifThen(
                            this._lang.not(this._compile(ctx, rules)),
                            this._lang.returnValue(this._addTrace(ctx))
                        )
                    ),
                    this._lang.returnValue(this._lang.literal(true))
                ])
            )
        ]);

        ctx.popUp();

        return result;
    }

    private _compileModifierEnum(ctx: I.IContext, rules: any[]): string {

        if (rules.length === 0) {

            throw new SyntaxError(`At least one enum candidate is required for $.enum`);
        }

        const ret: string[] = [];

        for (const r of rules) {

            switch (typeof r) {

                case 'string':
                case 'number':
                case 'boolean':
                    ret.push(this._lang.eq(ctx.vName, this._lang.literal(r)));
                    break;
                default:
                    if (r === null) {
                        ret.push(this._lang.eq(ctx.vName, this._lang.literal(null)));
                        break;
                    }
                    throw new SyntaxError(`Invalid literal value ${JSON.stringify(rules)} for $.enum.`);
            }
        }

        return this._lang.or(ret);
    }

    private _compileModifierDICT(ctx: I.IContext, rules: any[]): string {

        if (rules.length < 2 || !Array.isArray(rules[0])) {

            throw new SyntaxError(`Invalid dict ${JSON.stringify(rules)}.`);
        }

        const tmp: Record<string, string> = {};

        const id = `${Date.now()}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

        this._compileModifierTYPE(ctx, [
            this._lang.varName(id),
            rules.slice(1)
        ]);

        const type = `${I.PRE_DEF_TYPE_SYMBOL}${this._lang.varName(id)}`;

        for (const key of rules[0]) {

            if (typeof key !== 'string') {

                throw new SyntaxError(`Invalid key ${JSON.stringify(key)} for dict.`);
            }

            tmp[key] = type;
        }

        return this._compileStructuredRule(ctx, tmp);
    }

    private _compileSimpleStructure(
        ctx: I.IContext,
        rules: Record<string, any>
    ): string {

        const strict = !!ctx.flags[I.EFlags.STRICT];

        const result: string[] = [
            this._addTraceOr(
                ctx,
                this._lang.isStructure(ctx.vName, true),
                '!object'
            )
        ];

        const keys: string[] = [];

        for (let k in rules) {

            let rule = rules[k];

            let optional = false;

            if (k.endsWith(I.IMPLICIT_SYMBOL)) {

                optional = true;
                k = k.slice(0, -1);
            }

            ctx.trap(true);

            if (k.endsWith(I.KEY_LIST_SUFFIX)) {

                k = k.slice(0, -I.KEY_LIST_SUFFIX.length);
                rule = [M.LIST, rule];
            }
            else if (k.endsWith(I.KEY_MAP_SUFFIX)) {

                k = k.slice(0, -I.KEY_MAP_SUFFIX.length);
                rule = [M.MAP, rule];
            }
            else if (k.endsWith(I.KEY_STRICT_SUFFIX)) {

                k = k.slice(0, -I.KEY_STRICT_SUFFIX.length);
                rule = [M.STRICT, rule];
            }
            else if (k.endsWith(I.KEY_EQUAL_SUFFIX)) {

                k = k.slice(0, -I.KEY_STRICT_SUFFIX.length);
                rule = [M.EQUAL, rule];
            }
            else {

                const matchResult = I.KEY_ARRAY_SUFFIX.exec(k);

                if (matchResult) {

                    k = k.slice(0, matchResult.index);

                    if (matchResult[3]) {

                        rule = [
                            M.ARRAY,
                            [
                                parseInt(matchResult[1]),
                                parseInt(matchResult[3])
                            ],
                            rule
                        ];
                    }
                    else if (matchResult[2]) {

                        rule = [M.ARRAY, [parseInt(matchResult[1])], rule];
                    }
                    else {

                        rule = [M.ARRAY, parseInt(matchResult[1]), rule];
                    }
                }
            }

            if (optional) {

                if (this._isOrRule(rule)) {

                    rule.push(B.VOID);
                }
                else {

                    rule = [B.VOID, rule];
                }
            }

            keys.push(k);

            ctx.vName = this._lang.fieldIndex(ctx.vName, this._lang.literal(k));
            ctx.tracePath = `${ctx.tracePath}[${this._lang.literal(k)}]`;

            result.push(this._addTraceOr(
                ctx,
                this._compile(ctx, rule)
            ));

            ctx.popUp();
        }

        if (strict && keys.length) {

            result.splice(
                1,
                -1,
                this._lang.arrayInSet(
                    this._lang.keys(ctx.vName),
                    this._lang.array(keys)
                )
            );
        }

        return this._lang.and(result);
    }

    private _compileStructuredRule(
        ctx: I.IContext,
        rules: Record<string, any>
    ): string {

        const mapSymbol = Object.keys(rules).filter((x) => x.startsWith(M.MAP));

        if (mapSymbol.length > 1) {

            throw new SyntaxError('Only one \'$.map\' is allowed as rest-mapping.');
        }
        else if (mapSymbol.length === 0) {

            return this._compileSimpleStructure(ctx, rules);
        }

        const result: string[] = [
            this._lang.isStructure(ctx.vName, true)
        ];

        ctx.trap();

        const CLOSURE_ARG = ctx.vName;

        const CLOSURE_PARAM = this._lang.varName(ctx.vCursor++);

        const FOR_KEY = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);

        const CASES: string[] = [];

        const keys: string[] = [];

        for (let k in rules) {

            ctx.trap(true);

            let rule = rules[k];

            let optional = false;

            if (k.endsWith(I.IMPLICIT_SYMBOL)) {

                optional = true;
                k = k.slice(0, -1);
            }

            if (k.endsWith(I.KEY_LIST_SUFFIX)) {

                k = k.slice(0, -I.KEY_LIST_SUFFIX.length);
                rule = [M.LIST, rule];
            }
            else if (k.endsWith(I.KEY_MAP_SUFFIX)) {

                k = k.slice(0, -I.KEY_MAP_SUFFIX.length);
                rule = [M.MAP, rule];
            }
            else if (k.endsWith(I.KEY_STRICT_SUFFIX)) {

                k = k.slice(0, -I.KEY_STRICT_SUFFIX.length);
                rule = [M.STRICT, rule];
            }
            else if (k.endsWith(I.KEY_EQUAL_SUFFIX)) {

                k = k.slice(0, -I.KEY_STRICT_SUFFIX.length);
                rule = [M.EQUAL, rule];
            }
            else {

                const matchResult = I.KEY_ARRAY_SUFFIX.exec(k);

                if (matchResult) {

                    k = k.slice(0, matchResult.index);

                    if (matchResult[3]) {

                        rule = [
                            M.ARRAY,
                            [
                                parseInt(matchResult[1]),
                                parseInt(matchResult[3])
                            ],
                            rule
                        ];
                    }
                    else if (matchResult[2]) {

                        rule = [M.ARRAY, [parseInt(matchResult[1])], rule];
                    }
                    else {

                        rule = [M.ARRAY, parseInt(matchResult[1]), rule];
                    }
                }
            }

            if (k === M.MAP) {

                CASES.push(this._lang.caseDefault(
                    this._lang.ifThen(
                        this._lang.not(this._compile(ctx, rule)),
                        this._lang.returnValue(this._lang.literal(false))
                    )
                ));
            }
            else {

                if (optional) {

                    if (this._isOrRule(rule)) {

                        rule.push(B.VOID);
                    }
                    else {

                        rule = [B.VOID, rule];
                    }
                }
                else {

                    keys.push(k);
                }

                CASES.push(this._lang.caseIf(
                    [this._lang.literal(k)],
                    this._lang.ifThen(
                        this._lang.not(this._compile(ctx, rule)),
                        this._lang.returnValue(this._lang.literal(false))
                    )
                ));
            }

            ctx.popUp();
        }

        if (keys.length) {

            result.push(this._lang.arrayInSet(
                this._lang.array(keys),
                this._lang.keys(CLOSURE_ARG)
            ));
        }

        result.push(this._lang.closure(
            [CLOSURE_PARAM],
            [CLOSURE_ARG],
            this._lang.series([
                this._lang.forIn(
                    CLOSURE_PARAM,
                    FOR_KEY,
                    ctx.vName,
                    this._lang.switchCase(FOR_KEY, CASES)
                ),
                this._lang.returnValue(this._lang.literal(true))
            ])
        ));

        ctx.popUp();

        return this._lang.and(result);
    }

    private _isOrRule(rule: unknown): rule is any[] {

        return Array.isArray(rule) && (
            rule[0] === M.OR ||
            typeof rule[0] !== 'string' ||
            !rule[0].startsWith(I.MODIFIER_PREFIX)
        );
    }
}

/**
 * Create a compiler object.
 *
 * @param lang The language builder.
 */
export function createCompiler(lang: C.ILanguageBuilder): C.ICompiler {

    const ret = new BuiltInTypeCompiler(lang);

    return new Compiler(
        lang, ret, new FilterCompiler(lang, ret)
    );
}
