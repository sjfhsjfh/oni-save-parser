"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadInstruction = exports.GetReaderPosition = exports.ReadCompressedInstruction = exports.SkipBytesInstruction = exports.ReadKleiStringInstruction = exports.ReadCharsInstruction = exports.ReadDoubleInstruction = exports.ReadSingleInstruction = exports.ReadInt64Instruction = exports.ReadUInt64Instruction = exports.ReadInt32Instruction = exports.ReadUInt32Instruction = exports.ReadInt16Instruction = exports.ReadUInt16Instruction = exports.ReadBytesInstruction = exports.ReadSByteInstruction = exports.ReadByteInstruction = exports.BasicReadInstruction = void 0;
const types_1 = require("../types");
class BasicReadInstruction extends types_1.ParserInstruction {
    constructor() {
        super(...arguments);
        this.type = "read";
        this.isMeta = false;
    }
}
exports.BasicReadInstruction = BasicReadInstruction;
class ReadByteInstruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "byte";
    }
}
exports.ReadByteInstruction = ReadByteInstruction;
class ReadSByteInstruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "signed-byte";
    }
}
exports.ReadSByteInstruction = ReadSByteInstruction;
class ReadBytesInstruction extends BasicReadInstruction {
    constructor(length) {
        super();
        this.length = length;
        this.dataType = "byte-array";
    }
}
exports.ReadBytesInstruction = ReadBytesInstruction;
class ReadUInt16Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "uint-16";
    }
}
exports.ReadUInt16Instruction = ReadUInt16Instruction;
class ReadInt16Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "int-16";
    }
}
exports.ReadInt16Instruction = ReadInt16Instruction;
class ReadUInt32Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "uint-32";
    }
}
exports.ReadUInt32Instruction = ReadUInt32Instruction;
class ReadInt32Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "int-32";
    }
}
exports.ReadInt32Instruction = ReadInt32Instruction;
class ReadUInt64Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "uint-64";
    }
}
exports.ReadUInt64Instruction = ReadUInt64Instruction;
class ReadInt64Instruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "int-64";
    }
}
exports.ReadInt64Instruction = ReadInt64Instruction;
class ReadSingleInstruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "single";
    }
}
exports.ReadSingleInstruction = ReadSingleInstruction;
class ReadDoubleInstruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "double";
    }
}
exports.ReadDoubleInstruction = ReadDoubleInstruction;
class ReadCharsInstruction extends BasicReadInstruction {
    constructor(length) {
        super();
        this.length = length;
        this.dataType = "chars";
    }
}
exports.ReadCharsInstruction = ReadCharsInstruction;
class ReadKleiStringInstruction extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "klei-string";
    }
}
exports.ReadKleiStringInstruction = ReadKleiStringInstruction;
class SkipBytesInstruction extends BasicReadInstruction {
    constructor(length) {
        super();
        this.length = length;
        this.dataType = "skip-bytes";
    }
}
exports.SkipBytesInstruction = SkipBytesInstruction;
class ReadCompressedInstruction extends BasicReadInstruction {
    constructor(parser) {
        super();
        this.parser = parser;
        this.dataType = "compressed";
    }
}
exports.ReadCompressedInstruction = ReadCompressedInstruction;
class GetReaderPosition extends BasicReadInstruction {
    constructor() {
        super(...arguments);
        this.dataType = "reader-position";
    }
}
exports.GetReaderPosition = GetReaderPosition;
function isReadInstruction(value) {
    return (value instanceof ReadByteInstruction ||
        value instanceof ReadSByteInstruction ||
        value instanceof ReadBytesInstruction ||
        value instanceof ReadUInt16Instruction ||
        value instanceof ReadInt16Instruction ||
        value instanceof ReadUInt32Instruction ||
        value instanceof ReadInt32Instruction ||
        value instanceof ReadUInt64Instruction ||
        value instanceof ReadInt64Instruction ||
        value instanceof ReadSingleInstruction ||
        value instanceof ReadDoubleInstruction ||
        value instanceof ReadCharsInstruction ||
        value instanceof ReadKleiStringInstruction ||
        value instanceof SkipBytesInstruction ||
        value instanceof ReadCompressedInstruction ||
        value instanceof GetReaderPosition);
}
exports.isReadInstruction = isReadInstruction;
//# sourceMappingURL=read-instructions.js.map