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

    title: string;

    value: any;

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

export function defaultItems(
    items: Record<string, boolean>,
    defaultValue: boolean = false
): ITestItem[] {

    return [
        {
            'title': 'true',
            'value': true,
            'expect': items['true'] === undefined ? defaultValue : items['true']
        },
        {
            'title': 'false',
            'value': false,
            'expect': items['false'] === undefined ? defaultValue : items['false']
        },
        {
            'title': 'undefined',
            'value': undefined,
            'expect': items['undefined'] === undefined ? defaultValue : items['undefined']
        },
        {
            'title': 'null',
            'value': null,
            'expect': items['null'] === undefined ? defaultValue : items['null']
        },
        {
            'title': 'empty array',
            'value': [],
            'expect': items['empty array'] === undefined ? defaultValue : items['empty array']
        },
        {
            'title': 'string \'hello\'',
            'value': 'hello',
            'expect': items['string \'hello\''] === undefined ? defaultValue : items['string \'hello\'']
        },
        {
            'title': 'empty string',
            'value': '',
            'expect': items['empty string'] === undefined ? defaultValue : items['empty string']
        },
        {
            'title': 'object',
            'value': {},
            'expect': items['object'] === undefined ? defaultValue : items['object']
        },
        {
            'title': 'number 0',
            'value': 0,
            'expect': items['number 0'] === undefined ? defaultValue : items['number 0']
        },
        {
            'title': 'number 1',
            'value': 1,
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

compiler.addPredefinedType<string>(
    'trim_string',
    function(i, minLen: number = 0, maxLen?: number): i is string {
        return typeof i === 'string' && i.trim().length >= minLen && i.trim().length <= (maxLen ?? i.length);
    }
);

compiler.addPredefinedType<string>(
    'enum',
    function(i, ...candidates: any[]): i is string {
        return candidates.includes(i);
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

compiler2.addPredefinedType<string>(
    'trim_string',
    function(i, minLen: number = 0, maxLen?: number): i is string {
        return typeof i === 'string' && i.trim().length >= minLen && i.trim().length <= (maxLen ?? i.length);
    }
);

compiler2.addPredefinedType<string>(
    'enum',
    function(i, ...candidates: any[]): i is string {
        return candidates.includes(i);
    }
);

export function assertItem(input: unknown, expect: boolean | 'throw'): ITestItem {

    return {
        title: JSON.stringify(input),
        value: input,
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
                            item.title
                        }.`, function() {

                            assert.equal(
                                checkWithTrace(item.value),
                                item.expect
                            );

                            assert.equal(
                                checkWithoutTrace(item.value),
                                item.expect
                            );
                        });
                    }
                });
            }
        });
    };
}
