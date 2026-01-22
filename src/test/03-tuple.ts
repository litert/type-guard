/**
 * Copyright 2026 Angus Fenying <fenying@litert.org>
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

    name: 'Tuple',
    sections: [

        {
            'name': 'Simple tuple',
            'rule': ['$.tuple', 'string', 'int'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: false
                },
                {
                    title: '[string,int]',
                    value: ['fff', 1213],
                    expect: true
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Empty tuple',
            'rule': ['$.tuple'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: false
                },
                {
                    title: '[string,int]',
                    value: ['fff', 1213],
                    expect: false
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Unlimited optional tuple',
            'rule': ['$.tuple', 'string', 'int', '...'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: true
                },
                {
                    title: '[string,int]',
                    value: ['fff', 1213],
                    expect: true
                },
                {
                    title: '[string,int,int]',
                    value: ['fff', 1213, 233],
                    expect: true
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Limited optional tuple',
            'rule': ['$.tuple', 'string', 'int', '...3', 'string'],
            'items': [
                {
                    title: '[string,int,int,int,string]',
                    value: ['fff', 1, 3, 5, 'ccc'],
                    expect: true
                },
                {
                    title: '[string,int]',
                    value: ['fff', 1213],
                    expect: false
                },
                {
                    title: '[string,int,string]',
                    value: ['fff', 1213, 'ccc'],
                    expect: false
                },
                {
                    title: '[string,int,int]',
                    value: ['fff', 1213, 233],
                    expect: false
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Mixed omitted tuple',
            'rule': ['$.tuple', 'string', 'int', '...4', 'string', '...'],
            'items': [
                {
                    title: '[string,int,int,int,int,string]',
                    value: ['fff', 1, 3, 5, 2, 'ccc'],
                    expect: true
                },
                {
                    title: '[string,int,int,int,int,string,string]',
                    value: ['fff', 1, 3, 5, 2, 'ccc', 'aaa'],
                    expect: true
                },
                {
                    title: '[string,int,int,int,int]',
                    value: ['fff', 1, 3, 5, 2],
                    expect: true
                },
                {
                    title: '[string,int,int,int]',
                    value: ['fff', 1, 3, 5],
                    expect: false
                },
                {
                    title: '[string,int]',
                    value: ['fff', 1213],
                    expect: false
                },
                {
                    title: '[string,int,string]',
                    value: ['fff', 1213, 'ccc'],
                    expect: false
                },
                {
                    title: '[string,int,int]',
                    value: ['fff', 1213, 233],
                    expect: false
                },
                {
                    title: '[int, string]',
                    value: [123, 'fff'],
                    expect: false
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'...\']',
            'rule': ['$.tuple', '...'],
            'items': [
                {
                    title: 'any',
                    value: 'any',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'string\', \'...\', \'...\']',
            'rule': ['$.tuple', 'string', '...', '...'],
            'items': [
                {
                    title: 'any',
                    value: 'any',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'string\', \'...d\']',
            'rule': ['$.tuple', 'string', '...d'],
            'items': [
                {
                    title: 'any',
                    value: 'any',
                    expect: 'throw'
                }
            ]
        }
    ]
};

export default createTestDefinition(testItems);
