/**
 * Copyright 2022 Angus Fenying <fenying@litert.org>
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

    name: 'Tuple',
    sections: [

        {
            'name': 'Simple tuple',
            'rule': ['$.tuple', 'string', 'int'],
            'items': [
                {
                    inputName: '[string]',
                    inputValue: ['fff'],
                    expect: false
                },
                {
                    inputName: '[string,int]',
                    inputValue: ['fff', 1213],
                    expect: true
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Empty tuple',
            'rule': ['$.tuple'],
            'items': [
                {
                    inputName: '[string]',
                    inputValue: ['fff'],
                    expect: false
                },
                {
                    inputName: '[string,int]',
                    inputValue: ['fff', 1213],
                    expect: false
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Umlimited omittable tuple',
            'rule': ['$.tuple', 'string', 'int', '...'],
            'items': [
                {
                    inputName: '[string]',
                    inputValue: ['fff'],
                    expect: true
                },
                {
                    inputName: '[string,int]',
                    inputValue: ['fff', 1213],
                    expect: true
                },
                {
                    inputName: '[string,int,int]',
                    inputValue: ['fff', 1213, 233],
                    expect: true
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Limited omittable tuple',
            'rule': ['$.tuple', 'string', 'int', '...3', 'string'],
            'items': [
                {
                    inputName: '[string,int,int,int,string]',
                    inputValue: ['fff', 1, 3, 5, 'ccc'],
                    expect: true
                },
                {
                    inputName: '[string,int]',
                    inputValue: ['fff', 1213],
                    expect: false
                },
                {
                    inputName: '[string,int,string]',
                    inputValue: ['fff', 1213, 'ccc'],
                    expect: false
                },
                {
                    inputName: '[string,int,int]',
                    inputValue: ['fff', 1213, 233],
                    expect: false
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Mixed omitted tuple',
            'rule': ['$.tuple', 'string', 'int', '...4', 'string', '...'],
            'items': [
                {
                    inputName: '[string,int,int,int,int,string]',
                    inputValue: ['fff', 1, 3, 5, 2, 'ccc'],
                    expect: true
                },
                {
                    inputName: '[string,int,int,int,int,string,string]',
                    inputValue: ['fff', 1, 3, 5, 2, 'ccc', 'aaa'],
                    expect: true
                },
                {
                    inputName: '[string,int,int,int,int]',
                    inputValue: ['fff', 1, 3, 5, 2],
                    expect: true
                },
                {
                    inputName: '[string,int,int,int]',
                    inputValue: ['fff', 1, 3, 5],
                    expect: false
                },
                {
                    inputName: '[string,int]',
                    inputValue: ['fff', 1213],
                    expect: false
                },
                {
                    inputName: '[string,int,string]',
                    inputValue: ['fff', 1213, 'ccc'],
                    expect: false
                },
                {
                    inputName: '[string,int,int]',
                    inputValue: ['fff', 1213, 233],
                    expect: false
                },
                {
                    inputName: '[int, string]',
                    inputValue: [123, 'fff'],
                    expect: false
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'...\']',
            'rule': ['$.tuple', '...'],
            'items': [
                {
                    inputName: 'any',
                    inputValue: 'any',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'string\', \'...\', \'...\']',
            'rule': ['$.tuple', 'string', '...', '...'],
            'items': [
                {
                    inputName: 'any',
                    inputValue: 'any',
                    expect: 'throw'
                }
            ]
        },
        {
            'name': 'Invalid syntax: [\'$.tuple\', \'string\', \'...d\']',
            'rule': ['$.tuple', 'string', '...d'],
            'items': [
                {
                    inputName: 'any',
                    inputValue: 'any',
                    expect: 'throw'
                }
            ]
        }
    ]
};

export default createTestDefinition(testItems);
