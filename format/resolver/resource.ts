import {Entry} from "../../syntax/parser/ast";
import {Resource as ResourceParser} from "../../syntax/parser/grammar";

export class Resource {
    public readonly body: Array<Entry>;

    constructor(source: string) {
        this.body = this.parse(source).body;
    }

    private parse(source: string) {
        return ResourceParser.run(source).fold(
            resource => resource,
            err => {
                throw err;
            }
        );
    }
}
