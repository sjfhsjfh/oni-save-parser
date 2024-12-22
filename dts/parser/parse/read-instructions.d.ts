import { LongNum } from "../../binary-serializer/types";
import { ParserInstruction } from "../types";
import { ParseIterator } from "./parser";
export type PrimaryNameReturn = {
    byte: number;
    "signed-byte": number;
    "byte-array": ArrayBuffer;
    "uint-16": number;
    "int-16": number;
    "uint-32": number;
    "int-32": number;
    "uint-64": LongNum;
    "int-64": LongNum;
    single: number;
    double: number;
    chars: string;
    "klei-string": string | null;
    "skip-bytes": void;
    "reader-position": number;
};
export type PrimaryTName = keyof PrimaryNameReturn & string;
export type PrimaryInstruction = {
    byte: ReadByteInstruction;
    "signed-byte": ReadSByteInstruction;
    "byte-array": ReadBytesInstruction;
    "uint-16": ReadUInt16Instruction;
    "int-16": ReadInt16Instruction;
    "uint-32": ReadUInt32Instruction;
    "int-32": ReadInt32Instruction;
    "uint-64": ReadUInt64Instruction;
    "int-64": ReadInt64Instruction;
    single: ReadSingleInstruction;
    double: ReadDoubleInstruction;
    chars: ReadCharsInstruction;
    "klei-string": ReadKleiStringInstruction;
    "skip-bytes": SkipBytesInstruction;
    "reader-position": GetReaderPosition;
};
export type TNameOf<TReturn> = {
    [TName in PrimaryTName]: PrimaryNameReturn[TName] extends TReturn ? TName : never;
}[PrimaryTName];
export type InstOf<TReturn> = TReturn extends PrimaryReturn ? PrimaryInstruction[TNameOf<TReturn>] : ReadCompressedInstruction<TReturn>;
export type PrimaryReturn = PrimaryNameReturn[PrimaryTName];
export declare abstract class BasicReadInstruction<TName extends string> extends ParserInstruction {
    type: "read";
    isMeta: false;
    abstract dataType: TName;
}
export declare class ReadByteInstruction extends BasicReadInstruction<"byte"> {
    dataType: "byte";
}
export declare class ReadSByteInstruction extends BasicReadInstruction<"signed-byte"> {
    dataType: "signed-byte";
}
export declare class ReadBytesInstruction extends BasicReadInstruction<"byte-array"> {
    length?: number | undefined;
    dataType: "byte-array";
    constructor(length?: number | undefined);
}
export declare class ReadUInt16Instruction extends BasicReadInstruction<"uint-16"> {
    dataType: "uint-16";
}
export declare class ReadInt16Instruction extends BasicReadInstruction<"int-16"> {
    dataType: "int-16";
}
export declare class ReadUInt32Instruction extends BasicReadInstruction<"uint-32"> {
    dataType: "uint-32";
}
export declare class ReadInt32Instruction extends BasicReadInstruction<"int-32"> {
    dataType: "int-32";
}
export declare class ReadUInt64Instruction extends BasicReadInstruction<"uint-64"> {
    dataType: "uint-64";
}
export declare class ReadInt64Instruction extends BasicReadInstruction<"int-64"> {
    dataType: "int-64";
}
export declare class ReadSingleInstruction extends BasicReadInstruction<"single"> {
    dataType: "single";
}
export declare class ReadDoubleInstruction extends BasicReadInstruction<"double"> {
    dataType: "double";
}
export declare class ReadCharsInstruction extends BasicReadInstruction<"chars"> {
    length: number;
    dataType: "chars";
    constructor(length: number);
}
export declare class ReadKleiStringInstruction extends BasicReadInstruction<"klei-string"> {
    dataType: "klei-string";
}
export declare class SkipBytesInstruction extends BasicReadInstruction<"skip-bytes"> {
    length: number;
    dataType: "skip-bytes";
    constructor(length: number);
}
export declare class ReadCompressedInstruction<TInner> extends BasicReadInstruction<"compressed"> {
    parser: ParseIterator<TInner>;
    dataType: "compressed";
    constructor(parser: ParseIterator<TInner>);
}
export declare class GetReaderPosition extends BasicReadInstruction<"reader-position"> {
    dataType: "reader-position";
}
export type ReadInstruction = ReadByteInstruction | ReadSByteInstruction | ReadBytesInstruction | ReadUInt16Instruction | ReadInt16Instruction | ReadUInt32Instruction | ReadInt32Instruction | ReadUInt64Instruction | ReadInt64Instruction | ReadSingleInstruction | ReadDoubleInstruction | ReadCharsInstruction | ReadKleiStringInstruction | SkipBytesInstruction | ReadCompressedInstruction<any> | GetReaderPosition;
export declare function isReadInstruction(value: any): value is ReadInstruction;
