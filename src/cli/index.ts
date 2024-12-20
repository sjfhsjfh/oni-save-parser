import yargs from "yargs";
import { test } from "./test";

try{
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
        .positional("file", {
          describe: "File name",
          type: "string"
        });
    },
    argv => {
      const showProgress = argv.progress as boolean;
      const showTags = argv["progress-tags"] as boolean;
      const fileName = argv.file as string;

      test(fileName, showProgress, showTags);
    }
  )
  .help().argv
} catch (e) {
  console.error(e.stack);
  process.exit(1);
}
