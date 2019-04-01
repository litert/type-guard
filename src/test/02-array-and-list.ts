import { createTestDefinition, defaultItemss, ITestSuite } from "./abstracts";

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
        }
    ]
};

export default createTestDefinition(testItems);
