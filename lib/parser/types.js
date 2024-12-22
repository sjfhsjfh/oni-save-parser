"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserInstruction = void 0;
exports.isMetaInstruction = isMetaInstruction;
class ParserInstruction {
}
exports.ParserInstruction = ParserInstruction;
function isMetaInstruction(inst) {
    return inst !== null && typeof inst === "object" && !!inst.isMeta;
}
//# sourceMappingURL=types.js.map