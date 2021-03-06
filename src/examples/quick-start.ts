/**
 * Copyright 2021 Angus.Fenying <fenying@litert.org>
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
console.log(check2('world'));
console.log(check2.toString());

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
