import { Application, Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";

export class Chunk {
    private _container: Container;
    private _chunkCenterOffset = 8 * Tile.width;

    constructor() {
        this._container = new Container();
        this._container.name = "chunk"


        this._container.on('mousemove', (event: FederatedPointerEvent) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            
            

            const x = COORDS_IN_CHUNK.x + COORDS_IN_CHUNK.y;
            const y = COORDS_IN_CHUNK.x * -1 + COORDS_IN_CHUNK.y;

            console.log(COORDS_IN_CHUNK.x,COORDS_IN_CHUNK.y)
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
            for (let j = 0; j < Constants.chunkSize; j++) {

                let cartesian = new Point(
                    i * Tile.width,
                    i * Tile.height
                )

                let iso = new Point(
                    ((j * Tile.width * .5  + i * Tile.width * -.5) - Tile.width / 2) + this._chunkCenterOffset,
                    j * Tile.height * .5 + i * Tile.height * .5
                );

                    console.log(this._container.toLocal(iso))


                    // tilePos.x = origin.x + tilePos.x;
                    // tilePos.y = origin.y + tilePos.y;

                this._container.addChild(Tile.make("/assets/img/tiles/dirt.png", iso));
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