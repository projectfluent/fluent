import {Pattern} from "../../syntax/parser/ast.js";

export interface Message {
    readonly id: string;
    readonly value: Pattern | null;
    readonly attributes: Record<string, Pattern>;
}
