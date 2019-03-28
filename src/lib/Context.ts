import * as C from "./Common";

export class Context implements C.IContext {

    public trace: boolean;

    public tracePoint: number;

    public vCursor: number;

    public stack: C.IContextData[];

    public vName: string;

    public fromString: boolean;

    public strict: boolean;

    public constructor(
        vName: string
    ) {

        this.fromString = false;

        this.vName = vName;

        this.strict = false;

        this.stack = [];

        this.vCursor = 0;

        this.tracePoint = 0;

        this.trace = false;
    }

    public trap(): void {

        this.stack.push({
            vName: this.vName,
            fromString: this.fromString,
            strict: this.strict
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
    }
}
