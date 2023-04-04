import { Container, Point, Sprite } from "pixi.js";
import { getScreenCenter } from "../utils/getScreenCenter.function";
import { Chunk } from "../classes/Chunk";
import world from "../data/map.json";
import { Map as MapType } from "../types/Map.type";
import { IChunk } from "../interfaces/Chunk.interface";
import { DataService } from "./data.service";
import { EntityFactory } from "../classes/Entity.factory";
import { Constants } from "../constants/Constants.class";
import { Injectable, Optional } from "@angular/core";
import { IOService } from "./io.service";

@Injectable({ providedIn: "root" })
export class MapService {
  private _container: Container = new Container();
  public origin: Point = getScreenCenter();
  public map: MapType = world as MapType;

  // array of chunks in current render distance to be drawn
  private _chunksBuffer: Array<Chunk> = [];
  private _renderDistance: number = 1;
  public targetedTile: Sprite = null as unknown as Sprite;
  public targetedChunk: Chunk = null as unknown as Chunk;

  constructor(private dataService: DataService, private IOService: IOService) {
    this.container.position = this.origin;

    this.map.forEach((chunkData: IChunk) => {
      const CHUNK = new Chunk(this, chunkData, this.dataService);
      this._chunksBuffer.push(CHUNK);
    });

    this._chunksBuffer.forEach((chunk: Chunk) => {
      chunk.render();
      this._container.addChild(chunk.container);
    });

    this.IOService.displacementVector$.subscribe((value) => {
      this.container.position = this.container.position.add(value);
    });
  
    this.setupListener();
  }

  public get container(): Container {
    return this._container;
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

      this._container.onmousemove = (event) => {
        if (this.targetedTile) {
          choosenEntity.position.set(
            this.targetedTile.position.x + (Constants.tileSize - choosenEntity.width) / 2,
            this.targetedTile.position.y - (choosenEntity.height - 100)
          );

          this.targetedChunk.entitiesContainer.addChild(choosenEntity);

          if (this.targetedChunk.tracks) {
            let tempContainer: Container = this.targetedChunk.entitiesContainer.children[
              this.targetedChunk.tracks!.x + this.targetedChunk.tracks!.y
            ] as Container;

            if (tempContainer) {
              tempContainer.addChild(choosenEntity);
            }
          }

          this._container.onclick = (event) => {
            this._container.onmousemove = null;
          };
        }
      };
    });
  }
}
