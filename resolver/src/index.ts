import * as ast from "./ast";
import {Scope} from "./scope";
import {StringValue} from "./value";
import {Message} from "./message";
import {hello, exclamation} from "./fixtures";

let messages = new Map(
    Object.entries({
        hello: new Message(hello as ast.IMessage),
        exclamation: new Message(exclamation as ast.IMessage),
    })
);

let variables = new Map(
    Object.entries({
        world: new StringValue("World"),
    })
);
let scope = new Scope(messages, variables);
let message = messages.get("exclamation");
if (message !== undefined) {
    let value = message.resolveValue(scope);
    console.log(value);
    console.log(scope.errors);
}
