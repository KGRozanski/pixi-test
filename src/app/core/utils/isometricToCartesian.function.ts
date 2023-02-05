import { Point } from "pixi.js";

export function isometricToCartesian(vector: Point): Point {
    return new Point(
        vector.x * .5 + vector.y * -.5,
        vector.x * .25 + vector.y * .25
    )
}
