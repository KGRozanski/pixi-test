import { Point } from "pixi.js"

export function getScreenCenter(): Point {
    return new Point(
        document.body.clientWidth / 2,
        document.body.clientHeight / 2
    );
}
