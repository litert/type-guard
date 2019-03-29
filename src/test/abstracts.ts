export interface TestItem {

    inputName: string;

    inputValue: any;

    expectation: boolean;
}

export function defaultItemss(items: Record<string, boolean>): TestItem[] {

    return [
        {
            "inputName": "true",
            "inputValue": true,
            "expectation": items["true"] || false
        },
        {
            "inputName": "false",
            "inputValue": false,
            "expectation": items["false"] || false
        },
        {
            "inputName": "undefined",
            "inputValue": undefined,
            "expectation": items["undefined"] || false
        },
        {
            "inputName": "null",
            "inputValue": null,
            "expectation": items["null"] || false
        },
        {
            "inputName": "array",
            "inputValue": [],
            "expectation": items["array"] || false
        },
        {
            "inputName": "string 'hello'",
            "inputValue": "hello",
            "expectation": items["string 'hello'"] || false
        },
        {
            "inputName": "empty string",
            "inputValue": "",
            "expectation": items["empty string"] || false
        },
        {
            "inputName": "object",
            "inputValue": {},
            "expectation": items["object"] || false
        },
        {
            "inputName": "number 0",
            "inputValue": 0,
            "expectation": items["number 0"] || false
        },
        {
            "inputName": "number 1",
            "inputValue": 1,
            "expectation": items["number 1"] || false
        }
    ];
}
