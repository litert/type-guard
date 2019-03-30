import * as TypeGuard from "../lib";

const tgc = TypeGuard.createJavaScriptJIT();

const check1 = tgc.compile({
    rule: ["$.strict", {
        "a": "string",
        "b?": "uint32",
        "d?": {
            "a": "uint32"
        }
    }]
});

const check2 = tgc.compile({
    rule: ["$.equal", {
        "a": "string",
        "b?": "uint32",
        "d?": {
            "a": "uint32"
        }
    }]
});

console.log(tgc.detectUndefinedTypes());

console.log(check1({
    "a": "fff",
    "b": 1231,
    "c": "fff"
}));

console.log(check1({
    "a": "fff",
    "b": 1231,
    "d": {
        "a": 123,
        "b": 333
    }
}));

console.log(check2({
    "a": "fff",
    "b": 1231,
    "d": {
        "a": 123
    }
}));

console.log(check2({
    "a": "fff",
    "b": 1231,
    "d": {
        "a": 123,
        "b": 333
    }
}));
