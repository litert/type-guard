import * as C from "./Common";
import * as Modifers from "./Modifiers";
import { Context } from "./Context";

export class CheckerCompiler {

    public constructor(
        private _lang: C.ILanguageBuilder,
        private _builtInTypes: C.IBuiltInTypeCompiler,
        private _filters: C.IFilterCompiler
    ) { }

    public compile(options: C.ICompileOptions): C.ICompileResult {

        const ctx: C.IContext = new Context(this._lang.varName("entry"));

        const ret: C.ICompileResult = {

            source: "",
            arguments: [{
                "name": ctx.vName,
                "type": "unknown"
            }],
            extras: {},
            tracePoints: []
        };

        ret.source = this._compile(ctx, options.rules);

        return ret;
    }

    private _compile(ctx: C.IContext, rules: any): string {

        switch (typeof rules) {
        case "string":

            return this._compileStringRule(ctx, rules);

        case "boolean":
        case "number":

            return this._lang.eq(
                ctx.vName,
                this._lang.literal(rules)
            );

        case "object":

            if (Array.isArray(rules)) {

                return this._compileModifiedRule(ctx, rules);
            }
            else if (rules === null) {

                return this._lang.isNull(ctx.vName, true);
            }

            return this._compileStructuredRule(ctx, rules);

        case "undefined":

            return this._lang.isUndefined(ctx.vName, true);
        }

        throw new TypeError("Unknwn rules.");
    }

    private _compileStringRule(ctx: C.IContext, rule: string): string {

        if (rule[0] === C.IMPLICIT_SYMBOL) {

            return this._lang.or([
                this._builtInTypes.compile("void", ctx, []),
                this._compileStringRule(ctx, rule.slice(1))
            ]);
        }

        let regResult: RegExpMatchArray | null;

        /**
         * For rules like `xxx[123]`.
         */
        if (regResult = rule.match(/\[(\d*)\]$/)) {

            if (regResult[1]) {

                return this._lang.and([
                    this._compileModifiedRule(ctx, [
                        Modifers.ARRAY,
                        rule.substr(0, regResult.index)
                    ]),
                    this._lang.eq(
                        this._lang.literal(parseInt(regResult[1])),
                        this._lang.arrayLength(ctx.vName)
                    )
                ]);
            }
            else {

                return this._compileModifiedRule(ctx, [
                    Modifers.ARRAY,
                    rule.substr(0, regResult.index)
                ]);
            }
        }

        /**
         * For rules like `xxx{}`.
         */
        if (rule.endsWith("{}")) {

            return this._lang.and([
                this._compileModifiedRule(ctx, [
                    Modifers.MAP,
                    rule.slice(0, -2)
                ])
            ]);
        }

        /**
         * For built-in-type rules like:
         *
         * - `string(20)`
         * - `string(20, 30)`
         * - `string`
         * - `int(12, 34)`
         */
        if (regResult = rule.match(/^(\w+)(\((-?\d+(\.\d+)?)(,\s*(-?\d+(\.\d+)?))?\))?$/)) {

            if (regResult[6]) {

                return this._builtInTypes.compile(
                    regResult[1],
                    ctx,
                    [regResult[3], regResult[6]]
                );
            }
            else if (regResult[3]) {

                return this._builtInTypes.compile(
                    regResult[1],
                    ctx,
                    [regResult[3]]
                );
            }

            return this._builtInTypes.compile(
                regResult[1],
                ctx,
                []
            );
        }

        if (rule[0] === C.FILTER_PREFIX) {

            return this._filters.compile(rule, ctx);
        }

        const strAssert = this._compileStringAssert(ctx, rule);

        if (strAssert !== false) {

            return this._lang.and([
                this._lang.isString(ctx.vName, true),
                strAssert
            ]);
        }

        throw new TypeError(`Unknown type "${rule}".`);
    }

