"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportProgress = reportProgress;
exports.progressReporter = progressReporter;
const types_1 = require("./types");
function reportProgress(message) {
    return new types_1.ProgressInstruction(message);
}
function progressReporter(onProgress) {
    return (instruction) => {
        if (instruction && instruction instanceof types_1.ProgressInstruction) {
            onProgress(instruction.message);
        }
        return instruction;
    };
}
//# sourceMappingURL=index.js.map