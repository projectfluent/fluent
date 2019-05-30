import * as ast from "./ast";
import {Scope} from "./scope";

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

let variables = new Map([["userName", "Anne"]]);
let scope = new Scope(variables);
let value = scope.resolve(message.value as ast.IPattern);
console.log(value);
