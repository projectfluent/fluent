export let hello = {
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

export let exclamation = {
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
