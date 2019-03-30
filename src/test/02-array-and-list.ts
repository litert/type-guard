import { createTestDefinition, defaultItemss, ITestSuite } from "./abstracts";

const testItems: ITestSuite = {

    name: "List & Array",
    sections: [

        {
            "name": "Fixed-length array",
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
        }
    ]
};

export default createTestDefinition(testItems);
