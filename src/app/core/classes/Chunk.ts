import { Application, Container, FederatedPointerEvent, Graphics, Point, Sprite } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";

export class Chunk {
    private _container: Container;
    private _chunkCenterOffset = 8 * Tile.width;
    private _tiles: Array<Array<Sprite>> = [];

    constructor() {
        this._container = new Container();
        this._container.name = "chunk"


        this._container.on('mousemove', (event: FederatedPointerEvent) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            
            

            const x = COORDS_IN_CHUNK.x + COORDS_IN_CHUNK.y * 2;
            const y = COORDS_IN_CHUNK.x * -1 + COORDS_IN_CHUNK.y * 2;

            // console.log(Math.floor((COORDS_IN_CHUNK.x) / Tile.width), Math.floor(COORDS_IN_CHUNK.y / Tile.height));
            let currentSprite = this._tiles[Math.floor(y / Tile.width)][Math.floor(x / Tile.width)]
            currentSprite.scale.x = .98;
            currentSprite.scale.y = .98;
            
        })
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

    render(origin: Point) {
        this._container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            this._tiles.push([]);
    
            for (let j = 0; j < Constants.chunkSize; j++) {

                // let iso = new Point(
                //     ((j * Tile.width * .5  + i * Tile.width * -.5) - Tile.width / 2) + this._chunkCenterOffset,
                //     j * Tile.height * .5 + i * Tile.height * .5
                // );
                let iso = new Point(
                    (j * Tile.width - Tile.width ) * .5  + i * Tile.height * -.5,
                    j * Tile.width * .25 + i * Tile.height * .25
                );
                    // console.log(this._container.toLocal(iso))

                this._tiles[i].push(Tile.make("/assets/img/tiles/dirt_1x1.png", iso));
                this._container.addChild(this._tiles[i][j]);
            }
        }

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