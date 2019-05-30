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

export let select = {
    type: "Message",
    id: {
        type: "Identifier",
        name: "select",
    },
    value: {
        type: "Pattern",
        elements: [
            {
                type: "Placeable",
                expression: {
                    type: "SelectExpression",
                    selector: {
                        type: "VariableReference",
                        id: {
                            type: "Identifier",
                            name: "selector",
                        },
                    },
                    variants: [
                        {
                            type: "Variant",
                            key: {
                                type: "Identifier",
                                name: "a",
                            },
                            value: {
                                type: "Pattern",
                                elements: [
                                    {
                                        type: "TextElement",
                                        value: "(a) ",
                                    },
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
                                ],
                            },
                            default: true,
                        },
                        {
                            type: "Variant",
                            key: {
                                type: "Identifier",
                                name: "b",
                            },
                            value: {
                                type: "Pattern",
                                elements: [
                                    {
                                        type: "TextElement",
                                        value: "(b) ",
                                    },
                                    {
                                        type: "Placeable",
                                        expression: {
                                            type: "MessageReference",
                                            id: {
                                                type: "Identifier",
                                                name: "exclamation",
                                            },
                                            attribute: null,
                                        },
                                    },
                                ],
                            },
                            default: false,
                        },
                    ],
                },
            },
        ],
    },
};
