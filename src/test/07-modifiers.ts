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
                    title: JSON.stringify('123'),
                    value: '123',
                    expect: true
                },
                {
                    title: JSON.stringify({ 'a': 123 }),
                    value: { 'a': 123 },
                    expect: true
                },
                {
                    title: JSON.stringify({ 'a': 123 }),
                    value: { 'a': 123 },
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
                    title: JSON.stringify('123'),
                    value: '123',
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
                    title: JSON.stringify([{ 'a': 'x' }, { 'a': 'c', 'b': 'x' }]),
                    value: [{ 'a': 'x' }, { 'a': 'c', 'b': 'x' }],
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
                    title: JSON.stringify({ 'a': { 'b': 'c', 'd': 'ccc' } }),
                    value: { 'a': { 'b': 'c', 'd': 'ccc' } },
                    expect: true
                }
            ]
        },
        {
            'name': '$.not with string and literal 0',
            'rule': ['$.not', 'string', 0],
            'items': [
                {
                    title: 'string \'abc\'',
                    value: 'abc',
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
                    title: 'object {a: 213, b: 321}',
                    value: {
                        'a': 213,
                        'b': 321
                    },
                    expect: true
                },
                {
                    title: 'object {a: 213, b: "321"}',
                    value: {
                        'a': 213,
                        'b': '321'
                    },
                    expect: false
                },
                {
                    title: 'object {a: 213, b: "321"}',
                    value: {
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
                    title: 'String: 1.1.1.1',
                    value: '1.1.1.1',
                    expect: true
                },
                {
                    title: 'String: 255.255.255.255',
                    value: '255.255.255.255',
                    expect: true
                },
                {
                    title: 'String: 0.0.0.0',
                    value: '0.0.0.0',
                    expect: true
                },
                {
                    title: 'String: 2552.1.1.1',
                    value: '2552.1.1.1',
                    expect: false
                },
                {
                    title: 'String: 256.1.1.1',
                    value: '256.1.1.1',
                    expect: false
                },
                {
                    title: 'String: .1.1.1',
                    value: '.1.1.1',
                    expect: false
                },
                {
                    title: 'object {a: 213, b: 321}',
                    value: {
                        'a': 213,
                        'b': 321
                    },
                    expect: false
                },
                {
                    title: 'object {a: 213, b: "321"}',
                    value: {
                        'a': 213,
                        'b': '321'
                    },
                    expect: false
                },
                {
                    title: 'object {a: 213, b: "321"}',
                    value: {
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
                    title: 'String " aaa"',
                    value: ' aaa',
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
                    title: 'String " aaa"',
                    value: ' aaa',
                    expect: true
                },
                {
                    title: 'String " ffff"',
                    value: ' ffff',
                    expect: true
                },
                {
                    title: 'String " aa "',
                    value: ' aa ',
                    expect: true
                },
                {
                    title: 'String " a "',
                    value: ' a ',
                    expect: false
                },
                {
                    title: 'String " aaaaaaa "',
                    value: ' aaaaaaa ',
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
                    title: 'Integer 2',
                    value: 2,
                    expect: true
                },
                {
                    title: 'Integer 0x1111',
                    value: 0x1111,
                    expect: true
                },
                {
                    title: 'Integer -2',
                    value: -2,
                    expect: true
                },
                {
                    title: 'String "dddd"',
                    value: 'dddd',
                    expect: true
                },
                {
                    title: 'String "ss\\""',
                    value: 'ss"',
                    expect: true
                },
                {
                    title: 'String "ff"',
                    value: 'ff',
                    expect: true
                },
                {
                    title: 'String "ff\'"',
                    value: 'ff\'',
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
                    title: 'String " aaa"',
                    value: ' aaa',
                    expect: true
                },
                {
                    title: 'String " ffff"',
                    value: ' ffff',
                    expect: true
                },
                {
                    title: 'String " aa "',
                    value: ' aa ',
                    expect: true
                },
                {
                    title: 'String " a "',
                    value: ' a ',
                    expect: false
                },
                {
                    title: 'String " aaaaaaa "',
                    value: ' aaaaaaa ',
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
                    title: 'invalid format',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum',
            'rule': ['$.enum', '==123', '=123', 'int', 3333333, null, true],
            'items': [
                {
                    title: 'string "==123"',
                    value: '==123',
                    expect: true
                },
                {
                    title: 'string "123"',
                    value: '123',
                    expect: false
                },
                {
                    title: 'string "=123"',
                    value: '=123',
                    expect: true
                },
                {
                    title: 'string "int"',
                    value: 'int',
                    expect: true
                },
                {
                    title: 'string "uint"',
                    value: 'uint',
                    expect: false
                },
                {
                    title: 'integer 3333333',
                    value: 3333333,
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
                    title: 'invalid empty candidate list',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with object candidate',
            'rule': ['$.enum', {}],
            'items': [
                {
                    title: 'object as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with array candidate',
            'rule': ['$.enum', []],
            'items': [
                {
                    title: 'array as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with undefined candidate',
            'rule': ['$.enum', undefined],
            'items': [
                {
                    title: 'undefined as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with function candidate',
            'rule': ['$.enum', () => true],
            'items': [
                {
                    title: 'function as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with bigint candidate',
            'rule': ['$.enum', BigInt(123)],
            'items': [
                {
                    title: 'bigint as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': '$.enum with symbol candidate',
            'rule': ['$.enum', Symbol('123')],
            'items': [
                {
                    title: 'symbol as candidate',
                    value: '',
                    expect: 'throw'
                }
            ]
        },
    ]
};

export default createTestDefinition(testItems);
