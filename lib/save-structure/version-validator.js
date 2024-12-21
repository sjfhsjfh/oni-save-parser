"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVersion = exports.CURRENT_VERSION = exports.Version = exports.E_VERSION_MINOR = exports.E_VERSION_MAJOR = exports.CURRENT_VERSION_MINOR = exports.CURRENT_VERSION_MAJOR = void 0;
exports.CURRENT_VERSION_MAJOR = 7;
exports.CURRENT_VERSION_MINOR = [31];
exports.E_VERSION_MAJOR = "E_VERSION_MAJOR";
exports.E_VERSION_MINOR = "E_VERSION_MINOR";
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
function validateVersion(major, minor, strictness = "minor") {
    if (strictness === "none") {
        return;
    }
    if (!matchVersion(major, exports.CURRENT_VERSION_MAJOR) ||
        (strictness == "minor" && !matchVersion(minor, exports.CURRENT_VERSION_MINOR))) {
        const err = new Error(`Save version "${major}.${minor}" is not compatible with this parser.  Expected version "${exports.CURRENT_VERSION_MAJOR}.${exports.CURRENT_VERSION_MINOR}".`);
        err.code =
            major !== exports.CURRENT_VERSION_MAJOR ? exports.E_VERSION_MAJOR : exports.E_VERSION_MINOR;
        throw err;
    }
}
exports.validateVersion = validateVersion;
function matchVersion(currentVersion, supportedVersion) {
    if (Array.isArray(supportedVersion)) {
        return supportedVersion.indexOf(currentVersion) !== -1;
    }
    return currentVersion === supportedVersion;
}
//# sourceMappingURL=version-validator.js.map