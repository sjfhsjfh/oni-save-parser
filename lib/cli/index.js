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
    }, test_1.test)
        .help().argv;
}
catch (e) {
    console.error(e.stack);
    process.exit(1);
}
//# sourceMappingURL=index.js.map