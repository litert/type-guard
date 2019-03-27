"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckerCompiler_1 = require("../lib/CheckerCompiler");
const JavaScript_1 = require("../lib/langs/JavaScript");
const BuiltInTypeCompiler_1 = require("../lib/BuiltInTypeCompiler");
const FilterCompiler_1 = require("../lib/FilterCompiler");
const lang = JavaScript_1.createJavaScriptLanguageBuilder();
const bitc = new BuiltInTypeCompiler_1.BuiltInTypeCompiler(lang);
const tgc = new CheckerCompiler_1.CheckerCompiler(lang, bitc, new FilterCompiler_1.FilterCompiler(lang, bitc));
// tslint:disable: no-console
const result = tgc.compile({
    rules: "string(0,200)[5]"
});
const checker = new Function(result.arguments[0].name, `return ${result.source}`);
console.log(result.source);
console.log(checker([100, 127, -128, 111, 0]));
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
//# sourceMappingURL=debug.js.map