import { ParserInstruction } from "../parser/types";

export class ProgressInstruction implements ParserInstruction {
  public type: "progress" = "progress";
  public isMeta: true = true;
  constructor(public message: string) {}
}
