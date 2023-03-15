import { Point, Sprite, Text } from 'pixi.js';
import { Constants } from '../constants/Constants.class';

export class Tile {
  private readonly _position: Point;


  constructor(pos: Point) {
    this._position = pos;
  }

  public getSprite(texture: string ): Sprite {
    const SPRITE: Sprite = Sprite.from(texture);
          SPRITE.x = this._position.x;
          SPRITE.y = this._position.y;

    SPRITE.eventMode = 'static';

    return SPRITE;
  }

  public debugText(coordsSpan: string): Text {
    const DEBUG_TEXT = new Text(coordsSpan, {fill: '#eee'});
          DEBUG_TEXT.position = new Point(
            (this._position.x + Constants.tileSize * .5) - 20,
            (this._position.y + Constants.tileSize * .25) - 20
          );

    return DEBUG_TEXT;
    
  }
}
