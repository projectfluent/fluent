export enum ErrorKind {
    UnknownVariable,
    UnknownMessage,
    MissingValue,
}

export class ScopeError extends Error {
    public kind: ErrorKind;
    public arg: string;

    constructor(kind: ErrorKind, arg: string) {
        super();
        this.kind = kind;
        this.arg = arg;
    }
}
