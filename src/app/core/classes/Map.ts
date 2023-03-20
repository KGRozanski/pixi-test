import {
  Application,
  Container,
  Graphics,
  Point,
  Sprite
} from 'pixi.js';
import { keyFactory } from '../functions/keyFactory.function';
import { getScreenCenter } from '../utils/getScreenCenter.function';
import { Chunk } from './Chunk';
import world from '../data/map.json';
import { Map as MapType } from '../types/Map.type';
import { IChunk } from '../interfaces/Chunk.interface';
import { DataService } from '../services/data.service';
import { EntityFactory } from './Entity.factory';

export class Map {
  private _container: Container = new Container();
  public origin: Point = getScreenCenter();
  public map: MapType = world as MapType;

  // array of chunks in current render distance to be drawn
  private _chunksBuffer: Array<Chunk> = [];
  private _renderDistance: number = 1;
  public targetedTile: Sprite = null as unknown as Sprite;
  public targetedChunk: Chunk = null as unknown as Chunk;

  constructor(private app: Application, private dataService: DataService) {

    this.map.forEach((chunkData: IChunk) => {
      const CHUNK = new Chunk(this, chunkData);
      this._chunksBuffer.push(CHUNK);
    });


    this._chunksBuffer.forEach((chunk: Chunk) => {
      chunk.render();
      this._container.addChild(chunk.container);
    });


    this.listen();
    this.setupListener();
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

  public getChunk(coords: Point): Chunk | undefined {
    return this._chunksBuffer.find((chunk: any) => chunk.coords.equals(coords));
  }

  public clearGraphics(): void {
    this._chunksBuffer.forEach((chunk: any) => chunk.clearGraphics());
  }

  public setupListener(): void {

    


    this.dataService.buildEntity$.subscribe((entityName) => {
      EntityFactory.setStrategy(entityName);
      let choosenEntity = EntityFactory.entity.getSprite();
      console.log(choosenEntity)
      
      this._container.onmousemove = (event) => {
        if(this.targetedTile) {
          choosenEntity.position.set(
            this.targetedTile.position.x, this.targetedTile.position.y
          );

        }
      };
      this.targetedChunk.entitiesContainer.addChild(choosenEntity);

    });
  }

}
