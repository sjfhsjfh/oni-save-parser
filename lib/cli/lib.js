"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFile = loadFile;
exports.saveFile = saveFile;
const fs_1 = require("fs");
const __1 = require("..");
const progress_1 = require("../progress");
const tagger_1 = require("../tagger");
const lodash_flowright_1 = __importDefault(require("lodash.flowright"));
function loadFile(fileName, currentTagPath, showProgress = false, showTags = false, versionStrictness = "minor") {
    const fileData = (0, fs_1.readFileSync)(`./test-data/${fileName}.sav`);
    let interceptors = [];
    if (showProgress) {
        interceptors.push((0, progress_1.progressReporter)(console.log.bind(console, "LOADING")));
    }
    if (showTags) {
        interceptors.push((0, tagger_1.tagReporter)(console.log.bind(console, "LOAD-TAG-START"), console.log.bind(console, "LOAD-TAG-END")));
    }
    const interceptor = lodash_flowright_1.default((x) => x, ...interceptors);
    try {
        return (0, __1.parseSaveGame)(fileData.buffer, {
            interceptor,
            versionStrictness
        });
    }
    catch (e) {
        console.error(`Load error at ${currentTagPath.join(" => ")}`);
        e.tagPath = [...currentTagPath];
        throw e;
    }
}
function saveFile(fileName, save, currentTagPath, showProgress, showTags) {
    let interceptors = [];
    if (showProgress) {
        interceptors.push((0, progress_1.progressReporter)(console.log.bind(console, "SAVING")));
    }
    interceptors.push((0, tagger_1.tagReporter)(onTagStart, onTagEnd));
    // const interceptor = compose((x: any) => x, ...interceptors);
    const interceptor = interceptors.reduce((a, b) => (x) => b(a(x)), (x) => x);
    try {
        const fileData = (0, __1.writeSaveGame)(save, interceptor);
        (0, fs_1.writeFileSync)(`./test-data/${fileName}.sav`, new Uint8Array(fileData));
    }
    catch (e) {
        console.error(`Save error at ${currentTagPath.join(" => ")}`);
        e.tagPath = [...currentTagPath];
        throw e;
    }
    function onTagStart(tagName, instanceName) {
        if (showTags) {
            console.log("TAG_START", tagName, instanceName);
        }
        const part = instanceName ? `${tagName}::${instanceName}` : tagName;
        currentTagPath.push(part);
    }
    function onTagEnd(tagName, instanceName) {
        if (showTags) {
            console.log("TAG_END", tagName, instanceName);
        }
        const part = instanceName ? `${tagName}::${instanceName}` : tagName;
        if (currentTagPath[currentTagPath.length - 1] !== part) {
            debugger;
        }
        currentTagPath.pop();
    }
}
//# sourceMappingURL=lib.js.map