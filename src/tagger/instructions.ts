import { ParserInstruction } from "../parser/types";

type TaggedParseStart = "tagged-parse:start";
type TaggedParseEnd = "tagged-parse:end";
type TaggedParseType = TaggedParseStart | TaggedParseEnd;

export class TaggedParseInstruction implements ParserInstruction {
  public isMeta: true = true;
  constructor(
    public type: TaggedParseType,
    public tag: string,
    public instanceName?: string
  ) {}

  public static start(
    tag: string,
    instanceName?: string
  ): TaggedParseInstruction {
    return new TaggedParseInstruction("tagged-parse:start", tag, instanceName);
  }

  public static end(
    tag: string,
    instanceName?: string
  ): TaggedParseInstruction {
    return new TaggedParseInstruction("tagged-parse:end", tag, instanceName);
  }

  public isStart(): boolean {
    return this.type === "tagged-parse:start";
  }

  public isEnd(): boolean {
    return this.type === "tagged-parse:end";
  }
}
