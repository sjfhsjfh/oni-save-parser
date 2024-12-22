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
  [TName in PrimaryTName]: PrimaryNameReturn[TName] extends TReturn
    ? TName
    : never
}[PrimaryTName];

export type InstOf<TReturn> = TReturn extends PrimaryReturn
  ? PrimaryInstruction[TNameOf<TReturn>]
  : ReadCompressedInstruction<TReturn>;

export type PrimaryReturn = PrimaryNameReturn[PrimaryTName];

export abstract class BasicReadInstruction<
  TName extends string
> extends ParserInstruction {
  public type: "read" = "read";
  public isMeta: false = false;
  abstract dataType: TName;
}

export class ReadByteInstruction extends BasicReadInstruction<"byte"> {
  public dataType: "byte" = "byte";
}

export class ReadSByteInstruction extends BasicReadInstruction<"signed-byte"> {
  public dataType: "signed-byte" = "signed-byte";
}

export class ReadBytesInstruction extends BasicReadInstruction<"byte-array"> {
  public dataType: "byte-array" = "byte-array";
  constructor(public length?: number) {
    super();
  }
}

export class ReadUInt16Instruction extends BasicReadInstruction<"uint-16"> {
  public dataType: "uint-16" = "uint-16";
}

export class ReadInt16Instruction extends BasicReadInstruction<"int-16"> {
  public dataType: "int-16" = "int-16";
}

export class ReadUInt32Instruction extends BasicReadInstruction<"uint-32"> {
  public dataType: "uint-32" = "uint-32";
}

export class ReadInt32Instruction extends BasicReadInstruction<"int-32"> {
  public dataType: "int-32" = "int-32";
}

export class ReadUInt64Instruction extends BasicReadInstruction<"uint-64"> {
  public dataType: "uint-64" = "uint-64";
}

export class ReadInt64Instruction extends BasicReadInstruction<"int-64"> {
  public dataType: "int-64" = "int-64";
}

export class ReadSingleInstruction extends BasicReadInstruction<"single"> {
  public dataType: "single" = "single";
}

export class ReadDoubleInstruction extends BasicReadInstruction<"double"> {
  public dataType: "double" = "double";
}

export class ReadCharsInstruction extends BasicReadInstruction<"chars"> {
  public dataType: "chars" = "chars";
  constructor(public length: number) {
    super();
  }
}

export class ReadKleiStringInstruction extends BasicReadInstruction<
  "klei-string"
> {
  public dataType: "klei-string" = "klei-string";
}

export class SkipBytesInstruction extends BasicReadInstruction<"skip-bytes"> {
  public dataType: "skip-bytes" = "skip-bytes";
  constructor(public length: number) {
    super();
  }
}

export class ReadCompressedInstruction<TInner> extends BasicReadInstruction<
  "compressed"
> {
  public dataType: "compressed" = "compressed";
  constructor(public parser: ParseIterator<TInner>) {
    super();
  }
}

export class GetReaderPosition extends BasicReadInstruction<"reader-position"> {
  public dataType: "reader-position" = "reader-position";
}

export type ReadInstruction =
  | ReadByteInstruction
  | ReadSByteInstruction
  | ReadBytesInstruction
  | ReadUInt16Instruction
  | ReadInt16Instruction
  | ReadUInt32Instruction
  | ReadInt32Instruction
  | ReadUInt64Instruction
  | ReadInt64Instruction
  | ReadSingleInstruction
  | ReadDoubleInstruction
  | ReadCharsInstruction
  | ReadKleiStringInstruction
  | SkipBytesInstruction
  | ReadCompressedInstruction<any>
  | GetReaderPosition;

export function isReadInstruction(value: any): value is ReadInstruction {
  return (
    value instanceof ReadByteInstruction ||
    value instanceof ReadSByteInstruction ||
    value instanceof ReadBytesInstruction ||
    value instanceof ReadUInt16Instruction ||
    value instanceof ReadInt16Instruction ||
    value instanceof ReadUInt32Instruction ||
    value instanceof ReadInt32Instruction ||
    value instanceof ReadUInt64Instruction ||
    value instanceof ReadInt64Instruction ||
    value instanceof ReadSingleInstruction ||
    value instanceof ReadDoubleInstruction ||
    value instanceof ReadCharsInstruction ||
    value instanceof ReadKleiStringInstruction ||
    value instanceof SkipBytesInstruction ||
    value instanceof ReadCompressedInstruction ||
    value instanceof GetReaderPosition
  );
}