    private _compileStringAssert(
        ctx: C.IContext,
        rule: string
    ): string | false {

        const assertRule = rule.match(/^:([-\w]+):/);

        const offset = assertRule ? assertRule[1].length + 2 : 2;

        switch ((assertRule && assertRule[1]) || rule.substr(0, 2)) {
        case "==":
        case "equal":

            return this._lang.eq(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            );

        case "%=":
        case "equal-i":

            return this._lang.eq(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            );

        case "!=":
        case "not-equal":

            return this._lang.ne(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            );

        case "%!":
        case "not-equal-i":

            return this._lang.ne(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            );

        case "~=":
        case "match":

            return this._lang.matchRegExp(
                ctx.vName,
                rule.slice(offset)
            );

        case "~!":
        case "not-match":

            return this._lang.not(this._lang.matchRegExp(
                ctx.vName,
                rule.slice(offset)
            ));

        case "?=":
        case "include":

            return this._lang.instr(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            );

        case "?!":
        case "not-include":

            return this._lang.not(this._lang.instr(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            ));

        case "*=":
        case "include-i":

            return this._lang.instr(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            );

        case "*!":
        case "not-include-i":

            return this._lang.not(this._lang.instr(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            ));

        case "^=":
        case "start-with":

            return this._lang.startsWith(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            );

        case "start-with-i":

            return this._lang.startsWith(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            );

        case "^!":
        case "not-start-with":

            return this._lang.not(this._lang.startsWith(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            ));

        case "not-start-with-i":

            return this._lang.not(this._lang.startsWith(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            ));

        case "$=":
        case "end-with":

            return this._lang.endsWith(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            );

        case "end-with-i":

            return this._lang.endsWith(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            );

        case "$!":
        case "not-end-with":

            return this._lang.not(this._lang.endsWith(
                ctx.vName,
                this._lang.literal(rule.slice(offset))
            ));

        case "not-end-with-i":

            return this._lang.not(this._lang.endsWith(
                this._lang.lowerCase(ctx.vName),
                this._lang.literal(rule.slice(offset).toLowerCase())
            ));

        default:

            if (rule.startsWith("=")) {

                return this._lang.eq(ctx.vName, this._lang.literal(rule.slice(1)));
            }

            if (rule.startsWith("~")) {

                return this._lang.matchRegExp(ctx.vName, rule.slice(1));
            }
        }

        return false;
    }

    private _compileModifiedRule(ctx: C.IContext, rules: any[]): string {

        if (!rules.length) {

            throw new TypeError(`Unknwon type "[]".`);
        }

        /**
         * By default, use OR modifier.
         */
        if (
            typeof rules[0] !== "string" ||
            !rules[0].startsWith(C.MODIFIER_PREFIX)
        ) {

            if (rules.length === 1) {

                return this._compile(ctx, rules[0]);
            }

            rules.unshift(Modifers.OR);
        }

        switch (rules[0]) {
            case Modifers.OR: {

                return this._compileModifierOR(ctx, rules.slice(1));
            }
            case Modifers.AND: {

                return this._compileModifierAND(ctx, rules.slice(1));
            }
            case Modifers.ARRAY: {

                return this._compileModifierARRAY(ctx, rules.slice(1));
            }
            case Modifers.MAP: {

                return this._compileModifierMAP(ctx, rules.slice(1));
            }
            case Modifers.TUPLE: {

                return this._compileModifierTUPLE(ctx, rules.slice(1));
            }
            case Modifers.STRING: {

                ctx.flags[C.EFlags.FROM_STRING] = C.EFlagValue.INHERIT;
                return this._compileModifiedRule(ctx, rules.slice(1));
            }
            case Modifers.STRICT: {

                ctx.flags[C.EFlags.STRICT] = C.EFlagValue.YES;
                return this._compileModifiedRule(ctx, rules.slice(1));
            }
            case Modifers.EQUAL: {

                ctx.flags[C.EFlags.STRICT] = C.EFlagValue.INHERIT;
                return this._compileModifiedRule(ctx, rules.slice(1));
            }
        }

        throw new TypeError(`Unknown modifier "${rules[0]}".`);
    }

    private _compileModifierOR(ctx: C.IContext, rules: any[]): string {

        let result: string[] = [];

        for (const r of rules) {

            ctx.trap();

            result.push(this._compile(ctx, r));

            ctx.untrap();
        }

        return this._lang.or(result);
    }

    private _compileModifierAND(ctx: C.IContext, rules: any[]): string {

        return this._lang.and(
            rules.map((rule) => this._compile(ctx, rule))
        );
    }

