interface IResult<T> {
    then(fn: IChainer<T>): IResult<T>;
    else(fn: IChainer<T>): IResult<T>;
    fold(s: IMapper<T>, f: IMapper<T>): T;
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
    then(fn: IChainer<T>) {
        return fn(this.value);
    }
    else(fn: IChainer<T>) {
        return this;
    }
    fold(s: IMapper<T>, f: IMapper<T>) {
        return s(this.value);
    }
}

export class Failure<T> implements IResult<T> {
    private readonly value: T;
    constructor(value: T) {
        this.value = value;
    }
    then(fn: IChainer<T>) {
        return this;
    }
    else(fn: IChainer<T>) {
        return fn(this.value);
    }
    fold(s: IMapper<T>, f: IMapper<T>) {
        return f(this.value);
    }
}
