import { readFileSync, writeFileSync } from "fs";
import { SaveGame } from "../save-structure";
import { ParseInterceptor } from "../parser";
import { parseSaveGame, writeSaveGame } from "..";
import { progressReporter } from "../progress";
import { tagReporter } from "../tagger";
import { VersionStrictness } from "../save-structure/version";

import compose from "lodash.flowright";

export function loadFile(
  fileName: string,
  currentTagPath: string[],
  showProgress: boolean = false,
  showTags: boolean = false,
  versionStrictness: VersionStrictness = "minor"
): SaveGame {
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
    return parseSaveGame(fileData.buffer, {
      interceptor,
      versionStrictness
    });
  } catch (e) {
    console.error(`Load error at ${currentTagPath.join(" => ")}`);
    e.tagPath = [...currentTagPath];
    throw e;
  }
}

export function saveFile(
  fileName: string,
  save: SaveGame,
  currentTagPath: string[],
  showProgress: boolean,
  showTags: boolean
) {
  let interceptors: ParseInterceptor[] = [];

  if (showProgress) {
    interceptors.push(progressReporter(console.log.bind(console, "SAVING")));
  }

  interceptors.push(tagReporter(onTagStart, onTagEnd));

  // const interceptor = compose((x: any) => x, ...interceptors);
  const interceptor = interceptors.reduce(
    (a, b) => (x: any) => b(a(x)),
    (x: any) => x
  );

  try {
    const fileData = writeSaveGame(save, interceptor);
    writeFileSync(`./test-data/${fileName}.sav`, new Uint8Array(fileData));
  } catch (e) {
    console.error(`Save error at ${currentTagPath.join(" => ")}`);
    e.tagPath = [...currentTagPath];
    throw e;
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
