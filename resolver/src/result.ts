export interface IResult<T> {
    map(fn: IMapper<T>): IResult<T>;
    then(fn: IChainer<T>): IResult<T>;
    else(fn: IChainer<T>): IResult<T>;
    fold(s: IMapper<T>, f: IMapper<T>): T;
}

interface IMapper<T> {
    (value: T): T;
}

interface IChainer<T> {
    (value: T): IResult<T>;
}

export class Success<T> implements IResult<T> {
    constructor(private value: T) {}
    map(fn: IMapper<T>): IResult<T> {
        return new Success(fn(this.value));
    }
    then(fn: IChainer<T>) {
        return fn(this.value);
    }
    else(fn: IChainer<T>) {
        return this;
    }
    fold(s: IMapper<T>, f: IMapper<T>): T {
        return s(this.value);
    }
}

export class Failure<T> implements IResult<T> {
    constructor(private value: T) {}
    map(fn: IMapper<T>): IResult<T> {
        return this;
    }
    then(fn: IChainer<T>): IResult<T> {
        return this;
    }
    else(fn: IChainer<T>): IResult<T> {
        return fn(this.value);
    }
    fold(s: IMapper<T>, f: IMapper<T>) {
        return f(this.value);
    }
}
