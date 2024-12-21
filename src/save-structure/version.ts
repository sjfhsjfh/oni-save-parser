/**
 * @module version
 *
 * Version validation utilities.
 */

const versionOrder: ["major", "minor"] = ["major", "minor"];

export type VersionStrictness = "none" | typeof versionOrder[number];

export class Version {
  constructor(public major: number, public minor: number) {}

  public validate(other: Version, strictness: VersionStrictness = "minor") {
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

  public matchOne(strictness: VersionStrictness, ...others: Version[]) {
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
export const CURRENT_VERSION_MAJOR = 7;
export const CURRENT_VERSION_MINOR = [31];

export const E_VERSION_MAJOR = "E_VERSION_MAJOR";
export const E_VERSION_MINOR = "E_VERSION_MINOR";
