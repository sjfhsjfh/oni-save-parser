/**
 * @module cli
 *
 * Main CLI module
 *
 * To add more commands/modify existing commands, add a new file/edit the existing file in the `src/cli` directory and export a `mount` function of `MountFunction` type.
 */

import yargs from "yargs";
import { mount as mountTest } from "./test";
import { mount as mountShow } from "./show";

export type MountFunction = (y: yargs.Argv) => yargs.Argv;

const commands: MountFunction[] = [mountTest, mountShow];
const mount: MountFunction = (y: yargs.Argv) =>
  commands.reduce((y, c) => c(y), y);

try {
  mount(yargs(process.argv.slice(2))).help().argv;
} catch (e) {
  console.error(e.stack);
  process.exit(1);
}
