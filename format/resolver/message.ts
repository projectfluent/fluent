import {Pattern} from "./ast";

export interface Message {
    readonly id: string;
    readonly value: Pattern | null;
    readonly attributes: Record<string, Pattern>;
}
