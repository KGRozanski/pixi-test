import { Application, Container, FederatedPointerEvent, Graphics, Point } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";

export class Chunk {
    private _container: Container;

    constructor() {
        this._container = new Container();
        this._container.name = "chunk"
    }

    public get container(): Container {
        return this._container;
    }

    public static get width(): number {
        return Tile.width * Constants.chunkSize;
    }

    public static get height(): number {
        return (Tile.height / 2) * Constants.chunkSize;
    }

    render(origin: Point) {
        this._container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            for (let j = 0; j < Constants.chunkSize; j++) {
                // let tilePos = new Point(
                //     (i % 2 !== 0) ? j * Tile.width + Tile.width / 2 : j * Tile.width, 
                //     (Tile.height / 2) * i
                // );

                let cartesian = new Point(
                    i * Tile.width,
                    i * Tile.height
                )

                let iso = new Point(
                    (j * 1 * Tile.width) / 2 + (i * -1 * j),
                    (j * .5 * Tile.height) + (i * 1 * Tile.height )
                );

                    console.log(iso)


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