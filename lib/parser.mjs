import Stream from "./stream.mjs";
import {Failure} from "./result.mjs";

export class Abstract {
    constructor(value) {
        this.value = value;
    }
}

export default class Parser {
    constructor(parse) {
        this.parse = parse;
    }

    run(iterable) {
        const stream = iterable instanceof Stream
            ? iterable
            : new Stream(iterable);
        try {
            return this.parse(stream);
        } catch (err) {
            // console.error(err.message);
            return new Failure(err.message, stream);
        }
    }

    get abstract() {
        return this.map(value => new Abstract(value));
    }

    map(f) {
        return new Parser(stream => this.run(stream).map(f));
    }

    bimap(s, f) {
        return new Parser(stream => this.run(stream).bimap(s, f));
    }

    chain(f) {
        return new Parser(stream =>
            this.run(stream).chain(
                (value, tail) => f(value).run(tail)));
    }

    fold(s, f) {
        return new Parser(stream => this.run(stream).fold(s, f));
    }
}
