import {parse} from "babylon";
import walk from "./walker.js";
import visitor from "./visitor.js";
import serialize from "./serializer.js";

export default function ebnf(source, min_name_length = 0) {
    let grammar_ast = parse(source, {sourceType: "module"});
    let rules = walk(grammar_ast, visitor);
    let state = {
        max_name_length: Math.max(min_name_length, ...rules.map(rule => rule.name.length)),
    };
    return rules.map(rule => serialize(rule, state)).join("");
}
