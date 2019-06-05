export default function serialize_rule(rule, state) {
    let {name, expression, block_comments} = rule;
    let lhs = name.padEnd(state.max_name_length);
    let rhs = serialize_expression(expression, state);
    let comment = serialize_comments(block_comments);
    return `${comment}${lhs} ::= ${rhs}\n`;
}

function serialize_comments(comments) {
    let contents = [];
    for (let {value} of comments) {
        if (/^[ =*/-]*$/.test(value)) {
            contents.push("");
        } else {
            contents.push(`/*${value}*/`);
        }
    }
    return contents.length ? contents.join("\n") + "\n" : "";
}

function serialize_expression(expression, state) {
    switch (expression.type) {
        case "Symbol":
            return expression.name;
        case "Terminal":
            return expression.value;
        case "Operator":
            return serialize_operator(expression, state);
    }
}

function serialize_operator({name, args}, state) {
    let serialized_args = args.map(arg => serialize_expression(arg, {...state, parent: name}));

    function ensure_prec(text) {
        return state.parent ? `(${text})` : text;
    }

    switch (name) {
        case "always": {
            return null;
        }
        case "and": {
            return ensure_prec(serialized_args.reverse().join(" "));
        }
        case "char": {
            return `"${serialized_args[0]}"`;
        }
        case "charset": {
            return `[${serialized_args[0]}]`;
        }
        case "either": {
            if (state.parent) {
                return `(${serialized_args.join(" | ")})`;
            }

            // Add 5 to align with "<rule name> ::= ".
            let padding = state.max_name_length + 5;
            return serialized_args.join("\n" + " | ".padStart(padding));
        }
        case "eof": {
            return "EOF";
        }
        case "maybe": {
            return `${serialized_args[0]}?`;
        }
        case "never": {
            return null;
        }
        case "not": {
            return `- ${serialized_args[0]}`;
        }
        case "regex": {
            return `/${serialized_args[0]}/`;
        }
        case "repeat": {
            return `${serialized_args[0]}*`;
        }
        case "repeat1": {
            return `${serialized_args[0]}+`;
        }
        case "sequence": {
            return ensure_prec(serialized_args.filter(Boolean).join(" "));
        }
        case "string": {
            return `"${serialized_args[0]}"`;
        }
    }
}
