import * as assert from "assert";
import * as TypeGuard from "../lib";

export interface ITestItem {

    inputName: string;

    inputValue: any;

    expect: boolean | "throw";
}

export interface ITestRule {

    name: string;

    rule: any;

    items: ITestItem[];
}

export interface ITestSuite {

    name: string;

    sections: ITestRule[];
}

export function defaultItemss(
    items: Record<string, boolean>,
    defaultValue: boolean = false
): ITestItem[] {

    return [
        {
            "inputName": "true",
            "inputValue": true,
            "expect": items["true"] === undefined ? defaultValue : items["true"]
        },
        {
            "inputName": "false",
            "inputValue": false,
            "expect": items["false"] === undefined ? defaultValue : items["false"]
        },
        {
            "inputName": "undefined",
            "inputValue": undefined,
            "expect": items["undefined"] === undefined ? defaultValue : items["undefined"]
        },
        {
            "inputName": "null",
            "inputValue": null,
            "expect": items["null"] === undefined ? defaultValue : items["null"]
        },
        {
            "inputName": "empty array",
            "inputValue": [],
            "expect": items["empty array"] === undefined ? defaultValue : items["empty array"]
        },
        {
            "inputName": "string 'hello'",
            "inputValue": "hello",
            "expect": items["string 'hello'"] === undefined ? defaultValue : items["string 'hello'"]
        },
        {
            "inputName": "empty string",
            "inputValue": "",
            "expect": items["empty string"] === undefined ? defaultValue : items["empty string"]
        },
        {
            "inputName": "object",
            "inputValue": {},
            "expect": items["object"] === undefined ? defaultValue : items["object"]
        },
        {
            "inputName": "number 0",
            "inputValue": 0,
            "expect": items["number 0"] === undefined ? defaultValue : items["number 0"]
        },
        {
            "inputName": "number 1",
            "inputValue": 1,
            "expect": items["number 1"] === undefined ? defaultValue : items["number 1"]
        }
    ];
}

const compiler = TypeGuard.createJavaScriptJIT();

export function createTestDefinition(suite: ITestSuite) {

    return function(): void {

        describe(suite.name, function() {

            for (let section of suite.sections) {

                describe(section.name, function() {

                    if (
                        section.items.length === 1 &&
                        section.items[0].expect === "throw"
                    ) {

                        it(`Throws exception.`, function() {

                            assert.throws(() => {

                                compiler.compile<any>({
                                    "rule": section.rule
                                });
                            });
                        });
                        return;
                    }

                    const check = compiler.compile<any>({
                        "rule": section.rule
                    });

                    for (let item of section.items.sort((a, b) => a.expect === b.expect ? 0 : (a.expect ? -1 : 1))) {

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