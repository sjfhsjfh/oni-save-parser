"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseQuaternion = exports.parseQuaternion = exports.unparseVector3 = exports.parseVector3 = exports.unparseVector2I = exports.parseVector2I = exports.unparseVector2 = exports.parseVector2 = void 0;
const parser_1 = require("../../parser");
function* parseVector2() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction()
    };
}
exports.parseVector2 = parseVector2;
function* unparseVector2(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
}
exports.unparseVector2 = unparseVector2;
function* parseVector2I() {
    return {
        x: yield new parser_1.ReadInt32Instruction(),
        y: yield new parser_1.ReadInt32Instruction()
    };
}
exports.parseVector2I = parseVector2I;
function* unparseVector2I(value) {
    yield (0, parser_1.writeInt32)(value.x);
    yield (0, parser_1.writeInt32)(value.y);
}
exports.unparseVector2I = unparseVector2I;
function* parseVector3() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction(),
        z: yield new parser_1.ReadSingleInstruction()
    };
}
exports.parseVector3 = parseVector3;
function* unparseVector3(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
    yield (0, parser_1.writeSingle)(value.z);
}
exports.unparseVector3 = unparseVector3;
function* parseQuaternion() {
    return {
        x: yield new parser_1.ReadSingleInstruction(),
        y: yield new parser_1.ReadSingleInstruction(),
        z: yield new parser_1.ReadSingleInstruction(),
        w: yield new parser_1.ReadSingleInstruction()
    };
}
exports.parseQuaternion = parseQuaternion;
function* unparseQuaternion(value) {
    yield (0, parser_1.writeSingle)(value.x);
    yield (0, parser_1.writeSingle)(value.y);
    yield (0, parser_1.writeSingle)(value.z);
    yield (0, parser_1.writeSingle)(value.w);
}
exports.unparseQuaternion = unparseQuaternion;
//# sourceMappingURL=data-types-parser.js.map