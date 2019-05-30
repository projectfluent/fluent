export interface Result<T> {
    map(fn: Mapper<T>): Result<T>;
    then(fn: Chainer<T>): Result<T>;
    else(fn: Chainer<T>): Result<T>;
    fold(s: Mapper<T>, f: Mapper<T>): T;
}

interface Mapper<T> {
    (value: T): T;
}

interface Chainer<T> {
    (value: T): Result<T>;
}

export class Success<T> implements Result<T> {
    constructor(private value: T) {}
    map(fn: Mapper<T>): Result<T> {
        return new Success(fn(this.value));
    }
    then(fn: Chainer<T>) {
        return fn(this.value);
    }
    else(fn: Chainer<T>) {
        return this;
    }
    fold(s: Mapper<T>, f: Mapper<T>): T {
        return s(this.value);
    }
}

export class Failure<T> implements Result<T> {
    constructor(private value: T) {}
    map(fn: Mapper<T>): Result<T> {
        return this;
    }
    then(fn: Chainer<T>): Result<T> {
        return this;
    }
    else(fn: Chainer<T>): Result<T> {
        return fn(this.value);
    }
    fold(s: Mapper<T>, f: Mapper<T>) {
        return f(this.value);
    }
}
