interface IResult<T> {
    andThen(fn: IChainer<T>): IResult<T>;
    orElse(fn: IChainer<T>): IResult<T>;
    unwrapOrElse(fn: IMapper<T>): T;
}

interface IMapper<T> {
    (value: T): T;
}

interface IChainer<T> {
    (value: T): Result<T>;
}

export type Result<T> = Success<T> | Failure<T>;

export class Success<T> implements IResult<T> {
    private readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    andThen(fn: IChainer<T>) {
        return fn(this.value);
    }
    orElse(fn: IChainer<T>) {
        return this;
    }
    unwrapOrElse(fn: IMapper<T>) {
        return this.value;
    }
}

export class Failure<T> implements IResult<T> {
    private readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    andThen(fn: IChainer<T>) {
        return this;
    }
    orElse(fn: IChainer<T>) {
        return fn(this.value);
    }
    unwrapOrElse(fn: IMapper<T>) {
        return fn(this.value);
    }
}
