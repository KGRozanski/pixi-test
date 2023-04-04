import { Container, Graphics, Point, Sprite, Text } from "pixi.js";
import { Constants } from "../constants/Constants.class";
import { Tile } from "./Tile";
import { isoToCar } from "../utils/isoToCar.function";
import { carToIso } from "../utils/carToIso.function";
import { MapService } from "../services/map.service";
import { IChunk } from "../interfaces/Chunk.interface";
import { Injectable, Optional } from "@angular/core";
import { DataService } from "../services/data.service";

export class Chunk {
    public coords: Point;
    public origin: Point;
    public entitiesContainer: Container = this.getDepthContainer();
    public tracks: Point | null = null;

    private _container: Container;
    private _tilesContainer: Container = new Container();
    private _debugContainer: Container = new Container();
    private _tiles: Array<Array<Sprite>> = [];
    private _tileOutlineContainer = new Container();
    private _tileOutlineGraphics = new Graphics();
    private readonly _map: MapService;

    constructor(public map: MapService, public chunkData: IChunk, private dataService: DataService) {
        this._map = map;
        this._container = new Container();
        this._container.name = "chunk";
        this.coords = new Point(chunkData.coords[0], chunkData.coords[1]);
        this.origin = this.coords.multiplyScalar(Constants.tileSize * Constants.chunkSize);
        this._tileOutlineContainer.addChild(this._tileOutlineGraphics);
        this._container.position = carToIso(this.origin);
        this._registerEventListeners();
    }

    public get container(): Container {
        return this._container;
    }

    private _registerEventListeners() {
        this._container.onmousemove = (event) => {
            const COORDS_IN_CHUNK = this._container.toLocal(event.client);
            this._target(isoToCar(COORDS_IN_CHUNK));
        }

        this.dataService.toggleDebugInfo$.subscribe((debugModeFlag) => {
            this._debugContainer.visible = debugModeFlag;
        })
    }

    /**
     * Evaluates coordinates of mouse and sets currently targeted Chunk and Tile
     * @param mousePos 
     */
    private _target(mousePos: Point) {
        this._map.clearGraphics();
        this.tracks = new Point(
            Math.floor(mousePos.x / Constants.tileSize),
            Math.floor(mousePos.y / Constants.tileSize),
        );

        if (this.tracks.x < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x - 1, this.coords.y)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[this.tracks.y][Constants.chunkSize - 1] as Sprite;
        }

        if (this.tracks.y < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x, this.coords.y - 1)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[Constants.chunkSize - 1][this.tracks.x] as Sprite;
        }

        if (this.tracks.y < 0 && this.tracks.x < 0) {
            this._map.targetedChunk = this._map.getChunk(new Point(this.coords.x - 1, this.coords.y - 1)) as Chunk;
            this._map.targetedTile = this._map.targetedChunk?._tiles[Constants.chunkSize - 1][Constants.chunkSize - 1] as Sprite;
        }

        if (this.tracks.y >= 0 && this.tracks.x >= 0) {
            this._map.targetedChunk = this;
            this._map.targetedTile = this._map.targetedChunk?._tiles[this.tracks.y][this.tracks.x];
        }

        this._map.targetedChunk.renderTileDiagnostics();
    }

    public renderTileDiagnostics() {

        this._tileOutlineContainer.position = this._map.targetedTile.position.add(new Point(128, 64));
        this._tileOutlineGraphics.pivot = new Point(128, 64)

        this._tileOutlineContainer.scale.x = .95;
        this._tileOutlineContainer.scale.y = .95;

        let origin = new Point(0, 0);
        origin.x += Constants.tileSize * .5;
        
        this._tileOutlineGraphics.lineStyle(1, 0xffffff, 1);
        this._tileOutlineGraphics.beginFill(0xffffff, .05);
        this._tileOutlineGraphics.drawPolygon(
            origin,
            new Point(origin.x + Constants.tileSize * .5, origin.y + Constants.tileSize * .25),
            new Point(origin.x, origin.y + Constants.tileSize * .5),
            new Point(origin.x - Constants.tileSize * .5, origin.y + Constants.tileSize * .25),
        );
        this._tileOutlineGraphics.endFill();


    }

    public renderChunkDiagnostics() {
        const outline = new Graphics();
        outline.lineStyle(1, 0xffd900, 1);
        outline.drawPolygon(
            new Point(0, 0),
            carToIso(new Point(Constants.chunkSize * Constants.tileSize, 0)),
            carToIso(new Point(Constants.chunkSize * Constants.tileSize, Constants.chunkSize * Constants.tileSize)),
            carToIso(new Point(0, Constants.chunkSize * Constants.tileSize))
        );
        outline.endFill();
        this._debugContainer.addChild(outline);

        const description = new Text(`${this.coords.x}, ${this.coords.y}`, {fill: '#ff0000'});
                description.position = new Point(0,0)


        this._debugContainer.addChild(description);
    }

    render() {
        this._container.removeChildren()

        for (let i = 0; i < Constants.chunkSize; i++) {
            this._tiles.push([]);
    
            for (let j = 0; j < Constants.chunkSize; j++) {
                const TILE_POS = carToIso(new Point(
                    j * Constants.tileSize - Constants.tileSize / 2,
                    i * Constants.tileSize + Constants.tileSize / 2 
                ))
                const TILE = new Tile(TILE_POS);
                this._tiles[i].push(TILE.getSprite("/assets/img/tiles/dirt_256px.png"));
                this._tilesContainer.addChild(this._tiles[i][j]);
                this._debugContainer.addChild(TILE.debugText(`${j},${i}`));
            }
        }
        
        this._container.addChild(this._tilesContainer, this._tileOutlineContainer);
        this.renderChunkDiagnostics();
        this.container.addChild(this.entitiesContainer, this._debugContainer);
    }

    public clearGraphics(): void {
        this._tileOutlineGraphics.clear();
    }


    private getDepthContainer(): Container {
        let container = new Container();
        for (let index = 0; index < Constants.chunkSize * 2; index++) {
            container.addChild(new Container());
        }

        return container;
    }
}