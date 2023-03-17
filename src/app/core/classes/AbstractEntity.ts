import { Sprite } from "pixi.js";

export abstract class AbstractEntity {
    public abstract title: string;

    constructor() {}

    getSprite(): Sprite {
        return Sprite.from('assets/img/others/entities/' + this.title.toLowerCase() + '.png');
    }
}
