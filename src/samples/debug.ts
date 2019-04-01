// tslint:disable: no-console
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    "rule": {
        "data->(=)": {
            "a": "string",
            "b": {
                "c": "string"
            }
        }
    }
});

console.log(check1({
    "data": {
        "a": "fff",
        "b": {
            "c": "ccc",
            "x": 123,
        }
    }
}));
