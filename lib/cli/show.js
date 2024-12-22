"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = mount;
const lib_1 = require("./lib");
function mount(y) {
    return y.command("show <file> <path> [options]", "Legacy test", yargs => {
        yargs
            .option("progress", {
            type: "boolean",
            default: false,
            description: "Show progress"
        })
            .option("progress-tags", {
            type: "boolean",
            default: false,
            description: "Show progress tags"
        })
            .option("version-strictness", {
            type: "string",
            alias: "s",
            default: "minor",
            description: "Version strictness, must be 'none', 'major', or 'minor'"
        })
            .positional("file", {
            describe: "File name",
            type: "string"
        })
            .positional("path", {
            decribe: "Object key path, separated by dots",
            type: "string"
        });
    }, show);
}
function show(argv) {
    const path = argv.path;
    const showProgress = argv.progress;
    const showTags = argv["progress-tags"];
    const fileName = argv.file;
    const versionStrictness = argv["version-strictness"];
    const currentTagPath = [];
    console.log("Loading save");
    const saveData = (0, lib_1.loadFile)(fileName, currentTagPath, showProgress, showTags, versionStrictness);
    // TODO: "." in key
    const keys = path.split(".");
    let obj = saveData;
    for (const key of keys) {
        obj = obj[key];
    }
    console.log(obj);
}
//# sourceMappingURL=show.js.map