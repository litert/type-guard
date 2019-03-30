import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check = tgc.compile({
    rule: {
        "b": "@MyType",
        "a": ["$.type", "MyType", "string[1]"],
        "c": "@MyType"
    }
});

console.log(tgc.detectUndefinedTypes());

console.log(check({
    "a": ["f"],
    "b": ["f"],
    "c": ["f"],
}));
