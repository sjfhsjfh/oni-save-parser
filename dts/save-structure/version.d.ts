/**
 * @module version
 *
 * Version validation utilities.
 */
declare const versionOrder: ["major", "minor"];
/**
 * How strictly to compare versions
 */
export type VersionStrictness = "none" | typeof versionOrder[number];
/**
 * Represents a ONI version
 * @class Version
 * @param {number} major Major version number
 * @param {number} minor Minor version number
 */
export declare class Version {
    major: number;
    minor: number;
    constructor(major: number, minor: number);
    /**
     * Throws an error if this version is not compatible with another version
     * @param {Version} other  The version to compare against
     * @param {VersionStrictness} strictness The strictness of the comparison
     * @returns {void}
     */
    validate(other: Version, strictness?: VersionStrictness): void;
    /**
     * Returns true if this version is compatible at least one of the given versions
     * @param {VersionStrictness} strictness The strictness of the comparison
     * @param {Version[]} others The versions to compare against
     * @returns {boolean}
     */
    matchOne(strictness: VersionStrictness, ...others: Version[]): boolean;
}
export declare const CURRENT_VERSION: Version;
export declare const CURRENT_VERSION_MAJOR: number;
export declare const CURRENT_VERSION_MINOR: number[];
export declare const E_VERSION_MAJOR = "E_VERSION_MAJOR";
export declare const E_VERSION_MINOR = "E_VERSION_MINOR";
export {};
