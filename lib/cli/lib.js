"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTestArgs = void 0;
function parseTestArgs(rawArgs) {
    let saveFile = rawArgs._.shift();
    if (!saveFile) {
        throw new Error("Missing required argument: saveFile");
    }
    let showProgress = rawArgs["progress"] === true;
    let showTags = rawArgs["progress-tags"] === true;
    return { saveFile, showProgress, showTags };
}
exports.parseTestArgs = parseTestArgs;
//# sourceMappingURL=lib.js.map