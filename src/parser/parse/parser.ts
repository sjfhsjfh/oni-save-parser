import { DataReader, ZlibDataReader } from "../../binary-serializer";

import {
  BasicReadInstruction,
  InstOf,
  isReadInstruction,
  PrimaryInstruction,
  PrimaryNameReturn,
  PrimaryTName,
  ReadCompressedInstruction,
} from "./read-instructions";
import { ParseError } from "../errors";
import { ParserInstruction } from "../types";

// Typescript currently does not support specifying the return value of an iterator.
//  We could use IterableIterator<ReadInstructions | T>, but that throws errors
//  when the parser delegates to sub-generators.
export type ParseIterator<T> = Generator<ParserInstruction, T, any>;
export type ParseInterceptor = (
  instruction: ParserInstruction
) => ParserInstruction;

export function parse<T>(
  reader: DataReader,
  readParser: ParseIterator<T>,
  interceptor?: ParseInterceptor
): T {
  let nextValue: any = undefined;
  while (true) {
    let iteratorResult: IteratorResult<ParserInstruction, T>;
    try {
      iteratorResult = readParser.next(nextValue);
    } catch (e) {
      throw ParseError.create(e, reader.position);
    }

    if (iteratorResult.done) return iteratorResult.value;

    let value = iteratorResult.value;

    value = interceptor ? interceptor(value) : value;

    if (value.isMeta) continue;

    if (!(value instanceof BasicReadInstruction)) {
      throw new Error("Cannot yield a non-parse-instruction.");
    }
    try {
      if (
        !(
          value.dataType in primaryReadParsers ||
          value.dataType === "compressed"
        )
      ) {
        throw new Error(`Unknown read instruction dataType: ${value.dataType}`);
      }
      nextValue = executeReadInstruction(reader, value, interceptor);
    } catch (e) {
      const err = ParseError.create(e, reader.position);
      throw err;
    }
  }
}

type PrimaryParser<TName extends PrimaryTName> = (
  reader: DataReader,
  inst: PrimaryInstruction[TName],
  interceptor?: ParseInterceptor
) => PrimaryNameReturn[TName];
type PrimaryParsers = { [P in PrimaryTName]: PrimaryParser<P> };

const primaryReadParsers: PrimaryParsers = {
  byte: (r, _) => r.readByte(),
  "signed-byte": (r, _) => r.readSByte(),
  "byte-array": (r, i) =>
    i.length == null ? r.readAllBytes() : r.readBytes(i.length),
  "uint-16": (r, _) => r.readUInt16(),
  "int-16": (r, _) => r.readInt16(),
  "uint-32": (r, _) => r.readUInt32(),
  "int-32": (r, _) => r.readInt32(),
  "uint-64": (r, _) => r.readUInt64(),
  "int-64": (r, _) => r.readInt64(),
  single: (r, _) => r.readSingle(),
  double: (r, _) => r.readDouble(),
  chars: (r, i) => r.readChars(i.length),
  "klei-string": (r, _) => r.readKleiString(),
  "skip-bytes": (r, i) => r.skipBytes(i.length),
  "reader-position": (r, _) => r.position
};

function parseCompressed<TReturn>(
  reader: DataReader,
  inst: ReadCompressedInstruction<TReturn>,
  interceptor?: ParseInterceptor
): TReturn {
  const bytes = reader.readAllBytes();
  const new_reader = new ZlibDataReader(new Uint8Array(bytes));
  return parse(new_reader, inst.parser, interceptor);
}

function executeReadInstruction<TReturn>(
  reader: DataReader,
  inst: InstOf<TReturn>,
  interceptor?: ParseInterceptor
): TReturn {
  if (inst.type !== "read") {
    // TODO: remove, unreachable code
    throw new Error("Expected a read parse instruction.");
  }

  if (!isReadInstruction(inst)) {
    throw new Error("Expected a read instruction.");
  }

  function compressed<TReturn>(
    inst: any
  ): inst is ReadCompressedInstruction<TReturn> {
    return inst instanceof ReadCompressedInstruction;
  }

  if (compressed<TReturn>(inst)) {
    return parseCompressed(reader, inst, interceptor);
  }

  // Here `TReturn` must be extends `PrimaryReturn`
  return (primaryReadParsers[inst.dataType] as any)(
    reader,
    inst,
    interceptor
  ) as TReturn;
}
