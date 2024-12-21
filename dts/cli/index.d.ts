/**
 * @module cli
 *
 * Main CLI module
 *
 * To add more commands/modify existing commands, add a new file/edit the existing file in the `src/cli` directory and export a `mount` function of `MountFunction` type.
 */
import yargs from "yargs";
export type MountFunction = (y: yargs.Argv) => yargs.Argv;
