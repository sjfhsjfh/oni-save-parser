import yargs from "yargs";
import { test } from "./test";

try {
  yargs(process.argv.slice(2))
    .command(
      "test <file>",
      "Legacy test",
      yargs => {
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
            description:
              "Version strictness, must be 'none', 'major', or 'minor'"
          })
          .positional("file", {
            describe: "File name",
            type: "string"
          });
      },
      test
    )
    .help().argv;
} catch (e) {
  console.error(e.stack);
  process.exit(1);
}
