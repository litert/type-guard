import * as assert from "assert";
import * as TypeGuard from "../lib";
import { TestItem, defaultItemss } from "./abstracts";

const testItems: Record<string, TestItem[]> = {

    "string": [
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": true
        })
    ],
    "string(5)": [
        {
            "inputName": "string 'world'",
            "inputValue": "world",
            "expectation": true
        },
        {
            "inputName": "string 'hi'",
            "inputValue": "hi",
            "expectation": false
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": false
        },
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": false
        })
    ],
    "ascii_string": [
        {
            "inputName": "string 'world'",
            "inputValue": "world",
            "expectation": true
        },
        {
            "inputName": "string 'hi'",
            "inputValue": "hi",
            "expectation": true
        },
        {
            "inputName": "string 'proper'",
            "inputValue": "proper",
            "expectation": true
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": true
        },
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": true
        })
    ],
    "string(2, 6)": [
        {
            "inputName": "string 'world'",
            "inputValue": "world",
            "expectation": true
        },
        {
            "inputName": "string 'hi'",
            "inputValue": "hi",
            "expectation": true
        },
        {
            "inputName": "string 'proper'",
            "inputValue": "proper",
            "expectation": true
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": false
        },
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": false
        })
    ],
    "latin_string(2, 6)": [
        {
            "inputName": "string 'ⱠⱡⱢab'",
            "inputValue": "ⱠⱡⱢab",
            "expectation": true
        },
        {
            "inputName": "string 'Ᵽ'",
            "inputValue": "Ᵽ",
            "expectation": false
        },
        {
            "inputName": "string 'proper'",
            "inputValue": "proper",
            "expectation": true
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": false
        },
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": false
        })
    ],
    "ascii_string(2, 6)": [
        {
            "inputName": "string 'proper'",
            "inputValue": "proper",
            "expectation": true
        },
        {
            "inputName": "string 'world'",
            "inputValue": "world",
            "expectation": true
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": false
        },
        {
            "inputName": "string 'ⱠⱡⱢab'",
            "inputValue": "ⱠⱡⱢab",
            "expectation": false
        },
        {
            "inputName": "string 'Ᵽ'",
            "inputValue": "Ᵽ",
            "expectation": false
        },
        ...defaultItemss({
            "string 'hello'": true,
            "empty string": false
        })
    ],
    "hex_string(2, 8)": [
        {
            "inputName": "string 'fffff'",
            "inputValue": "fffff",
            "expectation": true
        },
        {
            "inputName": "string '1234a'",
            "inputValue": "1234a",
            "expectation": true
        },
        {
            "inputName": "string 'fffffffffffff'",
            "inputValue": "fffffffffffff",
            "expectation": false
        },
        {
            "inputName": "string 'logical'",
            "inputValue": "logical",
            "expectation": false
        },
        {
            "inputName": "string 'ⱠⱡⱢab'",
            "inputValue": "ⱠⱡⱢab",
            "expectation": false
        },
        {
            "inputName": "string 'Ᵽ'",
            "inputValue": "Ᵽ",
            "expectation": false
        },
        ...defaultItemss({
            "string 'hello'": false,
            "empty string": false
        })
    ],
    "boolean": [
        {
            "inputName": "string 'true'",
            "inputValue": "true",
            "expectation": false
        },
        {
            "inputName": "string 'false'",
            "inputValue": "false",
            "expectation": false
        },
        ...defaultItemss({
            "true": true,
            "false": true
        })
    ],
    "true": [
        {
            "inputName": "string 'true'",
            "inputValue": "true",
            "expectation": false
        },
        ...defaultItemss({
            "true": true,
            "false": false
        })
    ],
    "false": [
        {
            "inputName": "string 'false'",
            "inputValue": "false",
            "expectation": false
        },
        ...defaultItemss({
            "true": false,
            "false": true
        })
    ],
    "true_value": [
        {
            "inputName": "string 'true'",
            "inputValue": "true",
            "expectation": true
        },
        ...defaultItemss({
            "true": true,
            "false": false,
            "object": true,
            "number 1": true,
            "string 'hello'": true,
            "empty array": true
        })
    ],
    "false_value": [
        {
            "inputName": "string 'false'",
            "inputValue": "false",
            "expectation": false
        },
        ...defaultItemss({
            "true": false,
            "false": true,
            "number 0": true,
            "null": true,
            "undefined": true,
            "empty string": true
        })
    ],
    "int": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "int(-12, 25)": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number -12",
            "inputValue": -12,
            "expectation": true
        },
        {
            "inputName": "number 25",
            "inputValue": 25,
            "expectation": true
        },
        {
            "inputName": "number 26",
            "inputValue": 26,
            "expectation": false
        },
        {
            "inputName": "number -13",
            "inputValue": -13,
            "expectation": false
        },
        {
            "inputName": "number -11.5",
            "inputValue": -11.5,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "int8": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number -0x80",
            "inputValue": -0x80,
            "expectation": true
        },
        {
            "inputName": "number 0x7F",
            "inputValue": 0x7F,
            "expectation": true
        },
        {
            "inputName": "number 0x80",
            "inputValue": 0x80,
            "expectation": false
        },
        {
            "inputName": "number -0x81",
            "inputValue": -0x81,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "int16": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number -0x8000",
            "inputValue": -0x8000,
            "expectation": true
        },
        {
            "inputName": "number 0x7FFF",
            "inputValue": 0x7FFF,
            "expectation": true
        },
        {
            "inputName": "number 0x8000",
            "inputValue": 0x8000,
            "expectation": false
        },
        {
            "inputName": "number -0x8001",
            "inputValue": -0x8001,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "int32": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number -0x80000000",
            "inputValue": -0x80000000,
            "expectation": true
        },
        {
            "inputName": "number 0x7FFFFFFF",
            "inputValue": 0x7FFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 0x80000000",
            "inputValue": 0x80000000,
            "expectation": false
        },
        {
            "inputName": "number -0x80000001",
            "inputValue": -0x80000001,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "int64": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number -0x8000000000000000",
            "inputValue": -0x8000000000000000,
            "expectation": true
        },
        {
            "inputName": "number 0x7FFFFFFF",
            "inputValue": 0x7FFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 0x7FFFFFFFFFFFFFFF",
            "inputValue": 0x7FFFFFFFFFFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "uint": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "uint8": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 0xFF",
            "inputValue": 0xFF,
            "expectation": true
        },
        {
            "inputName": "number 0x100",
            "inputValue": 0x100,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "uint16": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 0xFFFF",
            "inputValue": 0xFFFF,
            "expectation": true
        },
        {
            "inputName": "number 0x10000",
            "inputValue": 0x10000,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "uint32": [

        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 0xFFFFFFFF",
            "inputValue": 0xFFFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 0x100000000",
            "inputValue": 0x100000000,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "uint64": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 0xFFFFFFFFFFFFFFFF",
            "inputValue": 0xFFFFFFFFFFFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 0x7FFFFFFF",
            "inputValue": 0x7FFFFFFF,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "safe_int": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number 9007199254740991",
            "inputValue": 9007199254740991,
            "expectation": true
        },
        {
            "inputName": "number -9007199254740991",
            "inputValue": -9007199254740991,
            "expectation": true
        },
        {
            "inputName": "number 9007199254740992",
            "inputValue": 9007199254740992,
            "expectation": false
        },
        {
            "inputName": "number -9007199254740992",
            "inputValue": -9007199254740992,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "safe_uint": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 9007199254740991",
            "inputValue": 9007199254740991,
            "expectation": true
        },
        {
            "inputName": "number 9007199254740992",
            "inputValue": 9007199254740992,
            "expectation": false
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": false
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "float": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number 120312",
            "inputValue": 120312,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": true
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": true
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "ufloat": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": false
        },
        {
            "inputName": "number 120312",
            "inputValue": 120312,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": true
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": false
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "number": [
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number 120312",
            "inputValue": 120312,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": true
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": true
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "numeric": [
        {
            "inputName": "string '120312'",
            "inputValue": "120312",
            "expectation": true
        },
        {
            "inputName": "string '2.23'",
            "inputValue": "2.23",
            "expectation": true
        },
        {
            "inputName": "string '2.23.4'",
            "inputValue": "2.23.4",
            "expectation": false
        },
        {
            "inputName": "number -1",
            "inputValue": -1,
            "expectation": true
        },
        {
            "inputName": "number 120312",
            "inputValue": 120312,
            "expectation": true
        },
        {
            "inputName": "number 1.23",
            "inputValue": 1.23,
            "expectation": true
        },
        {
            "inputName": "number -1.23",
            "inputValue": -1.23,
            "expectation": true
        },
        ...defaultItemss({
            "number 0": true,
            "number 1": true
        })
    ],
    "void": [
        ...defaultItemss({
            "undefined": true
        })
    ],
    "optional": [
        ...defaultItemss({
            "undefined": true
        })
    ],
    "undefined": [
        ...defaultItemss({
            "undefined": true
        })
    ],
    "required": [
        ...defaultItemss({
            "true": true,
            "false": true,
            "null": true,
            "empty array": true,
            "string 'hello'": true,
            "empty string": true,
            "object": true,
            "number 0": true,
            "number 1": true
        })
    ],
    "null": [
        ...defaultItemss({
            "null": true
        })
    ],
    "array": [
        {
            "inputName": "[string, number]",
            "inputValue": ["-1.23", 123123],
            "expectation": true
        },
        ...defaultItemss({
            "empty array": true
        })
    ],
    "struct": [
        ...defaultItemss({
            "object": true
        })
    ],
    "decimal": [
        {
            "inputName": "number 1.00",
            "inputValue": 1.00,
            "expectation": false
        },
        {
            "inputName": "string '1.00'",
            "inputValue": "1.00",
            "expectation": true
        },
        {
            "inputName": "string '+1.00'",
            "inputValue": "+1.00",
            "expectation": true
        },
        {
            "inputName": "string '0.00'",
            "inputValue": "0.00",
            "expectation": true
        },
        {
            "inputName": "string '10.00'",
            "inputValue": "10.00",
            "expectation": true
        },
        {
            "inputName": "string '-10.00'",
            "inputValue": "-10.00",
            "expectation": true
        },
        {
            "inputName": "string '010.00'",
            "inputValue": "010.00",
            "expectation": false
        },
        {
            "inputName": "string '.00'",
            "inputValue": ".00",
            "expectation": false
        },
        {
            "inputName": "string '0.'",
            "inputValue": "0.",
            "expectation": false
        },
        {
            "inputName": "string '0.00.0'",
            "inputValue": "0.00.0",
            "expectation": false
        },
        ...defaultItemss({})
    ],
    "decimal(5)": [
        {
            "inputName": "number 1.00",
            "inputValue": 1.00,
            "expectation": false
        },
        {
            "inputName": "string '1.00'",
            "inputValue": "1.00",
            "expectation": true
        },
        {
            "inputName": "string '0.00'",
            "inputValue": "0.00",
            "expectation": true
        },
        {
            "inputName": "string '10.00'",
            "inputValue": "10.00",
            "expectation": true
        },
        {
            "inputName": "string '-10.00'",
            "inputValue": "-10.00",
            "expectation": true
        },
        {
            "inputName": "string '10000'",
            "inputValue": "10000",
            "expectation": true
        },
        {
            "inputName": "string '100000'",
            "inputValue": "100000",
            "expectation": false
        },
        {
            "inputName": "string '00001.0'",
            "inputValue": "00001.0",
            "expectation": false
        },
        {
            "inputName": "string '1.00123'",
            "inputValue": "1.00123",
            "expectation": false
        },
        {
            "inputName": "string '010.00'",
            "inputValue": "010.00",
            "expectation": false
        },
        {
            "inputName": "string '.00'",
            "inputValue": ".00",
            "expectation": false
        },
        {
            "inputName": "string '0.'",
            "inputValue": "0.",
            "expectation": false
        },
        {
            "inputName": "string '0.00.0'",
            "inputValue": "0.00.0",
            "expectation": false
        },
        ...defaultItemss({})
    ],
    "decimal(5, 2)": [
        {
            "inputName": "number 1.00",
            "inputValue": 1.00,
            "expectation": false
        },
        {
            "inputName": "string '1.00'",
            "inputValue": "1.00",
            "expectation": true
        },
        {
            "inputName": "string '0.00'",
            "inputValue": "0.00",
            "expectation": true
        },
        {
            "inputName": "string '10.00'",
            "inputValue": "10.00",
            "expectation": true
        },
        {
            "inputName": "string '+10.00'",
            "inputValue": "+10.00",
            "expectation": true
        },
        {
            "inputName": "string '100.12'",
            "inputValue": "100.12",
            "expectation": true
        },
        {
            "inputName": "string '-100.12'",
            "inputValue": "-100.12",
            "expectation": true
        },
        {
            "inputName": "string '1100.1'",
            "inputValue": "1100.1",
            "expectation": false
        },
        {
            "inputName": "string '11.123'",
            "inputValue": "10.123",
            "expectation": false
        },
        {
            "inputName": "string '100000'",
            "inputValue": "100000",
            "expectation": false
        },
        {
            "inputName": "string '00001.0'",
            "inputValue": "00001.0",
            "expectation": false
        },
        {
            "inputName": "string '1.00123'",
            "inputValue": "1.00123",
            "expectation": false
        },
        {
            "inputName": "string '010.00'",
            "inputValue": "010.00",
            "expectation": false
        },
        {
            "inputName": "string '.00'",
            "inputValue": ".00",
            "expectation": false
        },
        {
            "inputName": "string '0.'",
            "inputValue": "0.",
            "expectation": false
        },
        {
            "inputName": "string '0.00.0'",
            "inputValue": "0.00.0",
            "expectation": false
        },
        ...defaultItemss({})
    ],
    "string{}": [
        {
            "inputName": JSON.stringify({
                "a": "bbbb",
                "b": "ccccc"
            }),
            "inputValue": {
                "a": "bbbb",
                "b": "ccccc"
            },
            "expectation": true
        },
        {
            "inputName": JSON.stringify({
                "a": "bbbb",
                "b": 321
            }),
            "inputValue": {
                "a": "bbbb",
                "b": 321
            },
            "expectation": false
        },
        {
            "inputName": "[string, string, string]",
            "inputValue": ["a", "b", "c"],
            "expectation": false
        },
        ...defaultItemss({
            "object": true
        })
    ],
    "string[]": [
        {
            "inputName": "[string, string]",
            "inputValue": ["a", "123"],
            "expectation": true
        },
        {
            "inputName": "[string]",
            "inputValue": ["a"],
            "expectation": true
        },
        {
            "inputName": "[string, number]",
            "inputValue": ["a", 123],
            "expectation": false
        },
        ...defaultItemss({
            "empty array": true
        })
    ],
    "string[0]": [
        {
            "inputName": "[string]",
            "inputValue": ["a"],
            "expectation": false
        },
        {
            "inputName": "[string, number]",
            "inputValue": ["a", 123],
            "expectation": false
        },
        ...defaultItemss({
            "empty array": true
        })
    ],
    "string[3]": [
        {
            "inputName": "[string, string, string]",
            "inputValue": ["a", "b", "c"],
            "expectation": true
        },
        {
            "inputName": "[string, string, number]",
            "inputValue": ["a", "b", 123],
            "expectation": false
        },
        {
            "inputName": "[string, string]",
            "inputValue": ["a", "b"],
            "expectation": false
        },
        {
            "inputName": "[string]",
            "inputValue": ["a"],
            "expectation": false
        },
        {
            "inputName": "[string, number]",
            "inputValue": ["a", 123],
            "expectation": false
        },
        ...defaultItemss({})
    ],
    "string[0,3]": [
        {
            "inputName": "[string, string, string]",
            "inputValue": ["a", "b", "c"],
            "expectation": true
        },
        {
            "inputName": "[string, string, number]",
            "inputValue": ["a", "b", 123],
            "expectation": false
        },
        {
            "inputName": "[string, string]",
            "inputValue": ["a", "b"],
            "expectation": true
        },
        {
            "inputName": "[string]",
            "inputValue": ["a"],
            "expectation": true
        },
        {
            "inputName": "[string, number]",
            "inputValue": ["a", 123],
            "expectation": false
        },
        ...defaultItemss({
            "empty array": true
        })
    ],
    "string(1,5)[0,3]": [
        {
            "inputName": "[string, string, string]",
            "inputValue": ["a", "b", "c"],
            "expectation": true
        },
        {
            "inputName": "[string, string, number]",
            "inputValue": ["a", "b", 123],
            "expectation": false
        },
        {
            "inputName": "[string, string]",
            "inputValue": ["a", "b"],
            "expectation": true
        },
        {
            "inputName": "[string, string, string(7)]",
            "inputValue": ["a", "b", "aaabbbc"],
            "expectation": false
        },
        {
            "inputName": "[string]",
            "inputValue": ["a"],
            "expectation": true
        },
        {
            "inputName": "[string, number]",
            "inputValue": ["a", 123],
            "expectation": false
        },
        ...defaultItemss({
            "empty array": true
        })
    ],
    "?string": [
        {
            "inputName": "string 'fine'",
            "inputValue": "fine",
            "expectation": true
        },
        ...defaultItemss({
            "undefined": true,
            "empty string": true,
            "string 'hello'": true
        })
    ]
};

export default function testElementalTypes(): void {

    describe("Elemental Types", function() {

        const compile = TypeGuard.createJavaScriptCompiler();

        for (let rule in testItems) {

            describe(rule, function() {

                const check = compile<any>(rule);

                for (let item of testItems[rule].sort((a, b) => a.expectation ? -1 : 1)) {

                    it(`${
                        item.expectation ? "OK" : "FAILED"
                    } when input ${
                        item.inputName
                    }.`, function() {

                        assert.equal(
                            check(item.inputValue),
                            item.expectation
                        );
                    });
                }
            });
        }
    });
}
