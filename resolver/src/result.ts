type Value = number | string | Date;

export interface IResult {
    map(fn: IMapper): IResult;
    then(fn: IChainer): IResult;
    else(fn: IChainer): IResult;
    fold(s: IMapper, f: IMapper): Value;
}

interface IMapper {
    (value: Value): Value;
}

interface IChainer {
    (value: Value): IResult;
}

export class Success implements IResult {
    constructor(private value: Value) {}
    map(fn: IMapper): IResult {
        return new Success(fn(this.value));
    }
    then(fn: IChainer) {
        return fn(this.value);
    }
    else(fn: IChainer) {
        return this;
    }
    fold(s: IMapper, f: IMapper): Value {
        return s(this.value);
    }
}

export class Failure implements IResult {
    constructor(private value: Value) {}
    map(fn: IMapper): IResult {
        return this;
    }
    then(fn: IChainer): IResult {
        return this;
    }
    else(fn: IChainer): IResult {
        return fn(this.value);
    }
    fold(s: IMapper, f: IMapper) {
        return f(this.value);
    }
}
