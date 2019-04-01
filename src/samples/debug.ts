// tslint:disable: no-console
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    rule: ["$.tuple", "string", "int", "...4", "string", "...2", "int", "..."]
});

console.log(check1(["aaa", 123, 312, 222, 333, "fff", "ccc", 444]));
