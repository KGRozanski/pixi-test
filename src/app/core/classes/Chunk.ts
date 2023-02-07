import { Application, Container, FederatedPointerEvent, Graphics, Point, Polygon, Sprite, Text } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";
import { cartesianToIsometric } from "../utils/cartesianToIsometric.function";
import { isometricToCartesian } from "../utils/isometricToCartesian.function";
import { Map } from "./Map";

export class Chunk {
    private _container: Container;
    private _tiles: Array<Array<Sprite>> = [];
    private _tileOutline = new Graphics();
    public coords: any;
    private readonly _map: Map;

    constructor(public map: Map) {
        this._container = new Container();
        this._container.name = "chunk";
        this._map = map;
        this._registerEventListeners();
    }

    public get container(): Container {
        return this._container;
    }

    private _registerEventListeners() {
        this._container.on('mousemove', (event: FederatedPointerEvent) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            this._target(cartesianToIsometric(COORDS_IN_CHUNK));
        });

        this._container.on('click', (event: FederatedPointerEvent) => {
            this._map.targetedTile.y += 50;
        });
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
            this._map.targetedChunk = this._map.getChunk([this.coords[0] - 1, this.coords[1]]) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[TRACKS.y][Constants.chunkSize - 1] as Sprite;
        }

        if (TRACKS.y < 0) {
            this._map.targetedChunk = this._map.getChunk([this.coords[0], this.coords[1] - 1]) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[Constants.chunkSize - 1][TRACKS.x] as Sprite;
        }

        if (TRACKS.y < 0 && TRACKS.x < 0) {
            this._map.targetedChunk = this._map.getChunk([this.coords[0] - 1, this.coords[1] - 1]) as Chunk;
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
            isometricToCartesian(new Point(Constants.chunkSize * Constants.tileSize, 0)),
            isometricToCartesian(new Point(Constants.chunkSize * Constants.tileSize, Constants.chunkSize * Constants.tileSize)),
            isometricToCartesian(new Point(0, Constants.chunkSize * Constants.tileSize))
        );
        outline.endFill();
        this._container.addChild(outline);

        const description = new Text(`${this.coords[0]}, ${this.coords[1]}`, {fill: '#ff0000'});
                description.position = new Point(0,0)


        this._container.addChild(description);
    }

    render() {
        this._container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            this._tiles.push([]);
    
            for (let j = 0; j < Constants.chunkSize; j++) {
                let iso = isometricToCartesian(new Point(
                    j * Constants.tileSize - Constants.tileSize * .5,
                    i * Constants.tileSize + Constants.tileSize * .5
                ))
                const TILE = new Tile(iso);
                this._tiles[i].push(TILE.getSprite("/assets/img/tiles/dirt_256px.png"));
                this._container.addChild(this._tiles[i][j]);
                this._container.addChild(TILE.debugText(`${j},${i}`));
            }
        }

        this.renderChunkDiagnostics();
        this._container.addChild(this._tileOutline);
    }

    public clearGraphics(): void {
        this._tileOutline.clear();
    }

}