    private _compileModifierARRAY(ctx: C.IContext, rules: any[]): string {

        ctx.trap();

        const CLOSURE_ARG = ctx.vName;

        const CLOSURE_PARAM = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);

        const result = this._lang.and([
            this._lang.isArray(CLOSURE_ARG, true),
            this._lang.closure(
                [CLOSURE_PARAM],
                [CLOSURE_ARG],
                this._lang.series([
                    this._lang.forEach(
                        CLOSURE_PARAM, ctx.vName, this._lang.ifThen(
                            this._lang.not(this._compile(ctx, rules)),
                            this._lang.returnValue(this._lang.literal(false))
                        )
                    ),
                    this._lang.returnValue(this._lang.literal(true))
                ])
            )
        ]);

        ctx.untrap();

        return result;
    }

    private _compileModifierTUPLE(ctx: C.IContext, rules: any[]): string {

        const result: string[] = [
            this._lang.isArray(ctx.vName, true),
            this._lang.eq(this._lang.arrayLength(ctx.vName), rules.length)
        ];

        for (let i = 0; i < rules.length; i++) {

            ctx.trap();

            ctx.vName = this._lang.arrayIndex(ctx.vName, i);
            result.push(this._compile(ctx, rules[i]));

            ctx.untrap();
        }

        return this._lang.and(result);
    }

    private _compileModifierMAP(ctx: C.IContext, rules: any[]): string {

        if (rules.length === 1) {

            rules = rules[0];
        }

        ctx.trap();

        const CLOSURE_ARG = ctx.vName;

        const CLOSURE_PARAM = this._lang.varName(ctx.vCursor++);

        const FOR_IN_KEY = this._lang.varName(ctx.vCursor++);

        ctx.vName = this._lang.varName(ctx.vCursor++);

        const result = this._lang.and([
            this._lang.isDict(CLOSURE_ARG, true),
            this._lang.closure(
                [CLOSURE_PARAM],
                [CLOSURE_ARG],
                this._lang.series([
                    this._lang.forIn(
                        CLOSURE_PARAM, FOR_IN_KEY, ctx.vName, this._lang.ifThen(
                            this._lang.not(this._compile(ctx, rules)),
                            this._lang.returnValue(this._lang.literal(false))
                        )
                    ),
                    this._lang.returnValue(this._lang.literal(true))
                ])
            )
        ]);

        ctx.untrap();

        return result;
    }

    private _compileStructuredRule(ctx: C.IContext, rules: Record<string, any>): string {

        const strict = !!ctx.flags[C.EFlags.STRICT];

        const result: string[] = [
            this._lang.isDict(ctx.vName, true)
        ];

        for (let k in rules) {

            let rule = rules[k];

            let optional = false;

            if (k.endsWith(C.IMPLICIT_SYMBOL)) {

                optional = true;
                k = k.slice(0, -1);
            }

            ctx.trap();

            if (k.endsWith(C.KEY_ARRAY_SUFFIX)) {

                k = k.slice(0, -C.KEY_ARRAY_SUFFIX.length);
                rule = ["$.array", rule];
            }
            else if (k.endsWith(C.KEY_MAP_SUFFIX)) {

                k = k.slice(0, -C.KEY_MAP_SUFFIX.length);
                rule = [Modifers.MAP, rule];
            }
            else if (k.endsWith(C.KEY_STRICT_SUFFIX)) {

                k = k.slice(0, -C.KEY_STRICT_SUFFIX.length);
                rule = [Modifers.STRICT, rule];
            }

            if (optional) {

                if (this._isOrRule(rule)) {

                    rule.push("void");
                }
                else {

                    rule = ["void", rule];
                }
            }

            ctx.vName = this._lang.fieldIndex(ctx.vName, this._lang.literal(k));

            result.push(this._compile(ctx, rule));

            ctx.untrap();
        }

        return this._lang.and(result);
    }

    private _isOrRule(rule: unknown): rule is any[] {

        return Array.isArray(rule) && (
            rule[0] === Modifers.OR ||
            typeof rule[0] !== "string" ||
            !rule[0].startsWith(C.MODIFIER_PREFIX)
        );
    }

}
