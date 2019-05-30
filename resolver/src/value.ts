import {Scope} from "./scope";

export interface Value {
    readonly value: null | string | number;
    format(scope: Scope): null | string;
}

export class NoneValue implements Value {
    value = null;
    format(scope: Scope) {
        return null;
    }
}

export class StringValue implements Value {
    constructor(readonly value: string) {}

    format(scope: Scope) {
        return this.value;
    }
}

export class NumberValue implements Value {
    constructor(readonly value: number) {}

    format(scope: Scope) {
        return this.value.toString();
    }
}
