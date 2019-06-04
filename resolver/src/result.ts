interface IResult<T> {
    andThen(fn: (value: T) => IResult<T>): IResult<T>;
    orElse(fn: (value: T) => IResult<T>): IResult<T>;
    unwrapOrElse(fn: (value: T) => T): T;
}

export type Result<T> = Success<T> | Failure<T>;

export class Success<T> implements IResult<T> {
    private readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    andThen(fn: (value: T) => Result<T>): Result<T> {
        return fn(this.value);
    }
    orElse(fn: (value: T) => Result<T>): Result<T> {
        return this;
    }
    unwrapOrElse(fn: (value: T) => T) {
        return this.value;
    }
}

export class Failure<T> implements IResult<T> {
    private readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    andThen(fn: (value: T) => Result<T>): Result<T> {
        return this;
    }
    orElse(fn: (value: T) => Result<T>): Result<T> {
        return fn(this.value);
    }
    unwrapOrElse(fn: (value: T) => T) {
        return fn(this.value);
    }
}
