"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressInstruction = void 0;
class ProgressInstruction {
    constructor(message) {
        this.message = message;
        this.type = "progress";
        this.isMeta = true;
    }
}
exports.ProgressInstruction = ProgressInstruction;
//# sourceMappingURL=types.js.map