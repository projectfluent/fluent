import {Scope} from "./scope";

export interface IValue {
    readonly value: null | string | number;
    format(scope: Scope): null | string;
}

export class NoneValue implements IValue {
    value = null;
    format(scope: Scope) {
        return null;
    }
}

export class StringValue implements IValue {
    constructor(readonly value: string) {}

    format(scope: Scope) {
        return this.value;
    }
}

export class NumberValue implements IValue {
    constructor(readonly value: number) {}

    format(scope: Scope) {
        return this.value.toString();
    }
}
