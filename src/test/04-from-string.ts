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

    name: "From String",
    sections: [

        {
            "name": "Boolean",
            "rule": ["$.string", "boolean"],
            "items": [
                {
                    "inputName": "string 'true'",
                    "inputValue": "true",
                    "expect": true
                },
                {
                    "inputName": "string 'false'",
                    "inputValue": "false",
                    "expect": true
                },
                ...defaultItemss({
                    "true": true,
                    "false": true
                })
            ]
        },
        {
            "name": "True",
            "rule": ["$.string", "true"],
            "items": [
                {
                    "inputName": "string 'true'",
                    "inputValue": "true",
                    "expect": true
                },
                ...defaultItemss({
                    "true": true,
                    "false": false
                })
            ]
        },
        {
            "name": "False",
            "rule": ["$.string", "false"],
            "items": [
                {
                    "inputName": "string 'false'",
                    "inputValue": "false",
                    "expect": true
                },
                ...defaultItemss({
                    "true": false,
                    "false": true
                })
            ]
        },
        {
            "name": "Integer",
            "rule": ["$.string", "int"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": "-1",
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": "1.23",
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer >= 10",
            "rule": ["$.string", "int(10,)"],
            "items": [
                {
                    "inputName": "number 11",
                    "inputValue": 11,
                    "expect": true
                },
                {
                    "inputName": "number 10",
                    "inputValue": 10,
                    "expect": true
                },
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 9",
                    "inputValue": 9,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "string '11'",
                    "inputValue": "11",
                    "expect": true
                },
                {
                    "inputName": "string '10'",
                    "inputValue": "10",
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": "-1",
                    "expect": false
                },
                {
                    "inputName": "string '9'",
                    "inputValue": "9",
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": "1.23",
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": false,
                    "number 1": false
                })
            ]
        },
        {
            "name": "Integer <= 10",
            "rule": ["$.string", "int(,10)"],
            "items": [
                {
                    "inputName": "number 11",
                    "inputValue": 11,
                    "expect": false
                },
                {
                    "inputName": "number 10",
                    "inputValue": 10,
                    "expect": true
                },
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number 9",
                    "inputValue": 9,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "string '11'",
                    "inputValue": "11",
                    "expect": false
                },
                {
                    "inputName": "string '10'",
                    "inputValue": "10",
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": "-1",
                    "expect": true
                },
                {
                    "inputName": "string '9'",
                    "inputValue": "9",
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": "1.23",
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between -12 and 25",
            "rule": ["$.string", "int(-12, 25)"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number -12",
                    "inputValue": -12,
                    "expect": true
                },
                {
                    "inputName": "number 25",
                    "inputValue": 25,
                    "expect": true
                },
                {
                    "inputName": "number 26",
                    "inputValue": 26,
                    "expect": false
                },
                {
                    "inputName": "number -13",
                    "inputValue": -13,
                    "expect": false
                },
                {
                    "inputName": "number -11.5",
                    "inputValue": -11.5,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": "-1",
                    "expect": true
                },
                {
                    "inputName": "string '-12'",
                    "inputValue": "-12",
                    "expect": true
                },
                {
                    "inputName": "string '25'",
                    "inputValue": "25",
                    "expect": true
                },
                {
                    "inputName": "string '26'",
                    "inputValue": "26",
                    "expect": false
                },
                {
                    "inputName": "string '-13'",
                    "inputValue": "-13",
                    "expect": false
                },
                {
                    "inputName": "string '-11.5'",
                    "inputValue": "-11.5",
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": "1.23",
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between -0x80 and 0x7F",
            "rule": ["$.string", "int8"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number -0x80",
                    "inputValue": -0x80,
                    "expect": true
                },
                {
                    "inputName": "number 0x7F",
                    "inputValue": 0x7F,
                    "expect": true
                },
                {
                    "inputName": "number 0x80",
                    "inputValue": 0x80,
                    "expect": false
                },
                {
                    "inputName": "number -0x81",
                    "inputValue": -0x81,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-0x80'",
                    "inputValue": (-0x80).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7F'",
                    "inputValue": (0x7F).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x80'",
                    "inputValue": (0x80).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-0x81'",
                    "inputValue": (-0x81).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between -0x8000 and 0x7FFF",
            "rule": ["$.string", "int16"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number -0x8000",
                    "inputValue": -0x8000,
                    "expect": true
                },
                {
                    "inputName": "number 0x7FFF",
                    "inputValue": 0x7FFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x8000",
                    "inputValue": 0x8000,
                    "expect": false
                },
                {
                    "inputName": "number -0x8001",
                    "inputValue": -0x8001,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-0x8000'",
                    "inputValue": (-0x8000).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7FFF'",
                    "inputValue": (0x7FFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x8000'",
                    "inputValue": (0x8000).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-0x8001'",
                    "inputValue": (-0x8001).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between -0x80000000 and 0x7FFFFFFF",
            "rule": ["$.string", "int32"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number -0x80000000",
                    "inputValue": -0x80000000,
                    "expect": true
                },
                {
                    "inputName": "number 0x7FFFFFFF",
                    "inputValue": 0x7FFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x80000000",
                    "inputValue": 0x80000000,
                    "expect": false
                },
                {
                    "inputName": "number -0x80000001",
                    "inputValue": -0x80000001,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-0x80000000'",
                    "inputValue": (-0x80000000).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7FFFFFFF'",
                    "inputValue": (0x7FFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x80000000'",
                    "inputValue": (0x80000000).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-0x80000001'",
                    "inputValue": (-0x80000001).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "64-bits integer",
            "rule": ["$.string", "int64"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number -0x8000000000000000",
                    "inputValue": -0x8000000000000000,
                    "expect": true
                },
                {
                    "inputName": "number 0x7FFFFFFF",
                    "inputValue": 0x7FFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x7FFFFFFFFFFFFFFF",
                    "inputValue": 0x7FFFFFFFFFFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-0x8000000000000000'",
                    "inputValue": (-0x8000000000000000).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7FFFFFFF'",
                    "inputValue": (0x7FFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7FFFFFFFFFFFFFFF'",
                    "inputValue": (0x7FFFFFFFFFFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer larger than -1",
            "rule": ["$.string", "uint"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1'",
                    "inputValue": (1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0'",
                    "inputValue": (0).toString(),
                    "expect": true
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between 0 and 0xFF",
            "rule": ["$.string", "uint8"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 0xFF",
                    "inputValue": 0xFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x100",
                    "inputValue": 0x100,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '0xFF'",
                    "inputValue": (0xFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x100'",
                    "inputValue": (0x100).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between 0 and 0xFFFF",
            "rule": ["$.string", "uint16"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 0xFFFF",
                    "inputValue": 0xFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x10000",
                    "inputValue": 0x10000,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '0xFFFF'",
                    "inputValue": (0xFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x10000'",
                    "inputValue": (0x10000).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between 0 and 0xFFFFFFFF",
            "rule": ["$.string", "uint32"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 0xFFFFFFFF",
                    "inputValue": 0xFFFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x100000000",
                    "inputValue": 0x100000000,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '0xFFFFFFFF'",
                    "inputValue": (0xFFFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x100000000'",
                    "inputValue": (0x100000000).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Integer between 0 and 0xFFFFFFFFFFFFFFFF",
            "rule": ["$.string", "uint64"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 0xFFFFFFFFFFFFFFFF",
                    "inputValue": 0xFFFFFFFFFFFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 0x7FFFFFFF",
                    "inputValue": 0x7FFFFFFF,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '0xFFFFFFFFFFFFFFFF'",
                    "inputValue": (0xFFFFFFFFFFFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0x7FFFFFFF'",
                    "inputValue": (0x7FFFFFFF).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Accuracy safe integer",
            "rule": ["$.string", "safe_int"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number 9007199254740991",
                    "inputValue": 9007199254740991,
                    "expect": true
                },
                {
                    "inputName": "number -9007199254740991",
                    "inputValue": -9007199254740991,
                    "expect": true
                },
                {
                    "inputName": "number 9007199254740992",
                    "inputValue": 9007199254740992,
                    "expect": false
                },
                {
                    "inputName": "number -9007199254740992",
                    "inputValue": -9007199254740992,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '9007199254740991'",
                    "inputValue": (9007199254740991).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-9007199254740991'",
                    "inputValue": (-9007199254740991).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '9007199254740992'",
                    "inputValue": (9007199254740992).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-9007199254740992'",
                    "inputValue": (-9007199254740992).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Accuracy safe unsigned integer",
            "rule": ["$.string", "safe_uint"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 9007199254740991",
                    "inputValue": 9007199254740991,
                    "expect": true
                },
                {
                    "inputName": "number 9007199254740992",
                    "inputValue": 9007199254740992,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '9007199254740991'",
                    "inputValue": (9007199254740991).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '9007199254740992'",
                    "inputValue": (9007199254740992).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Float number",
            "rule": ["$.string", "float"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number 120312",
                    "inputValue": 120312,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": true
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '120312'",
                    "inputValue": (120312).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": true
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Unsigned float number",
            "rule": ["$.string", "ufloat"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 120312",
                    "inputValue": 120312,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": true
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '120312'",
                    "inputValue": (120312).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Number",
            "rule": ["$.string", "number"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number 120312",
                    "inputValue": 120312,
                    "expect": true
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": true
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '120312'",
                    "inputValue": (120312).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": true
                },
                ...defaultItemss({
                    "number 0": true,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Number between 1.0, 10.0",
            "rule": ["$.string", "number(1.0, 10.0)"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 1",
                    "inputValue": 1,
                    "expect": true
                },
                {
                    "inputName": "number 10",
                    "inputValue": 10,
                    "expect": true
                },
                {
                    "inputName": "number 11",
                    "inputValue": 11,
                    "expect": false
                },
                {
                    "inputName": "number 0",
                    "inputValue": 0,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": true
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1'",
                    "inputValue": (1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '10'",
                    "inputValue": (10).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '11'",
                    "inputValue": (11).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '0'",
                    "inputValue": (0).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": false,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Number larger than 1",
            "rule": ["$.string", "number(1, )"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": false
                },
                {
                    "inputName": "number 1",
                    "inputValue": 1,
                    "expect": true
                },
                {
                    "inputName": "number 10",
                    "inputValue": 10,
                    "expect": true
                },
                {
                    "inputName": "number 11",
                    "inputValue": 11,
                    "expect": true
                },
                {
                    "inputName": "number 0",
                    "inputValue": 0,
                    "expect": false
                },
                {
                    "inputName": "number 1.23",
                    "inputValue": 1.23,
                    "expect": true
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": false
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1'",
                    "inputValue": (1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '10'",
                    "inputValue": (10).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '11'",
                    "inputValue": (11).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0'",
                    "inputValue": (0).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '1.23'",
                    "inputValue": (1.23).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": false
                },
                ...defaultItemss({
                    "number 0": false,
                    "number 1": true
                })
            ]
        },
        {
            "name": "Number lower than -1",
            "rule": ["$.string", "number(, -1)"],
            "items": [
                {
                    "inputName": "number -1",
                    "inputValue": -1,
                    "expect": true
                },
                {
                    "inputName": "number 1",
                    "inputValue": 1,
                    "expect": false
                },
                {
                    "inputName": "number -0.3",
                    "inputValue": -0.3,
                    "expect": false
                },
                {
                    "inputName": "number -11",
                    "inputValue": -11,
                    "expect": true
                },
                {
                    "inputName": "number 0",
                    "inputValue": 0,
                    "expect": false
                },
                {
                    "inputName": "number -1.23",
                    "inputValue": -1.23,
                    "expect": true
                },
                {
                    "inputName": "string '-1'",
                    "inputValue": (-1).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '1'",
                    "inputValue": (1).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-0.3'",
                    "inputValue": (-0.3).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-11'",
                    "inputValue": (-11).toString(),
                    "expect": true
                },
                {
                    "inputName": "string '0'",
                    "inputValue": (0).toString(),
                    "expect": false
                },
                {
                    "inputName": "string '-1.23'",
                    "inputValue": (-1.23).toString(),
                    "expect": true
                },
                ...defaultItemss({
                    "number 0": false,
                    "number 1": false
                })
            ]
        },
        {
            "name": "Null",
            "rule": ["$.string", "null"],
            "items": [
                {
                    "inputName": "string 'null'",
                    "inputValue": "null",
                    "expect": true
                },
                ...defaultItemss({
                    "null": true
                })
            ]
        },
        {
            "name": "Literal null",
            "rule": ["$.string", null],
            "items": [
                {
                    "inputName": "string 'null'",
                    "inputValue": "null",
                    "expect": true
                },
                ...defaultItemss({
                    "null": true
                })
            ]
        },
        {
            "name": "Literal number 1",
            "rule": ["$.string", 1],
            "items": [
                {
                    "inputName": "string '1'",
                    "inputValue": "1",
                    "expect": true
                },
                ...defaultItemss({
                    "number 1": true
                })
            ]
        },
        {
            "name": "Literal true",
            "rule": ["$.string", true],
            "items": [
                {
                    "inputName": "string 'true'",
                    "inputValue": "true",
                    "expect": true
                },
                ...defaultItemss({
                    "true": true
                })
            ]
        },
        {
            "name": "Literal false",
            "rule": ["$.string", false],
            "items": [
                {
                    "inputName": "string 'false'",
                    "inputValue": "false",
                    "expect": true
                },
                ...defaultItemss({
                    "false": true
                })
            ]
        },
    ]
};

export default createTestDefinition(testItems);
