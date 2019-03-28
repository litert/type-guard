import * as C from "./Common";

export class Context implements C.IContext {

    public trace: boolean;

    public tracePoint: number;

    public vCursor: number;

    public stack: C.IContextData[];

    public vName: string;

    public fromString: boolean;

    public strict: boolean;

    public asserts: Record<string, boolean>;

    public constructor(vName: string) {

        this.fromString = false;

        this.vName = vName;

        this.strict = false;

        this.asserts = {};

        this.stack = [];

        this.vCursor = 0;

        this.tracePoint = 0;

        this.trace = false;
    }

    public inspect(
        type: string,
        action: (ctx: C.IContext, result: C.EInspectResult) => void
    ): C.EInspectResult {

        // tslint:disable: no-unused-expression

        const r = this.asserts[type];

        if (r === undefined) {

            action && action(this, C.EInspectResult.UNKNOWN);
            return C.EInspectResult.UNKNOWN;
        }
        else if (r === true) {

            action && action(this, C.EInspectResult.OK);
            return C.EInspectResult.OK;
        }
        else {

            action && action(this, C.EInspectResult.NO);
            return C.EInspectResult.NO;
        }
    }


    public trap(): void {

        this.stack.push({
            vName: this.vName,
            fromString: this.fromString,
            strict: this.strict,
            asserts: this.asserts
        });
    }

    public untrap(): void {

        const prev = this.stack.pop();

        if (!prev) {

            throw new Error("Failed to pop stack.");
        }

        this.vName = prev.vName;
        this.fromString = prev.fromString;
        this.strict = prev.strict;
        this.asserts = prev.asserts;
    }
}
