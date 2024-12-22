import {
  GetReaderPosition,
  ParseIterator,
  ReadBytesInstruction,
  ReadInt32Instruction,
  ReadKleiStringInstruction,
  UnparseIterator,
  writeBytes,
  writeDataLengthBegin,
  writeDataLengthEnd,
  writeKleiString
} from "../../../parser";

import taggedParser from "../../../tagger/parse-tagger";

import { validateDotNetIdentifierName } from "../../../utils";

import {
  TemplateParser,
  TemplateUnparser
} from "../../type-templates/template-data-parser";

import { GameObjectBehavior } from "./game-object-behavior";

interface ExtraDataParser {
  parse(templateParser: TemplateParser): ParseIterator<any>;
  unparse(value: any, templateUnparser: TemplateUnparser): UnparseIterator;
}

import { StorageBehavior } from "./known-behaviors/storage";
import {
  parseStorageExtraData,
  unparseStorageExtraData
} from "./known-behaviors/storage/parser";

import { MinionModifiersBehavior } from "./known-behaviors/minion-modifiers";
import {
  parseMinionModifiersExtraData,
  unparseMinionModifiersExtraData
} from "./known-behaviors/minion-modifiers/parser";

import { ModifiersBehavior } from "./known-behaviors/modifiers";
import {
  parseModifiersExtraData,
  unparseModifiersExtraData
} from "./known-behaviors/modifiers/parser";

const EXTRA_DATA_PARSERS: Record<string, ExtraDataParser> = {
  [StorageBehavior]: {
    parse: parseStorageExtraData,
    unparse: unparseStorageExtraData
  },
  [MinionModifiersBehavior]: {
    parse: parseMinionModifiersExtraData,
    unparse: unparseMinionModifiersExtraData
  },
  [ModifiersBehavior]: {
    parse: parseModifiersExtraData,
    unparse: unparseModifiersExtraData
  }
};

export function* parseGameObjectBehavior(
  templateParser: TemplateParser
): ParseIterator<GameObjectBehavior> {
  const name = yield new ReadKleiStringInstruction();
  validateDotNetIdentifierName(name);

  return yield* parseNamedGameObjectBehavior(name, templateParser);
}

const parseNamedGameObjectBehavior = taggedParser(
  "GameObjectBehavior",
  name => name,
  function*(
    name: string,
    templateParser: TemplateParser
  ): ParseIterator<GameObjectBehavior> {
    let extraData: any | undefined;
    let extraRaw: ArrayBuffer | undefined;

    const dataLength = yield new ReadInt32Instruction();

    const preParsePosition = yield new GetReaderPosition();
    const templateData = yield* templateParser.parseByTemplate(name);

    const extraDataParser = EXTRA_DATA_PARSERS[name];
    if (extraDataParser) {
      extraData = yield* extraDataParser.parse(templateParser);
    }

    const postParsePosition = yield new GetReaderPosition();

    const dataRemaining = dataLength - (postParsePosition - preParsePosition);
    if (dataRemaining < 0) {
      throw new Error(
        `GameObjectBehavior "${name}" deserialized more type data than expected.`
      );
    } else if (dataRemaining > 0) {
      if (extraDataParser) {
        // If we had an extraData parser, then it should have parsed the rest of it.
        throw new Error(
          `GameObjectBehavior "${name}" extraData parser did not consume all extra data.`
        );
      }

      // No extraData parser, so this is probably extraData that we do not know how to handle.
      //  Store it so that it can be saved again.
      extraRaw = yield new ReadBytesInstruction(dataRemaining);
    }

    const behavior: GameObjectBehavior = {
      name,
      templateData,
      extraData,
      extraRaw
    };
    return behavior;
  }
);

export function* unparseGameObjectBehavior(
  behavior: GameObjectBehavior,
  templateUnparser: TemplateUnparser
): UnparseIterator {
  yield* unparseTaggedGameObjectBehavior(behavior, templateUnparser);
}

const unparseTaggedGameObjectBehavior = taggedParser(
  "GameObjectBehavior",
  behavior => behavior.name,
  function*(
    behavior: GameObjectBehavior,
    templateUnparser: TemplateUnparser
  ): UnparseIterator {
    const { name, templateData, extraData, extraRaw } = behavior;
    const extraDataParser = EXTRA_DATA_PARSERS[name];

    yield writeKleiString(name);

    const lengthToken = yield writeDataLengthBegin();

    yield* templateUnparser.unparseByTemplate(name, templateData);

    if (extraData) {
      if (!extraDataParser) {
        throw new Error(
          `GameObjectBehavior "${name}" has extraData set, but no extraData parser exists for this behavior.`
        );
      }

      yield* extraDataParser.unparse(extraData, templateUnparser);
    }

    if (extraRaw) {
      yield writeBytes(extraRaw);
    }

    yield writeDataLengthEnd(lengthToken);
  }
);
