"use strict";
/**
 * @module version
 *
 * Version validation utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_VERSION_MINOR = exports.E_VERSION_MAJOR = exports.CURRENT_VERSION_MINOR = exports.CURRENT_VERSION_MAJOR = exports.CURRENT_VERSION = exports.Version = void 0;
const versionOrder = ["major", "minor"];
/**
 * Represents a ONI version
 * @class Version
 * @param {number} major Major version number
 * @param {number} minor Minor version number
 */
class Version {
    constructor(major, minor) {
        this.major = major;
        this.minor = minor;
    }
    /**
     * Throws an error if this version is not compatible with another version
     * @param {Version} other  The version to compare against
     * @param {VersionStrictness} strictness The strictness of the comparison
     * @returns {void}
     */
    validate(other, strictness = "minor") {
        if (strictness == "none") {
            return;
        }
        for (const key of versionOrder) {
            if (this[key] !== other[key]) {
                const err = new Error(`Save version "${this.major}.${this.minor}" is not compatible with this parser.  Expected version "${other.major}.${other.minor}".`);
                err.code = key === "major" ? exports.E_VERSION_MAJOR : exports.E_VERSION_MINOR;
                throw err;
            }
        }
    }
    /**
     * Returns true if this version is compatible at least one of the given versions
     * @param {VersionStrictness} strictness The strictness of the comparison
     * @param {Version[]} others The versions to compare against
     * @returns {boolean}
     */
    matchOne(strictness, ...others) {
        for (const other of others) {
            try {
                this.validate(other, strictness);
                return true;
            }
            finally {
            }
        }
        return false;
    }
}
exports.Version = Version;
exports.CURRENT_VERSION = new Version(7, 31);
exports.CURRENT_VERSION_MAJOR = exports.CURRENT_VERSION.major;
exports.CURRENT_VERSION_MINOR = [exports.CURRENT_VERSION.minor];
exports.E_VERSION_MAJOR = "E_VERSION_MAJOR";
exports.E_VERSION_MINOR = "E_VERSION_MINOR";
//# sourceMappingURL=version.js.map