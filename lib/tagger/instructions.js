"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggedParseInstruction = void 0;
class TaggedParseInstruction {
    constructor(type, tag, instanceName) {
        this.type = type;
        this.tag = tag;
        this.instanceName = instanceName;
        this.isMeta = true;
    }
    static start(tag, instanceName) {
        return new TaggedParseInstruction("tagged-parse:start", tag, instanceName);
    }
    static end(tag, instanceName) {
        return new TaggedParseInstruction("tagged-parse:end", tag, instanceName);
    }
    isStart() {
        return this.type === "tagged-parse:start";
    }
    isEnd() {
        return this.type === "tagged-parse:end";
    }
}
exports.TaggedParseInstruction = TaggedParseInstruction;
//# sourceMappingURL=instructions.js.map