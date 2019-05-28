import * as ast from "./ast";
import {Resolver} from "./resolver";

let message = {
    "type": "Message",
    "id": {
        "type": "Identifer",
        "name": "hello"
    },
    "value": {
        "type": "Pattern",
        "elements": [
            {
                "type": "TextElement",
                "value": "Hello, "
            },
            {
                "type": "Placeable",
                "expression": {
                    "type": "VariableReference",
                    "id": {
                        "type": "Identifier",
                        "name": "userName"
                    }
                }
            }
        ]
    },
    "attributes": [],
    "comment": null
};


let variables = new Map([["userName", "Anne"]]);
let resolver = new Resolver(variables);
let value = resolver.resolve(message.value as ast.IPattern);
console.log(value);
