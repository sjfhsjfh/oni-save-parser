"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMetaInstruction = exports.ParserInstruction = void 0;
class ParserInstruction {
}
exports.ParserInstruction = ParserInstruction;
function isMetaInstruction(inst) {
    return inst !== null && typeof inst === "object" && !!inst.isMeta;
}
exports.isMetaInstruction = isMetaInstruction;
//# sourceMappingURL=types.js.map