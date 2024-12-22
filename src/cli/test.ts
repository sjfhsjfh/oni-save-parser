/**
 * @module test
 *
 * Original Test function by @RoboPhred
 */

import { readFileSync, writeFileSync } from "fs";
import compose from "lodash.flowright";
import { diff } from "deep-diff";

import {
  parseSaveGame,
  writeSaveGame,
  progressReporter,
  tagReporter
} from "../index";

import {
  SaveGame,
  MinionModifiersBehavior,
  getBehavior
} from "../save-structure";
import { ParseInterceptor } from "../parser";
import { VersionStrictness } from "../save-structure/version";
import yargs from "yargs";
import { loadFile, saveFile } from "./lib";

export function mount(y: yargs.Argv) {
  return y.command(
    "test <file> [options]",
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
          description: "Version strictness, must be 'none', 'major', or 'minor'"
        })
        .positional("file", {
          describe: "File name",
          type: "string"
        });
    },
    test
  );
}

function test(argv: yargs.ArgumentsCamelCase) {
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

  const modifiers = getBehavior(
    saveData.gameObjects.find(x => x.name === "Minion")!.gameObjects[0],
    MinionModifiersBehavior
  )!;
  console.log("modifiers", JSON.stringify(modifiers, null, 2));

  console.log("re-saving");
  const writebackName = `${fileName}-writeback`;
  saveFile(writebackName, saveData, currentTagPath, showProgress, showTags);

  console.log("reloading");
  const writebackData = loadFile(
    writebackName,
    currentTagPath,
    showProgress,
    showTags,
    versionStrictness
  );

  console.log("diffing");
  const writebackDiff = checkDiff(saveData, writebackData);

  const hasChanges = writebackDiff && writebackDiff.length;
  if (hasChanges) {
    console.error("Changes detected");
    console.dir(writebackDiff);
    process.exit(1);
  }

  console.log(
    "Seen objects:\n",
    saveData.gameObjects.map(x => x.name).join("\n")
  );

  console.log("done");

  function checkDiff(original: SaveGame, modified: SaveGame) {
    original = {
      ...original,
      world: {
        ...original.world,
        streamed: null as any
      }
    };
    modified = {
      ...modified,
      world: {
        ...modified.world,
        streamed: null as any
      }
    };
    return diff(original, modified);
  }
}
