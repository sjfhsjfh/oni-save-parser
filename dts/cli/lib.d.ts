import { SaveGame } from "../save-structure";
import { VersionStrictness } from "../save-structure/version";
export declare function loadFile(fileName: string, currentTagPath: string[], showProgress?: boolean, showTags?: boolean, versionStrictness?: VersionStrictness): SaveGame;
export declare function saveFile(fileName: string, save: SaveGame, currentTagPath: string[], showProgress: boolean, showTags: boolean): void;
