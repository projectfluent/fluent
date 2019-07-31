import {Resource} from "../../format/resolver/ast";
interface Result<T, E> {
    fold(s: (value: T) => T, f: (err: E) => never): T;
}

interface Parser {
    run(input: string): Result<Resource, string>;
}

export declare let Resource: Parser;
