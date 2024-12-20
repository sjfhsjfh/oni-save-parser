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

export function test(
  fileName: string,
  showProgress: boolean,
  showTags: boolean
) {
  const currentTagPath: string[] = [];
  console.log("Loading save");
  const saveData = loadFile(fileName);

  const modifiers = getBehavior(
    saveData.gameObjects.find(x => x.name === "Minion")!.gameObjects[0],
    MinionModifiersBehavior
  )!;
  console.log("modifiers", JSON.stringify(modifiers, null, 2));

  console.log("re-saving");
  const writebackName = `${fileName}-writeback`;
  saveFile(writebackName, saveData);

  console.log("reloading");
  const writebackData = loadFile(writebackName);

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

  function loadFile(fileName: string): SaveGame {
    const fileData = readFileSync(`./test-data/${fileName}.sav`);

    let interceptors: ParseInterceptor[] = [];

    if (showProgress) {
      interceptors.push(progressReporter(console.log.bind(console, "LOADING")));
    }
    if (showTags) {
      interceptors.push(
        tagReporter(
          console.log.bind(console, "LOAD-TAG-START"),
          console.log.bind(console, "LOAD-TAG-END")
        )
      );
    }

    const interceptor = (compose as any)((x: any) => x, ...interceptors);

    try {
      return parseSaveGame(fileData.buffer, interceptor);
    } catch (e) {
      console.error(`Load error at ${currentTagPath.join(" => ")}`);
      e.tagPath = [...currentTagPath];
      throw e;
    }
  }

  function saveFile(fileName: string, save: SaveGame) {
    let interceptors: ParseInterceptor[] = [];

    if (showProgress) {
      interceptors.push(progressReporter(console.log.bind(console, "SAVING")));
    }

    interceptors.push(tagReporter(onTagStart, onTagEnd));

    const interceptor = (compose as any)((x: any) => x, ...interceptors);

    try {
      const fileData = writeSaveGame(save, interceptor);
      writeFileSync(`./test-data/${fileName}.sav`, new Uint8Array(fileData));
    } catch (e) {
      console.error(`Save error at ${currentTagPath.join(" => ")}`);
      e.tagPath = [...currentTagPath];
      throw e;
    }
  }

  function onTagStart(tagName: string, instanceName: string | null) {
    if (showTags) {
      console.log("TAG_START", tagName, instanceName);
    }
    const part = instanceName ? `${tagName}::${instanceName}` : tagName;
    currentTagPath.push(part);
  }
  function onTagEnd(tagName: string, instanceName: string | null) {
    if (showTags) {
      console.log("TAG_END", tagName, instanceName);
    }

    const part = instanceName ? `${tagName}::${instanceName}` : tagName;
    if (currentTagPath[currentTagPath.length - 1] !== part) {
      debugger;
    }
    currentTagPath.pop();
  }
}
