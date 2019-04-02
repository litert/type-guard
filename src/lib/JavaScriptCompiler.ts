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

import { Compiler } from "./CheckerCompiler";
import { createJavaScriptLanguageBuilder } from "./langs/JavaScript";
import { BuiltInTypeCompiler } from "./BuiltInTypeCompiler";
import { FilterCompiler } from "./FilterCompiler";
import * as C from "./Common";

export interface IJITCompileOptions extends C.ICompileOptions {

    /**
     * Added `debugger` statement before executing checking code.
     */
    "stopOnEntry"?: boolean;
}

export interface IJavaScriptJIT {

    /**
     * Compile the rule and wrap the result into a JavaScript function, so that
     * it could be invoked directly.
     *
     * @param options The options of compilation.
     */
    compile<T>(options: IJITCompileOptions): C.TypeChecker<T>;

    /**
     * Get the type-checker of a pre-defined type.
     *
     * @param name The name of the pre-defined type.
     */
    getPredefinedType<T>(name: string): C.TypeChecker<T>;

    /**
     * Check if a pre-defined type is compiled.
     *
     * @param name The name of the pre-defined type.
     */
    hasPredefinedType(name: string): boolean;

    /**
     * Get the names list of undefined pre-defined types.
     */
    detectUndefinedTypes(): string[];
}

class JavaScriptJIT
implements IJavaScriptJIT {

    private _defTypes: Record<string, C.TypeChecker<any>>;

    private _missingTypes: Record<string, boolean>;

    private _compiler: C.ICompiler;

    public constructor() {

        this._defTypes = {};

        this._missingTypes = {};

        const lang = createJavaScriptLanguageBuilder();

        const bitc = new BuiltInTypeCompiler(lang);

        this._compiler = new Compiler(
            lang,
            bitc,
            new FilterCompiler(lang, bitc)
        );
    }

    public compile<T>(options: IJITCompileOptions): C.TypeChecker<T> {

        const result = this._compiler.compile(options);

        this._preapreDefinedTypes(result.referredTypes, options.stopOnEntry);

        return this._wrapCheckerCode(result, options.stopOnEntry);
    }

    private _preapreDefinedTypes(
        types: string[],
        stopOnEntry?: boolean
    ): void {

        for (let x of types) {

            if (this._defTypes[x]) {

                continue;
            }

            const info = this._compiler.getPredefinedType(x);

            if (!info) {

                this._missingTypes[x] = true;
                continue;
            }

            this._defTypes[x] = this._wrapCheckerCode(info, stopOnEntry);

            this._preapreDefinedTypes(info.referredTypes);

            delete this._missingTypes[x];
        }
    }

    public detectUndefinedTypes(): string[] {

        return Object.keys(this._missingTypes);
    }

    public hasPredefinedType(name: string): boolean {

        return !!this._defTypes[name];
    }

    public getPredefinedType(name: string): C.TypeChecker<any> {

        if (!this._defTypes[name]) {

            throw new Error(`Pre-defined type "${name}" doesn't exist.`);
        }

        return this._defTypes[name];
    }

    private _wrapCheckerCode(
        info: C.ICompileResult,
        stopOnEntry: boolean = false
    ): C.TypeChecker<any> {

        const soe = stopOnEntry ? "debugger;" : "";

        return (new Function(
            info.typeSlotName,
            `return function(${info.arguments[0].name}) {${soe}

                return ${info.source};
            };`
        ))(this._defTypes);
    }
}

export function createJavaScriptJIT(): IJavaScriptJIT {

    return new JavaScriptJIT();
}
