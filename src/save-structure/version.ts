/**
 * @module version
 *
 * Version validation utilities.
 */

const versionOrder: ["major", "minor"] = ["major", "minor"];

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
export class Version {
  constructor(public major: number, public minor: number) {}

  /**
   * Throws an error if this version is not compatible with another version
   * @param {Version} other  The version to compare against
   * @param {VersionStrictness} strictness The strictness of the comparison
   * @returns {void}
   */
  public validate(
    other: Version,
    strictness: VersionStrictness = "minor"
  ): void {
    if (strictness == "none") {
      return;
    }
    for (const key of versionOrder) {
      if (this[key] !== other[key]) {
        const err = new Error(
          `Save version "${this.major}.${
            this.minor
          }" is not compatible with this parser.  Expected version "${
            other.major
          }.${other.minor}".`
        );
        (err as any).code = key === "major" ? E_VERSION_MAJOR : E_VERSION_MINOR;
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
  public matchOne(
    strictness: VersionStrictness,
    ...others: Version[]
  ): boolean {
    for (const other of others) {
      try {
        this.validate(other, strictness);
        return true;
      } finally {
      }
    }
    return false;
  }
}

export const CURRENT_VERSION = new Version(7, 31);
export const CURRENT_VERSION_MAJOR = CURRENT_VERSION.major;
export const CURRENT_VERSION_MINOR = [CURRENT_VERSION.minor];

export const E_VERSION_MAJOR = "E_VERSION_MAJOR";
export const E_VERSION_MINOR = "E_VERSION_MINOR";
