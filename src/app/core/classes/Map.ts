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
interface ChunkWithMetadata {
  coords: { x: number; y: number };
  chunk: Chunk;
}

export class Map {
  public _container: Container = new Container();
  public origin: Point = getScreenCenter();
  public chunks: Array<Array<ChunkWithMetadata>> = [];
  // Size of the rectangle minimum to cover the entire screen
  // chunks x,y axis  must be at least bigger than the screen size
  private _gridSize: number = 4;

  constructor(private app: Application) {
    const HALF_GRID_SIZE = this._gridSize / 2;

    for (let i = 0; i < this._gridSize; i++) {
      this.chunks.push([]);

      for (let j = 0; j < this._gridSize; j++) {
        const coords = { x: j - HALF_GRID_SIZE, y: i - HALF_GRID_SIZE };
        const CHUNK = new Chunk();
        this.chunks[i].push({
          coords,
          chunk: CHUNK,
        });
      }
    }

    this.chunks.flat().forEach((metaChunk: ChunkWithMetadata) => {
      metaChunk.chunk.render(this.getChunkPos(metaChunk.coords));
      this._container.addChild(metaChunk.chunk.container);
      this.renderChunkDiagnostics(metaChunk);
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


  getChunkPos(coords: { x: number; y: number }): Point {
    return new Point(
      (Chunk.width * coords.x - (this.origin.x - getScreenCenter().x)),
      (Chunk.height * coords.y - (this.origin.y - getScreenCenter().y))
    );
  }

  renderChunkDiagnostics(metaChunk: ChunkWithMetadata) {
    const CHUNK_ORIGIN = this.getChunkPos(metaChunk.coords);
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
