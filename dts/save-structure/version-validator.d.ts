export declare const CURRENT_VERSION_MAJOR = 7;
export declare const CURRENT_VERSION_MINOR: number[];
export type VersionStrictness = "none" | "major" | "minor";
export declare function validateVersion(major: number, minor: number, strictness?: VersionStrictness): void;
export declare const E_VERSION_MAJOR = "E_VERSION_MAJOR";
export declare const E_VERSION_MINOR = "E_VERSION_MINOR";
