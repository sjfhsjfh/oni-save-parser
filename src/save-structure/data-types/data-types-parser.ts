import {
  ParseIterator,
  UnparseIterator,
  writeSingle,
  writeInt32,
  ReadSingleInstruction,
  ReadInt32Instruction
} from "../../parser";

import { Vector2, Vector2I, Vector3, Quaternion } from "./data-types";

export function* parseVector2(): ParseIterator<Vector2> {
  return {
    x: yield new ReadSingleInstruction(),
    y: yield new ReadSingleInstruction()
  };
}
export function* unparseVector2(value: Vector2): UnparseIterator {
  yield writeSingle(value.x);
  yield writeSingle(value.y);
}

export function* parseVector2I(): ParseIterator<Vector2I> {
  return {
    x: yield new ReadInt32Instruction(),
    y: yield new ReadInt32Instruction()
  };
}
export function* unparseVector2I(value: Vector2I): UnparseIterator {
  yield writeInt32(value.x);
  yield writeInt32(value.y);
}

export function* parseVector3(): ParseIterator<Vector3> {
  return {
    x: yield new ReadSingleInstruction(),
    y: yield new ReadSingleInstruction(),
    z: yield new ReadSingleInstruction()
  };
}
export function* unparseVector3(value: Vector3): UnparseIterator {
  yield writeSingle(value.x);
  yield writeSingle(value.y);
  yield writeSingle(value.z);
}

export function* parseQuaternion(): ParseIterator<Quaternion> {
  return {
    x: yield new ReadSingleInstruction(),
    y: yield new ReadSingleInstruction(),
    z: yield new ReadSingleInstruction(),
    w: yield new ReadSingleInstruction()
  };
}
export function* unparseQuaternion(value: Quaternion): UnparseIterator {
  yield writeSingle(value.x);
  yield writeSingle(value.y);
  yield writeSingle(value.z);
  yield writeSingle(value.w);
}
