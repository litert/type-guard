import { CheckerCompiler } from "./CheckerCompiler";
import { createJavaScriptLanguageBuilder } from "./langs/JavaScript";
import { BuiltInTypeCompiler } from "./BuiltInTypeCompiler";
import { FilterCompiler } from "./FilterCompiler";
import { TypeChecker } from "./Common";

export function createJavaScriptCompiler(): <T>(rules: any) => TypeChecker<T> {

    const lang = createJavaScriptLanguageBuilder();

    const bitc = new BuiltInTypeCompiler(lang);

    const tgc = new CheckerCompiler(
        lang,
        bitc,
        new FilterCompiler(lang, bitc)
    );

    return function(rules): any {

        const result = tgc.compile({
            rules
        });

        console.log(result.source);
        console.log("");

        return new Function(
            result.arguments[0].name,
            `return ${result.source}`
        );
    };
}
