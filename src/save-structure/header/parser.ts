import { TextDecoder, TextEncoder } from "text-encoding";

import { validate } from "jsonschema";

import {
  ParseIterator,
  writeUInt32,
  writeBytes,
  UnparseIterator,
  ReadUInt32Instruction,
  ReadBytesInstruction
} from "../../parser";

import { SaveGameHeader, headerSchema } from "./header";

export function* parseHeader(): ParseIterator<SaveGameHeader> {
  const buildVersion = yield new ReadUInt32Instruction();
  const headerSize = yield new ReadUInt32Instruction();
  const headerVersion = yield new ReadUInt32Instruction();
  const isCompressed =
    headerVersion >= 1 ? Boolean(yield new ReadUInt32Instruction()) : false;

  const infoBytes = yield new ReadBytesInstruction(headerSize);
  const infoStr = new TextDecoder("utf-8").decode(infoBytes);
  const gameInfo = JSON.parse(infoStr);

  const header: SaveGameHeader = {
    buildVersion,
    headerVersion,
    isCompressed,
    gameInfo
  };
  return header;
}

export function* unparseHeader(header: SaveGameHeader): UnparseIterator {
  validate(header, headerSchema, { throwError: true });

  const { buildVersion, headerVersion, isCompressed, gameInfo } = header;

  const infoStr = JSON.stringify(gameInfo);
  const headerBytes = new TextEncoder("utf-8").encode(infoStr);

  yield writeUInt32(buildVersion);
  yield writeUInt32(headerBytes.byteLength);
  yield writeUInt32(headerVersion);
  if (headerVersion >= 1) {
    yield writeUInt32(isCompressed ? 1 : 0);
  }

  yield writeBytes(headerBytes.buffer);
}
