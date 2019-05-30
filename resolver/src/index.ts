import * as ast from "./ast";
import {Scope} from "./scope";
import {StringValue} from "./value";
import {Message} from "./message";
import {hello, exclamation, select} from "./fixtures";

let messages = new Map(
    Object.entries({
        hello: new Message(hello as ast.Message),
        exclamation: new Message(exclamation as ast.Message),
        select: new Message(select as ast.Message),
    })
);

let variables = new Map(
    Object.entries({
        world: new StringValue("World"),
        selector: new StringValue("b"),
    })
);
let scope = new Scope(messages, variables);
let message = messages.get("select");
if (message !== undefined) {
    let value = message.resolveValue(scope);
    console.log(value);
    console.log(scope.errors);
}
