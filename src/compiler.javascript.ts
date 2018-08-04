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

import * as TyG from ".";

class Compiler4JavaScript
implements TyG.Compiler4JavaScript {

    private _compiler: TyG.Compiler;

    public constructor() {

        this._compiler = TyG.createCompiler(new TyG.JavaScriptLanguage());
    }

    public compile<T = any>(
        schema: any,
        stopOnEntry?: boolean
    ): TyG.TypeChecker<T> {

        const result = this._compiler.compile(schema);

        return <TyG.TypeChecker<T>> new Function(
            result.inputVariable,
            `${stopOnEntry && "debugger;" || ""} return ${result.source};`
        );
    }
}

export function createCompiler4JavaScript(): TyG.Compiler4JavaScript {

    return new Compiler4JavaScript();
}

export default createCompiler4JavaScript;
