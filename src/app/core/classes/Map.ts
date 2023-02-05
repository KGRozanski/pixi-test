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
        let chunk = new Chunk();

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

    
    // this._container.on('mousemove', (event: FederatedPointerEvent) => {
    //   // console.log(event.target.parent)
    //   const pointOfCursor: Point = this._container.toLocal(event.client);
    //   const chunksInCol = Math.floor(pointOfCursor.x / Chunk.width);
    //   const chunksInRow = Math.floor(pointOfCursor.y / Chunk.height);

    //   const pointInChunk: Point = new Point(
    //     Math.abs(chunksInCol * Chunk.width - pointOfCursor.x),
    //     Math.abs(chunksInRow * Chunk.height - pointOfCursor.y)
    //   );

    //   const tileCol = Math.floor(pointInChunk.x / Tile.width)
    //   const tileRow = Math.floor(pointInChunk.y / Tile.height)

    //   const pointInTile: Point = new Point(
    //     Math.abs(tileCol * Tile.width - pointInChunk.x),
    //     Math.abs(tileRow * Tile.height - pointInChunk.y)
    //   );

    //   //https://www.youtube.com/watch?v=04oQ2jOUjkU&ab_channel=JordanWest

      
    // })

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



  renderChunkDiagnostics(metaChunk: ChunkWithMetadata) {
    const CHUNK_ORIGIN: any = null
    const graphics = new Graphics();
    graphics
      .lineStyle(1, 0xff0000)
      .drawRect(
        CHUNK_ORIGIN.x,
        CHUNK_ORIGIN.y,
        Chunk.width,
        Chunk.height
      );
    this._container.addChild(graphics);



    graphics
      .lineStyle(1, 0xffff00)
      .drawRect(
        this._container.x,
        this._container.y,
        10,
        10
      );


    const description = new Text(`${metaChunk.coords.x},${metaChunk.coords.y}`, {fill: '#ff0000'});
        description.x = CHUNK_ORIGIN.x,
        description.y = CHUNK_ORIGIN.y;


    this._container.addChild(description);

  }
}
