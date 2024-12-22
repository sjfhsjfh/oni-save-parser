"use strict";
/**
 * @module test
 *
 * Original Test function by @RoboPhred
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = mount;
const deep_diff_1 = require("deep-diff");
const save_structure_1 = require("../save-structure");
const lib_1 = require("./lib");
function mount(y) {
    return y.command("test <file> [options]", "Legacy test", yargs => {
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
        });
    }, test);
}
function test(argv) {
    const showProgress = argv.progress;
    const showTags = argv["progress-tags"];
    const fileName = argv.file;
    const versionStrictness = argv["version-strictness"];
    const currentTagPath = [];
    console.log("Loading save");
    const saveData = (0, lib_1.loadFile)(fileName, currentTagPath, showProgress, showTags, versionStrictness);
    const modifiers = (0, save_structure_1.getBehavior)(saveData.gameObjects.find(x => x.name === "Minion").gameObjects[0], save_structure_1.MinionModifiersBehavior);
    console.log("modifiers", JSON.stringify(modifiers, null, 2));
    console.log("re-saving");
    const writebackName = `${fileName}-writeback`;
    (0, lib_1.saveFile)(writebackName, saveData, currentTagPath, showProgress, showTags);
    console.log("reloading");
    const writebackData = (0, lib_1.loadFile)(writebackName, currentTagPath, showProgress, showTags, versionStrictness);
    console.log("diffing");
    const writebackDiff = checkDiff(saveData, writebackData);
    const hasChanges = writebackDiff && writebackDiff.length;
    if (hasChanges) {
        console.error("Changes detected");
        console.dir(writebackDiff);
        process.exit(1);
    }
    console.log("Seen objects:\n", saveData.gameObjects.map(x => x.name).join("\n"));
    console.log("done");
    function checkDiff(original, modified) {
        original = Object.assign(Object.assign({}, original), { world: Object.assign(Object.assign({}, original.world), { streamed: null }) });
        modified = Object.assign(Object.assign({}, modified), { world: Object.assign(Object.assign({}, modified.world), { streamed: null }) });
        return (0, deep_diff_1.diff)(original, modified);
    }
}
//# sourceMappingURL=test.js.map