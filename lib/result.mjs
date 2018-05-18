class Result {
    constructor(value, rest) {
        this.value = value;
        this.rest = rest;
    }
}

export class Success extends Result {
    map(fn) {
        return new Success(fn(this.value), this.rest);
    }
    bimap(s, f) {
        return new Success(s(this.value), this.rest);
    }
    chain(fn) {
        return fn(this.value, this.rest);
    }
    fold(s, f) {
        return s(this.value, this.rest);
    }
}

export class Failure extends Result {
    map(fn) {
        return this;
    }
    bimap(s, f) {
        return new Failure(f(this.value), this.rest);
    }
    chain(fn) {
        return this;
    }
    fold(s, f) {
        return f(this.value, this.rest);
    }
}
