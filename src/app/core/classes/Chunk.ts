import { Application, Container, Graphics, Point } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";

export class Chunk {
    private app: Application;
    private container: Container;

    constructor(app: Application, graphics: Graphics) {
        this.app = app;
        this.container = new Container();
        this.app.stage.addChild(this.container);
    }

    public static get width(): number {
        return Tile.width * Constants.chunkSize;
    }

    public static get height(): number {
        return (Tile.height / 2) * Constants.chunkSize;
    }

    render(origin: Point) {
        this.container.removeChildren();

        for (let i = 0; i < Constants.chunkSize; i++) {
            for (let j = 0; j < Constants.chunkSize; j++) {
                let tilePos = new Point(
                    (i % 2 !== 0) ? j * Tile.width + Tile.width / 2 : j * Tile.width, 
                    (Tile.height / 2) * i
                );

                    tilePos.x = origin.x + tilePos.x;
                    tilePos.y = origin.y + tilePos.y;

                this.container.addChild(Tile.make("/assets/img/tiles/dirt.png", tilePos));
            }
        }

    }


}