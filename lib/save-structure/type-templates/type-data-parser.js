"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseByType = exports.parseByType = void 0;
const parser_1 = require("../../parser");
const type_templates_1 = require("../../save-structure/type-templates");
const template_data_parser_1 = require("./template-data-parser");
function* parseArrayLike(info, templates) {
    const [elementType] = info.subTypes;
    // data-length
    //  Note that if length is -1, this is 4 (the length of the count).
    //  If length is >= 0, this is the length of the element
    //  portion, NOT INCLUDING the count.
    yield new parser_1.ReadInt32Instruction();
    // element-length
    const length = yield new parser_1.ReadInt32Instruction();
    if (length === -1) {
        return null;
    }
    else if (length >= 0) {
        const typeCode = (0, type_templates_1.getTypeCode)(elementType.info);
        if (typeCode === type_templates_1.SerializationTypeCode.Byte) {
            const data = yield new parser_1.ReadBytesInstruction(length);
            return new Uint8Array(data);
        }
        else if ((0, type_templates_1.isValueType)(elementType.info)) {
            if (typeCode !== type_templates_1.SerializationTypeCode.UserDefined) {
                throw new Error(`Type ${typeCode} cannot be parsed as a value-type.`);
            }
            const typeName = elementType.templateName;
            // In the ONI code, this skips straight back to a SerializationMapping (parseByTemplate) and bypasses ReadValue (parseByType)
            //  This effectively skips out writing the data length, probably because that is also used to indicate null values.
            const elements = new Array(length);
            for (let i = 0; i < length; i++) {
                const element = yield* (0, template_data_parser_1.parseByTemplate)(templates, typeName);
                elements[i] = element;
            }
            return elements;
        }
        else {
            const elements = new Array(length);
            for (let i = 0; i < length; i++) {
                const element = yield* parseByType(elementType, templates);
                elements[i] = element;
            }
            return elements;
        }
    }
    else {
        throw new Error(`Failed to parse array: Invalid length value of ${length}`);
    }
}
function* unparseArrayLike(values, info, templates) {
    const [elementType] = info.subTypes;
    if (values == null) {
        // ONI inconsistancy: Element count is only included
        //  in the data-length when the array is null.
        yield (0, parser_1.writeInt32)(4);
        yield (0, parser_1.writeInt32)(-1);
    }
    else {
        // Despite ONI not making use of the data length, we still calculate it
        //  and store it against the day that it might be used.
        const lengthToken = yield (0, parser_1.writeDataLengthBegin)();
        // Frustratingly, the element count is written after the length but not included
        //  in it.
        yield (0, parser_1.writeInt32)(values.length);
        lengthToken.startPosition = yield (0, parser_1.getWriterPosition)();
        if ((0, type_templates_1.getTypeCode)(elementType.info) === type_templates_1.SerializationTypeCode.Byte) {
            if (!(values instanceof Uint8Array)) {
                throw new Error("Expected byte array value to be Uint8Array.");
            }
            yield (0, parser_1.writeBytes)(values);
        }
        else if ((0, type_templates_1.isValueType)(elementType.info)) {
            // In the ONI code, this skips straight back to a SerializationMapping (parseByTemplate) and bypasses ReadValue (parseByType)
            //  This effectively skips out writing the data length, probably because that is also used to indicate null values.
            const templateName = elementType.templateName;
            for (let element of values) {
                yield* (0, template_data_parser_1.unparseByTemplate)(templates, templateName, element);
            }
        }
        else {
            for (let element of values) {
                yield* unparseByType(element, elementType, templates);
            }
        }
        yield (0, parser_1.writeDataLengthEnd)(lengthToken);
    }
}
const typeParsers = {
    [type_templates_1.SerializationTypeCode.Array]: {
        parse: parseArrayLike,
        unparse: unparseArrayLike
    },
    [type_templates_1.SerializationTypeCode.Boolean]: {
        parse: function* () {
            const b = yield new parser_1.ReadByteInstruction();
            return Boolean(b);
        },
        unparse: function* (value) {
            yield (0, parser_1.writeByte)(value ? 1 : 0);
        }
    },
    [type_templates_1.SerializationTypeCode.Byte]: {
        parse: function* () {
            return yield new parser_1.ReadByteInstruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeByte)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.Colour]: {
        parse: function* () {
            const rb = yield new parser_1.ReadByteInstruction();
            const gb = yield new parser_1.ReadByteInstruction();
            const bb = yield new parser_1.ReadByteInstruction();
            const ab = yield new parser_1.ReadByteInstruction();
            return {
                r: rb / 255,
                g: gb / 255,
                b: bb / 255,
                a: ab / 255
            };
        },
        unparse: function* (value) {
            yield (0, parser_1.writeByte)(fracToByte(value.r));
            yield (0, parser_1.writeByte)(fracToByte(value.g));
            yield (0, parser_1.writeByte)(fracToByte(value.b));
            yield (0, parser_1.writeByte)(fracToByte(value.a));
        }
    },
    [type_templates_1.SerializationTypeCode.Dictionary]: {
        parse: function* (info, templates) {
            const [keyType, valueType] = info.subTypes;
            // data-length.  4 if null.
            yield new parser_1.ReadInt32Instruction();
            // element-count.  -1 if null.
            const count = yield new parser_1.ReadInt32Instruction();
            if (count >= 0) {
                let pairs = new Array(count);
                // Values are parsed first
                for (let i = 0; i < count; i++) {
                    pairs[i] = new Array(2);
                    pairs[i][1] = yield* parseByType(valueType, templates);
                }
                for (let i = 0; i < count; i++) {
                    pairs[i][0] = yield* parseByType(keyType, templates);
                }
                return pairs;
            }
            else {
                return null;
            }
        },
        unparse: function* (value, info, templates) {
            if (value == null) {
                // ONI inconsistancy: Element count is only included
                //  in the data-length when the dictionary is null.
                yield (0, parser_1.writeInt32)(4);
                yield (0, parser_1.writeInt32)(-1);
            }
            else {
                const [keyType, valueType] = info.subTypes;
                // Despite ONI not making use of the data length, we still calculate it
                //  and store it against the day that it might be used.
                const lengthToken = yield (0, parser_1.writeDataLengthBegin)();
                // Frustratingly, the element count is written after the length but not included
                //  in it.
                yield (0, parser_1.writeInt32)(value.length);
                lengthToken.startPosition = yield (0, parser_1.getWriterPosition)();
                // Values come first.
                for (let element of value) {
                    yield* unparseByType(element[1], valueType, templates);
                }
                for (let element of value) {
                    yield* unparseByType(element[0], keyType, templates);
                }
                yield (0, parser_1.writeDataLengthEnd)(lengthToken);
            }
        }
    },
    [type_templates_1.SerializationTypeCode.Double]: {
        parse: function* () {
            return yield new parser_1.ReadDoubleInstruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeDouble)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.Enumeration]: {
        parse: function* () {
            return yield new parser_1.ReadInt32Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeInt32)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.HashSet]: {
        parse: parseArrayLike,
        unparse: unparseArrayLike
    },
    [type_templates_1.SerializationTypeCode.Int16]: {
        parse: function* () {
            return yield new parser_1.ReadInt16Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeInt16)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.Int32]: {
        parse: function* () {
            return yield new parser_1.ReadInt32Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeInt32)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.Int64]: {
        parse: function* () {
            return yield new parser_1.ReadInt64Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeInt64)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.List]: {
        parse: parseArrayLike,
        unparse: unparseArrayLike
    },
    [type_templates_1.SerializationTypeCode.Pair]: {
        // ONI BUG:
        //  On null pair, ONI writes out [4, -1], as if it was
        //  writing out null to a variable-length collection.
        // However, it checks for a first value >= 0 to indicate not-null,
        //  meaning it will parse a null as not-null and get the parser
        //  into an incorrect state.
        // We reproduce the faulty behavior here to remain accurate to ONI.
        parse: function* (info, templates) {
            // Writer mirrors ONI code and writes unparsable data.  See ONI bug description above.
            const dataLength = yield new parser_1.ReadInt32Instruction();
            if (dataLength >= 0) {
                // Trying to parse a data length of 0 makes no sense,
                //  but we are following ONI code.  Do not change this logic.
                const [keyType, valueType] = info.subTypes;
                const key = yield* parseByType(keyType, templates);
                const value = yield* parseByType(valueType, templates);
                return {
                    key,
                    value
                };
            }
            else {
                return null;
            }
        },
        unparse: function* (value, info, templates) {
            // Writer mirrors ONI code and writes unparsable data.  See ONI bug description above.
            if (value == null) {
                yield (0, parser_1.writeInt32)(4);
                yield (0, parser_1.writeInt32)(-1);
            }
            else {
                const [keyType, valueType] = info.subTypes;
                // Despite ONI not making use of the data length, we still calculate it
                //  and store it against the day that it might be used.
                const lengthToken = yield (0, parser_1.writeDataLengthBegin)();
                yield* unparseByType(value.key, keyType, templates);
                yield* unparseByType(value.value, valueType, templates);
                yield (0, parser_1.writeDataLengthEnd)(lengthToken);
            }
        }
    },
    [type_templates_1.SerializationTypeCode.Queue]: {
        parse: parseArrayLike,
        unparse: unparseArrayLike
    },
    [type_templates_1.SerializationTypeCode.SByte]: {
        parse: function* () {
            return yield new parser_1.ReadSByteInstruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeSByte)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.Single]: {
        parse: function* () {
            return yield new parser_1.ReadSingleInstruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeSingle)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.String]: {
        parse: function* () {
            return yield new parser_1.ReadKleiStringInstruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeKleiString)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.UInt16]: {
        parse: function* () {
            return yield new parser_1.ReadUInt16Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeUInt16)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.UInt32]: {
        parse: function* () {
            return yield new parser_1.ReadUInt32Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeUInt32)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.UInt64]: {
        parse: function* () {
            return yield new parser_1.ReadUInt64Instruction();
        },
        unparse: function* (value) {
            yield (0, parser_1.writeUInt64)(value);
        }
    },
    [type_templates_1.SerializationTypeCode.UserDefined]: {
        parse: function* (info, templates) {
            const templateName = info.templateName;
            const dataLength = yield new parser_1.ReadInt32Instruction();
            if (dataLength < 0) {
                return null;
            }
            const parseStart = yield new parser_1.GetReaderPosition();
            const obj = yield* (0, template_data_parser_1.parseByTemplate)(templates, templateName);
            const parseEnd = yield new parser_1.GetReaderPosition();
            const parseLength = parseEnd - parseStart;
            if (parseLength !== dataLength) {
                throw new Error(`Failed to parse object: Template name "${templateName}" parsed ${Math.abs(parseLength - dataLength)} ${parseLength > dataLength ? "more" : "less"} than expected.`);
            }
            return obj;
        },
        unparse: function* (value, info, templates) {
            const templateName = info.templateName;
            if (value == null) {
                yield (0, parser_1.writeInt32)(-1);
            }
            else {
                const lengthToken = yield (0, parser_1.writeDataLengthBegin)();
                yield* (0, template_data_parser_1.unparseByTemplate)(templates, templateName, value);
                yield (0, parser_1.writeDataLengthEnd)(lengthToken);
            }
        }
    },
    [type_templates_1.SerializationTypeCode.Vector2]: {
        parse: function* () {
            const x = yield new parser_1.ReadSingleInstruction();
            const y = yield new parser_1.ReadSingleInstruction();
            return {
                x,
                y
            };
        },
        unparse: function* (value) {
            yield (0, parser_1.writeSingle)(value.x);
            yield (0, parser_1.writeSingle)(value.y);
        }
    },
    [type_templates_1.SerializationTypeCode.Vector2I]: {
        parse: function* () {
            const x = yield new parser_1.ReadInt32Instruction();
            const y = yield new parser_1.ReadInt32Instruction();
            return {
                x,
                y
            };
        },
        unparse: function* (value) {
            yield (0, parser_1.writeInt32)(value.x);
            yield (0, parser_1.writeInt32)(value.y);
        }
    },
    [type_templates_1.SerializationTypeCode.Vector3]: {
        parse: function* () {
            const x = yield new parser_1.ReadSingleInstruction();
            const y = yield new parser_1.ReadSingleInstruction();
            const z = yield new parser_1.ReadSingleInstruction();
            return {
                x,
                y,
                z
            };
        },
        unparse: function* (value) {
            yield (0, parser_1.writeSingle)(value.x);
            yield (0, parser_1.writeSingle)(value.y);
            yield (0, parser_1.writeSingle)(value.z);
        }
    }
};
function* parseByType(info, templates) {
    const type = (0, type_templates_1.getTypeCode)(info.info);
    const parser = typeParsers[type];
    if (!parser) {
        throw new Error(`Unknown type code "${type}" (typeinfo: "${info.info}").`);
    }
    return yield* parser.parse(info, templates);
}
exports.parseByType = parseByType;
function* unparseByType(value, info, templates) {
    const type = (0, type_templates_1.getTypeCode)(info.info);
    const parser = typeParsers[type];
    if (!parser) {
        throw new Error(`Unknown type code "${type}" (typeinfo: "${info.info}").`);
    }
    return yield* parser.unparse(value, info, templates);
}
exports.unparseByType = unparseByType;
function fracToByte(num) {
    const byte = Math.round(num * 255);
    if (byte < 0)
        return 0;
    if (byte > 255)
        return 255;
    return byte;
}
//# sourceMappingURL=type-data-parser.js.map