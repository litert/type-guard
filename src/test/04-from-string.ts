import { createTestDefinition, defaultItemss, ITestSuite } from "./abstracts";

const testItems: ITestSuite = {

    name: "Tuple",
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
    ]
};

export default createTestDefinition(testItems);
