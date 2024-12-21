import yargs from "yargs";
import { mount as mountTest } from "./test";

const commands: ((y: yargs.Argv) => yargs.Argv)[] = [mountTest];
const mount = (y: yargs.Argv) => commands.reduce((y, c) => c(y), y);

try {
  mount(yargs(process.argv.slice(2))).help().argv;
} catch (e) {
  console.error(e.stack);
  process.exit(1);
}
