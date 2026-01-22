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

import { createTestDefinition, defaultItems, ITestSuite } from './abstracts';

const testItems: ITestSuite = {

    name: 'From String',
    sections: [

        {
            'name': 'Boolean',
            'rule': ['$.string', 'boolean'],
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': true
                },
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': true
                },
                ...defaultItems({
                    'true': true,
                    'false': true
                })
            ]
        },
        {
            'name': 'True',
            'rule': ['$.string', 'true'],
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': true
                },
                ...defaultItems({
                    'true': true,
                    'false': false
                })
            ]
        },
        {
            'name': 'False',
            'rule': ['$.string', 'false'],
            'items': [
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': true
                },
                ...defaultItems({
                    'true': false,
                    'false': true
                })
            ]
        },
        {
            'name': 'Integer',
            'rule': ['$.string', 'int'],
            'items': [
                {
                    'title': 'number -1',
                    'value': -1,
                    'expect': true
                },
                {
                    'title': 'string \'-1\'',
                    'value': '-1',
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': '1.23',
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
            'name': 'Integer >= 10',
            'rule': ['$.string', 'int(10,)'],
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
                {
                    'title': 'string \'11\'',
                    'value': '11',
                    'expect': true
                },
                {
                    'title': 'string \'10\'',
                    'value': '10',
                    'expect': true
                },
                {
                    'title': 'string \'-1\'',
                    'value': '-1',
                    'expect': false
                },
                {
                    'title': 'string \'9\'',
                    'value': '9',
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': '1.23',
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
            'rule': ['$.string', 'int(,10)'],
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
                {
                    'title': 'string \'11\'',
                    'value': '11',
                    'expect': false
                },
                {
                    'title': 'string \'10\'',
                    'value': '10',
                    'expect': true
                },
                {
                    'title': 'string \'-1\'',
                    'value': '-1',
                    'expect': true
                },
                {
                    'title': 'string \'9\'',
                    'value': '9',
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': '1.23',
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
            'rule': ['$.string', 'int(-12, 25)'],
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
                {
                    'title': 'string \'-1\'',
                    'value': '-1',
                    'expect': true
                },
                {
                    'title': 'string \'-12\'',
                    'value': '-12',
                    'expect': true
                },
                {
                    'title': 'string \'25\'',
                    'value': '25',
                    'expect': true
                },
                {
                    'title': 'string \'26\'',
                    'value': '26',
                    'expect': false
                },
                {
                    'title': 'string \'-13\'',
                    'value': '-13',
                    'expect': false
                },
                {
                    'title': 'string \'-11.5\'',
                    'value': '-11.5',
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': '1.23',
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
            'rule': ['$.string', 'int8'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-0x80\'',
                    'value': (-0x80).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7F\'',
                    'value': (0x7F).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x80\'',
                    'value': (0x80).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-0x81\'',
                    'value': (-0x81).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'int16'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-0x8000\'',
                    'value': (-0x8000).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7FFF\'',
                    'value': (0x7FFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x8000\'',
                    'value': (0x8000).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-0x8001\'',
                    'value': (-0x8001).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'int32'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-0x80000000\'',
                    'value': (-0x80000000).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7FFFFFFF\'',
                    'value': (0x7FFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x80000000\'',
                    'value': (0x80000000).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-0x80000001\'',
                    'value': (-0x80000001).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'int64'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-0x8000000000000000\'',
                    'value': (-0x8000000000000000).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7FFFFFFF\'',
                    'value': (0x7FFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7FFFFFFFFFFFFFFF\'',
                    'value': (0x7FFFFFFFFFFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'uint'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1\'',
                    'value': (1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0\'',
                    'value': (0).toString(),
                    'expect': true
                },
                ...defaultItems({
                    'number 0': true,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Integer between 0 and 0xFF',
            'rule': ['$.string', 'uint8'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'0xFF\'',
                    'value': (0xFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x100\'',
                    'value': (0x100).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'uint16'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'0xFFFF\'',
                    'value': (0xFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x10000\'',
                    'value': (0x10000).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'uint32'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'0xFFFFFFFF\'',
                    'value': (0xFFFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x100000000\'',
                    'value': (0x100000000).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'uint64'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'0xFFFFFFFFFFFFFFFF\'',
                    'value': (0xFFFFFFFFFFFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0x7FFFFFFF\'',
                    'value': (0x7FFFFFFF).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'safe_int'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'9007199254740991\'',
                    'value': (9007199254740991).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-9007199254740991\'',
                    'value': (-9007199254740991).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'9007199254740992\'',
                    'value': (9007199254740992).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-9007199254740992\'',
                    'value': (-9007199254740992).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'safe_uint'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'9007199254740991\'',
                    'value': (9007199254740991).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'9007199254740992\'',
                    'value': (9007199254740992).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'float'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'120312\'',
                    'value': (120312).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'ufloat'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'120312\'',
                    'value': (120312).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'number'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'120312\'',
                    'value': (120312).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'number(1.0, 10.0)'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1\'',
                    'value': (1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'10\'',
                    'value': (10).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'11\'',
                    'value': (11).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'0\'',
                    'value': (0).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
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
            'rule': ['$.string', 'number(1, )'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1\'',
                    'value': (1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'10\'',
                    'value': (10).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'11\'',
                    'value': (11).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0\'',
                    'value': (0).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'1.23\'',
                    'value': (1.23).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
                    'expect': false
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Number lower than -1',
            'rule': ['$.string', 'number(, -1)'],
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
                {
                    'title': 'string \'-1\'',
                    'value': (-1).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'1\'',
                    'value': (1).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-0.3\'',
                    'value': (-0.3).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-11\'',
                    'value': (-11).toString(),
                    'expect': true
                },
                {
                    'title': 'string \'0\'',
                    'value': (0).toString(),
                    'expect': false
                },
                {
                    'title': 'string \'-1.23\'',
                    'value': (-1.23).toString(),
                    'expect': true
                },
                ...defaultItems({
                    'number 0': false,
                    'number 1': false
                })
            ]
        },
        {
            'name': 'Null',
            'rule': ['$.string', 'null'],
            'items': [
                {
                    'title': 'string \'null\'',
                    'value': 'null',
                    'expect': true
                },
                ...defaultItems({
                    'null': true
                })
            ]
        },
        {
            'name': 'Literal null',
            'rule': ['$.string', null],
            'items': [
                {
                    'title': 'string \'null\'',
                    'value': 'null',
                    'expect': true
                },
                ...defaultItems({
                    'null': true
                })
            ]
        },
        {
            'name': 'Literal number 1',
            'rule': ['$.string', 1],
            'items': [
                {
                    'title': 'string \'1\'',
                    'value': '1',
                    'expect': true
                },
                ...defaultItems({
                    'number 1': true
                })
            ]
        },
        {
            'name': 'Literal true',
            'rule': ['$.string', true],
            'items': [
                {
                    'title': 'string \'true\'',
                    'value': 'true',
                    'expect': true
                },
                ...defaultItems({
                    'true': true
                })
            ]
        },
        {
            'name': 'Literal false',
            'rule': ['$.string', false],
            'items': [
                {
                    'title': 'string \'false\'',
                    'value': 'false',
                    'expect': true
                },
                ...defaultItems({
                    'false': true
                })
            ]
        },
    ]
};

export default createTestDefinition(testItems);
