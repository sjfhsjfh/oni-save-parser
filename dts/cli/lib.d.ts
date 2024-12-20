import minimist from "minimist";
export type cliArgs = {
    saveFile: string;
    showProgress: boolean;
    showTags: boolean;
};
export declare function parseTestArgs(rawArgs: minimist.ParsedArgs): cliArgs;
