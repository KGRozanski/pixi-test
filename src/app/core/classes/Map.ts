import { Application, Graphics, Point, Ticker } from "pixi.js";
import { keyFactory } from "../functions/keyFactory.function";
import { getScreenCenter } from "../utils/getScreenCenter.function";
import { Chunk } from "./Chunk";

export class Map {
    private chunk: Chunk;
    

    constructor(private app: Application, private graphics: Graphics) {
        this.chunk = new Chunk(app, graphics, {});
        this.chunk.render(getScreenCenter())

        console.log(
            Chunk.width,
            Chunk.height

        )

        const right = keyFactory("ArrowRight");
        const top = keyFactory("ArrowUp");
        const down = keyFactory("ArrowDown");
        const left = keyFactory("ArrowLeft");

        let ticker = this.app.ticker.add((delta => {
            if(right.isDown ) {
                console.log(right.value)
            }
            if(top.isDown ) {
                console.log(top.value)
            }
            if(down.isDown ) {
                console.log(down.value)
            }
            if(left.isDown ) {
                console.log(left.value)
            }
        }));



    }


}