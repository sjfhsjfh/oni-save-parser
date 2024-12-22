"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseStorageExtraData = exports.parseStorageExtraData = void 0;
const utils_1 = require("../../../../../utils");
const parser_1 = require("../../../../../parser");
const parser_2 = require("../../../game-object/parser");
function* parseStorageExtraData(templateParser) {
    const itemCount = yield new parser_1.ReadInt32Instruction();
    const items = new Array(itemCount);
    for (let i = 0; i < itemCount; i++) {
        const name = yield new parser_1.ReadKleiStringInstruction();
        (0, utils_1.validateDotNetIdentifierName)(name);
        const gameObject = yield* (0, parser_2.parseGameObject)(templateParser);
        items[i] = Object.assign({ name }, gameObject);
    }
    return items;
}
exports.parseStorageExtraData = parseStorageExtraData;
function* unparseStorageExtraData(extraData, templateUnparser) {
    yield (0, parser_1.writeInt32)(extraData.length);
    for (const gameObject of extraData) {
        yield (0, parser_1.writeKleiString)(gameObject.name);
        yield* (0, parser_2.unparseGameObject)(gameObject, templateUnparser);
    }
}
exports.unparseStorageExtraData = unparseStorageExtraData;
//# sourceMappingURL=parser.js.map