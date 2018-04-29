/*
   +----------------------------------------------------------------------+
   | LiteRT TypeGuard.js Library                                          |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/type-guard/blob/master/LICENSE             |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

// tslint:disable:no-console
import * as TypeGuard from ".";

let compiler = TypeGuard.createCompiler4JavaScript();

const Tests = {

    isUInt8: {
        rule: "uint8",
        args: [-1, 0, 1, "123", 10, 127, 128, 255, 256]
    },
    isInt8: {
        rule: "int8",
        args: [-129, -128, -127, -1, 0, 23, 127, 128, 129, "123", "333"]
    },
    isString: {
        rule: "string",
        args: ["a", "", 123, null, false, true, [""]]
    },
    isASCIIString: {
        rule: "ascii_string",
        args: ["a", "heihei", "好", "a我b", 123, null, false, true, [""]]
    },
    isStringArray: {
        rule: "string[]",
        args: [
            ["a", ""],
            new Array<string>(),
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isStringMap: {
        rule: "string{}",
        args: [
            {"a": "c", "b": "d"},
            {"a": "c", "b": 123},
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isStringDict: {
        rule: ["$.dict", ["a", "b"], "string"],
        args: [
            {"a": "c", "b": "d"},
            {"a": "c", "c": "d"},
            {"a": "c", "b": 123},
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isOptionalString: {
        rule: ["string", "void"],
        args: [
            undefined,
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isImplicitOptionalString: {
        rule: "?string",
        args: [
            undefined,
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isPoint: {
        rule: {"x": "float", "y": "float"},
        args: [
            {"x": 1.2, "y": 4},
            {"x": 3, "y": 113.2},
            undefined,
            {"x": 1.2, "y": "4"},
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isPointArray: {
        rule: ["$.array", {"x": "float", "y": "float"}],
        args: [
            [{"x": 1.2, "y": 4}],
            [{"x": 1.2, "y": 4}, {"x": 1.2, "y": "4"}],
            undefined,
            {"x": 1.2, "y": 4},
            [],
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isPointMap: {
        rule: ["$.map", {"x": "float", "y": "float"}],
        args: [
            {a: {"x": 1.2, "y": 4}, b: {"x": 1.2, "y": 4}},
            [{"x": 1.2, "y": 4}, {"x": 1.2, "y": "4"}],
            {a: {"x": 1.2, "y": "4"}, b: {"x": 1.2, "y": 4}},
            {a: {"x": 1.2, "y": 4}, b: false},
            undefined,
            {"x": 1.2, "y": 4},
            [],
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    isNumberOrPointMap: {
        rule: ["$.map", {"x": "float", "y": "float"}, "uint32"],
        args: [
            {a: {"x": 1.2, "y": 4}, b: {"x": 1.2, "y": 4}, c: 123},
            {a: {"x": 1.2, "y": 4}, b: {"x": 1.2, "y": 4}},
            {a: {"x": 1.2, "y": 4}, b: {"x": 1.2, "y": 4}, d: 55.02},
            [{"x": 1.2, "y": 4}, {"x": 1.2, "y": "4"}],
            {a: {"x": 1.2, "y": "4"}, b: {"x": 1.2, "y": 4}},
            {a: {"x": 1.2, "y": 4}, b: false},
            undefined,
            {"x": 1.2, "y": 4},
            [],
            "",
            "a",
            ["", 123],
            123,
            null,
            false
        ]
    },
    orTest: {
        rule: ["$.or", "string", "boolean"],
        args: [
            "abc",
            1231,
            true,
            false,
            "",
            null,
            NaN,
            undefined
        ]
    },
    orImplicitTest: {
        rule: ["string", "boolean"],
        args: [
            "abc",
            1231,
            true,
            false,
            "",
            null,
            NaN,
            undefined
        ]
    },
    andTest: {
        rule: [["$.and", "string", ["=male", "=female"]], ["uint"]],
        args: [
            "abc",
            1231,
            true,
            false,
            "333",
            "male",
            "female",
            null,
            NaN,
            undefined
        ]
    },
    tupleTest: {
        rule: ["$.tuple", "string", "int8"],
        args: [
            ["a", 1],
            [321, 1],
            ["a", -129],
            undefined,
            null,
            false,
            true
        ]
    },
    tupleTest1: {
        rule: ["$.tuple", "string", 123],
        args: [
            ["a", 1],
            ["a", 123],
            [321, 1],
            ["a", -127],
            undefined,
            null,
            false,
            true
        ]
    },
    objectSubMapTest1: {
        rule: {
            "name": "string",
            "age?": ["$.and", "int", "|value between 1 100"],
            "friends->{}?": {
                "name": "string",
                "gender": ["=male", "=female", "=other"]
            }
        },
        args: [
            {
                name: "Angus",
                age: 24,
                friends: {
                    "Edith": {
                        name: "Edith",
                        gender: "female"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "male"
                    }
                }
            },
            {
                name: "Angus",
                friends: {
                    "Edith": {
                        name: "Edith",
                        gender: "female"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "male"
                    }
                }
            },
            {
                name: "Angus",
                age: 24
            },
            {
                name: "Angus",
                age: 242,
                friends: {
                    "Edith": {
                        name: "Edith",
                        gender: "female"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "male"
                    }
                }
            },
            {
                name: "Angus",
                friends: {
                    "Edith": {
                        name: "Edith",
                        gender: "female"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "male"
                    }
                }
            },
            {
                name: "Angus",
                friends: {
                    "Edith": {
                        name: "Edith"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "male"
                    }
                }
            },
            {
                name: "Angus",
                age: 24,
                friends: {
                    "Edith": {
                        name: "Edith",
                        gender: "female"
                    },
                    "Yubo": {
                        name: "Yubo",
                        gender: "secret"
                    }
                }
            }
        ]
    }
};

function runTestItem(
    name: keyof typeof Tests,
    stopOnEntry?: boolean
): void {

    const ruleText = JSON.stringify(
        Tests[name].rule,
        null,
        2
    ).split("\n").map((x) => `  ${x}`).join("\n");

    console.log("---------------------------------\n");
    console.log(`Name:\n`);
    console.log(`  ${name}\n`);
    console.log(`Rule:\n`);
    console.log(`${ruleText}\n`);
    console.log(`Tests:\n`);

    const verify = compiler.compile(
        Tests[name].rule,
        stopOnEntry
    );

    for (let val of Tests[name].args) {

        console.log(`  > Input: ${JSON.stringify(val)}`);
        console.log(`    Result: ${verify(val)}\n`);
    }
}

function runAllTests(stopOnEntry?: boolean) {

    for (let name in Tests) {

        runTestItem(<any> name, stopOnEntry);
    }
}

runAllTests();
// runTestItem("isStringDict", true);
