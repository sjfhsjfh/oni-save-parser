import { ProgressInstruction } from "./types";
import { ParseInterceptor } from "../parser";
import { ParserInstruction } from "../parser/types";

export function reportProgress(message: string): ProgressInstruction {
  return new ProgressInstruction(message);
}

export function progressReporter(
  onProgress: (message: string) => void
): ParseInterceptor {
  return (instruction: ParserInstruction) => {
    if (instruction && instruction instanceof ProgressInstruction) {
      onProgress(instruction.message);
    }
    return instruction;
  };
}
