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

import { createCompiler } from './Compiler';
import { createJavaScriptLanguageBuilder } from './langs/JavaScript';
import * as C from './Common';
import * as I from './Internal';

export interface IInlineCompileOptions extends C.ICompileOptions {

    /**
     * Added `debugger` statement before executing checking code.
     */
    'stopOnEntry'?: boolean;
}

export interface IInlineCompiler {

    /**
     * Compile the rule and wrap the result into a JavaScript function, so that
     * it could be invoked directly.
     *
     * @param options The options of compilation.
     */
    compile<T>(options: IInlineCompileOptions): C.ITypeChecker<T>;

    /**
     * Get the type-checker of a pre-defined type.
     *
     * @param name The name of the pre-defined type.
     */
    getPredefinedType<T>(name: string): C.ITypeChecker<T>;

    /**
     * Register a pre-defined type checker.
     *
     * @param name      The name of the pre-defined type (without prefix `@`)
     * @param checker   The checker callback of the pre-defined type.
     */
    addPredefinedType<T>(name: string, checker: C.ITypeChecker<T>): this;

    /**
     * Check if a pre-defined type is compiled.
     *
     * @param name The name of the pre-defined type.
     */
    hasPredefinedType(name: string): boolean;

    /**
     * Get the names list of undefined but referred pre-defined types.
     */
    detectUndefinedTypes(): string[];
}

class InlineCompiler
implements IInlineCompiler {

    private _defTypes: Record<string, C.ITypeChecker<any>>;

    private _missingTypes: Record<string, boolean>;

    private readonly _compiler: C.ICompiler;

    public constructor() {

        this._defTypes = {};

        this._missingTypes = {};

        const lang = createJavaScriptLanguageBuilder();

        this._compiler = createCompiler(
            lang
        );
    }

    public compile<T>(options: IInlineCompileOptions): C.ITypeChecker<T> {

        const result = this._compiler.compile(options);

        this._preapreDefinedTypes(result.referredTypes, options.stopOnEntry);

        return this._wrapCheckerCode(result, options.stopOnEntry);
    }

    private _preapreDefinedTypes(
        types: string[],
        stopOnEntry?: boolean
    ): void {

        for (const x of types) {

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

    public addPredefinedType(name: string, checker: C.ITypeChecker<any>): this {

        if (!I.RE_VALID_CUSTOM_TYPE_NAME.test(name)) {

            throw new TypeError(`Invalid name ${ JSON.stringify(name) } for a pre-defined type.`);
        }

        this._defTypes[name] = checker;

        return this;
    }

    public detectUndefinedTypes(): string[] {

        return Object.keys(this._missingTypes);
    }

    public hasPredefinedType(name: string): boolean {

        return !!this._defTypes[name];
    }

    public getPredefinedType(name: string): C.ITypeChecker<any> {

        if (!this._defTypes[name]) {

            throw new Error(`Pre-defined type "${name}" doesn't exist.`);
        }

        return this._defTypes[name];
    }

    private _wrapCheckerCode(
        info: C.ICompileResult,
        stopOnEntry: boolean = false
    ): C.ITypeChecker<any> {

        const soe = stopOnEntry ? 'debugger;' : '';

        return (new Function(
            info.typeSlotName,
            `return function(${
                info.arguments
                    .map((a) => a.initial ? `${a.name} = ${a.initial}` : a.name)
                    .join(',')
            }) {
                ${soe}

                return ${info.source};
            };`
        ))(this._defTypes);
    }
}

/**
 * Create a compiler object that compiles the rule into JavaScript lambda code.
 */
export function createInlineCompiler(): IInlineCompiler {

    return new InlineCompiler();
}
