import { Point } from "pixi.js";

export function isoToCar(vector: Point): Point {
    return new Point(
        vector.x + vector.y * 2,
        vector.x * -1 + vector.y * 2 
    );
}
