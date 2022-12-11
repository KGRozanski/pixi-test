import { Application, Container, Graphics, Point } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";

export class Chunk {
    private app: Application;
    private graphics: Graphics;
    private container: Container;
    private tile!: Tile;

    constructor(app: Application, graphics: Graphics, data: any) {
        this.app = app;
        this.graphics = graphics;
        this.container = new Container();
        this.app.stage.addChild(this.container);
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