"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressReporter = exports.reportProgress = void 0;
const types_1 = require("./types");
function reportProgress(message) {
    return new types_1.ProgressInstruction(message);
}
exports.reportProgress = reportProgress;
function progressReporter(onProgress) {
    return (instruction) => {
        if (instruction && instruction instanceof types_1.ProgressInstruction) {
            onProgress(instruction.message);
        }
        return instruction;
    };
}
exports.progressReporter = progressReporter;
//# sourceMappingURL=index.js.map