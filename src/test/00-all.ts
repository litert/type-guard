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

import testElementalTypes from './01-elemental-types';
import testArrayAndList from './02-array-and-list';
import testTuple from './03-tuple';
import testFromString from './04-from-string';
import testStringAssert from './05-string-asserts';
import testStructure from './06-structure';
import testModifiers from './07-modifiers';
import testMapAndDict from './08-map-and-dict';
import testExceptions from './09-exceptions';

testElementalTypes();
testArrayAndList();
testTuple();
testFromString();
testStringAssert();
testStructure();
testModifiers();
testMapAndDict();
testExceptions();
