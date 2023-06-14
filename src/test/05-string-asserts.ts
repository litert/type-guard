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

    name: 'String Asserts',
    sections: [
        {
            'name': 'Operator ==',
            'rule': '==aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': true
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Operator =',
            'rule': '=aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': true
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Symbol \':equal:\'',
            'rule': ':equal:aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': true
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Symbol \':equal-i:\'',
            'rule': ':equal-i:aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': true
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': true
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Operator %=',
            'rule': '%=aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': true
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': true
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Operator !=',
            'rule': '!=aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': false
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-equal:\'',
            'rule': ':not-equal:aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': false
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-equal-i:\'',
            'rule': ':not-equal-i:aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': false
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator %!',
            'rule': '%!aasdsadsada',
            'items': [
                {
                    'title': 'string \'aasdsadsada\'',
                    'value': 'aasdsadsada',
                    'expect': false
                },
                {
                    'title': 'string \'AASDSADSADA\'',
                    'value': 'AASDSADSADA',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator ^=',
            'rule': '^=hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':start-with:\'',
            'rule': ':start-with:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':start-with-i:\'',
            'rule': ':start-with-i:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ^!',
            'rule': '^!hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-start-with:\'',
            'rule': ':not-start-with:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-start-with-i:\'',
            'rule': ':not-start-with-i:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator $=',
            'rule': '$=world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello World',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':end-with:\'',
            'rule': ':end-with:world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello World',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':end-with-i:\'',
            'rule': ':end-with-i:world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello World',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator $!',
            'rule': '$!world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello World',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-end-with:\'',
            'rule': ':not-end-with:world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello World',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-end-with-i:\'',
            'rule': ':not-end-with-i:world',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello World',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },

        /**
         * Include
         */

        {
            'name': 'Operator ?=',
            'rule': '?=hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':include:\'',
            'rule': ':include:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator *=',
            'rule': '*=hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Symbol \':include-i:\'',
            'rule': ':include-i:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ?!',
            'rule': '?!hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-include:\'',
            'rule': ':not-include:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Symbol \':not-include-i:\'',
            'rule': ':not-include-i:hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator *!',
            'rule': '*!hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator ~=/hello/i',
            'rule': '~=/hello/i',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ~=hello',
            'rule': '~=hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ~/hello/i',
            'rule': '~/hello/i',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ~hello',
            'rule': '~hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Operator ~!hello',
            'rule': '~!hello',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator ~!/hello/i',
            'rule': '~!/hello/i',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': false
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Operator ~!/hello/i with negative assert shortcut',
            'rule': '!~!/hello/i',
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'empty string': false
                }, true)
            ]
        },
        {
            'name': 'Operator ~!/hello/i with negative assert',
            'rule': ['$.not', '~!/hello/i'],
            'items': [
                {
                    'title': 'string \'hello world\'',
                    'value': 'hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hello world\'',
                    'value': 'Hello world',
                    'expect': true
                },
                {
                    'title': 'string \'hi world\'',
                    'value': 'hi world',
                    'expect': false
                },
                ...defaultItems({
                    'empty string': false
                }, true)
            ]
        },
    ]
};

export default createTestDefinition(testItems);
