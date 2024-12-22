import { ParseInterceptor } from "../parser/parse/parser";
import { ParserInstruction } from "../parser/types";

import { TaggedParseInstruction } from "./instructions";

export function tagReporter(
  onTagStart: (tag: string, instanceName: string | null) => void,
  onTagEnd?: (tag: string, instanceName: string | null) => void
): ParseInterceptor {
  return (inst: ParserInstruction) => {
    if (inst instanceof TaggedParseInstruction) {
      if (inst.isStart()) {
        onTagStart(inst.tag, inst.instanceName || null);
      } else if (onTagEnd && inst.isEnd()) {
        onTagEnd(inst.tag, inst.instanceName || null);
      }
    }
    return inst;
  };
}
