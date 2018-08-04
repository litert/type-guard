/*
 * Copyright 2018 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export {

    TypeChecker,
    Language,
    Compiler,
    Compiler4JavaScript,
    BuiltInTypes,
    AdvancedTypes

} from "./common";

export { createCompiler } from "./compiler";
export { createCompiler4JavaScript } from "./compiler.javascript";

export { JavaScriptLanguage } from "./lang.javascript";
