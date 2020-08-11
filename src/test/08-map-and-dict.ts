/**
 * Copyright 2020 Angus.Fenying <fenying@litert.org>
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
    defaultItemss,
    ITestSuite,
    assertItem,
    addRule
} from './abstracts';

const testItems: ITestSuite = {

    name: 'Mappings & Dicts',
    sections: [

        {
            'name': JSON.stringify(['$.map', 'string', 'uint32']),
            'rule': ['$.map', 'string', 'uint32'],
            'items': [
                {
                    inputName: 'all string object',
                    inputValue: {'a': '123312312', 'b': 'ccc' },
                    expect: true
                },
                {
                    inputName: 'all uint32 object',
                    inputValue: {'a': 123312312, 'b': 0xCCC },
                    expect: true
                },
                {
                    inputName: 'all uint32 & string object',
                    inputValue: {'a': 123312312, 'b': 0xCCC },
                    expect: true
                },
                {
                    inputName: 'all uint32 & boolean object',
                    inputValue: {'a': 123312312, 'b': false },
                    expect: false
                },
                ...defaultItemss({
                    'object': true
                })
            ]
        },
        {
            'name': JSON.stringify({
                'a': 'string',
                '$.map': 'number'
            }),
            'rule': {
                'a': 'string',
                '$.map': 'number'
            },
            'items': [
                assertItem(
                    {'a': '123312312', 'b': 123.3, c: 1232 },
                    true
                ),
                assertItem(
                    {'a': '123312312', 'b': 'ccc' },
                    false
                ),
                assertItem(
                    {'a': 123312312, 'b': 123.3 },
                    false
                ),
            ]
        },
        {
            'name': JSON.stringify({
                'a': 'string',
                'b->{}': 'number'
            }),
            'rule': {
                'a': 'string',
                'b->{}': 'number'
            },
            'items': [
                assertItem(
                    {'a': '123312312', 'b': 'ccc' },
                    false
                ),
                assertItem(
                    {'a': 123312312, 'b': 123.3 },
                    false
                ),
                assertItem(
                    {'a': '123312312', 'b': {d: 123.3, c: 1232} },
                    true
                ),
                assertItem(
                    {'a': '123312312', 'b': { d: 123.3, c: '1232' } },
                    false
                ),
            ]
        },
        addRule(['$.dict', ['a', 'b'], 'string'], [
            assertItem(
                {'a': '123312312', 'b': 'ccc' },
                true
            ),
            assertItem(
                {'a': '123312312', 'b': 'ccc', 'c': 123 },
                true
            ),
            assertItem(
                {'a': '123312312' },
                false
            ),
            assertItem(
                {'a': '123312312', 'c': 'ddd' },
                false
            ),
            assertItem(
                {'a': '123312312', 'b': 123.3 },
                false
            )
        ]),
        addRule(['$.strict', '$.dict', ['a', 'b'], 'string'], [
            assertItem(
                {'a': '123312312', 'b': 'ccc' },
                true
            ),
            assertItem(
                {'a': '123312312', 'b': 'ccc', 'c': 123 },
                false
            ),
            assertItem(
                {'a': '123312312' },
                false
            ),
        ])

    ]
};

export default createTestDefinition(testItems);
