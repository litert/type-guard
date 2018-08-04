/*
 * Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// tslint:disable:no-console
import * as TypeGuard from ".";

let compiler = TypeGuard.createCompiler4JavaScript();

interface ITestItem {

    rule: any;

    items: Array<{

        input: any;

        output: boolean;
    }>;
}

const Tests: Record<string, ITestItem> = {
    "isUInt8": {
        rule: "uint8",
        items: [
            {
                input: -1,
                output: false
            },
            {
                input: 0,
                output: true
            },
            {
                input: 1,
                output: true
            },
            {
                input: "123",
                output: false
            },
            {
                input: 10,
                output: true
            },
            {
                input: 127,
                output: true
            },
            {
                input: 128,
                output: true
            },
            {
                input: 255,
                output: true
            },
            {
                input: 256,
                output: false
            }
        ]
    },
    "isInt8": {
        rule: "int8",
        items: [
            {
                input: -129,
                output: false
            },
            {
                input: -128,
                output: true
            },
            {
                input: -127,
                output: true
            },
            {
                input: -1,
                output: true
            },
            {
                input: 0,
                output: true
            },
            {
                input: 23,
                output: true
            },
            {
                input: 127,
                output: true
            },
            {
                input: 128,
                output: false
            },
            {
                input: 129,
                output: false
            },
            {
                input: "123",
                output: false
            },
            {
                input: "333",
                output: false
            }
        ]
    },
    "isString": {
        rule: "string",
        items: [
            {
                input: "a",
                output: true
            },
            {
                input: "",
                output: true
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            },
            {
                input: true,
                output: false
            },
            {
                input: [
                    ""
                ],
                output: false
            }
        ]
    },
    "isASCIIString": {
        rule: "ascii_string",
        items: [
            {
                input: "a",
                output: true
            },
            {
                input: "heihei",
                output: true
            },
            {
                input: "好",
                output: false
            },
            {
                input: "a我b",
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            },
            {
                input: true,
                output: false
            },
            {
                input: [
                    ""
                ],
                output: false
            }
        ]
    },
    "isStringArray": {
        rule: "string[]",
        items: [
            {
                input: [
                    "a",
                    ""
                ],
                output: true
            },
            {
                input: [],
                output: true
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isStringMap": {
        rule: "string{}",
        items: [
            {
                input: {
                    "a": "c",
                    "b": "d"
                },
                output: true
            },
            {
                input: {
                    "a": "c",
                    "b": 123
                },
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isStringDict": {
        rule: [
            "$.dict",
            [
                "a",
                "b"
            ],
            "string"
        ],
        items: [
            {
                input: {
                    "a": "c",
                    "b": "d"
                },
                output: true
            },
            {
                input: {
                    "a": "c",
                    "c": "d"
                },
                output: false
            },
            {
                input: {
                    "a": "c",
                    "b": 123
                },
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isOptionalString": {
        rule: [
            "string",
            "void"
        ],
        items: [
            {
                input: undefined,
                output: true
            },
            {
                input: "",
                output: true
            },
            {
                input: "a",
                output: true
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isImplicitOptionalString": {
        rule: "?string",
        items: [
            {
                input: undefined,
                output: true
            },
            {
                input: "",
                output: true
            },
            {
                input: "a",
                output: true
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isPoint": {
        rule: {
            "x": "float",
            "y": "float"
        },
        items: [
            {
                input: {
                    "x": 1.2,
                    "y": 4
                },
                output: true
            },
            {
                input: {
                    "x": 3,
                    "y": 113.2
                },
                output: true
            },
            {
                input: undefined,
                output: false
            },
            {
                input: {
                    "x": 1.2,
                    "y": "4"
                },
                output: false
            },
            {
                input: "",
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isPointStrict": {
        rule: [
            "$.struct",
            {
                "x": "float",
                "y": "float"
            }
        ],
        items: [
            {
                input: {
                    "x": 1.2,
                    "y": 4
                },
                output: true
            },
            {
                input: {
                    "x": 3,
                    "y": 113.2
                },
                output: true
            },
            {
                input: {
                    "x": 3,
                    "y": 113.2,
                    "z": 223.5
                },
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: {
                    "x": 1.2,
                    "y": "4"
                },
                output: false
            },
            {
                input: "",
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isPointArray": {
        rule: [
            "$.array",
            {
                "x": "float",
                "y": "float"
            }
        ],
        items: [
            {
                input: [
                    {
                        "x": 1.2,
                        "y": 4
                    }
                ],
                output: true
            },
            {
                input: [
                    {
                        "x": 1.2,
                        "y": 4
                    },
                    {
                        "x": 1.2,
                        "y": "4"
                    }
                ],
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: {
                    "x": 1.2,
                    "y": 4
                },
                output: false
            },
            {
                input: [],
                output: true
            },
            {
                input: "",
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isPointMap": {
        rule: [
            "$.map",
            {
                "x": "float",
                "y": "float"
            }
        ],
        items: [
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    }
                },
                output: true
            },
            {
                input: [
                    {
                        "x": 1.2,
                        "y": 4
                    },
                    {
                        "x": 1.2,
                        "y": "4"
                    }
                ],
                output: false
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": "4"
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    }
                },
                output: false
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": false
                },
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: {
                    "x": 1.2,
                    "y": 4
                },
                output: false
            },
            {
                input: [],
                output: false
            },
            {
                input: "",
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "isNumberOrPointMap": {
        rule: [
            "$.map",
            {
                "x": "float",
                "y": "float"
            },
            "uint32"
        ],
        items: [
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    },
                    "c": 123
                },
                output: true
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    }
                },
                output: true
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    },
                    "d": 55.02
                },
                output: false
            },
            {
                input: [
                    {
                        "x": 1.2,
                        "y": 4
                    },
                    {
                        "x": 1.2,
                        "y": "4"
                    }
                ],
                output: false
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": "4"
                    },
                    "b": {
                        "x": 1.2,
                        "y": 4
                    }
                },
                output: false
            },
            {
                input: {
                    "a": {
                        "x": 1.2,
                        "y": 4
                    },
                    "b": false
                },
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: {
                    "x": 1.2,
                    "y": 4
                },
                output: false
            },
            {
                input: [],
                output: false
            },
            {
                input: "",
                output: false
            },
            {
                input: "a",
                output: false
            },
            {
                input: [
                    "",
                    123
                ],
                output: false
            },
            {
                input: 123,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            }
        ]
    },
    "orTest": {
        rule: [
            "$.or",
            "string",
            "boolean"
        ],
        items: [
            {
                input: "abc",
                output: true
            },
            {
                input: 1231,
                output: false
            },
            {
                input: true,
                output: true
            },
            {
                input: false,
                output: true
            },
            {
                input: "",
                output: true
            },
            {
                input: null,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: undefined,
                output: false
            }
        ]
    },
    "orImplicitTest": {
        rule: [
            "string",
            "boolean"
        ],
        items: [
            {
                input: "abc",
                output: true
            },
            {
                input: 1231,
                output: false
            },
            {
                input: true,
                output: true
            },
            {
                input: false,
                output: true
            },
            {
                input: "",
                output: true
            },
            {
                input: null,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: undefined,
                output: false
            }
        ]
    },
    "andTest": {
        rule: [
            [
                "$.and",
                "string",
                [
                    "=male",
                    "=female"
                ]
            ],
            [
                "uint"
            ]
        ],
        items: [
            {
                input: "abc",
                output: false
            },
            {
                input: 1231,
                output: true
            },
            {
                input: true,
                output: false
            },
            {
                input: false,
                output: false
            },
            {
                input: "333",
                output: false
            },
            {
                input: "male",
                output: true
            },
            {
                input: "female",
                output: true
            },
            {
                input: null,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: undefined,
                output: false
            }
        ]
    },
    "tupleTest": {
        rule: [
            "$.tuple",
            "string",
            "int8"
        ],
        items: [
            {
                input: [
                    "a",
                    1
                ],
                output: true
            },
            {
                input: [
                    321,
                    1
                ],
                output: false
            },
            {
                input: [
                    "a",
                    -129
                ],
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            },
            {
                input: true,
                output: false
            }
        ]
    },
    "tupleTest1": {
        rule: [
            "$.tuple",
            "string",
            123
        ],
        items: [
            {
                input: [
                    "a",
                    1
                ],
                output: false
            },
            {
                input: [
                    "a",
                    123
                ],
                output: true
            },
            {
                input: [
                    321,
                    1
                ],
                output: false
            },
            {
                input: [
                    "a",
                    -127
                ],
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: false,
                output: false
            },
            {
                input: true,
                output: false
            }
        ]
    },
    "objectSubMapTest1": {
        rule: {
            "name": "string",
            "age?": [
                "$.and",
                "int",
                "|value between 1 100"
            ],
            "friends->{}?": {
                "name": "string",
                "gender": [
                    "=male",
                    "=female",
                    "=other"
                ]
            }
        },
        items: [
            {
                input: {
                    "name": "Angus",
                    "age": 24,
                    "friends": {
                        "Edith": {
                            "name": "Edith",
                            "gender": "female"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "male"
                        }
                    }
                },
                output: true
            },
            {
                input: {
                    "name": "Angus",
                    "friends": {
                        "Edith": {
                            "name": "Edith",
                            "gender": "female"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "male"
                        }
                    }
                },
                output: true
            },
            {
                input: {
                    "name": "Angus",
                    "age": 24
                },
                output: true
            },
            {
                input: {
                    "name": "Angus",
                    "age": 242,
                    "friends": {
                        "Edith": {
                            "name": "Edith",
                            "gender": "female"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "male"
                        }
                    }
                },
                output: false
            },
            {
                input: {
                    "name": "Angus",
                    "friends": {
                        "Edith": {
                            "name": "Edith",
                            "gender": "female"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "male"
                        }
                    }
                },
                output: true
            },
            {
                input: {
                    "name": "Angus",
                    "friends": {
                        "Edith": {
                            "name": "Edith"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "male"
                        }
                    }
                },
                output: false
            },
            {
                input: {
                    "name": "Angus",
                    "age": 24,
                    "friends": {
                        "Edith": {
                            "name": "Edith",
                            "gender": "female"
                        },
                        "Yubo": {
                            "name": "Yubo",
                            "gender": "secret"
                        }
                    }
                },
                output: false
            }
        ]
    },
    "strictObjectTest": {
        rule: {
            "a": "string",
            "b->(=)": {
                "c?": "int",
                "d->(=)?": {
                    "e": "?uint"
                }
            }
        },
        items: [
            {
                input: {
                    "a": "hello",
                    "b": {
                        "c": 321
                    }
                },
                output: true
            },
            {
                input: {
                    "a": "hello",
                    "b": {
                        "c": 321,
                        "d": {
                            "e": 333
                        }
                    }
                },
                output: true
            },
            {
                input: {
                    "a": "hello",
                    "b": {
                        "d": {
                            "e": 333
                        }
                    }
                },
                output: true
            },
            {
                input: {
                    "a": "hello",
                    "b": {
                        "c": 321,
                        "e": {
                            "d": 333
                        }
                    }
                },
                output: false
            },
            {
                input: {
                    "a": "hello",
                    "b": {
                        "c": 321,
                        "d": {}
                    }
                },
                output: true
            },
            {
                input: {
                    "a": "hello",
                    "b": {
                        "c": 321,
                        "d": {
                            "e": 44,
                            "f": true
                        }
                    }
                },
                output: false
            }
        ]
    },
    "embededArrayTest": {
        rule: "string[][]",
        items: [
            {
                input: [
                    [
                        "a"
                    ],
                    [],
                    [
                        "b"
                    ]
                ],
                output: true
            },
            {
                input: [
                    [
                        "a"
                    ],
                    "a",
                    [
                        "b"
                    ]
                ],
                output: false
            }
        ]
    },
    "valueofKeyTest": {
        rule: {
            "method": [
                "=email",
                "=password"
            ],
            "$.valueof:method": "string"
        },
        items: [
            {
                input: {
                    "method": "email",
                    "email": "fenying@litert.org"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": "hello world"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "valueofKeyStrictTest": {
        rule: [
            "$.struct",
            {
                "$.valueof:method": "string",
                "method": [
                    "=email",
                    "=password"
                ]
            }
        ],
        items: [
            {
                input: {
                    "method": "email",
                    "email": "fenying@litert.org"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": "hello world"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": "hello world",
                    "c": "dsad"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "valueofKeyStrictTest2": {
        rule: [
            "$.struct",
            {
                "$.valueof:method->[]": "string",
                "method": [
                    "=email",
                    "=password"
                ]
            }
        ],
        items: [
            {
                input: {
                    "method": "email",
                    "email": [
                        "fenying@litert.org"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ],
                    "c": "dsad"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "valueofKeyStrictTest3": {
        rule: [
            "$.struct",
            {
                "$.valueof:method->[]?": "string",
                "method": [
                    "=email",
                    "=password"
                ]
            }
        ],
        items: [
            {
                input: {
                    "method": "email",
                    "email": [
                        "fenying@litert.org"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ],
                    "c": "dsad"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "assertKeyTest1": {
        rule: {
            "method": [
                "=email",
                "=password"
            ],
            "$.valueof:method": "exists",
            "email?": "string[]",
            "password?": "string[]"
        },
        items: [
            {
                input: {
                    "method": "email",
                    "email": [
                        "fenying@litert.org"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ]
                },
                output: true
            },
            {
                input: {
                    "method": "password"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ],
                    "c": "dsad"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "assertStrictKeyTest1": {
        rule: [
            "$.struct",
            {
                "method": [
                    "=email",
                    "=password"
                ],
                "$.valueof:method": "exists",
                "$.virtual:email?": "string",
                "$.virtual:password?": "string"
            }
        ],
        items: [
            {
                input: {
                    "method": "email",
                    "email": "fenying@litert.org",
                    "password": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "email",
                    "email": "fenying@litert.org"
                },
                output: true
            },
            {
                input: {
                    "method": "password",
                    "password": "hello world"
                },
                output: true
            },
            {
                input: {
                    "method": "password"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "password": [
                        "hello world"
                    ],
                    "c": "dsad"
                },
                output: false
            },
            {
                input: {
                    "method": "password",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "method": "vvv",
                    "class": "hello world"
                },
                output: false
            },
            {
                input: {
                    "at": "vvv",
                    "class": "hello world"
                },
                output: false
            }
        ]
    },
    "extendFilterTest": {
        rule: "|uint between 0 10000000",
        items: [
            {
                input: 1,
                output: true
            },
            {
                input: 1111,
                output: true
            },
            {
                input: 1234567890,
                output: false
            },
            {
                input: undefined,
                output: false
            },
            {
                input: null,
                output: false
            },
            {
                input: -1,
                output: false
            },
            {
                input: 1.3,
                output: false
            },
            {
                input: true,
                output: false
            },
            {
                input: [
                    123
                ],
                output: false
            },
            {
                input: {a: 123},
                output: false
            }
        ]
    }
};

function runTestItem(
    name: string,
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

    for (let val of Tests[name].items) {

        console.log(`  > Input:     ${JSON.stringify(val.input)}`);
        console.log(`    Expected:  ${JSON.stringify(val.output)}`);
        console.log(`    Result:    ${
            verify(val.input) === val.output ? "PASSED" : "NOT-MATCHED"
        }\n`);
    }
}

function runAllTests(stopOnEntry?: boolean) {

    for (let name in Tests) {

        runTestItem(<any> name, stopOnEntry);
    }
}

runAllTests();
// runTestItem("assertStrictKeyTest1");
