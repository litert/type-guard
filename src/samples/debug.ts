// tslint:disable: no-console
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    "rule": ["$.string", "null"]
});

console.log(check1("null"));
