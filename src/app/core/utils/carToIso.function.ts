import { Point } from "pixi.js";

export function carToIso(vector: Point): Point {
    return new Point(
        vector.x * .5 + vector.y * -.5,
        vector.x * .25 + vector.y * .25
    )
}
