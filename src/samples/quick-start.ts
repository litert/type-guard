/**
 * Copyright 2019 Angus.Fenying <fenying@litert.org>
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
import * as TypeGuard from "../lib";

const tgc = TypeGuard.createInlineCompiler();

const check1 = tgc.compile({
    "rule": ["$.equal", "$.dict", ["a", "b"], "string"]
});

console.log(check1({
    "a": "123",
    "b": "321"
}));
