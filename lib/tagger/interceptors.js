"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagReporter = void 0;
const instructions_1 = require("./instructions");
function tagReporter(onTagStart, onTagEnd) {
    return (inst) => {
        if (inst instanceof instructions_1.TaggedParseInstruction) {
            if (inst.isStart()) {
                onTagStart(inst.tag, inst.instanceName || null);
            }
            else if (onTagEnd && inst.isEnd()) {
                onTagEnd(inst.tag, inst.instanceName || null);
            }
        }
        return inst;
    };
}
exports.tagReporter = tagReporter;
//# sourceMappingURL=interceptors.js.map