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

import {
    createTestDefinition,
    ITestSuite
} from './abstracts';

const testItems: ITestSuite = {

    name: 'When optional with any',
    sections: [

        {
            'name': JSON.stringify({ 'test?': 'any' }),
            'rule': { 'test?': 'any' },
            'items': [
                {
                    title: 'When test === \'ffff\'',
                    value: { 'test': 'ffff' },
                    expect: true
                },
                {
                    title: 'When test is omitted',
                    value: {},
                    expect: true
                }
            ]
        },
        {
            'name': JSON.stringify({ 'test': 'int8' }),
            'rule': { 'test': 'int8' },
            'items': [
                {
                    title: 'When test === 123',
                    value: { 'test': 123 },
                    expect: true
                },
                {
                    title: 'When test === 1234',
                    value: { 'test': 1234 },
                    expect: false
                },
                {
                    title: 'When test is omitted',
                    value: {},
                    expect: false
                }
            ]
        },
    ]
};

export default createTestDefinition(testItems);
