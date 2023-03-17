import { Container, Graphics, Point, Sprite, Text } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";
import { isoToCar } from "../utils/isoToCar.function";
import { carToIso } from "../utils/carToIso.function";
import { Map } from "./Map";
import { IChunk } from "../interfaces/Chunk.interface";

export class Chunk {
    public coords: Point;
    public origin: Point;
    public entitiesContainer: Container = new Container();

    private _container: Container;
    private _tiles: Array<Array<Sprite>> = [];
    private _tileOutline = new Graphics();
    private readonly _map: Map;

    constructor(public map: Map, public chunkData: IChunk) {
        this._map = map;
        this._container = new Container();
        this._container.name = "chunk";
        this.coords = new Point(chunkData.coords[0], chunkData.coords[1]);
        this.origin = this.coords.multiplyScalar(Constants.tileSize * Constants.chunkSize)
        this._container.position = carToIso(this.origin);
        this._registerEventListeners();
    }

    public get container(): Container {
        return this._container;
    }

    private _registerEventListeners() {
        this._container.onmousemove = (event) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            this._target(isoToCar(COORDS_IN_CHUNK));
        }
    }

    /**
     * Evaluates coordinates of mouse and sets currently targeted Chunk and Tile
     * @param mousePos 
     */
    private _target(mousePos: Point) {
        this._map.clearGraphics();
        const TRACKS = new Point(
            Math.floor(mousePos.x / Constants.tileSize),
            Math.floor(mousePos.y / Constants.tileSize),
        );

        if (TRACKS.x < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x - 1, this.coords.y)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[TRACKS.y][Constants.chunkSize - 1] as Sprite;
        }

        if (TRACKS.y < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x, this.coords.y - 1)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[Constants.chunkSize - 1][TRACKS.x] as Sprite;
        }

        if (TRACKS.y < 0 && TRACKS.x < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x - 1, this.coords.y - 1)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[Constants.chunkSize - 1][Constants.chunkSize - 1] as Sprite;
        }

        if (TRACKS.y >= 0 && TRACKS.x >= 0) {
            this._map.targetedChunk = this;
            this._map.targetedTile = this._map.targetedChunk?._tiles[TRACKS.y][TRACKS.x];
        }

        this._map.targetedChunk.renderTileDiagnostics();
    }

    public renderTileDiagnostics() {
        let origin = new Point(this._map.targetedTile.x, this._map.targetedTile.y);
        origin.x += Constants.tileSize * .5;

        this._tileOutline.lineStyle(1, 0xffffff, 1);
        this._tileOutline.beginFill(0xffffff, .1);
        this._tileOutline.drawPolygon(
            origin,
            new Point(origin.x + Constants.tileSize * .5, origin.y + Constants.tileSize * .25),
            new Point(origin.x, origin.y + Constants.tileSize * .5),
            new Point(origin.x - Constants.tileSize * .5, origin.y + Constants.tileSize * .25),
        );
        this._tileOutline.endFill();
        
    }

    public renderChunkDiagnostics() {
        const outline = new Graphics();
        outline.lineStyle(1, 0xffd900, 1);
        outline.drawPolygon(
            new Point(0, 0),
            carToIso(new Point(Constants.chunkSize * Constants.tileSize, 0)),
            carToIso(new Point(Constants.chunkSize * Constants.tileSize, Constants.chunkSize * Constants.tileSize)),
            carToIso(new Point(0, Constants.chunkSize * Constants.tileSize))
        );
        outline.endFill();
        this._container.addChild(outline);

        const description = new Text(`${this.coords.x}, ${this.coords.y}`, {fill: '#ff0000'});
                description.position = new Point(0,0)


        this._container.addChild(description);
    }

    render() {
        this._container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            this._tiles.push([]);
    
            for (let j = 0; j < Constants.chunkSize; j++) {
                const TILE_POS = carToIso(new Point(
                    j * Constants.tileSize - Constants.tileSize * .5,
                    i * Constants.tileSize + Constants.tileSize * .5
                ))
                const TILE = new Tile(TILE_POS);
                this._tiles[i].push(TILE.getSprite("/assets/img/tiles/dirt_256px.png"));
                this._container.addChild(this._tiles[i][j]);
                // this._container.addChild(TILE.debugText(`${j},${i}`));
            }
        }

        this.renderChunkDiagnostics();
        this._container.addChild(this._tileOutline, this.entitiesContainer);
    }

    public clearGraphics(): void {
        this._tileOutline.clear();
    }

}