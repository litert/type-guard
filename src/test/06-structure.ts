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

    name: 'Structure',
    sections: [

        {
            'name': 'Empty object',
            'rule': {},
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: true
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: true
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'object': true
                })
            ]
        },
        {
            'name': '1 property object',
            'rule': { 'a': 'uint32' },
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: false
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: true
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'object': false
                })
            ]
        },
        {
            'name': '1 optional property object',
            'rule': { 'a?': 'uint32' },
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: true
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: true
                },
                {
                    title: 'Object with one mismatch-type property',
                    value: { 'a': '123' },
                    expect: false
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'object': true
                })
            ]
        },
        {
            'name': 'Nested object',
            'rule': { 'a?': 'uint32', 'b': { 'c': 'string' } },
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: false
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: false
                },
                {
                    title: 'Object with mismatch-typed nest property',
                    value: { 'a': 123, 'b': { 'c': 1232131 } },
                    expect: false
                },
                {
                    title: 'Object with one mismatch-typed property',
                    value: { 'a': '123', 'b': { 'c': 'ffff' } },
                    expect: false
                },
                {
                    title: 'Object with all corrected',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
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
                    title: 'Empty object',
                    value: {},
                    expect: false
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: true
                },
                {
                    title: 'Object with one mismatch-typed property',
                    value: { 'a': '123' },
                    expect: false
                },
                {
                    title: 'Object with 2 properties',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
                    expect: false
                }
            ]
        },
        {
            'name': 'Strict object with empty object',
            'rule': ['$.strict', {}],
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: true
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: false
                },
                {
                    title: 'Object with one mismatch-typed property',
                    value: { 'a': '123' },
                    expect: false
                },
                {
                    title: 'Object with 2 properties',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
                    expect: false
                }
            ]
        },
        {
            'name': 'Recursively-Strict object with empty object',
            'rule': ['$.equal', {}],
            'items': [
                {
                    title: 'Empty object',
                    value: {},
                    expect: true
                },
                {
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: false
                },
                {
                    title: 'Object with one mismatch-typed property',
                    value: { 'a': '123' },
                    expect: false
                },
                {
                    title: 'Object with 2 properties',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
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
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: false
                },
                {
                    title: 'Object with wrong type in nest',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
                    expect: false
                },
                {
                    title: 'Object with all correct',
                    value: { 'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    title: 'Object with one more in nested',
                    value: { 'a': 123, 'b': { 'c': 123, 'd': '1213131' } },
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
                    title: 'Object with one property',
                    value: { 'a': 123 },
                    expect: false
                },
                {
                    title: 'Object with wrong type in nest',
                    value: { 'a': 123, 'b': { 'c': 'ffff' } },
                    expect: false
                },
                {
                    title: 'Object with all correct',
                    value: { 'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    title: 'Object with one more in nested',
                    value: { 'a': 123, 'b': { 'c': 123, 'd': '1213131' } },
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
                    title: 'Object with all correct',
                    value: { 'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    title: 'Object with string incorrect-value',
                    value: { 'a': 123, 'b': { 'c': '123d' } },
                    expect: false
                },
                {
                    title: 'Object with string value',
                    value: { 'a': '123312312', 'b': { 'c': '123' } },
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
                    title: 'Object with all correct',
                    value: { 'a': 123, 'b': { 'c': 123 } },
                    expect: true
                },
                {
                    title: 'Object with string incorrect-value',
                    value: { 'a': 123, 'b': { 'c': '123d' } },
                    expect: false
                },
                {
                    title: 'Object with string value',
                    value: { 'a': '123312312', 'b': { 'c': '123' } },
                    expect: true
                }
            ]
        },
    ]
};

export default createTestDefinition(testItems);
