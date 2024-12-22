export declare abstract class ParserInstruction {
    abstract type: string;
    abstract isMeta: boolean;
}
export declare function isMetaInstruction(inst: ParserInstruction): boolean;
