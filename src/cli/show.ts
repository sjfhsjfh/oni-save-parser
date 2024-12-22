import yargs from "yargs";
import { VersionStrictness } from "../save-structure/version";
import { loadFile } from "./lib";

export function mount(y: yargs.Argv) {
  return y.command(
    "show <file> <path> [options]",
    "show value",
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
    },
    show
  );
}

function show(argv: yargs.ArgumentsCamelCase) {
  const path = argv.path as string;
  const showProgress = argv.progress as boolean;
  const showTags = argv["progress-tags"] as boolean;
  const fileName = argv.file as string;
  const versionStrictness = argv["version-strictness"] as VersionStrictness;

  const currentTagPath: string[] = [];
  console.log("Loading save");
  const saveData = loadFile(
    fileName,
    currentTagPath,
    showProgress,
    showTags,
    versionStrictness
  );

  // TODO: "." in key
  const keys: string[] = path.split(".");
  let obj: any = saveData;
  for (const key of keys) {
    obj = obj[key];
  }
  console.log(obj);
}
