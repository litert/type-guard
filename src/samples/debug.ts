// tslint:disable: no-console
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    "rule": {
        "a?": "string",
        "g": {
            "name": "string",
            "age": "uint8"
        },
        "$.map": "uint32"
    },
    stopOnEntry: true
});

console.log(check1({
    "a": "123",
    "g": {
        "name": "aaa",
        "age": 123
    },
    "b": 1231,
    "c": 333
}));
