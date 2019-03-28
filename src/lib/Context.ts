import * as C from "./Common";

export class Context implements C.IContext {

    public trace: boolean;

    public tracePoint: number;

    public vCursor: number;

    public stack: C.IContextData[];

    public vName: string;

    public flags: Record<string, C.EFlagValue>;

    public constructor(
        vName: string
    ) {
        this.vName = vName;

        this.stack = [];

        this.vCursor = 0;

        this.flags = {};

        this.tracePoint = 0;

        this.trace = false;
    }

    public trap(): void {

        this.stack.push({
            vName: this.vName,
            flags: this.flags
        });

        const prevFlags = this.flags;

        this.flags = {};

        for (const key in prevFlags) {

            if (prevFlags[key] === C.EFlagValue.INHERIT) {

                this.flags[key] = prevFlags[key];
            }
        }
    }

    public untrap(): void {

        const prev = this.stack.pop();

        if (!prev) {

            throw new Error("Failed to pop stack.");
        }

        this.vName = prev.vName;
        this.flags = prev.flags;
    }
}
