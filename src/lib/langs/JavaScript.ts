import * as C from "../Common";

class JavaScriptLanguage
implements C.ILanguageBuilder {

    private _isLiteralString(str: string): boolean {

        return str[0] === "\"";
    }

    public instr(
        expr: string,
        match: string,
        caseSensitive: boolean = true
    ): string {

        if (!caseSensitive) {

            expr = `${expr}.toLowerCase()`;
            match = this._isLiteralString(match) ?
                match.toLowerCase() :
                `${match}.toLowerCase()`;
        }

        return `${expr}.includes(${match})`;
    }

    public startsWith(
        expr: string,
        match: string,
        caseSensitive: boolean = true
    ): string {

        if (!caseSensitive) {

            expr = `${expr}.toLowerCase()`;
            match = this._isLiteralString(match) ?
                match.toLowerCase() :
                `${match}.toLowerCase()`;
        }

        return `${expr}.startsWith(${match})`;
    }

    public endsWith(
        expr: string,
        match: string,
        caseSensitive: boolean = true
    ): string {

        if (!caseSensitive) {

            expr = `${expr}.toLowerCase()`;
            match = this._isLiteralString(match) ?
                match.toLowerCase() :
                `${match}.toLowerCase()`;
        }

        return `${expr}.endsWith(${match})`;
    }

    public varName(index: number | string): string {

        return `var_${index}`;
    }

    public or(conditions: string[]): string {

        return `${conditions.map((x) => `(${x})`).join(" || ")}`;
    }

    public and(conditions: string[]): string {

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

    private _escape(s: string): string {

        return s.replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/'/g, "\\\'")
                .replace(/\r/g, "\\r")
                .replace(/\n/g, "\\n");
    }

    public matchRegExp(
        expr: string,
        regExp: string
    ): string {

        let m = regExp.match(/^\/(.+)\/([a-z]*)$/i);

        if (m) {

            return `/${this._escape(m[1])}/${m[2]}.test(${expr})`;
        }

        return `/${this._escape(regExp)}/.test(${expr})`;
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

    public isDict(vn: string, positive: boolean = true): string {

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

        return `/^[+-]?\\d+(\\.\\d+)?$/.test(${vn}) ${this._equal(positive)} true`;
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
        k: string,
        literal?: boolean
    ): string {

        return `${o}[${ literal ? JSON.stringify(k) : k}]`;
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
