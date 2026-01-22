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

// tslint:disable: no-console
import * as TypeGuard from '../lib';

const tgc = TypeGuard.createInlineCompiler();

const check1 = tgc.compile({
    'rule': ['$.equal', '$.dict', ['a', 'b'], 'string']
});

console.log(check1({
    'a': '123',
    'b': '321'
}));

const check2 = tgc.compile({
    'rule': '==hello',
    'name': 'isHello'
});

console.log(check2('hello'));
console.log(check2('hello'));
console.log(check2.toString());
console.log(tgc.compile({
    'rule': 'string[]',
    'traceErrors': true
}).toString());

const check3 = tgc.compile({
    'rule': '@isHello'
});

console.log(check3('hello'));
console.log(check3('world'));
console.log(check3.toString());

console.log(tgc.compile({
    rule: {
        'test': 'any'
    }
}).toString());

console.log(tgc.compile({
    rule: '==adadasdas'
}).toString());

function printIndent(text: string, depth: number = 1): void {

    console.log(text.split('\n').map((l) => `${'  '.repeat(depth)}${l}`).join('\n'));
}

function executeTest(
    rules: any,
    tests: unknown[],
): void {

    console.log('----------------------------------');
    console.log('Rules:');
    printIndent(JSON.stringify(rules, null, 2));

    const checker = tgc.compile({
        rule: rules,
        traceErrors: true
    });

    console.log('Sources:');
    printIndent(checker.toString());
    console.log('Tests:');

    for (let i = 0; i < tests.length; i++) {

        const test = tests[i];

        console.log(`Test #${i + 1}:`);

        printIndent(`Input:`);
        printIndent(JSON.stringify(test, null, 2), 2);

        const traces: string[] = [];
        printIndent(`Result: ${checker(test, traces)}`);
        if (traces.length) {
            printIndent('Traces:');

            for (const t of traces) {
                printIndent(`- ${t}`, 2);
            }
        }
    }
}

executeTest(
    'string[]',
    [
        ['a', 'b', 'c'],
        ['a', 'b', 'c', 3, 'd'],
        ['a', 'b', 'c', 'd', null, 'e'],
    ]
);

executeTest(
    'string[1,5]',
    [
        ['a', 'b', 'c'],
        ['a', 'b', 'c', 3, 'd'],
        ['a', 'b', 'c', 'd', null, 'e'],
    ]
);

executeTest(
    'string{}',
    [
        ['a', 'b', 'c'],
        { a: 'str' },
        { a: 'str', b: 123 },
        { a: 'str', ss: { c: 123 } },
    ]
);

executeTest(
    ['$.tuple', 'string', 'uint', '...3', 'string(1,)', '...1'],
    [
        ['a', 'b', 'c'],
        ['a', 3, 4, 5, '1'],
        ['a', '3', 4, 5, '1'],
        ['a', 3, '4', 5, '1'],
        ['a', 3, 4, 5, 22],
        [false, 3, 4, 5, '22'],
    ]
);

executeTest(
    ['$.tuple', 'string', 'uint', '...3', 'string(1,)', '...'],
    [
        ['a', 'b', 'c'],
        ['false', 3, 4, 5, '22'],
        ['false', 3, 4, 5, '22', 'c'],
    ]
);

executeTest(
    { a: 'string', b: 'uint', c: ['$.tuple', { a: 'string' }], 'd->[]': 'string' },
    [
        { a: 'ccc' },
        { b: 3333 },
        null,
        { a: 'ccc', b: 3333 },
        { a: 'ccc', b: 3333, c: [{ c: '123' }] },
        { a: 'ccc', b: 3333, c: [{ a: '123' }], 'd': [1, 's'] },
    ]
);

executeTest(
    { 'a': 'string', 'b->{}': 'number' },
    [
        { 'a': '123312312', 'b': 'ccc' },
    ]
);

console.log(tgc.compile({
    rule: '@enum(1, 2, 3, "ss\\"")',
}).toString());
