"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVector2 = parseVector2;
exports.unparseVector2 = unparseVector2;
exports.parseVector2I = parseVector2I;
exports.unparseVector2I = unparseVector2I;
exports.parseVector3 = parseVector3;
exports.unparseVector3 = unparseVector3;
exports.parseQuaternion = parseQuaternion;
exports.unparseQuaternion = unparseQuaternion;
const parser_1 = require("../../parser");
function* parseVector2() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction()
    };
}
function* unparseVector2(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
}
function* parseVector2I() {
    return {
        x: yield new parser_1.ReadInt32Instruction(),
        y: yield new parser_1.ReadInt32Instruction()
    };
}
function* unparseVector2I(value) {
    yield (0, parser_1.writeInt32)(value.x);
    yield (0, parser_1.writeInt32)(value.y);
}
function* parseVector3() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction(),
        z: yield new parser_1.ReadSingleInstruction()
    };
}
function* unparseVector3(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
    yield (0, parser_1.writeSingle)(value.z);
}
function* parseQuaternion() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction(),
        z: yield new parser_1.ReadSingleInstruction(),
        w: yield new parser_1.ReadSingleInstruction()
    };
}
function* unparseQuaternion(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
    yield (0, parser_1.writeSingle)(value.z);
    yield (0, parser_1.writeSingle)(value.w);
}
//# sourceMappingURL=data-types-parser.js.map