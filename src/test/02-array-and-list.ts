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

import {
    createTestDefinition,
    defaultItems,
    ITestSuite,
    assertItem,
    addRule
} from './abstracts';

const testItems: ITestSuite = {

    name: 'List & Array',
    sections: [

        {
            'name': 'String list',
            'rule': ['$.list', 'string'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: true
                },
                {
                    title: '[string,string]',
                    value: ['fff', 'ggg'],
                    expect: true
                },
                {
                    title: '[string,int]',
                    value: ['fff', 123],
                    expect: false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Fixed-length array with 1 element.',
            'rule': ['$.array', 1, 'string'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: true
                },
                {
                    title: '[string,string]',
                    value: ['fff', 'ggg'],
                    expect: false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Fixed-length array with 2 different-type elements.',
            'rule': ['$.array', 2, 'string', 'int'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: false
                },
                {
                    title: '[string,string]',
                    value: ['fff', 'ggg'],
                    expect: true
                },
                {
                    title: '[string,int]',
                    value: ['fff', 312],
                    expect: true
                },
                {
                    title: '[int,int]',
                    value: [333, 312],
                    expect: true
                },
                {
                    title: '[int,string]',
                    value: [333, 'ddsadsa'],
                    expect: true
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Variable-length array with at least 1 element',
            'rule': ['$.array', [1], 'string'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: true
                },
                {
                    title: '[string,string]',
                    value: ['fff', 'ggg'],
                    expect: true
                },
                {
                    title: '[string,int]',
                    value: ['fff', 123],
                    expect: false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Variable-length array with 1 ~ 3 elements',
            'rule': ['$.array', [1, 3], 'string'],
            'items': [
                {
                    title: '[string]',
                    value: ['fff'],
                    expect: true
                },
                {
                    title: '[string,string]',
                    value: ['fff', 'ggg'],
                    expect: true
                },
                {
                    title: '[string,string,string]',
                    value: ['fff', 'ggg', 'ggg'],
                    expect: true
                },
                {
                    title: '[string,string,string,string]',
                    value: ['fff', 'ggg', 'ggg', 'fffa'],
                    expect: false
                },
                {
                    title: '[string,int]',
                    value: ['fff', 123],
                    expect: false
                },
                ...defaultItems({})
            ]
        },
        addRule({
            'a->[]': 'string'
        }, [
            assertItem([], false),
            assertItem({ 'a': [] }, true),
            assertItem({ 'a': [1] }, false),
            assertItem({ 'a': ['1'] }, true)
        ]),
        addRule({
            'a->[3]': 'string'
        }, [
            assertItem([], false),
            assertItem({ 'a': [] }, false),
            assertItem({ 'a': [1, 1, 2] }, false),
            assertItem({ 'a': ['1', 'f', 'c'] }, true),
            assertItem({ 'a': ['1', 'f', 'c', 'c'] }, false)
        ]),
        addRule({
            'a->[3,]': 'string'
        }, [
            assertItem([], false),
            assertItem({ 'a': [] }, false),
            assertItem({ 'a': [1, 1, 2] }, false),
            assertItem({ 'a': ['1', 'f', 'c'] }, true),
            assertItem({ 'a': ['1', 'f', 'c', 'c'] }, true)
        ]),
        addRule({
            'a->[3,5]': 'string'
        }, [
            assertItem([], false),
            assertItem({ 'a': [] }, false),
            assertItem({ 'a': [1, 1, 2] }, false),
            assertItem({ 'a': ['1', 'f', 'c'] }, true),
            assertItem({ 'a': ['1', 'f', 'c', 'c'] }, true),
            assertItem({ 'a': ['1', 'f', 'c', 'c', '5'] }, true),
            assertItem({ 'a': ['1', 'f', 'c', 'c', '5', 'c'] }, false)
        ])
    ],
};

export default createTestDefinition(testItems);
