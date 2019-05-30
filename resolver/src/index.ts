import * as ast from "./ast";
import {Scope} from "./scope";
import {StringValue} from "./value";

let message = {
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
                        name: "userName",
                    },
                },
            },
        ],
    },
    attributes: [],
    comment: null,
};

let variables = new Map(
    Object.entries({
        username: new StringValue("Anne"),
    })
);
let scope = new Scope(variables);
let value = scope.resolve(message.value as ast.IPattern);
console.log(value);
console.log(scope.errors);
