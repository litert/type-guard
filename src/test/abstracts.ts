import * as assert from "assert";
import * as TypeGuard from "../lib";

export interface ITestItem {

    inputName: string;

    inputValue: any;

    expect: boolean | "throw";
}

export interface ITestRule {

    name: string;

    rule: string;

    items: ITestItem[];
}

export interface ITestSuite {

    name: string;

    rules: ITestRule[];
}

export function defaultItemss(items: Record<string, boolean>): ITestItem[] {

    return [
        {
            "inputName": "true",
            "inputValue": true,
            "expect": items["true"] || false
        },
        {
            "inputName": "false",
            "inputValue": false,
            "expect": items["false"] || false
        },
        {
            "inputName": "undefined",
            "inputValue": undefined,
            "expect": items["undefined"] || false
        },
        {
            "inputName": "null",
            "inputValue": null,
            "expect": items["null"] || false
        },
        {
            "inputName": "empty array",
            "inputValue": [],
            "expect": items["empty array"] || false
        },
        {
            "inputName": "string 'hello'",
            "inputValue": "hello",
            "expect": items["string 'hello'"] || false
        },
        {
            "inputName": "empty string",
            "inputValue": "",
            "expect": items["empty string"] || false
        },
        {
            "inputName": "object",
            "inputValue": {},
            "expect": items["object"] || false
        },
        {
            "inputName": "number 0",
            "inputValue": 0,
            "expect": items["number 0"] || false
        },
        {
            "inputName": "number 1",
            "inputValue": 1,
            "expect": items["number 1"] || false
        }
    ];
}

export function createTestDefinition(suite: ITestSuite) {

    return function(): void {

        describe(suite.name, function() {

            const compile = TypeGuard.createJavaScriptCompiler();

            for (let rule of suite.rules) {

                describe(rule.name, function() {

                    if (
                        rule.items.length === 1 &&
                        rule.items[0].expect === "throw"
                    ) {

                        it(`Throws exception.`, function() {

                            assert.throws(() => {

                                compile<any>(rule.rule);
                            });
                        });
                        return;
                    }

                    const check = compile<any>(rule.rule);

                    for (let item of rule.items.sort((a, b) => a.expect ? -1 : 1)) {

                        it(`${
                            item.expect ? "OK" : "FAILED"
                        } when input ${
                            item.inputName
                        }.`, function() {

                            assert.equal(
                                check(item.inputValue),
                                item.expect
                            );
                        });
                    }
                });
            }
        });
    };
}