/* eslint-disable @typescript-eslint/no-loss-of-precision */
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

import * as NodeAssert from 'node:assert';
import { createInlineCompiler } from '../lib';
import { createTestDefinition, defaultItems, ITestSuite } from './abstracts';

const testItems: ITestSuite = {

    name: 'Elemental Types',
    sections: [

        {
            'name': 'Literal number 2113',
            'rule': 2113,
            'items': [
                {
                    'title': 'number 2113',
                    'value': 2113,
                    'expect': true
                },
                {
                    'title': 'string \'2113\'',
                    'value': '2113',
                    'expect': false
                }
            ]
        },
        {
            'name': 'Literal null',
            'rule': null,
            'items': [
                {
                    'title': 'string \'null\'',
                    'value': 'null',
                    'expect': false
                },
                ...defaultItems({
                    'null': true
                })
            ]
        },
        {
            'name': 'Literal boolean value true',
            'rule': true,
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': false
                },
                ...defaultItems({
                    'true': true
                })
            ]
        },
        {
            'name': 'Literal boolean value false',
            'rule': false,
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': false
                },
                ...defaultItems({
                    'false': true
                })
            ]
        },
        {
            'name': 'String',
            'rule': 'string',
            'items': [
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'String contains 5 characters',
            'rule': 'string(5)',
            'items': [
                {
                    'title': 'string \'world\'',
                    'value': 'world',
                    'expect': true
                },
                {
                    'title': 'string \'hi\'',
                    'value': 'hi',
                    'expect': false
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'String contains at least 5 characters',
            'rule': 'string(5,)',
            'items': [
                {
                    'title': 'string \'world\'',
                    'value': 'world',
                    'expect': true
                },
                {
                    'title': 'string \'hihi\'',
                    'value': 'hihi',
                    'expect': false
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Wrong expression for string: string(,5)',
            'rule': 'string(,5)',
            'items': [
                {
                    'title': 'string \'any\'',
                    'value': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'Wrong expression for string: string(,)',
            'rule': 'string(,)',
            'items': [
                {
                    'title': 'string \'any\'',
                    'value': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'String contains only ASCII characters.',
            'rule': 'ascii_string',
            'items': [
                {
                    'title': 'string \'world\'',
                    'value': 'world',
                    'expect': true
                },
                {
                    'title': 'string \'hi\'',
                    'value': 'hi',
                    'expect': true
                },
                {
                    'title': 'string \'proper\'',
                    'value': 'proper',
                    'expect': true
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': true
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'String contains 2 ~ 6 characters',
            'rule': 'string(2, 6)',
            'items': [
                {
                    'title': 'string \'world\'',
                    'value': 'world',
                    'expect': true
                },
                {
                    'title': 'string \'hi\'',
                    'value': 'hi',
                    'expect': true
                },
                {
                    'title': 'string \'proper\'',
                    'value': 'proper',
                    'expect': true
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'String contains only 2 ~ 6 latin characters.',
            'rule': 'latin_string(2, 6)',
            'items': [
                {
                    'title': 'string \'ⱠⱡⱢab\'',
                    'value': 'ⱠⱡⱢab',
                    'expect': true
                },
                {
                    'title': 'string \'Ᵽ\'',
                    'value': 'Ᵽ',
                    'expect': false
                },
                {
                    'title': 'string \'proper\'',
                    'value': 'proper',
                    'expect': true
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'String contains 2 ~ 6 ASCII characters.',
            'rule': 'ascii_string(2, 6)',
            'items': [
                {
                    'title': 'string \'proper\'',
                    'value': 'proper',
                    'expect': true
                },
                {
                    'title': 'string \'world\'',
                    'value': 'world',
                    'expect': true
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': false
                },
                {
                    'title': 'string \'ⱠⱡⱢab\'',
                    'value': 'ⱠⱡⱢab',
                    'expect': false
                },
                {
                    'title': 'string \'Ᵽ\'',
                    'value': 'Ᵽ',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': true,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'String contains 2 ~ 8 HEX characters.',
            'rule': 'hex_string(2, 8)',
            'items': [
                {
                    'title': 'string \'fffff\'',
                    'value': 'fffff',
                    'expect': true
                },
                {
                    'title': 'string \'1234a\'',
                    'value': '1234a',
                    'expect': true
                },
                {
                    'title': 'string \'fffffffffffff\'',
                    'value': 'fffffffffffff',
                    'expect': false
                },
                {
                    'title': 'string \'logical\'',
                    'value': 'logical',
                    'expect': false
                },
                {
                    'title': 'string \'ⱠⱡⱢab\'',
                    'value': 'ⱠⱡⱢab',
                    'expect': false
                },
                {
                    'title': 'string \'Ᵽ\'',
                    'value': 'Ᵽ',
                    'expect': false
                },
                ...defaultItems({
                    'string \'hello\'': false,
                    'empty string': false
                })
            ]
        },
        {
            'name': 'Boolean',
            'rule': 'boolean',
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': false
                },
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': false
                },
                ...defaultItems({
                    'true': true,
                    'false': true
                })
            ]
        },
        {
            'name': 'True',
            'rule': 'true',
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': false
                },
                ...defaultItems({
                    'true': true,
                    'false': false
                })
            ]
        },
        {
            'name': 'False',
            'rule': 'false',
            'items': [
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': false
                },
                ...defaultItems({
                    'true': false,
                    'false': true
                })
            ]
        },
        {
            'name': 'Logically true value',
            'rule': 'true_value',
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': true
                },
                ...defaultItems({
                    'true': true,
                    'false': false,
                    'object': true,
                    'number 1': true,
                    'string \'hello\'': true,
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Logically false value',
            'rule': 'false_value',
            'items': [
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': false
                },
                ...defaultItems({
                    'true': false,
                    'false': true,
                    'number 0': true,
                    'null': true,
                    'undefined': true,
                    'empty string': true
                })
            ]
        },
        {
            'name': 'Integer',
            'rule': 'int',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Wrong expression for integer: int(,)',
            'rule': 'int(,)',
            'items': [
                {
                    'title': 'any',
                    'value': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'Integer >= 10',
            'rule': 'int(10,)',
            'items': [
                {
                    'title': 'number 11',
                    'value': 11,
                    'expect': true
                },
                {
                    'title': 'number 10',
                    'value': 10,
                    'expect': true
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 9',
                    'value': 9,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': false
                })
            ]
        },
        {
            'name': 'Integer <= 10',
            'rule': 'int(,10)',
            'items': [
                {
                    'title': 'number 11',
                    'value': 11,
                    'expect': false
                },
                {
                    'title': 'number 10',
                    'value': 10,
                    'expect': true
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 9',
                    'value': 9,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between -12 and 25',
            'rule': 'int(-12, 25)',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number -12',
                    'value': -12,
                    'expect': true
                },
                {
                    'title': 'number 25',
                    'value': 25,
                    'expect': true
                },
                {
                    'title': 'number 26',
                    'value': 26,
                    'expect': false
                },
                {
                    'title': 'number -13',
                    'value': -13,
                    'expect': false
                },
                {
                    'title': 'number -11.5',
                    'value': -11.5,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between -0x80 and 0x7F',
            'rule': 'int8',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number -0x80',
                    'value': -0x80,
                    'expect': true
                },
                {
                    'title': 'number 0x7F',
                    'value': 0x7F,
                    'expect': true
                },
                {
                    'title': 'number 0x80',
                    'value': 0x80,
                    'expect': false
                },
                {
                    'title': 'number -0x81',
                    'value': -0x81,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between -0x8000 and 0x7FFF',
            'rule': 'int16',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number -0x8000',
                    'value': -0x8000,
                    'expect': true
                },
                {
                    'title': 'number 0x7FFF',
                    'value': 0x7FFF,
                    'expect': true
                },
                {
                    'title': 'number 0x8000',
                    'value': 0x8000,
                    'expect': false
                },
                {
                    'title': 'number -0x8001',
                    'value': -0x8001,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between -0x80000000 and 0x7FFFFFFF',
            'rule': 'int32',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number -0x80000000',
                    'value': -0x80000000,
                    'expect': true
                },
                {
                    'title': 'number 0x7FFFFFFF',
                    'value': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 0x80000000',
                    'value': 0x80000000,
                    'expect': false
                },
                {
                    'title': 'number -0x80000001',
                    'value': -0x80000001,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': '64-bits integer',
            'rule': 'int64',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number -0x8000000000000000',
                    'value': -0x8000000000000000,
                    'expect': true
                },
                {
                    'title': 'number 0x7FFFFFFF',
                    'value': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 0x7FFFFFFFFFFFFFFF',
                    'value': 0x7FFFFFFFFFFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer larger than -1',
            'rule': 'uint',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between 0 and 0xFF',
            'rule': 'uint8',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 0xFF',
                    'value': 0xFF,
                    'expect': true
                },
                {
                    'title': 'number 0x100',
                    'value': 0x100,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between 0 and 0xFFFF',
            'rule': 'uint16',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 0xFFFF',
                    'value': 0xFFFF,
                    'expect': true
                },
                {
                    'title': 'number 0x10000',
                    'value': 0x10000,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between 0 and 0xFFFFFFFF',
            'rule': 'uint32',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 0xFFFFFFFF',
                    'value': 0xFFFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 0x100000000',
                    'value': 0x100000000,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between 0 and 0xFFFFFFFFFFFFFFFF',
            'rule': 'uint64',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 0xFFFFFFFFFFFFFFFF',
                    'value': 0xFFFFFFFFFFFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 0x7FFFFFFF',
                    'value': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Accuracy safe integer',
            'rule': 'safe_int',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 9007199254740991',
                    'value': 9007199254740991,
                    'expect': true
                },
                {
                    'title': 'number -9007199254740991',
                    'value': -9007199254740991,
                    'expect': true
                },
                {
                    'title': 'number 9007199254740992',
                    'value': 9007199254740992,
                    'expect': false
                },
                {
                    'title': 'number -9007199254740992',
                    'value': -9007199254740992,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Accuracy safe unsigned integer',
            'rule': 'safe_uint',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 9007199254740991',
                    'value': 9007199254740991,
                    'expect': true
                },
                {
                    'title': 'number 9007199254740992',
                    'value': 9007199254740992,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Float number',
            'rule': 'float',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': true
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Unsigned float number',
            'rule': 'ufloat',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Number',
            'rule': 'number',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': true
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Number between 1.0, 10.0',
            'rule': 'number(1.0, 10.0)',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 1',
                    'value': 1,
                    'expect': true
                },
                {
                    'title': 'number 10',
                    'value': 10,
                    'expect': true
                },
                {
                    'title': 'number 11',
                    'value': 11,
                    'expect': false
                },
                {
                    'title': 'number 0',
                    'value': 0,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Number larger than 1',
            'rule': 'number(1, )',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 1',
                    'value': 1,
                    'expect': true
                },
                {
                    'title': 'number 10',
                    'value': 10,
                    'expect': true
                },
                {
                    'title': 'number 11',
                    'value': 11,
                    'expect': true
                },
                {
                    'title': 'number 0',
                    'value': 0,
                    'expect': false
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Wrong expression for number: number(,)',
            'rule': 'number(,)',
            'items': [
                {
                    'title': 'any',
                    'value': 'any',
                    'expect': 'throw'
                },
            ]
        },
        {
            'name': 'Number lower than -1',
            'rule': 'number(, -1)',
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 1',
                    'value': 1,
                    'expect': false
                },
                {
                    'title': 'number -0.3',
                    'value': -0.3,
                    'expect': false
                },
                {
                    'title': 'number -11',
                    'value': -11,
                    'expect': true
                },
                {
                    'title': 'number 0',
                    'value': 0,
                    'expect': false
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': true
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': false
                })
            ]
        },
        {
            'name': 'Numeric value',
            'rule': 'numeric',
            'items': [
                {
                    'title': 'string \'120312\'',
                    'value': '120312',
                    'expect': true
                },
                {
                    'title': 'string \'2.23\'',
                    'value': '2.23',
                    'expect': true
                },
                {
                    'title': 'string \'2.23.4\'',
                    'value': '2.23.4',
                    'expect': false
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': true
                },
                {
                    'title': 'number 1.23',
                    'value': 1.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': true
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Numeric value between 10 and 100',
            'rule': 'numeric(10,100)',
            'items': [
                {
                    'title': 'string \'50\'',
                    'value': '50',
                    'expect': true
                },
                {
                    'title': 'string \'22.23\'',
                    'value': '22.23',
                    'expect': true
                },
                {
                    'title': 'string \'2.23.4\'',
                    'value': '2.23.4',
                    'expect': false
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': false
                },
                {
                    'title': 'number 11.23',
                    'value': 11.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': false
                })
            ]
        },
        {
            'name': 'Numeric value not lower than 10',
            'rule': 'numeric(10,)',
            'items': [
                {
                    'title': 'string \'50\'',
                    'value': '50',
                    'expect': true
                },
                {
                    'title': 'string \'22.23\'',
                    'value': '22.23',
                    'expect': true
                },
                {
                    'title': 'string \'2.23.4\'',
                    'value': '2.23.4',
                    'expect': false
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': false
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': true
                },
                {
                    'title': 'number 11.23',
                    'value': 11.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': false
                })
            ]
        },
        {
            'name': 'Numeric value not lower than 10',
            'rule': 'numeric(,100)',
            'items': [
                {
                    'title': 'string \'50\'',
                    'value': '50',
                    'expect': true
                },
                {
                    'title': 'string \'22.23\'',
                    'value': '22.23',
                    'expect': true
                },
                {
                    'title': 'string \'2.23.4\'',
                    'value': '2.23.4',
                    'expect': false
                },
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'number 120312',
                    'value': 120312,
                    'expect': false
                },
                {
                    'title': 'number 11.23',
                    'value': 11.23,
                    'expect': true
                },
                {
                    'title': 'number -1.23',
                    'value': -1.23,
                    'expect': true
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Void',
            'rule': 'void',
            'items': [
                ...defaultItems({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Optional',
            'rule': 'optional',
            'items': [
                ...defaultItems({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Undefined',
            'rule': 'undefined',
            'items': [
                ...defaultItems({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Required',
            'rule': 'required',
            'items': [
                ...defaultItems({
                    'true': true,
                    'false': true,
                    'null': true,
                    'empty array': true,
                    'string \'hello\'': true,
                    'empty string': true,
                    'object': true,
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Null',
            'rule': 'null',
            'items': [
                ...defaultItems({
                    'null': true
                })
            ]
        },
        {
            'name': 'Array',
            'rule': 'array',
            'items': [
                {
                    'title': '[string, number]',
                    'value': ['-1.23', 123123],
                    'expect': true
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Array with 1 element',
            'rule': 'array(1)',
            'items': [
                {
                    'title': '[string, number]',
                    'value': ['-1.23', 123123],
                    'expect': false
                },
                {
                    'title': '[string]',
                    'value': ['-1.23'],
                    'expect': true
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Array with 1 ~ 3 elements',
            'rule': 'array(1,3)',
            'items': [
                {
                    'title': '[string, number, boolean]',
                    'value': ['-1.23', 123123, true],
                    'expect': true
                },
                {
                    'title': '[string, number]',
                    'value': ['-1.23', 123123],
                    'expect': true
                },
                {
                    'title': '[string]',
                    'value': ['-1.23'],
                    'expect': true
                },
                {
                    'title': '[string, number, boolean, string]',
                    'value': ['-1.23', 123123, true, 'fff'],
                    'expect': false
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Array with at least 1 element',
            'rule': 'array(1,)',
            'items': [
                {
                    'title': '[string, number]',
                    'value': ['-1.23', 123123],
                    'expect': true
                },
                {
                    'title': '[string]',
                    'value': ['-1.23'],
                    'expect': true
                },
                ...defaultItems({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Wrong expression for array: array(,)',
            'rule': 'array(,)',
            'items': [
                {
                    'title': 'any',
                    'value': 'any',
                    'expect': 'throw'
                },
            ]
        },
        {
            'name': 'Struct',
            'rule': 'struct',
            'items': [
                ...defaultItems({
                    'object': true
                })
            ]
        },
        {
            'name': 'Decimal',
            'rule': 'decimal',
            'items': [
                {
                    'title': 'number 1.00',
                    'value': 1.00,
                    'expect': false
                },
                {
                    'title': 'string \'1.00\'',
                    'value': '1.00',
                    'expect': true
                },
                {
                    'title': 'string \'+1.00\'',
                    'value': '+1.00',
                    'expect': true
                },
                {
                    'title': 'string \'0.00\'',
                    'value': '0.00',
                    'expect': true
                },
                {
                    'title': 'string \'10.00\'',
                    'value': '10.00',
                    'expect': true
                },
                {
                    'title': 'string \'-10.00\'',
                    'value': '-10.00',
                    'expect': true
                },
                {
                    'title': 'string \'010.00\'',
                    'value': '010.00',
                    'expect': false
                },
                {
                    'title': 'string \'.00\'',
                    'value': '.00',
                    'expect': false
                },
                {
                    'title': 'string \'0.\'',
                    'value': '0.',
                    'expect': false
                },
                {
                    'title': 'string \'0.00.0\'',
                    'value': '0.00.0',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Decimal with 5 effective digitals',
            'rule': 'decimal(5)',
            'items': [
                {
                    'title': 'number 1.00',
                    'value': 1.00,
                    'expect': false
                },
                {
                    'title': 'string \'1.00\'',
                    'value': '1.00',
                    'expect': true
                },
                {
                    'title': 'string \'0.00\'',
                    'value': '0.00',
                    'expect': true
                },
                {
                    'title': 'string \'10.00\'',
                    'value': '10.00',
                    'expect': true
                },
                {
                    'title': 'string \'-10.00\'',
                    'value': '-10.00',
                    'expect': true
                },
                {
                    'title': 'string \'10000\'',
                    'value': '10000',
                    'expect': true
                },
                {
                    'title': 'string \'100000\'',
                    'value': '100000',
                    'expect': false
                },
                {
                    'title': 'string \'00001.0\'',
                    'value': '00001.0',
                    'expect': false
                },
                {
                    'title': 'string \'1.00123\'',
                    'value': '1.00123',
                    'expect': false
                },
                {
                    'title': 'string \'010.00\'',
                    'value': '010.00',
                    'expect': false
                },
                {
                    'title': 'string \'.00\'',
                    'value': '.00',
                    'expect': false
                },
                {
                    'title': 'string \'0.\'',
                    'value': '0.',
                    'expect': false
                },
                {
                    'title': 'string \'0.00.0\'',
                    'value': '0.00.0',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Decimal with 5 effective digitals, while 2 after dot',
            'rule': 'decimal(5, 2)',
            'items': [
                {
                    'title': 'number 1.00',
                    'value': 1.00,
                    'expect': false
                },
                {
                    'title': 'string \'1.00\'',
                    'value': '1.00',
                    'expect': true
                },
                {
                    'title': 'string \'0.00\'',
                    'value': '0.00',
                    'expect': true
                },
                {
                    'title': 'string \'10.00\'',
                    'value': '10.00',
                    'expect': true
                },
                {
                    'title': 'string \'+10.00\'',
                    'value': '+10.00',
                    'expect': true
                },
                {
                    'title': 'string \'100.12\'',
                    'value': '100.12',
                    'expect': true
                },
                {
                    'title': 'string \'-100.12\'',
                    'value': '-100.12',
                    'expect': true
                },
                {
                    'title': 'string \'1100.1\'',
                    'value': '1100.1',
                    'expect': false
                },
                {
                    'title': 'string \'11.123\'',
                    'value': '10.123',
                    'expect': false
                },
                {
                    'title': 'string \'100000\'',
                    'value': '100000',
                    'expect': false
                },
                {
                    'title': 'string \'00001.0\'',
                    'value': '00001.0',
                    'expect': false
                },
                {
                    'title': 'string \'1.00123\'',
                    'value': '1.00123',
                    'expect': false
                },
                {
                    'title': 'string \'010.00\'',
                    'value': '010.00',
                    'expect': false
                },
                {
                    'title': 'string \'.00\'',
                    'value': '.00',
                    'expect': false
                },
                {
                    'title': 'string \'0.\'',
                    'value': '0.',
                    'expect': false
                },
                {
                    'title': 'string \'0.00.0\'',
                    'value': '0.00.0',
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'Mapping of string',
            'rule': 'string{}',
            'items': [
                {
                    'title': JSON.stringify({
                        'a': 'bbbb',
                        'b': 'ccccc'
                    }),
                    'value': {
                        'a': 'bbbb',
                        'b': 'ccccc'
                    },
                    'expect': true
                },
                {
                    'title': JSON.stringify({
                        'a': 'bbbb',
                        'b': 321
                    }),
                    'value': {
                        'a': 'bbbb',
                        'b': 321
                    },
                    'expect': false
                },
                {
                    'title': '[string, string, string]',
                    'value': ['a', 'b', 'c'],
                    'expect': false
                },
                ...defaultItems({
                    'object': true
                })
            ]
        },
        {
            'name': 'Array of string',
            'rule': 'string[]',
            'items': [
                {
                    'title': '[string, string]',
                    'value': ['a', '123'],
                    'expect': true
                },
                {
                    'title': '[string]',
                    'value': ['a'],
                    'expect': true
                },
                {
                    'title': '[string, number]',
                    'value': ['a', 123],
                    'expect': false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'String array contains 0 elements.',
            'rule': 'string[0]',
            'items': [
                {
                    'title': '[string]',
                    'value': ['a'],
                    'expect': false
                },
                {
                    'title': '[string, number]',
                    'value': ['a', 123],
                    'expect': false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'String array contains 3 elements.',
            'rule': 'string[3]',
            'items': [
                {
                    'title': '[string, string, string]',
                    'value': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'title': '[string, string, number]',
                    'value': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'title': '[string, string]',
                    'value': ['a', 'b'],
                    'expect': false
                },
                {
                    'title': '[string]',
                    'value': ['a'],
                    'expect': false
                },
                {
                    'title': '[string, number]',
                    'value': ['a', 123],
                    'expect': false
                },
                ...defaultItems({})
            ]
        },
        {
            'name': 'String array contains 0 ~ 3 elements.',
            'rule': 'string[0,3]',
            'items': [
                {
                    'title': '[string, string, string]',
                    'value': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'title': '[string, string, number]',
                    'value': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'title': '[string, string]',
                    'value': ['a', 'b'],
                    'expect': true
                },
                {
                    'title': '[string]',
                    'value': ['a'],
                    'expect': true
                },
                {
                    'title': '[string, number]',
                    'value': ['a', 123],
                    'expect': false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Array contains 0 ~ 3 string values that each contains 1 ~ 5 characters.',
            'rule': 'string(1,5)[0,3]',
            'items': [
                {
                    'title': '[string, string, string]',
                    'value': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'title': '[string, string, number]',
                    'value': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'title': '[string, string]',
                    'value': ['a', 'b'],
                    'expect': true
                },
                {
                    'title': '[string, string, string(7)]',
                    'value': ['a', 'b', 'aaabbbc'],
                    'expect': false
                },
                {
                    'title': '[string]',
                    'value': ['a'],
                    'expect': true
                },
                {
                    'title': '[string, number]',
                    'value': ['a', 123],
                    'expect': false
                },
                ...defaultItems({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Optional string',
            'rule': '?string',
            'items': [
                {
                    'title': 'string \'fine\'',
                    'value': 'fine',
                    'expect': true
                },
                ...defaultItems({
                    'undefined': true,
                    'empty string': true,
                    'string \'hello\'': true
                })
            ]
        }
    ]
};

describe('Invalid expression of elemental type with arguments', () => {

    for (const t of [
        'int8', 'int16', 'int32', 'int64',
        'uint', 'uint8', 'uint16', 'uint32', 'uint64',
        'ufloat', 'void', 'any', 'required',
        'undefined', 'false_value', 'true_value'
    ]) {

        const strictCompiler = createInlineCompiler({ ignoreInvalidArgs: false });
        const looseCompiler = createInlineCompiler(); // compatible mode

        it(`[Strict-Mode] "${t}" expression (without arguments) is allowed`, () => {

            NodeAssert.doesNotThrow(() => {
                strictCompiler.compile({ rule: t });
            });
        });

        it(`[Compatible-Mode] "${t}" expression (without arguments) is allowed`, () => {

            NodeAssert.doesNotThrow(() => {
                looseCompiler.compile({ rule: t });
            });
        });

        it(`[Strict-Mode] "${t}(1)" expression (with 1 argument) is not allowed`, () => {

            NodeAssert.throws(() => {
                strictCompiler.compile({ rule: `${t}(1)` });
            });
        });

        it(`[Compatible-Mode] "${t}(1)" expression (with 1 argument) is ignored`, () => {

            NodeAssert.doesNotThrow(() => {
                looseCompiler.compile({ rule: `${t}(1)` });
            });
        });

        it(`[Strict-Mode] "${t}(1,)" expression (with 1 argument and right opened) is not allowed`, () => {

            NodeAssert.throws(() => {
                strictCompiler.compile({ rule: `${t}(1,)` });
            });
        });

        it(`[Compatible-Mode] "${t}(1,)" expression (with 1 argument and right opened) is ignored`, () => {

            NodeAssert.doesNotThrow(() => {
                looseCompiler.compile({ rule: `${t}(1,)` });
            });
        });

        it(`[Strict-Mode] "${t}(,10)" expression (with 1 argument and left opened) is not allowed`, () => {

            NodeAssert.throws(() => {
                strictCompiler.compile({ rule: `${t}(,10)` });
            });
        });

        it(`[Compatible-Mode] "${t}(,10)" expression (with 1 argument and left opened) is ignored`, () => {

            NodeAssert.doesNotThrow(() => {
                looseCompiler.compile({ rule: `${t}(,10)` });
            });
        });

        it(`[Strict-Mode] "${t}(1,2)" expression (with 2 arguments) is not allowed`, () => {

            NodeAssert.throws(() => {
                strictCompiler.compile({ rule: `${t}(1,2)` });
            });
        });

        it(`[Compatible-Mode] "${t}(1,2)" expression (with 2 arguments) is ignored`, () => {

            NodeAssert.doesNotThrow(() => {
                looseCompiler.compile({ rule: `${t}(1,2)` });
            });
        });
    }
});

export default createTestDefinition(testItems);
