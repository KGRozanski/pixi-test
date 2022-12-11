import { Graphics, Point, Sprite } from "pixi.js";
import { Constants } from "../constants/Constants.class";

export class Tile {
    
    constructor() {}
    
    public static get width(): number {
        return Constants.tileSize;
    }

    public static get height(): number {
        return Math.floor(Tile.width / Math.tan((60 * Math.PI) / 180));
    }

    public static make(texture: string, pos: Point) {
        const SPRITE = Sprite.from(texture);
        SPRITE.x = pos.x;
        SPRITE.y = pos.y;
        
        return SPRITE;
    }



    // public draw(posX: number, posY: number) {
    //     // draw polygon
    //     const path = [0, 0, 700, 460, 780, 420, 730, 570, 590, 520];

    //     this.graphics.lineStyle(0);
    //     this.graphics.beginFill(0x9e528e, 1);
    //     this.graphics.drawPolygon(path);
    //     this.graphics.endFill();


    // }
}
