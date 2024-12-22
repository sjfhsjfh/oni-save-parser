import {
  ParseIterator,
  UnparseIterator,
  writeInt32,
  writeByte,
  ReadByteInstruction,
  ReadInt32Instruction
} from "../../../parser";

import {
  TemplateParser,
  TemplateUnparser
} from "../../type-templates/template-data-parser";

import {
  parseVector3,
  parseQuaternion,
  unparseVector3,
  unparseQuaternion
} from "../../../save-structure/data-types/data-types-parser";

import { GameObject } from "../game-object";

import { GameObjectBehavior } from "../game-object-behavior";
import {
  parseGameObjectBehavior,
  unparseGameObjectBehavior
} from "../game-object-behavior/parser";

export function* parseGameObject(
  templateParser: TemplateParser
): ParseIterator<GameObject> {
  const position = yield* parseVector3();
  const rotation = yield* parseQuaternion();
  const scale = yield* parseVector3();
  const folder = yield new ReadByteInstruction();

  const behaviorCount = yield new ReadInt32Instruction();

  const behaviors: GameObjectBehavior[] = new Array(behaviorCount);
  for (let i = 0; i < behaviorCount; i++) {
    behaviors[i] = yield* parseGameObjectBehavior(templateParser);
  }

  const gameObject: GameObject = {
    position,
    rotation,
    scale,
    folder,
    behaviors
  };

  return gameObject;
}

export function* unparseGameObject(
  gameObject: GameObject,
  templateUnparser: TemplateUnparser
): UnparseIterator {
  const { position, rotation, scale, folder, behaviors } = gameObject;

  yield* unparseVector3(position);
  yield* unparseQuaternion(rotation);
  yield* unparseVector3(scale);
  yield writeByte(folder);

  yield writeInt32(behaviors.length);

  for (const behavior of behaviors) {
    yield* unparseGameObjectBehavior(behavior, templateUnparser);
  }
}
