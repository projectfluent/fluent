import * as ast from "./ast";
import {Scope} from "./scope";
import {StringValue} from "./value";
import {Message} from "./message";

let hello = {
    type: "Message",
    id: {
        type: "Identifer",
        name: "hello",
    },
    value: {
        type: "Pattern",
        elements: [
            {
                type: "TextElement",
                value: "Hello, ",
            },
            {
                type: "Placeable",
                expression: {
                    type: "VariableReference",
                    id: {
                        type: "Identifier",
                        name: "world",
                    },
                },
            },
        ],
    },
};

let exclamation = {
    type: "Message",
    id: {
        type: "Identifier",
        name: "exclamation",
    },
    value: {
        type: "Pattern",
        elements: [
            {
                type: "Placeable",
                expression: {
                    type: "MessageReference",
                    id: {
                        type: "Identifier",
                        name: "hello",
                    },
                    attribute: null,
                },
            },
            {
                type: "TextElement",
                value: "!",
            },
        ],
    },
};

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
