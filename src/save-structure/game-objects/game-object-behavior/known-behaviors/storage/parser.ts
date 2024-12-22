import { validateDotNetIdentifierName } from "../../../../../utils";

import {
  ParseIterator,
  ReadInt32Instruction,
  ReadKleiStringInstruction,
  UnparseIterator,
  writeInt32,
  writeKleiString
} from "../../../../../parser";

import {
  TemplateParser,
  TemplateUnparser
} from "../../../../type-templates/template-data-parser";

import {
  parseGameObject,
  unparseGameObject
} from "../../../game-object/parser";

import { StoredGameObject } from "./storage";

export function* parseStorageExtraData(
  templateParser: TemplateParser
): ParseIterator<StoredGameObject[]> {
  const itemCount: number = yield new ReadInt32Instruction();
  const items = new Array(itemCount);
  for (let i = 0; i < itemCount; i++) {
    const name = yield new ReadKleiStringInstruction();
    validateDotNetIdentifierName(name);
    const gameObject = yield* parseGameObject(templateParser);
    items[i] = {
      name,
      ...gameObject
    };
  }
  return items;
}

export function* unparseStorageExtraData(
  extraData: StoredGameObject[],
  templateUnparser: TemplateUnparser
): UnparseIterator {
  yield writeInt32(extraData.length);
  for (const gameObject of extraData) {
    yield writeKleiString(gameObject.name);
    yield* unparseGameObject(gameObject, templateUnparser);
  }
}
