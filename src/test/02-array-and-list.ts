/**
 * Copyright 2019 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    createTestDefinition,
    defaultItemss,
    ITestSuite,
    assertItem,
    addRule
} from "./abstracts";

const testItems: ITestSuite = {

    name: "List & Array",
    sections: [

        {
            "name": "String list",
            "rule": ["$.list", "string"],
            "items": [
                {
                    inputName: "[string]",
                    inputValue: ["fff"],
                    expect: true
                },
                {
                    inputName: "[string,string]",
                    inputValue: ["fff", "ggg"],
                    expect: true
                },
                {
                    inputName: "[string,int]",
                    inputValue: ["fff", 123],
                    expect: false
                },
                ...defaultItemss({
                    "empty array": true
                })
            ]
        },
        {
            "name": "Fixed-length array with 1 element.",
            "rule": ["$.array", 1, "string"],
            "items": [
                {
                    inputName: "[string]",
                    inputValue: ["fff"],
                    expect: true
                },
                {
                    inputName: "[string,string]",
                    inputValue: ["fff", "ggg"],
                    expect: false
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Fixed-length array with 2 different-type elements.",
            "rule": ["$.array", 2, "string", "int"],
            "items": [
                {
                    inputName: "[string]",
                    inputValue: ["fff"],
                    expect: false
                },
                {
                    inputName: "[string,string]",
                    inputValue: ["fff", "ggg"],
                    expect: true
                },
                {
                    inputName: "[string,int]",
                    inputValue: ["fff", 312],
                    expect: true
                },
                {
                    inputName: "[int,int]",
                    inputValue: [333, 312],
                    expect: true
                },
                {
                    inputName: "[int,string]",
                    inputValue: [333, "ddsadsa"],
                    expect: true
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Variable-length array with at least 1 element",
            "rule": ["$.array", [1], "string"],
            "items": [
                {
                    inputName: "[string]",
                    inputValue: ["fff"],
                    expect: true
                },
                {
                    inputName: "[string,string]",
                    inputValue: ["fff", "ggg"],
                    expect: true
                },
                {
                    inputName: "[string,int]",
                    inputValue: ["fff", 123],
                    expect: false
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Variable-length array with 1 ~ 3 elements",
            "rule": ["$.array", [1, 3], "string"],
            "items": [
                {
                    inputName: "[string]",
                    inputValue: ["fff"],
                    expect: true
                },
                {
                    inputName: "[string,string]",
                    inputValue: ["fff", "ggg"],
                    expect: true
                },
                {
                    inputName: "[string,string,string]",
                    inputValue: ["fff", "ggg", "ggg"],
                    expect: true
                },
                {
                    inputName: "[string,string,string,string]",
                    inputValue: ["fff", "ggg", "ggg", "fffa"],
                    expect: false
                },
                {
                    inputName: "[string,int]",
                    inputValue: ["fff", 123],
                    expect: false
                },
                ...defaultItemss({})
            ]
        },
        addRule({
            "a->[]": "string"
        }, [
            assertItem([], false),
            assertItem({"a": []}, true),
            assertItem({"a": [1]}, false),
            assertItem({"a": ["1"]}, true)
        ]),
        addRule({
            "a->[3]": "string"
        }, [
            assertItem([], false),
            assertItem({"a": []}, false),
            assertItem({"a": [1, 1, 2]}, false),
            assertItem({"a": ["1", "f", "c"]}, true),
            assertItem({"a": ["1", "f", "c", "c"]}, false)
        ]),
        addRule({
            "a->[3,]": "string"
        }, [
            assertItem([], false),
            assertItem({"a": []}, false),
            assertItem({"a": [1, 1, 2]}, false),
            assertItem({"a": ["1", "f", "c"]}, true),
            assertItem({"a": ["1", "f", "c", "c"]}, true)
        ]),
        addRule({
            "a->[3,5]": "string"
        }, [
            assertItem([], false),
            assertItem({"a": []}, false),
            assertItem({"a": [1, 1, 2]}, false),
            assertItem({"a": ["1", "f", "c"]}, true),
            assertItem({"a": ["1", "f", "c", "c"]}, true),
            assertItem({"a": ["1", "f", "c", "c", "5"]}, true),
            assertItem({"a": ["1", "f", "c", "c", "5", "c"]}, false)
        ])
    ],
};

export default createTestDefinition(testItems);
