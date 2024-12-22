import {
  ParseIterator,
  ReadInt32Instruction,
  UnparseIterator,
  writeInt32
} from "../../parser";

import {
  TemplateParser,
  TemplateUnparser
} from "../type-templates/template-data-parser";

import { GameObjectGroup } from "./game-object-group";
import {
  parseGameObjectGroup,
  unparseGameObjectGroup
} from "./game-object-group/parser";

export function* parseGameObjects(
  templateParser: TemplateParser
): ParseIterator<GameObjectGroup[]> {
  const count = yield new ReadInt32Instruction();
  const groups: GameObjectGroup[] = new Array(count);
  for (let i = 0; i < count; i++) {
    groups[i] = yield* parseGameObjectGroup(templateParser);
  }
  return groups;
}

export function* unparseGameObjects(
  lists: GameObjectGroup[],
  templateWriter: TemplateUnparser
): UnparseIterator {
  yield writeInt32(lists.length);
  for (const group of lists) {
    yield* unparseGameObjectGroup(group, templateWriter);
  }
}
