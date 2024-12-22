import {
  ParseIterator,
  ReadKleiStringInstruction,
  UnparseIterator,
  writeKleiString
} from "../../parser";

import {
  TemplateParser,
  TemplateUnparser
} from "../type-templates/template-data-parser";

import { validateDotNetIdentifierName } from "../../utils";

import { SaveGameData } from "./game-data";

const AssemblyTypeName = "Game+GameSaveData";

export function* parseGameData({
  parseByTemplate
}: TemplateParser): ParseIterator<SaveGameData> {
  const typeName = yield new ReadKleiStringInstruction();
  validateDotNetIdentifierName(typeName);
  if (typeName !== AssemblyTypeName) {
    throw new Error(
      `Expected type name "${AssemblyTypeName}" but got "${typeName}".`
    );
  }

  const gameData = yield* parseByTemplate<SaveGameData>(AssemblyTypeName);
  return gameData;
}

export function* writeGameData(
  gameData: SaveGameData,
  { unparseByTemplate }: TemplateUnparser
): UnparseIterator {
  yield writeKleiString(AssemblyTypeName);
  yield* unparseByTemplate(AssemblyTypeName, gameData);
}
