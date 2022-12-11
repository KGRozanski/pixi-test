import { Application, Graphics, Point } from "pixi.js";
import { Chunk } from "./Chunk";

export class Map {
    private chunk: Chunk;
    

    constructor(private app: Application, private graphics: Graphics) {
        this.chunk = new Chunk(app, graphics, {});
        this.chunk.render(new Point(100, 100))
    }


}