import {
  Application,
  Container,
  Graphics,
  Point,
  Rectangle,
  Ticker,
  Text,
  FederatedPointerEvent
} from 'pixi.js';
import { keyFactory } from '../functions/keyFactory.function';
import { getScreenCenter } from '../utils/getScreenCenter.function';
import { Chunk } from './Chunk';
import { Tile } from './Tile';
import { Constants } from '../constants/Constants.class';
import { cartesianToIsometric } from '../utils/cartesianToIsometric.function';
import { isometricToCartesian } from '../utils/isometricToCartesian.function';

interface ChunkWithMetadata {
  coords: Point;
  chunk: Chunk;
}

export class Map {
  public _container: Container = new Container();
  public origin: Point = getScreenCenter();
  public map: Array<any> = [
    {
      coords: [-1,-1],
      chunk: []
    },
    {
      coords: [0,-1],
      chunk: []
    },
    {
      coords: [1,-1],
      chunk: []
    },

    {
      coords: [-1,0],
      chunk: []
    },
    {
      coords: [0,0],
      chunk: []
    },
    {
      coords: [1,0],
      chunk: []
    },

    {
      coords: [-1,1],
      chunk: []
    },
    {
      coords: [0,1],
      chunk: []
    },
    {
      coords: [1,1],
      chunk: []
    },
  ];

  // array of chunks in current render distance to be drawn
  private _chunksBuffer: Array<Chunk> = [];
  private _renderDistance: number = 1;

  constructor(private app: Application) {


      this.map.forEach(chunkData => {
        let chunk = new Chunk(this);
          chunk.coords = chunkData.coords;

        let chunkOrigin = new Point(
          chunkData.coords[0] * Tile.width * Constants.chunkSize,
          chunkData.coords[1] * Tile.width * Constants.chunkSize
        );

        chunk.container.position = isometricToCartesian(chunkOrigin);

        this._chunksBuffer.push(chunk);
      })



    this._chunksBuffer.forEach((chunk: Chunk) => {
      
      chunk.render();
      this._container.addChild(chunk.container);
    });


    this.listen();
  }

  public get container(): Container {
    return this._container;
  }

  listen(): void {
    const top = keyFactory('w');
    const right = keyFactory('d');
    const down = keyFactory('s');
    const left = keyFactory('a');


    this.app.ticker.add((delta) => {
      if (top.isDown) {
        this.origin.y += 5;
      }
      if (right.isDown) {
        this.origin.x -= 5;
      }
      if (down.isDown) {
        this.origin.y -= 5;
      }
      if (left.isDown) {
        this.origin.x += 5;
      }
      
      this.container.x = this.origin.x;
      this.container.y = this.origin.y;
    });
  }

  public getChunk(coords: Array<number>): Chunk | undefined {
    return this._chunksBuffer.find((chunk: any) => chunk.coords.toString() === coords.toString());
  }

  public clearGraphics(): void {
    this._chunksBuffer.forEach((chunk: any) => chunk.clearGraphics());
  }


}
