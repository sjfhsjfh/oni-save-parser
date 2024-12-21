/**
 * @module version
 *
 * Version validation utilities.
 */
declare const versionOrder: ["major", "minor"];
export type VersionStrictness = "none" | typeof versionOrder[number];
export declare class Version {
    major: number;
    minor: number;
    constructor(major: number, minor: number);
    validate(other: Version, strictness?: VersionStrictness): void;
    matchOne(strictness: VersionStrictness, ...others: Version[]): boolean;
}
export declare const CURRENT_VERSION: Version;
export declare const CURRENT_VERSION_MAJOR = 7;
export declare const CURRENT_VERSION_MINOR: number[];
export declare const E_VERSION_MAJOR = "E_VERSION_MAJOR";
export declare const E_VERSION_MINOR = "E_VERSION_MINOR";
export {};
