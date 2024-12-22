import { DataReader } from "../../binary-serializer";
import { ParserInstruction } from "../types";
export type ParseIterator<T> = Generator<ParserInstruction, T, any>;
export type ParseInterceptor = (instruction: ParserInstruction) => ParserInstruction;
export declare function parse<T>(reader: DataReader, readParser: ParseIterator<T>, interceptor?: ParseInterceptor): T;
