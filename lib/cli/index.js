"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const test_1 = require("./test");
try {
    (0, yargs_1.default)(process.argv.slice(2))
        .command("test <file>", "Legacy test", yargs => {
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
            .positional("file", {
            describe: "File name",
            type: "string"
        });
    }, argv => {
        const showProgress = argv.progress;
        const showTags = argv["progress-tags"];
        const fileName = argv.file;
        (0, test_1.test)(fileName, showProgress, showTags);
    })
        .help().argv;
}
catch (e) {
    console.error(e.stack);
    process.exit(1);
}
//# sourceMappingURL=index.js.map