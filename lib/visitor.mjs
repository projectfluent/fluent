export default {
    File(node, state, cont) {
        return cont(node.program, state);
    },
    Program(node, state, cont) {
        return node.body
            .map(statement => cont(statement, state))
            .filter(production => production !== undefined);
    },
    ExportNamedDeclaration(node, state, cont) {
        let {declaration, leadingComments} = node;
        let comments = leadingComments && {
            block_comments: leadingComments
                .filter(comm => comm.type === "CommentBlock")
                .map(comm => cont(comm, state))
        };
        return cont(declaration, {...state, ...comments});
    },
    VariableDeclaration(node, state, cont) {
        let {declarations, leadingComments} = node;
        let [declaration] = declarations;
        let comments = leadingComments && {
            block_comments: leadingComments
                .filter(comm => comm.type === "CommentBlock")
                .map(comm => cont(comm, state))
        };
        return cont(declaration, {...state, ...comments});
    },
    VariableDeclarator(node, state, cont) {
        let {id: {name}, init} = node;
        let {block_comments = []} = state;
        let expression = cont(init, state);
        return {type: "Rule", name, expression, block_comments};
    },
    CallExpression(node, state, cont) {
        let {callee, arguments: args} = node;
        switch (callee.type) {
            case "MemberExpression":
                return cont(callee.object, state);
            case "Identifier": {
                let {name} = callee;
                // defer(() => parser) is used to avoid cyclic dependencies.
                if (name === "defer") {
                    let [arrow_fn] = args;
                    return cont(arrow_fn.body, state);
                }

                // Don't recurse into always() and never(). They don't parse
                // the input and are only used for convenient AST building.
                if (name === "always" || name === "never") {
                    return {type: "Operator", name, args: []};
                }

                return {
                    type: "Operator",
                    name,
                    args: args.map(arg => cont(arg, state)),
                };
            }
        }
    },
    MemberExpression(node, state, cont) {
        return cont(node.object, state);
    },
    Identifier(node, state, cont) {
        let {name} = node;
        return {type: "Symbol", name};
    },
    StringLiteral({value}, state, cont) {
        return {type: "Terminal", value: escape(value)};
    },
    RegExpLiteral({pattern}, state, cont) {
        return {type: "Terminal", value: pattern};
    },
    CommentBlock({value}, state, cont) {
        return {type: "Comment", value};
    },
};

function escape(str) {
    return str
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        // Replace all Control and non-Basic Latin characters.
        .replace(/([^\u0021-\u007E])/g, unicode_sequence);
}

function unicode_sequence(char) {
    let code_point = char.codePointAt(0).toString(16);
    return `\\u${code_point.toUpperCase().padStart(4, "0")}`;
}
