import { Logger } from "../logging";
import { DataReader, DataWriter } from "../binary-serializer";
import { TypeReader, TypeWriter } from "../type-templates";
import { OniGameState } from "./services";
import { GameObject } from "./interfaces";
export declare class OniGameStateManagerImpl implements OniGameState {
    private _typeReader;
    private _typeWriter;
    private _logger;
    static readonly SAVE_HEADER: string;
    static readonly CURRENT_VERSION_MAJOR: number;
    static readonly CURRENT_VERSION_MINOR: number;
    gameObjects: Map<string, GameObject[]>;
    private _gameObjectOrdering;
    private _versionMinor;
    constructor(_typeReader: TypeReader, _typeWriter: TypeWriter, _logger: Logger);
    parse(reader: DataReader): void;
    write(writer: DataWriter): void;
    toJSON(): {
        gameObjects: {
            [key: string]: any[];
        };
    };
    private _parsePrefabs(reader);
    private _writePrefabs(writer);
    private _parsePrefabSet(reader, prefabName);
    private _writePrefabSet(writer, prefabSet);
    private _parseGameObject(reader);
    private _writeGameObject(writer, gameObject);
    private _parseGameObjectBehavior(reader);
    private _writeGameObjectBehavior(writer, behavior);
}
