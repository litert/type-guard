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

import { createTestDefinition, defaultItemss, ITestSuite } from "./abstracts";

const testItems: ITestSuite = {

    name: "String Asserts",
    sections: [
        {
            "name": "Operator ==",
            "rule": "==aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": true
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": false
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Operator =",
            "rule": "=aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": true
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": false
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Symbol ':equal:'",
            "rule": ":equal:aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": true
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": false
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Symbol ':equal-i:'",
            "rule": ":equal-i:aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": true
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": true
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Operator %=",
            "rule": "%=aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": true
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": true
                },
                ...defaultItemss({})
            ]
        },
        {
            "name": "Operator !=",
            "rule": "!=aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": false
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-equal:'",
            "rule": ":not-equal:aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": false
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-equal-i:'",
            "rule": ":not-equal-i:aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": false
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator %!",
            "rule": "%!aasdsadsada",
            "items": [
                {
                    "inputName": "string 'aasdsadsada'",
                    "inputValue": "aasdsadsada",
                    "expect": false
                },
                {
                    "inputName": "string 'AASDSADSADA'",
                    "inputValue": "AASDSADSADA",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator ^=",
            "rule": "^=hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':start-with:'",
            "rule": ":start-with:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':start-with-i:'",
            "rule": ":start-with-i:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ^!",
            "rule": "^!hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-start-with:'",
            "rule": ":not-start-with:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-start-with-i:'",
            "rule": ":not-start-with-i:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator $=",
            "rule": "$=world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello World",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':end-with:'",
            "rule": ":end-with:world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello World",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':end-with-i:'",
            "rule": ":end-with-i:world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello World",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator $!",
            "rule": "$!world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello World",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-end-with:'",
            "rule": ":not-end-with:world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello World",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-end-with-i:'",
            "rule": ":not-end-with-i:world",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello World",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": true
                })
            ]
        },

        /**
         * Include
         */

        {
            "name": "Operator ?=",
            "rule": "?=hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':include:'",
            "rule": ":include:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator *=",
            "rule": "*=hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Symbol ':include-i:'",
            "rule": ":include-i:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ?!",
            "rule": "?!hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-include:'",
            "rule": ":not-include:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Symbol ':not-include-i:'",
            "rule": ":not-include-i:hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator *!",
            "rule": "*!hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator ~=/hello/i",
            "rule": "~=/hello/i",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ~=hello",
            "rule": "~=hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ~/hello/i",
            "rule": "~/hello/i",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ~hello",
            "rule": "~hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "string 'hello'": true,
                    "empty string": false
                })
            ]
        },
        {
            "name": "Operator ~!hello",
            "rule": "~!hello",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator ~!/hello/i",
            "rule": "~!/hello/i",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": false
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": true
                },
                ...defaultItemss({
                    "string 'hello'": false,
                    "empty string": true
                })
            ]
        },
        {
            "name": "Operator ~!/hello/i with negative assert shortcut",
            "rule": "!~!/hello/i",
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "empty string": false
                }, true)
            ]
        },
        {
            "name": "Operator ~!/hello/i with negative assert",
            "rule": ["$.not", "~!/hello/i"],
            "items": [
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hello world'",
                    "inputValue": "Hello world",
                    "expect": true
                },
                {
                    "inputName": "string 'hi world'",
                    "inputValue": "hi world",
                    "expect": false
                },
                ...defaultItemss({
                    "empty string": false
                }, true)
            ]
        },
    ]
};

export default createTestDefinition(testItems);
