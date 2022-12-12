import { Application, Graphics, Point, Ticker } from "pixi.js";
import { keyFactory } from "../functions/keyFactory.function";
import { getScreenCenter } from "../utils/getScreenCenter.function";
import { Chunk } from "./Chunk";

interface ChunkWithMetadata {
    coords: { x: number, y: number},
    chunk: Chunk
}

export class Map {
    public origin: Point = getScreenCenter();
    public chunks: Array<Array<ChunkWithMetadata>> = [];
    // Size of the rectangle minimum to cover the entire screen
    // chunks x,y axis  must be at least bigger than the screen size
    private _gridSize: number = 4;
    

    constructor(private app: Application, private graphics: Graphics) {
        console.log(
            Chunk.width,
            Chunk.height
        )
            
            this.listen();


            const HALF_GRID_SIZE = this._gridSize / 2;

            for (let i = 0; i < this._gridSize; i++) {
                this.chunks.push([]);

                for (let j = 0; j < this._gridSize; j++) {
                    const coords = {x: j - HALF_GRID_SIZE, y: i - HALF_GRID_SIZE };
                    this.chunks[i].push({
                        coords,
                        chunk: new Chunk(this.app, this.graphics)
                    });
                }
            }

            console.log(this.chunks)
    }

    listen(): void {
        const top = keyFactory("ArrowUp");
        const right = keyFactory("ArrowRight");
        const down = keyFactory("ArrowDown");
        const left = keyFactory("ArrowLeft");
    
        this.app.ticker.add((delta => {
            if(top.isDown ) {
                this.origin.y -= 1;
            }
            if(right.isDown ) {
                this.origin.x += 1;
            }
            if(down.isDown ) {
                this.origin.y += 1;
            }
            if(left.isDown ) {
                this.origin.x -= 1;
            }

            this.calculate();

        }));
    }

    calculate(): void {
        this.chunks.flat().forEach((chunk) => {
            
            chunk.chunk.render(this.getChunkPos(chunk.coords));
        });
    }

    getChunkPos(coords: {x: number, y: number}): Point {
        return new Point(
            (Chunk.width * coords.x) - (this.origin.x - getScreenCenter().y ),
            (Chunk.height * coords.y) - (this.origin.y - getScreenCenter().x)
        );
    }


}