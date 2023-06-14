/**
 * Copyright 2023 Angus Fenying <fenying@litert.org>
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

import { createTestDefinition, defaultItems, ITestSuite } from './abstracts';

const testItems: ITestSuite = {

    name: 'Modifiers',
    sections: [

        {
            'name': '$.string',
            'rule': ['$.string', 'uint32', { 'a': 'uint32' }],
            'items': [
                {
                    inputName: JSON.stringify('123'),
                    inputValue: '123',
                    expect: true
                },
                {
                    inputName: JSON.stringify({ 'a': 123 }),
                    inputValue: { 'a': 123 },
                    expect: true
                },
                {
                    inputName: JSON.stringify({ 'a': 123 }),
                    inputValue: { 'a': 123 },
                    expect: true
                },
                ...defaultItems({
                    'number 1': true,
                    'number 0': true
                })
            ]
        },
        {
            'name': '$.string standalone',
            'rule': ['$.and', ['$.string', 'uint32'], 'uint32'],
            'items': [
                {
                    inputName: JSON.stringify('123'),
                    inputValue: '123',
                    expect: false
                }
            ]
        },
        {
            'name': '$.strict standalone',
            'rule': ['$.tuple', ['$.strict', {
                'a': 'string'
            }], {
                'a': 'string'
            }],
            'items': [
                {
                    inputName: JSON.stringify([{ 'a': 'x' }, { 'a': 'c', 'b': 'x' }]),
                    inputValue: [{ 'a': 'x' }, { 'a': 'c', 'b': 'x' }],
                    expect: true
                }
            ]
        },
        {
            'name': '$.equal standalone',
            'rule': ['$.and', ['$.equal', {
                'a': 'any'
            }], {
                'a': {
                    'b': 'string'
                }
            }],
            'items': [
                {
                    inputName: JSON.stringify({ 'a': { 'b': 'c', 'd': 'ccc' } }),
                    inputValue: { 'a': { 'b': 'c', 'd': 'ccc' } },
                    expect: true
                }
            ]
        },
        {
            'name': '$.not with string and literal 0',
            'rule': ['$.not', 'string', 0],
            'items': [
                {
                    inputName: 'string \'abc\'',
                    inputValue: 'abc',
                    expect: false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': false,
                    'number 0': false
                }, true)
            ]
        },
        {
            'name': '$.type with complex name',
            'rule': {
                'a': ['$.type', 'test:a.b-c', 'int'],
                'b': '@test:a.b-c',
            },
            'items': [
                {
                    inputName: 'object {a: 213, b: 321}',
                    inputValue: {
                        'a': 213,
                        'b': 321
                    },
                    expect: true
                },
                {
                    inputName: 'object {a: 213, b: "321"}',
                    inputValue: {
                        'a': 213,
                        'b': '321'
                    },
                    expect: false
                },
                {
                    inputName: 'object {a: 213, b: "321"}',
                    inputValue: {
                        'a': 213,
                        'b': 777
                    },
                    expect: true
                },
                ...defaultItems({}, false)
            ]
        },
        {
            'name': '$.type pre-defined IPv4 Address Checker',
            'rule': '@ipv4_address',
            'items': [
                {
                    inputName: 'String: 1.1.1.1',
                    inputValue: '1.1.1.1',
                    expect: true
                },
                {
                    inputName: 'String: 255.255.255.255',
                    inputValue: '255.255.255.255',
                    expect: true
                },
                {
                    inputName: 'String: 0.0.0.0',
                    inputValue: '0.0.0.0',
                    expect: true
                },
                {
                    inputName: 'String: 2552.1.1.1',
                    inputValue: '2552.1.1.1',
                    expect: false
                },
                {
                    inputName: 'String: 256.1.1.1',
                    inputValue: '256.1.1.1',
                    expect: false
                },
                {
                    inputName: 'String: .1.1.1',
                    inputValue: '.1.1.1',
                    expect: false
                },
                {
                    inputName: 'object {a: 213, b: 321}',
                    inputValue: {
                        'a': 213,
                        'b': 321
                    },
                    expect: false
                },
                {
                    inputName: 'object {a: 213, b: "321"}',
                    inputValue: {
                        'a': 213,
                        'b': '321'
                    },
                    expect: false
                },
                {
                    inputName: 'object {a: 213, b: "321"}',
                    inputValue: {
                        'a': 213,
                        'b': 777
                    },
                    expect: false
                },
                ...defaultItems({}, false)
            ]
        },
        {
            'name': '$.type pre-defined type "trim_string" without args',
            'rule': '@trim_string',
            'items': [
                {
                    inputName: 'String " aaa"',
                    inputValue: ' aaa',
                    expect: true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true,
                }, false)
            ]
        },
        {
            'name': '$.type pre-defined type "trim_string" with full args (2, 5)',
            'rule': '@trim_string(2, 5)',
            'items': [
                {
                    inputName: 'String " aaa"',
                    inputValue: ' aaa',
                    expect: true
                },
                {
                    inputName: 'String " ffff"',
                    inputValue: ' ffff',
                    expect: true
                },
                {
                    inputName: 'String " aa "',
                    inputValue: ' aa ',
                    expect: true
                },
                {
                    inputName: 'String " a "',
                    inputValue: ' a ',
                    expect: false
                },
                {
                    inputName: 'String " aaaaaaa "',
                    inputValue: ' aaaaaaa ',
                    expect: false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false,
                }, false)
            ]
        },
        {
            'name': '$.type pre-defined type "enum" with args (1, 2, 3, "dddd", true, false, null, -2, 0x1111, "ss\\"", \'ff\', \'ff\\\'\')',
            'rule': '@enum(1, 2, 3,     "dddd", true, false, null, -2, 0x1111, "ss\\"", \'ff\', \'ff\\\'\')',
            'items': [
                {
                    inputName: 'Integer 2',
                    inputValue: 2,
                    expect: true
                },
                {
                    inputName: 'Integer 0x1111',
                    inputValue: 0x1111,
                    expect: true
                },
                {
                    inputName: 'Integer -2',
                    inputValue: -2,
                    expect: true
                },
                {
                    inputName: 'String "dddd"',
                    inputValue: 'dddd',
                    expect: true
                },
                {
                    inputName: 'String "ss\\""',
                    inputValue: 'ss"',
                    expect: true
                },
                {
                    inputName: 'String "ff"',
                    inputValue: 'ff',
                    expect: true
                },
                {
                    inputName: 'String "ff\'"',
                    inputValue: 'ff\'',
                    expect: true
                },
                ...defaultItems({
                    'number 1': true,
                    'true': true,
                    'false': true,
                    'null': true,
                }, false)
            ]
        },
        {
            'name': '$.type pre-defined type "trim_string" with args (2)',
            'rule': '@trim_string(2)',
            'items': [
                {
                    inputName: 'String " aaa"',
                    inputValue: ' aaa',
                    expect: true
                },
                {
                    inputName: 'String " ffff"',
                    inputValue: ' ffff',
                    expect: true
                },
                {
                    inputName: 'String " aa "',
                    inputValue: ' aa ',
                    expect: true
                },
                {
                    inputName: 'String " a "',
                    inputValue: ' a ',
                    expect: false
                },
                {
                    inputName: 'String " aaaaaaa "',
                    inputValue: ' aaaaaaa ',
                    expect: true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false,
                }, false)
            ]
        },
        {
            'name': '$.type with unsupported characters in type name',
            'rule': {
                'a': ['$.type', 'test=123', 'int'],
                'b': '@test:a',
            },
            'items': [
                {
                    inputName: 'invalid format',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum',
            'rule': ['$.enum', '==123', '=123', 'int', 3333333, null, true],
            'items': [
                {
                    inputName: 'string "==123"',
                    inputValue: '==123',
                    expect: true
                },
                {
                    inputName: 'string "123"',
                    inputValue: '123',
                    expect: false
                },
                {
                    inputName: 'string "=123"',
                    inputValue: '=123',
                    expect: true
                },
                {
                    inputName: 'string "int"',
                    inputValue: 'int',
                    expect: true
                },
                {
                    inputName: 'string "uint"',
                    inputValue: 'uint',
                    expect: false
                },
                {
                    inputName: 'integer 3333333',
                    inputValue: 3333333,
                    expect: true
                },
                ...defaultItems({
                    'null': true,
                    'true': true
                }, false)
            ]
        },
        {
            'name': '$.enum with empty candidate list',
            'rule': ['$.enum'],
            'items': [
                {
                    inputName: 'invalid empty candidate list',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with object candidate',
            'rule': ['$.enum', {}],
            'items': [
                {
                    inputName: 'object as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with array candidate',
            'rule': ['$.enum', []],
            'items': [
                {
                    inputName: 'array as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with undefined candidate',
            'rule': ['$.enum', undefined],
            'items': [
                {
                    inputName: 'undefined as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with function candidate',
            'rule': ['$.enum', () => true],
            'items': [
                {
                    inputName: 'function as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with bigint candidate',
            'rule': ['$.enum', BigInt(123)],
            'items': [
                {
                    inputName: 'bigint as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with symbol candidate',
            'rule': ['$.enum', Symbol('123')],
            'items': [
                {
                    inputName: 'symbol as candidate',
                    inputValue: '',
                    expect: 'throw'
                }
            ]
        },
    ]
};

export default createTestDefinition(testItems);
