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

import * as assert from 'assert';
import * as TypeGuard from '../lib';

export interface ITestItem {

    inputName: string;

    inputValue: any;

    expect: boolean | 'throw';
}

export interface ITestRule {

    name: string;

    rule: any;

    items: ITestItem[];
}

export interface ITestSuite {

    name: string;

    sections: ITestRule[];
}

export function defaultItemss(
    items: Record<string, boolean>,
    defaultValue: boolean = false
): ITestItem[] {

    return [
        {
            'inputName': 'true',
            'inputValue': true,
            'expect': items['true'] === undefined ? defaultValue : items['true']
        },
        {
            'inputName': 'false',
            'inputValue': false,
            'expect': items['false'] === undefined ? defaultValue : items['false']
        },
        {
            'inputName': 'undefined',
            'inputValue': undefined,
            'expect': items['undefined'] === undefined ? defaultValue : items['undefined']
        },
        {
            'inputName': 'null',
            'inputValue': null,
            'expect': items['null'] === undefined ? defaultValue : items['null']
        },
        {
            'inputName': 'empty array',
            'inputValue': [],
            'expect': items['empty array'] === undefined ? defaultValue : items['empty array']
        },
        {
            'inputName': 'string \'hello\'',
            'inputValue': 'hello',
            'expect': items['string \'hello\''] === undefined ? defaultValue : items['string \'hello\'']
        },
        {
            'inputName': 'empty string',
            'inputValue': '',
            'expect': items['empty string'] === undefined ? defaultValue : items['empty string']
        },
        {
            'inputName': 'object',
            'inputValue': {},
            'expect': items['object'] === undefined ? defaultValue : items['object']
        },
        {
            'inputName': 'number 0',
            'inputValue': 0,
            'expect': items['number 0'] === undefined ? defaultValue : items['number 0']
        },
        {
            'inputName': 'number 1',
            'inputValue': 1,
            'expect': items['number 1'] === undefined ? defaultValue : items['number 1']
        }
    ];
}

const compiler = TypeGuard.createInlineCompiler();

compiler.addPredefinedType<string>(
    'ipv4_address',
    function(i): i is string {
        return  typeof i === 'string'
            && /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/.test(i)
            && i.split('.').map(x => parseInt(x, 10)).every(x => x >= 0 && x <= 255);
    }
);

const compiler2 = TypeGuard.createInlineCompiler();

compiler2.addPredefinedType<string>(
    'ipv4_address',
    function(i): i is string {
        return  typeof i === 'string'
            && /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/.test(i)
            && i.split('.').map(x => parseInt(x, 10)).every(x => x >= 0 && x <= 255);
    }
);

export function assertItem(input: unknown, expect: boolean | 'throw'): ITestItem {

    return {
        inputName: JSON.stringify(input),
        inputValue: input,
        expect
    };
}

export function addRule(rule: unknown, items: ITestItem[]): ITestRule {

    return {
        name: JSON.stringify(rule),
        rule,
        items
    };
}

export function createTestDefinition(suite: ITestSuite) {

    return function(): void {

        describe(suite.name, function() {

            for (const section of suite.sections) {

                describe(section.name, function() {

                    if (
                        section.items.length === 1 &&
                        section.items[0].expect === 'throw'
                    ) {

                        it('Throws exception.', function() {

                            assert.throws(() => {

                                compiler.compile<any>({
                                    'rule': section.rule,
                                    traceErrors: true,
                                });
                            });

                            assert.throws(() => {

                                compiler2.compile<any>({
                                    'rule': section.rule,
                                });
                            });
                        });
                        return;
                    }

                    const checkWithTrace = compiler.compile<any>({
                        'rule': section.rule,
                        traceErrors: true,
                    });

                    const checkWithoutTrace = compiler2.compile<any>({
                        'rule': section.rule,
                    });

                    for (const item of section.items.sort((a, b) => a.expect === b.expect ? 0 : (a.expect ? -1 : 1))) {

                        it(`${
                            item.expect ? 'PASSED' : 'REJECTED'
                        } when input ${
                            item.inputName
                        }.`, function() {

                            assert.equal(
                                checkWithTrace(item.inputValue),
                                item.expect
                            );

                            assert.equal(
                                checkWithoutTrace(item.inputValue),
                                item.expect
                            );
                        });
                    }
                });
            }
        });
    };
}
