/* eslint-disable @typescript-eslint/no-loss-of-precision */
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

    name: 'Elememetal Types',
    sections: [

        {
            'name': 'Literal number 2113',
            'rule': 2113,
            'items': [
                {
                    'inputName': 'number 2113',
                    'inputValue': 2113,
                    'expect': true
                },
                {
                    'inputName': 'string \'2113\'',
                    'inputValue': '2113',
                    'expect': false
                }
            ]
        },
        {
            'name': 'Literal null',
            'rule': null,
            'items': [
                {
                    'inputName': 'string \'null\'',
                    'inputValue': 'null',
                    'expect': false
                },
                ...defaultItemss({
                    'null': true
                })
            ]
        },
        {
            'name': 'Literal boolean value true',
            'rule': true,
            'items': [
                {
                    'inputName': 'string \'true\'',
                    'inputValue': 'true',
                    'expect': false
                },
                ...defaultItemss({
                    'true': true
                })
            ]
        },
        {
            'name': 'Literal boolean value false',
            'rule': false,
            'items': [
                {
                    'inputName': 'string \'true\'',
                    'inputValue': 'true',
                    'expect': false
                },
                ...defaultItemss({
                    'false': true
                })
            ]
        },
        {
            'name': 'String',
            'rule': 'string',
            'items': [
                ...defaultItemss({
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
                    'inputName': 'string \'world\'',
                    'inputValue': 'world',
                    'expect': true
                },
                {
                    'inputName': 'string \'hi\'',
                    'inputValue': 'hi',
                    'expect': false
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'world\'',
                    'inputValue': 'world',
                    'expect': true
                },
                {
                    'inputName': 'string \'hihi\'',
                    'inputValue': 'hihi',
                    'expect': false
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'string \'any\'',
                    'inputValue': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'Wrong expression for string: string(,)',
            'rule': 'string(,)',
            'items': [
                {
                    'inputName': 'string \'any\'',
                    'inputValue': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'String contains only ASCII characters.',
            'rule': 'ascii_string',
            'items': [
                {
                    'inputName': 'string \'world\'',
                    'inputValue': 'world',
                    'expect': true
                },
                {
                    'inputName': 'string \'hi\'',
                    'inputValue': 'hi',
                    'expect': true
                },
                {
                    'inputName': 'string \'proper\'',
                    'inputValue': 'proper',
                    'expect': true
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'string \'world\'',
                    'inputValue': 'world',
                    'expect': true
                },
                {
                    'inputName': 'string \'hi\'',
                    'inputValue': 'hi',
                    'expect': true
                },
                {
                    'inputName': 'string \'proper\'',
                    'inputValue': 'proper',
                    'expect': true
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'ⱠⱡⱢab\'',
                    'inputValue': 'ⱠⱡⱢab',
                    'expect': true
                },
                {
                    'inputName': 'string \'Ᵽ\'',
                    'inputValue': 'Ᵽ',
                    'expect': false
                },
                {
                    'inputName': 'string \'proper\'',
                    'inputValue': 'proper',
                    'expect': true
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'proper\'',
                    'inputValue': 'proper',
                    'expect': true
                },
                {
                    'inputName': 'string \'world\'',
                    'inputValue': 'world',
                    'expect': true
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': false
                },
                {
                    'inputName': 'string \'ⱠⱡⱢab\'',
                    'inputValue': 'ⱠⱡⱢab',
                    'expect': false
                },
                {
                    'inputName': 'string \'Ᵽ\'',
                    'inputValue': 'Ᵽ',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'fffff\'',
                    'inputValue': 'fffff',
                    'expect': true
                },
                {
                    'inputName': 'string \'1234a\'',
                    'inputValue': '1234a',
                    'expect': true
                },
                {
                    'inputName': 'string \'fffffffffffff\'',
                    'inputValue': 'fffffffffffff',
                    'expect': false
                },
                {
                    'inputName': 'string \'logical\'',
                    'inputValue': 'logical',
                    'expect': false
                },
                {
                    'inputName': 'string \'ⱠⱡⱢab\'',
                    'inputValue': 'ⱠⱡⱢab',
                    'expect': false
                },
                {
                    'inputName': 'string \'Ᵽ\'',
                    'inputValue': 'Ᵽ',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'true\'',
                    'inputValue': 'true',
                    'expect': false
                },
                {
                    'inputName': 'string \'false\'',
                    'inputValue': 'false',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'true\'',
                    'inputValue': 'true',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'false\'',
                    'inputValue': 'false',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'true\'',
                    'inputValue': 'true',
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'string \'false\'',
                    'inputValue': 'false',
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'any',
                    'inputValue': 'any',
                    'expect': 'throw'
                }
            ]
        },
        {
            'name': 'Integer >= 10',
            'rule': 'int(10,)',
            'items': [
                {
                    'inputName': 'number 11',
                    'inputValue': 11,
                    'expect': true
                },
                {
                    'inputName': 'number 10',
                    'inputValue': 10,
                    'expect': true
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 9',
                    'inputValue': 9,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number 11',
                    'inputValue': 11,
                    'expect': false
                },
                {
                    'inputName': 'number 10',
                    'inputValue': 10,
                    'expect': true
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 9',
                    'inputValue': 9,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number -12',
                    'inputValue': -12,
                    'expect': true
                },
                {
                    'inputName': 'number 25',
                    'inputValue': 25,
                    'expect': true
                },
                {
                    'inputName': 'number 26',
                    'inputValue': 26,
                    'expect': false
                },
                {
                    'inputName': 'number -13',
                    'inputValue': -13,
                    'expect': false
                },
                {
                    'inputName': 'number -11.5',
                    'inputValue': -11.5,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number -0x80',
                    'inputValue': -0x80,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7F',
                    'inputValue': 0x7F,
                    'expect': true
                },
                {
                    'inputName': 'number 0x80',
                    'inputValue': 0x80,
                    'expect': false
                },
                {
                    'inputName': 'number -0x81',
                    'inputValue': -0x81,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number -0x8000',
                    'inputValue': -0x8000,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7FFF',
                    'inputValue': 0x7FFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x8000',
                    'inputValue': 0x8000,
                    'expect': false
                },
                {
                    'inputName': 'number -0x8001',
                    'inputValue': -0x8001,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number -0x80000000',
                    'inputValue': -0x80000000,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7FFFFFFF',
                    'inputValue': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x80000000',
                    'inputValue': 0x80000000,
                    'expect': false
                },
                {
                    'inputName': 'number -0x80000001',
                    'inputValue': -0x80000001,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number -0x8000000000000000',
                    'inputValue': -0x8000000000000000,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7FFFFFFF',
                    'inputValue': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7FFFFFFFFFFFFFFF',
                    'inputValue': 0x7FFFFFFFFFFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 0xFF',
                    'inputValue': 0xFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x100',
                    'inputValue': 0x100,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 0xFFFF',
                    'inputValue': 0xFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x10000',
                    'inputValue': 0x10000,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 0xFFFFFFFF',
                    'inputValue': 0xFFFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x100000000',
                    'inputValue': 0x100000000,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 0xFFFFFFFFFFFFFFFF',
                    'inputValue': 0xFFFFFFFFFFFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 0x7FFFFFFF',
                    'inputValue': 0x7FFFFFFF,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 9007199254740991',
                    'inputValue': 9007199254740991,
                    'expect': true
                },
                {
                    'inputName': 'number -9007199254740991',
                    'inputValue': -9007199254740991,
                    'expect': true
                },
                {
                    'inputName': 'number 9007199254740992',
                    'inputValue': 9007199254740992,
                    'expect': false
                },
                {
                    'inputName': 'number -9007199254740992',
                    'inputValue': -9007199254740992,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 9007199254740991',
                    'inputValue': 9007199254740991,
                    'expect': true
                },
                {
                    'inputName': 'number 9007199254740992',
                    'inputValue': 9007199254740992,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 1',
                    'inputValue': 1,
                    'expect': true
                },
                {
                    'inputName': 'number 10',
                    'inputValue': 10,
                    'expect': true
                },
                {
                    'inputName': 'number 11',
                    'inputValue': 11,
                    'expect': false
                },
                {
                    'inputName': 'number 0',
                    'inputValue': 0,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 1',
                    'inputValue': 1,
                    'expect': true
                },
                {
                    'inputName': 'number 10',
                    'inputValue': 10,
                    'expect': true
                },
                {
                    'inputName': 'number 11',
                    'inputValue': 11,
                    'expect': true
                },
                {
                    'inputName': 'number 0',
                    'inputValue': 0,
                    'expect': false
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'any',
                    'inputValue': 'any',
                    'expect': 'throw'
                },
            ]
        },
        {
            'name': 'Number lower than -1',
            'rule': 'number(, -1)',
            'items': [
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 1',
                    'inputValue': 1,
                    'expect': false
                },
                {
                    'inputName': 'number -0.3',
                    'inputValue': -0.3,
                    'expect': false
                },
                {
                    'inputName': 'number -11',
                    'inputValue': -11,
                    'expect': true
                },
                {
                    'inputName': 'number 0',
                    'inputValue': 0,
                    'expect': false
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'string \'120312\'',
                    'inputValue': '120312',
                    'expect': true
                },
                {
                    'inputName': 'string \'2.23\'',
                    'inputValue': '2.23',
                    'expect': true
                },
                {
                    'inputName': 'string \'2.23.4\'',
                    'inputValue': '2.23.4',
                    'expect': false
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': true
                },
                {
                    'inputName': 'number 1.23',
                    'inputValue': 1.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': true
                },
                ...defaultItemss({
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
                    'inputName': 'string \'50\'',
                    'inputValue': '50',
                    'expect': true
                },
                {
                    'inputName': 'string \'22.23\'',
                    'inputValue': '22.23',
                    'expect': true
                },
                {
                    'inputName': 'string \'2.23.4\'',
                    'inputValue': '2.23.4',
                    'expect': false
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': false
                },
                {
                    'inputName': 'number 11.23',
                    'inputValue': 11.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'50\'',
                    'inputValue': '50',
                    'expect': true
                },
                {
                    'inputName': 'string \'22.23\'',
                    'inputValue': '22.23',
                    'expect': true
                },
                {
                    'inputName': 'string \'2.23.4\'',
                    'inputValue': '2.23.4',
                    'expect': false
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': false
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': true
                },
                {
                    'inputName': 'number 11.23',
                    'inputValue': 11.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': false
                },
                ...defaultItemss({
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
                    'inputName': 'string \'50\'',
                    'inputValue': '50',
                    'expect': true
                },
                {
                    'inputName': 'string \'22.23\'',
                    'inputValue': '22.23',
                    'expect': true
                },
                {
                    'inputName': 'string \'2.23.4\'',
                    'inputValue': '2.23.4',
                    'expect': false
                },
                {
                    'inputName': 'number -1',
                    'inputValue': -1,
                    'expect': true
                },
                {
                    'inputName': 'number 120312',
                    'inputValue': 120312,
                    'expect': false
                },
                {
                    'inputName': 'number 11.23',
                    'inputValue': 11.23,
                    'expect': true
                },
                {
                    'inputName': 'number -1.23',
                    'inputValue': -1.23,
                    'expect': true
                },
                ...defaultItemss({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Void',
            'rule': 'void',
            'items': [
                ...defaultItemss({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Optional',
            'rule': 'optional',
            'items': [
                ...defaultItemss({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Undefined',
            'rule': 'undefined',
            'items': [
                ...defaultItemss({
                    'undefined': true
                })
            ]
        },
        {
            'name': 'Required',
            'rule': 'required',
            'items': [
                ...defaultItemss({
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
                ...defaultItemss({
                    'null': true
                })
            ]
        },
        {
            'name': 'Array',
            'rule': 'array',
            'items': [
                {
                    'inputName': '[string, number]',
                    'inputValue': ['-1.23', 123123],
                    'expect': true
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Array with 1 element',
            'rule': 'array(1)',
            'items': [
                {
                    'inputName': '[string, number]',
                    'inputValue': ['-1.23', 123123],
                    'expect': false
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['-1.23'],
                    'expect': true
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Array with 1 ~ 3 elements',
            'rule': 'array(1,3)',
            'items': [
                {
                    'inputName': '[string, number, boolean]',
                    'inputValue': ['-1.23', 123123, true],
                    'expect': true
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['-1.23', 123123],
                    'expect': true
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['-1.23'],
                    'expect': true
                },
                {
                    'inputName': '[string, number, boolean, string]',
                    'inputValue': ['-1.23', 123123, true, 'fff'],
                    'expect': false
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Array with at least 1 element',
            'rule': 'array(1,)',
            'items': [
                {
                    'inputName': '[string, number]',
                    'inputValue': ['-1.23', 123123],
                    'expect': true
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['-1.23'],
                    'expect': true
                },
                ...defaultItemss({
                    'empty array': false
                })
            ]
        },
        {
            'name': 'Wrong expression for array: array(,)',
            'rule': 'array(,)',
            'items': [
                {
                    'inputName': 'any',
                    'inputValue': 'any',
                    'expect': 'throw'
                },
            ]
        },
        {
            'name': 'Struct',
            'rule': 'struct',
            'items': [
                ...defaultItemss({
                    'object': true
                })
            ]
        },
        {
            'name': 'Decimal',
            'rule': 'decimal',
            'items': [
                {
                    'inputName': 'number 1.00',
                    'inputValue': 1.00,
                    'expect': false
                },
                {
                    'inputName': 'string \'1.00\'',
                    'inputValue': '1.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'+1.00\'',
                    'inputValue': '+1.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'0.00\'',
                    'inputValue': '0.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'10.00\'',
                    'inputValue': '10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'-10.00\'',
                    'inputValue': '-10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'010.00\'',
                    'inputValue': '010.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'.00\'',
                    'inputValue': '.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.\'',
                    'inputValue': '0.',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.00.0\'',
                    'inputValue': '0.00.0',
                    'expect': false
                },
                ...defaultItemss({})
            ]
        },
        {
            'name': 'Decimal with 5 effective digitals',
            'rule': 'decimal(5)',
            'items': [
                {
                    'inputName': 'number 1.00',
                    'inputValue': 1.00,
                    'expect': false
                },
                {
                    'inputName': 'string \'1.00\'',
                    'inputValue': '1.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'0.00\'',
                    'inputValue': '0.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'10.00\'',
                    'inputValue': '10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'-10.00\'',
                    'inputValue': '-10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'10000\'',
                    'inputValue': '10000',
                    'expect': true
                },
                {
                    'inputName': 'string \'100000\'',
                    'inputValue': '100000',
                    'expect': false
                },
                {
                    'inputName': 'string \'00001.0\'',
                    'inputValue': '00001.0',
                    'expect': false
                },
                {
                    'inputName': 'string \'1.00123\'',
                    'inputValue': '1.00123',
                    'expect': false
                },
                {
                    'inputName': 'string \'010.00\'',
                    'inputValue': '010.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'.00\'',
                    'inputValue': '.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.\'',
                    'inputValue': '0.',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.00.0\'',
                    'inputValue': '0.00.0',
                    'expect': false
                },
                ...defaultItemss({})
            ]
        },
        {
            'name': 'Decimal with 5 effective digitals, while 2 after dot',
            'rule': 'decimal(5, 2)',
            'items': [
                {
                    'inputName': 'number 1.00',
                    'inputValue': 1.00,
                    'expect': false
                },
                {
                    'inputName': 'string \'1.00\'',
                    'inputValue': '1.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'0.00\'',
                    'inputValue': '0.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'10.00\'',
                    'inputValue': '10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'+10.00\'',
                    'inputValue': '+10.00',
                    'expect': true
                },
                {
                    'inputName': 'string \'100.12\'',
                    'inputValue': '100.12',
                    'expect': true
                },
                {
                    'inputName': 'string \'-100.12\'',
                    'inputValue': '-100.12',
                    'expect': true
                },
                {
                    'inputName': 'string \'1100.1\'',
                    'inputValue': '1100.1',
                    'expect': false
                },
                {
                    'inputName': 'string \'11.123\'',
                    'inputValue': '10.123',
                    'expect': false
                },
                {
                    'inputName': 'string \'100000\'',
                    'inputValue': '100000',
                    'expect': false
                },
                {
                    'inputName': 'string \'00001.0\'',
                    'inputValue': '00001.0',
                    'expect': false
                },
                {
                    'inputName': 'string \'1.00123\'',
                    'inputValue': '1.00123',
                    'expect': false
                },
                {
                    'inputName': 'string \'010.00\'',
                    'inputValue': '010.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'.00\'',
                    'inputValue': '.00',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.\'',
                    'inputValue': '0.',
                    'expect': false
                },
                {
                    'inputName': 'string \'0.00.0\'',
                    'inputValue': '0.00.0',
                    'expect': false
                },
                ...defaultItemss({})
            ]
        },
        {
            'name': 'Mapping of string',
            'rule': 'string{}',
            'items': [
                {
                    'inputName': JSON.stringify({
                        'a': 'bbbb',
                        'b': 'ccccc'
                    }),
                    'inputValue': {
                        'a': 'bbbb',
                        'b': 'ccccc'
                    },
                    'expect': true
                },
                {
                    'inputName': JSON.stringify({
                        'a': 'bbbb',
                        'b': 321
                    }),
                    'inputValue': {
                        'a': 'bbbb',
                        'b': 321
                    },
                    'expect': false
                },
                {
                    'inputName': '[string, string, string]',
                    'inputValue': ['a', 'b', 'c'],
                    'expect': false
                },
                ...defaultItemss({
                    'object': true
                })
            ]
        },
        {
            'name': 'Array of string',
            'rule': 'string[]',
            'items': [
                {
                    'inputName': '[string, string]',
                    'inputValue': ['a', '123'],
                    'expect': true
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['a'],
                    'expect': true
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['a', 123],
                    'expect': false
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'String array contains 0 elements.',
            'rule': 'string[0]',
            'items': [
                {
                    'inputName': '[string]',
                    'inputValue': ['a'],
                    'expect': false
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['a', 123],
                    'expect': false
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'String array contains 3 elements.',
            'rule': 'string[3]',
            'items': [
                {
                    'inputName': '[string, string, string]',
                    'inputValue': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'inputName': '[string, string, number]',
                    'inputValue': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'inputName': '[string, string]',
                    'inputValue': ['a', 'b'],
                    'expect': false
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['a'],
                    'expect': false
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['a', 123],
                    'expect': false
                },
                ...defaultItemss({})
            ]
        },
        {
            'name': 'String array contains 0 ~ 3 elements.',
            'rule': 'string[0,3]',
            'items': [
                {
                    'inputName': '[string, string, string]',
                    'inputValue': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'inputName': '[string, string, number]',
                    'inputValue': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'inputName': '[string, string]',
                    'inputValue': ['a', 'b'],
                    'expect': true
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['a'],
                    'expect': true
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['a', 123],
                    'expect': false
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Array contains 0 ~ 3 string values that each contains 1 ~ 5 characters.',
            'rule': 'string(1,5)[0,3]',
            'items': [
                {
                    'inputName': '[string, string, string]',
                    'inputValue': ['a', 'b', 'c'],
                    'expect': true
                },
                {
                    'inputName': '[string, string, number]',
                    'inputValue': ['a', 'b', 123],
                    'expect': false
                },
                {
                    'inputName': '[string, string]',
                    'inputValue': ['a', 'b'],
                    'expect': true
                },
                {
                    'inputName': '[string, string, string(7)]',
                    'inputValue': ['a', 'b', 'aaabbbc'],
                    'expect': false
                },
                {
                    'inputName': '[string]',
                    'inputValue': ['a'],
                    'expect': true
                },
                {
                    'inputName': '[string, number]',
                    'inputValue': ['a', 123],
                    'expect': false
                },
                ...defaultItemss({
                    'empty array': true
                })
            ]
        },
        {
            'name': 'Optional string',
            'rule': '?string',
            'items': [
                {
                    'inputName': 'string \'fine\'',
                    'inputValue': 'fine',
                    'expect': true
                },
                ...defaultItemss({
                    'undefined': true,
                    'empty string': true,
                    'string \'hello\'': true
                })
            ]
        }
    ]
};

export default createTestDefinition(testItems);
