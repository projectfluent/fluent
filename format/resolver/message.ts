import {Pattern} from "../../syntax/parser/ast";

export interface Message {
    readonly id: string;
    readonly value: Pattern | null;
    readonly attributes: Record<string, Pattern>;
}
