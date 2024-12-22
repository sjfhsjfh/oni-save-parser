import { ParserInstruction } from "../parser/types";
export declare class ProgressInstruction implements ParserInstruction {
    message: string;
    type: "progress";
    isMeta: true;
    constructor(message: string);
}
