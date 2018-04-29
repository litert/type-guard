/*
   +----------------------------------------------------------------------+
   | LiteRT TypeGuard.js Library                                          |
   +----------------------------------------------------------------------+
   | Copyright (c) 2018 Fenying Studio                                    |
   +----------------------------------------------------------------------+
   | This source file is subject to version 2.0 of the Apache license,    |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | https://github.com/litert/type-guard/blob/master/LICENSE             |
   +----------------------------------------------------------------------+
   | Authors: Angus Fenying <fenying@litert.org>                          |
   +----------------------------------------------------------------------+
 */

import * as TyG from ".";

class Compiler4JavaScript
implements TyG.Compiler4JavaScript {

    private _compiler: TyG.Compiler;

    public constructor() {

        this._compiler = TyG.createCompiler(new TyG.JavaScriptLanguage());
    }

    public compile<T = any>(
        rule: any,
        stopOnEntry?: boolean
    ): TyG.TypeChecker<T> {

        const result = this._compiler.compile(rule);

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
