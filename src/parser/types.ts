export abstract class ParserInstruction {
  abstract type: string;
  abstract isMeta: boolean;
}

export function isMetaInstruction(inst: ParserInstruction): boolean {
  return inst !== null && typeof inst === "object" && !!inst.isMeta;
}
