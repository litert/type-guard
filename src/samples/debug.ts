import { CheckerCompiler } from "../lib/CheckerCompiler";
import { createJavaScriptLanguageBuilder } from "../lib/langs/JavaScript";
import { BuiltInTypeCompiler } from "../lib/BuiltInTypeCompiler";
import { FilterCompiler } from "../lib/FilterCompiler";

const lang = createJavaScriptLanguageBuilder();

const bitc = new BuiltInTypeCompiler(lang);

const tgc = new CheckerCompiler(
    lang,
    bitc,
    new FilterCompiler(lang, bitc)
);

// tslint:disable: no-console

const result = tgc.compile({
    rules: {
        "a": "uint32",
        "b?": ["=123", "numeric"],
        "c->[]?": {
            "name": "string(1, 255)",
            "age": "int"
        }
    }
});

const checker = new Function(
    result.arguments[0].name,
    `return ${result.source}`
);

console.log(result.source);

console.log(checker({
    "a": 123
}));
console.log(checker({
    "a": 123,
    "c": [{
        "name": "2131231",
        "age": 333
    }]
}));
console.log(checker({
    "a": 123321,
    "b": "123"
}));
console.log(checker(["FFFFFFFF", 127]));
console.log(checker(["10090000", 123]));
console.log(checker(["100", -128]));
console.log(checker([100, 127, -128, 111, 0]));
console.log(checker(["100", "127", "-128", "111", "0"]));
console.log(checker({
    "A": 123,
    "b": -123
}));
console.log(checker([-1]));
console.log(checker([-128]));
console.log(checker([128]));
console.log(checker([-129]));
console.log(checker(123));
console.log(checker([123, undefined]));
