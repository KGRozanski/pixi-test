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
    private readonly _map: any;

    constructor(public map: Map) {
        this._container = new Container();
        this._container.name = "chunk";
        this._map = map;
        this._trackMouse();
    }

    private _trackMouse() {
        this._container.on('mousemove', (event: FederatedPointerEvent) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            this._drawHover(cartesianToIsometric(COORDS_IN_CHUNK));
        })
    }

    private _drawHover(mousePos: Point) {
        this._map.clearGraphics();
        const TRACKS = new Point(
            Math.floor(mousePos.x / Tile.width),
            Math.floor(mousePos.y / Tile.width),
        );

        if (TRACKS.x < 0) {
            const chunk = this._map.getChunk([this.coords[0] - 1, this.coords[1]]);
            chunk.renderTileDiagnostics(new Point(Constants.chunkSize - 1, TRACKS.y));
        }

        if (TRACKS.y < 0) {
            const chunk = this._map.getChunk([this.coords[0], this.coords[1] - 1]);
            chunk.renderTileDiagnostics(new Point(TRACKS.x, Constants.chunkSize - 1));
        }

        if (TRACKS.y < 0 && TRACKS.x < 0) {
            const chunk = this._map.getChunk([this.coords[0] - 1, this.coords[1] - 1]);
            chunk.renderTileDiagnostics(new Point(Constants.chunkSize - 1, Constants.chunkSize - 1));
        }

        if (TRACKS.y >= 0 && TRACKS.x >= 0) {
            this.renderTileDiagnostics(TRACKS)
        }
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

        const description = new Text(`${this.coords[0]}, ${this.coords[1]}`, {fill: '#ff0000'});
                description.position = new Point(0,0)


        this._container.addChild(description);
    }

    public renderTileDiagnostics(tileOrigin: Point) {
        const tileToDrawOn = this._tiles[tileOrigin.y][tileOrigin.x];

        let origin = new Point(tileToDrawOn.position.x, tileToDrawOn.position.y);
        origin.x += Tile.width * .5;

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



    public clearGraphics(): void {
        this._tileOutline.clear();
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