"use strict";
/**
 * @module cli
 *
 * Main CLI module
 *
 * To add more commands/modify existing commands, add a new file/edit the existing file in the `src/cli` directory and export a `mount` function of `MountFunction` type.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const test_1 = require("./test");
const commands = [test_1.mount];
const mount = (y) => commands.reduce((y, c) => c(y), y);
try {
    mount((0, yargs_1.default)(process.argv.slice(2))).help().argv;
}
catch (e) {
    console.error(e.stack);
    process.exit(1);
}
//# sourceMappingURL=index.js.map