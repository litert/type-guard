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
            'name': '$.type ',
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
            'name': 'Pre-defined IPv4 Address Checker',
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
    ]
};

export default createTestDefinition(testItems);
