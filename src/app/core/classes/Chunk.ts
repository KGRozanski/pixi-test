import { Application, Container, FederatedPointerEvent, Graphics, Point, Polygon, Sprite } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";
import { cartesianToIsometric } from "../utils/cartesianToIsometric.function";
import { isometricToCartesian } from "../utils/isometricToCartesian.function";

export class Chunk {
    private _container: Container;
    private _tiles: Array<Array<Sprite>> = [];
    private _tileOutline = new Graphics();

    constructor() {
        this._container = new Container();
        this._container.name = "chunk"

        this._container.on('mousemove', (event: FederatedPointerEvent) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            const isoCoords = cartesianToIsometric(COORDS_IN_CHUNK);
            const CURRENT_TILE_IDX_COORDS = this._getCurrentTile(new Point(isoCoords.x, isoCoords.y));
            const CUR_TILE = this._tiles[CURRENT_TILE_IDX_COORDS.x][CURRENT_TILE_IDX_COORDS.y]

            this.renderTileDiagnostics(CUR_TILE.position);

        })

        this._container.on('mouseout', (event: FederatedPointerEvent) => {
            this._tileOutline.clear()
        })
    }

    private _getCurrentTile(mousePos: Point) {
        return new Point(
            (Math.floor(Math.abs(mousePos.y) / Tile.width)),
            (Math.floor(Math.abs(mousePos.x) / Tile.width))
        );
    }

    public renderChunkDiagnostics() {
        const outline = new Graphics();
        outline.lineStyle(1, 0xffd900, 1);
        outline.drawPolygon(
            new Point(0, 0),
            isometricToCartesian(new Point(Constants.chunkSize * Tile.width, 0)),
            isometricToCartesian(new Point(Constants.chunkSize * Tile.width, Constants.chunkSize * Tile.width)),
            isometricToCartesian(new Point(0, Constants.chunkSize * Tile.width))
        );
        outline.endFill();
        this._container.addChild(outline);
    }

    public renderTileDiagnostics(tileOrigin: Point) {
        let origin = new Point(tileOrigin.x, tileOrigin.y);
        origin.x += Tile.width * .5;

        this._tileOutline.clear();
        this._tileOutline.lineStyle(1, 0xff0000, 1);
        this._tileOutline.beginFill(0xff0000, .2);
        this._tileOutline.drawPolygon(
            origin,
            new Point(origin.x + Tile.width * .5, origin.y + Tile.width * .25),
            new Point(origin.x, origin.y + Tile.width * .5),
            new Point(origin.x - Tile.width * .5, origin.y + Tile.width * .25),
        );
        this._tileOutline.endFill();
        
    }

    public get container(): Container {
        return this._container;
    }

    public static get width(): number {
        return Tile.width * Constants.chunkSize;
    }

    public static get height(): number {
        return Tile.height * Constants.chunkSize;
    }

    render() {
        this._container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            this._tiles.push([]);
    
            for (let j = 0; j < Constants.chunkSize; j++) {
                let iso = isometricToCartesian(new Point(
                    j * Tile.width - Tile.width * .5,
                    i * Tile.height + Tile.height * .5
                ))

                this._tiles[i].push(Tile.make("/assets/img/tiles/dirt_256px.png", iso));
                this._container.addChild(this._tiles[i][j]);
            }
        }

        this.renderChunkDiagnostics();
        this._container.addChild(this._tileOutline);
    }






    // render(origin: Point) {
    //     this._container.removeChildren();

    //     for (let i = 0; i < Constants.chunkSize; i++) {
    //         for (let j = 0; j < Constants.chunkSize; j++) {
    //             let tilePos = new Point(
    //                 (i % 2 !== 0) ? j * Tile.width + Tile.width / 2 : j * Tile.width, 
    //                 (Tile.height / 2) * i
    //             );

    //                 tilePos.x = origin.x + tilePos.x;
    //                 tilePos.y = origin.y + tilePos.y;

    //             this._container.addChild(Tile.make("/assets/img/tiles/dirt.png", tilePos));
    //         }
    //     }

    // }


}