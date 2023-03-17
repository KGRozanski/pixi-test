import { ITile } from "./Tile.interface";

export interface IChunk {
    coords: [number, number];
    tiles: Array<[ITile]>;
}
