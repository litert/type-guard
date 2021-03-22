/**
 * Copyright 2021 Angus.Fenying <fenying@litert.org>
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

import { createTestDefinition, defaultItemss, ITestSuite } from './abstracts';

const testItems: ITestSuite = {

    name: 'Structure',
    sections: [

        {
            'name': 'Empty object',
            'rule': {},
            'items': [
                {
                    inputName: 'Empty object',
                    inputValue: {},
                    expect: true
                },
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: true
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'object': true
                })
            ]
        },
        {
            'name': '1 property object',
            'rule': { 'a': 'uint32' },
            'items': [
                {
                    inputName: 'Empty object',
                    inputValue: {},
                    expect: false
                },
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: true
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'object': false
                })
            ]
        },
        {
            'name': '1 optional property object',
            'rule': { 'a?': 'uint32' },
            'items': [
                {
                    inputName: 'Empty object',
                    inputValue: {},
                    expect: true
                },
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: true
                },
                {
                    inputName: 'Object with one mismatch-type property',
                    inputValue: {'a': '123'},
                    expect: false
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'object': true
                })
            ]
        },
        {
            'name': 'Nested object',
            'rule': { 'a?': 'uint32', 'b': { 'c': 'string' } },
            'items': [
                {
                    inputName: 'Empty object',
                    inputValue: {},
                    expect: false
                },
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: false
                },
                {
                    inputName: 'Object with mismatch-typed nest property',
                    inputValue: {'a': 123, 'b': { 'c': 1232131 }},
                    expect: false
                },
                {
                    inputName: 'Object with one mismatch-typed property',
                    inputValue: {'a': '123', 'b': { 'c': 'ffff'} },
                    expect: false
                },
                {
                    inputName: 'Object with all corrected',
                    inputValue: {'a': 123, 'b': { 'c': 'ffff'} },
                    expect: true
                }
            ]
        },
        {
            'name': 'Strict object',
            'rule': ['$.strict', {
                'a': 'uint'
            }],
            'items': [
                {
                    inputName: 'Empty object',
                    inputValue: {},
                    expect: false
                },
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: true
                },
                {
                    inputName: 'Object with one mismatch-typed property',
                    inputValue: {'a': '123' },
                    expect: false
                },
                {
                    inputName: 'Object with 2 properties',
                    inputValue: {'a': 123, 'b': { 'c': 'ffff'} },
                    expect: false
                }
            ]
        },
        {
            'name': 'Strict object with nested properties',
            'rule': ['$.strict', {
                'a': 'uint',
                'b': {
                    'c': 'uint'
                }
            }],
            'items': [
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: false
                },
                {
                    inputName: 'Object with wrong type in nest',
                    inputValue: {'a': 123, 'b': { 'c': 'ffff'} },
                    expect: false
                },
                {
                    inputName: 'Object with all correct',
                    inputValue: {'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    inputName: 'Object with one more in nested',
                    inputValue: {'a': 123, 'b': { 'c': 123, 'd': '1213131' } },
                    expect: true
                }
            ]
        },
        {
            'name': 'Recursively-Strict object with nested properties',
            'rule': ['$.equal', {
                'a': 'uint',
                'b': {
                    'c': 'uint'
                }
            }],
            'items': [
                {
                    inputName: 'Object with one property',
                    inputValue: {'a': 123},
                    expect: false
                },
                {
                    inputName: 'Object with wrong type in nest',
                    inputValue: {'a': 123, 'b': { 'c': 'ffff'} },
                    expect: false
                },
                {
                    inputName: 'Object with all correct',
                    inputValue: {'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    inputName: 'Object with one more in nested',
                    inputValue: {'a': 123, 'b': { 'c': 123, 'd': '1213131' } },
                    expect: false
                }
            ]
        },
        {
            'name': 'Object with from-string modifier',
            'rule': ['$.string', {
                'a': 'uint',
                'b': {
                    'c': 'uint'
                }
            }],
            'items': [
                {
                    inputName: 'Object with all correct',
                    inputValue: {'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    inputName: 'Object with string incorrect-value',
                    inputValue: {'a': 123, 'b': { 'c': '123d' } },
                    expect: false
                },
                {
                    inputName: 'Object with string value',
                    inputValue: {'a': '123312312', 'b': { 'c': '123' } },
                    expect: true
                }
            ]
        },
        {
            'name': 'Object with from-string modifier',
            'rule': ['$.string', {
                'a': 'uint',
                'b': {
                    'c': 'uint'
                }
            }],
            'items': [
                {
                    inputName: 'Object with all correct',
                    inputValue: {'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    inputName: 'Object with string incorrect-value',
                    inputValue: {'a': 123, 'b': { 'c': '123d' } },
                    expect: false
                },
                {
                    inputName: 'Object with string value',
                    inputValue: {'a': '123312312', 'b': { 'c': '123' } },
                    expect: true
                }
            ]
        },
    ]
};

export default createTestDefinition(testItems);
