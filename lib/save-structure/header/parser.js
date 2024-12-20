"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseHeader = exports.parseHeader = void 0;
const text_encoding_1 = require("text-encoding");
const jsonschema_1 = require("jsonschema");
const parser_1 = require("../../parser");
const header_1 = require("./header");
function* parseHeader() {
    const buildVersion = yield (0, parser_1.readUInt32)();
    const headerSize = yield (0, parser_1.readUInt32)();
    const headerVersion = yield (0, parser_1.readUInt32)();
    const isCompressed = headerVersion >= 1 ? Boolean(yield (0, parser_1.readUInt32)()) : false;
    const infoBytes = yield (0, parser_1.readBytes)(headerSize);
    const infoStr = new text_encoding_1.TextDecoder("utf-8").decode(infoBytes);
    const gameInfo = JSON.parse(infoStr);
    const header = {
        buildVersion,
        headerVersion,
        isCompressed,
        gameInfo
    };
    return header;
}
exports.parseHeader = parseHeader;
function* unparseHeader(header) {
    (0, jsonschema_1.validate)(header, header_1.headerSchema, { throwError: true });
    const { buildVersion, headerVersion, isCompressed, gameInfo } = header;
    const infoStr = JSON.stringify(gameInfo);
    const headerBytes = new text_encoding_1.TextEncoder("utf-8").encode(infoStr);
    yield (0, parser_1.writeUInt32)(buildVersion);
    yield (0, parser_1.writeUInt32)(headerBytes.byteLength);
    yield (0, parser_1.writeUInt32)(headerVersion);
    if (headerVersion >= 1) {
        yield (0, parser_1.writeUInt32)(isCompressed ? 1 : 0);
    }
    yield (0, parser_1.writeBytes)(headerBytes.buffer);
}
exports.unparseHeader = unparseHeader;
//# sourceMappingURL=parser.js.map