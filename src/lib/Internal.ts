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

export const MAP_SUFFIX = '{}';

export const LIST_SUFFIX = '[]';

export const MODIFIER_PREFIX = '$.';

export const FILTER_PREFIX = '|';

export const IMPLICIT_SYMBOL = '?';

export const PREDEF_TYPE_SYMBOL = '@';

export const NEGATIVE_SYMBOL = '!';

export const KEY_MAP_SUFFIX = `->${MAP_SUFFIX}`;

export const KEY_LIST_SUFFIX = `->${LIST_SUFFIX}`;

export const KEY_ARRAY_SUFFIX = /->\[\s*(\d+)(\s*,\s*(\d+)?)?\s*\]$/;

export const KEY_STRICT_SUFFIX = '->()';

export const KEY_EQUAL_SUFFIX = '->(=)';

export enum EFlags {

    FROM_STRING,
    STRICT,
    OPTIONAL,
    REQUIRED,
    ARRAY
}

export enum EFlagValue {

    /**
     * Disabled.
     */
    NO,

    /**
     * Enabled but not inheritable.
     */
    YES,

    /**
     * Enabled and inheritable if not deep into sub element.
     */
    INHERIT,

    /**
     * Enabled and inheritable even deep into sub element.
     */
    ELEMENT_INHERIT
}

export interface IContextData {

    flags: Record<string, EFlagValue>;

    vName: string;

    tracePath: string;
}

export interface IContext extends IContextData {

    vTraceName: string;

    vTracePrefix: string;

    vCursor: number;

    readonly stack: IContextData[];

    readonly typeSlotName: string;

    readonly referredTypes: Record<string, boolean>;

    trap(subjChanged?: boolean): void;

    untrap(): void;
}

export interface IFilterCompiler {

    compile(rule: string, ctx: IContext): string;
}

export interface IBuiltInTypeCompiler {

    /**
     * Check if a type is a built-in type.
     *
     * @param type The type to be checked.
     */
    isBuiltInType(type: string): boolean;

    compile(type: string, ctx: IContext, args: number[]): string;

    /**
     * Check if a type is string type.
     *
     * @param type The type to be checked.
     */
    isStringType(type: string): boolean;

    isConstructed(type: string): boolean;

    isElemental(type: string): boolean;
}

export const RE_VALID_CUSTOM_TYPE_NAME = /^[-:.\w]+$/;
