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

import * as C from './Common';
import * as I from './Internal';

export class FilterCompiler
implements I.IFilterCompiler {

    public constructor(
        private _lang: C.ILanguageBuilder,
        private _bitc: I.IBuiltInTypeCompiler
    ) {}

    public compile(rule: string, ctx: I.IContext): string {

        let vName = ctx.vName;

        const filter = rule.slice(1).split(' ');

        if (filter.slice(2).length !== filter.slice(2).filter((x) => /^\d+(\.\d+)?$/.test(x)).length) {

            throw new TypeError('Only number is allowed as filter arguments.');
        }

        let ret: string[] = [];

        switch (filter[0]) {
            case 'array.length':
                ret.push(this._lang.isArray(vName, true));
                vName = this._lang.arrayLength(vName);
                break;
            case 'string.length':
                ret.push(this._lang.isString(vName, true));
                vName = this._lang.stringLength(vName);
                break;
            case 'value':
                ret.push(this._lang.isNumber(vName, true));
                break;
            default:
                ret.push(this._bitc.compile(filter[0], ctx, []));
                break;
        }

        switch (filter[1]) {
            case 'between':

                if (filter.length !== 4) {
                    throw new TypeError(`Filter ${filter[1]} require 2 arguments.`);
                }

                ret.push(this._lang.gte(vName, filter[2]));
                ret.push(this._lang.lte(vName, filter[3]));

                break;

            case 'gt':
            case '>':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.gt(vName, filter[2]));

                break;

            case 'ge':
            case 'gte':
            case '>=':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.gte(vName, filter[2]));

                break;

            case 'lt':
            case '<':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.lt(vName, filter[2]));

                break;

            case 'le':
            case 'lte':
            case '<=':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.lte(vName, filter[2]));

                break;

            case 'eq':
            case '==':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.eq(vName, filter[2]));

                break;

            case 'ne':
            case '!=':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.ne(vName, filter[2]));

                break;

            case 'timesof':

                if (filter.length !== 3) {
                    throw new TypeError(`Filter ${filter[1]} require 1 argument.`);
                }

                ret.push(this._lang.eq(
                    this._lang.modOf(vName, filter[2]),
                    '0'
                ));

                break;

            default:

                throw new TypeError(`Unknown filter type "${filter[1]}".`);
        }

        return this._lang.and(ret);
    }
}
