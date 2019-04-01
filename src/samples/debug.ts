// tslint:disable: no-console
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    "rule": ["$.string", {
        "a": "float(1.7,)",
        "b": {
            "c": "int(-12, )"
        }
    }]
});

console.log(check1({
    "a": "1.2",
    "b": {
        "c": "123312"
    }
}));
