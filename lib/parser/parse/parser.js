"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
const binary_serializer_1 = require("../../binary-serializer");
const read_instructions_1 = require("./read-instructions");
const errors_1 = require("../errors");
function parse(reader, readParser, interceptor) {
    let nextValue = undefined;
    while (true) {
        let iteratorResult;
        try {
            iteratorResult = readParser.next(nextValue);
        }
        catch (e) {
            throw errors_1.ParseError.create(e, reader.position);
        }
        if (iteratorResult.done)
            return iteratorResult.value;
        let value = iteratorResult.value;
        value = interceptor ? interceptor(value) : value;
        if (value.isMeta)
            continue;
        if (!(value instanceof read_instructions_1.BasicReadInstruction)) {
            throw new Error("Cannot yield a non-parse-instruction.");
        }
        try {
            if (!(value.dataType in primaryReadParsers ||
                value.dataType === "compressed")) {
                throw new Error(`Unknown read instruction dataType: ${value.dataType}`);
            }
            nextValue = executeReadInstruction(reader, value, interceptor);
        }
        catch (e) {
            const err = errors_1.ParseError.create(e, reader.position);
            throw err;
        }
    }
}
const primaryReadParsers = {
    byte: (r, _) => r.readByte(),
    "signed-byte": (r, _) => r.readSByte(),
    "byte-array": (r, i) => i.length == null ? r.readAllBytes() : r.readBytes(i.length),
    "uint-16": (r, _) => r.readUInt16(),
    "int-16": (r, _) => r.readInt16(),
    "uint-32": (r, _) => r.readUInt32(),
    "int-32": (r, _) => r.readInt32(),
    "uint-64": (r, _) => r.readUInt64(),
    "int-64": (r, _) => r.readInt64(),
    single: (r, _) => r.readSingle(),
    double: (r, _) => r.readDouble(),
    chars: (r, i) => r.readChars(i.length),
    "klei-string": (r, _) => r.readKleiString(),
    "skip-bytes": (r, i) => r.skipBytes(i.length),
    "reader-position": (r, _) => r.position
};
function parseCompressed(reader, inst, interceptor) {
    const bytes = reader.readAllBytes();
    const new_reader = new binary_serializer_1.ZlibDataReader(new Uint8Array(bytes));
    return parse(new_reader, inst.parser, interceptor);
}
function executeReadInstruction(reader, inst, interceptor) {
    if (inst.type !== "read") {
        // TODO: remove, unreachable code
        throw new Error("Expected a read parse instruction.");
    }
    if (!(0, read_instructions_1.isReadInstruction)(inst)) {
        throw new Error("Expected a read instruction.");
    }
    function compressed(inst) {
        return inst instanceof read_instructions_1.ReadCompressedInstruction;
    }
    if (compressed(inst)) {
        return parseCompressed(reader, inst, interceptor);
    }
    // Here `TReturn` must be extends `PrimaryReturn`
    return primaryReadParsers[inst.dataType](reader, inst, interceptor);
}
//# sourceMappingURL=parser.js.map