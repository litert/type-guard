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

import * as C from "./Common";

export class Context implements C.IContext {

    public trace: boolean;

    public tracePoint: number;

    public vCursor: number;

    public stack: C.IContextData[];

    public flags: Record<string, C.EFlagValue>;

    public constructor(
        public vName: string,
        public readonly typeSlotName: string,
        public readonly referredTypes: Record<string, boolean>
    ) {
        this.stack = [];

        this.vCursor = 0;

        this.flags = {};

        this.tracePoint = 0;

        this.trace = false;
    }

    public trap(subjChanged: boolean = false): void {

        this.stack.push({
            vName: this.vName,
            flags: this.flags
        });

        const prevFlags = this.flags;

        this.flags = {};

        for (const key in prevFlags) {

            if (subjChanged) {

                if (prevFlags[key] === C.EFlagValue.ELEMENT_INHERIT) {

                    this.flags[key] = prevFlags[key];
                }
            }
            else if (
                prevFlags[key] === C.EFlagValue.INHERIT ||
                prevFlags[key] === C.EFlagValue.ELEMENT_INHERIT
            ) {

                this.flags[key] = prevFlags[key];
            }
        }
    }

    public untrap(): void {

        const prev = this.stack.pop();

        if (!prev) {

            throw new Error("Failed to pop stack.");
        }

        this.vName = prev.vName;
        this.flags = prev.flags;
    }
}
