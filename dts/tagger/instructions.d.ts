import { ParserInstruction } from "../parser/types";
type TaggedParseStart = "tagged-parse:start";
type TaggedParseEnd = "tagged-parse:end";
type TaggedParseType = TaggedParseStart | TaggedParseEnd;
export declare class TaggedParseInstruction implements ParserInstruction {
    type: TaggedParseType;
    tag: string;
    instanceName?: string | undefined;
    isMeta: true;
    constructor(type: TaggedParseType, tag: string, instanceName?: string | undefined);
    static start(tag: string, instanceName?: string): TaggedParseInstruction;
    static end(tag: string, instanceName?: string): TaggedParseInstruction;
    isStart(): boolean;
    isEnd(): boolean;
}
export {};
