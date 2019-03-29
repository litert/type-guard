import * as C from "../Common";

class JavaScriptLanguage
implements C.ILanguageBuilder {

    private _isLiteralString(str: string): boolean {

        return str[0] === "\"";
    }

    public lowerCase(a: string): string {

        return `${a}.toLowerCase()`;
    }

    public instr(
        expr: string,
        match: string
    ): string {

        return `${expr}.includes(${match})`;
    }

    public startsWith(
        expr: string,
        match: string
    ): string {

        return `${expr}.startsWith(${match})`;
    }

    public endsWith(
        expr: string,
        match: string
    ): string {

        return `${expr}.endsWith(${match})`;
    }

    public varName(index: number | string): string {

        return `var_${index}`;
    }

    private _dereplicate(conds: string[]): string[] {

        return Array.from(new Set(conds));
    }

    public ifElseOp(
        cond: string,
        a: string | number,
        b: string | number
    ): string {
        return `(${cond}) ? ${a} : ${b}`;
    }

    public or(conditions: string[]): string {

        if (conditions.length === 1) {

            return conditions[0];
        }

        conditions = this._dereplicate(conditions.filter((x) => x !== "true"));

        if (!conditions.length) {

            return "true";
        }

        return `${conditions.map((x) => `(${x})`).join(" || ")}`;
    }

    public and(conditions: string[]): string {

        if (conditions.length === 1) {

            return conditions[0];
        }

        conditions = this._dereplicate(conditions.filter((x) => x !== "true"));

        if (!conditions.length) {

            return "true";
        }

        return `${conditions.map((x) => `(${x})`).join(" && ")}`;
    }

    public eq(a: string, b: string | number): string {

        return `${a} === ${b}`;
    }

    public ne(a: string, b: string): string {

        return `${a} !== ${b}`;
    }

    public gt(a: string, b: string): string {

        return `${a} > ${b}`;
    }

    public gte(a: string, b: string): string {

        return `${a} >= ${b}`;
    }

    public lt(a: string, b: string): string {

        return `${a} < ${b}`;
    }

    public lte(a: string, b: string): string {

        return `${a} <= ${b}`;
    }

    public not(a: string): string {

        return `!(${a})`;
    }

    public literal(val: string): string {

        return JSON.stringify(val);
    }

    public modOf(a: string, b: string): string {

        return `${a} % ${b}`;
    }

    public matchRegExp(
        expr: string,
        regExp: string
    ): string {

        let m = regExp.match(/^\/(.+)\/([a-z]*)$/i);

        if (m) {

            return `/${m[1]}/${m[2] || ""}.test(${expr})`;
        }

        return `/${regExp}/.test(${expr})`;
    }

    public isNull(vn: string, positive: boolean = true): string {

        return `${vn} ${this._equal(positive)} null`;
    }

    public isUndefined(vn: string, positive: boolean = true): string {

        return `${vn} ${this._equal(positive)} undefined`;
    }

    private _equal(positive: boolean = true): string {

        return positive ? "===" : "!==";
    }

    private _not(positive: boolean = true): string {

        return positive ? "" : "!";
    }

    public isString(vn: string, positive: boolean = true): string {

        return `typeof ${vn} ${this._equal(positive)} "string"`;
    }

    public isStrucutre(vn: string, positive: boolean = true): string {

        return positive ?
            `(typeof ${vn} === "object" && ${vn} !== null && !Array.isArray(${vn}))` :
            `(typeof ${vn} !== "object" || ${vn} === null || Array.isArray(${vn}))`;
    }

    public isInteger(vn: string, positive: boolean = true): string {

        return `${this._not(positive)}Number.isInteger(${vn})`;
    }

    public isNumber(vn: string, positive: boolean = true): string {

        return positive ?
            `typeof ${vn} === "number" && Number.isFinite(${vn}) && !Number.isNaN(${vn})` :
            `typeof ${vn} !== "number" || !Number.isFinite(${vn}) || Number.isNaN(${vn})`;
    }

    public isNumeric(vn: string, positive: boolean = true): string {

        return positive ? this.or([
            this.isNumber(vn, true),
            this.and([
                this.isString(vn, true),
                this.matchRegExp(vn, "^[+-]?\\d+(\\.\\d+)?$")
            ])
        ]) : this.and([
            this.isNumber(vn, false),
            this.or([
                this.isString(vn, false),
                this.not(this.matchRegExp(vn, "^[+-]?\\d+(\\.\\d+)?$"))
            ])
        ]);
    }

    public isArray(vn: string, positive: boolean = true): string {

        return `${this._not(positive)}Array.isArray(${vn})`;
    }

    public isBoolean(vn: string, positive: boolean = true): string {

        return `typeof ${vn} ${this._equal(positive)} "boolean"`;
    }

    public arrayLength(vn: string): string {

        return `${vn}.length`;
    }

    public stringLength(vn: string): string {

        return `${vn}.length`;
    }

    public keys(vn: string): string {

        return `Object.keys(${vn})`;
    }

    public forEach(
        an: string,
        it: string,
        body: string
    ): string {

        return `for (const ${it} of ${an}) {
            ${body}
        }`;
    }

    public series(statements: string[]): string {

        return statements.map((s) => s.endsWith(";") ? s : `${s};`).join("");
    }

    public ifThen(
        condition: string,
        ifBody: string,
        elseBody?: string
    ): string {

        if (elseBody) {

            return `if (${condition}) {
                ${ifBody}
            } else {
                ${elseBody}
            }`;
        }

        return `if (${condition}) { ${ifBody} }`;
    }

    public forIn(
        o: string,
        k: string,
        i: string,
        body: string
    ): string {

        return `for (const ${k} in ${o}) { const ${i} = ${o}[${k}]; ${body} }`;
    }

    public fieldIndex(
        o: string,
        k: string
    ): string {

        return `${o}[${k}]`;
    }

    public arrayIndex(
        a: string,
        i: string | number
    ): string {

        return `${a}[${i}]`;
    }

    public get literalFalse(): string {

        return `false`;
    }

    public get literalTrue(): string {

        return `true`;
    }

    public get maxSafeInteger(): string {

        return "0X1FFFFFFFFFFFFF";
    }

    public get minSafeInteger(): string {

        return "-0X1FFFFFFFFFFFFF";
    }

    public isTrueValue(vn: string): string {

        return `!!${vn}`;
    }

    public isFalseValue(vn: string): string {

        return `!${vn}`;
    }

    public returnValue(vn: string): string {

        return `return ${vn};`;
    }

    public closure(
        params: string[],
        args: string[],
        body: string
    ): string {

        return `(function(${params.join(", ")}) {
            ${body}
        })(${
            args.join(", ")
        })`;
    }
}

export function createJavaScriptLanguageBuilder(): C.ILanguageBuilder {

    return new JavaScriptLanguage();
}
