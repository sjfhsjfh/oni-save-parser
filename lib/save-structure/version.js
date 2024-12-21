"use strict";
/**
 * @module version
 *
 * Version validation utilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_VERSION_MINOR = exports.E_VERSION_MAJOR = exports.CURRENT_VERSION_MINOR = exports.CURRENT_VERSION_MAJOR = exports.CURRENT_VERSION = exports.Version = void 0;
const versionOrder = ["major", "minor"];
class Version {
    constructor(major, minor) {
        this.major = major;
        this.minor = minor;
    }
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
exports.CURRENT_VERSION_MAJOR = 7;
exports.CURRENT_VERSION_MINOR = [31];
exports.E_VERSION_MAJOR = "E_VERSION_MAJOR";
exports.E_VERSION_MINOR = "E_VERSION_MINOR";
//# sourceMappingURL=version.js.map