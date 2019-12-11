import {Scope} from "./scope";

export interface Value {
    readonly value: unknown;
    format(scope: Scope): string;
}

export class NoneValue implements Value {
    readonly value: string;

    constructor(value: string = "???") {
        this.value = value;
    }

    format(scope: Scope) {
        return `{${this.value}}`;
    }
}

export class StringValue implements Value {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    format(scope: Scope) {
        return this.value;
    }
}

export class NumberValue implements Value {
    readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    format(scope: Scope) {
        return this.value.toString(10);
    }
}
