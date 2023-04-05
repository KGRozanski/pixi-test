import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

import * as PIXI from 'pixi.js';
import { MapService } from './core/services/map.service';

import '@pixi/math-extras';
import '@pixi/events';
import { Application, Container, IApplicationOptions, Point, Text } from 'pixi.js';
import { DataService } from './core/services/data.service';
import { IOService } from './core/services/io.service';
import { Soldier } from './core/classes/Soldier';

declare let globalThis: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pixi-test';
  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  private Application: Application;
  private _debugMode = false;
  public entitiesContainer: Container = new Container();

  @HostListener('document:keydown', ['$event'])
  onDebugToggle(event: KeyboardEvent) {
    if(event.code == 'F2') {
      this._debugMode = !this._debugMode;
      this.dataService.toggleDebugInfo$.next(this._debugMode);
    }
  }
  
  constructor(@Inject(DOCUMENT) private document: Document, private dataService: DataService, private map: MapService, private IOService: IOService) {
    this.Application = new PIXI.Application({
      resizeTo: window,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      antialias: true,
    });
    dataService.application$.next(this.Application);
    this.Application.stage.addChild(this.map.container);
    this.Application.stage.addChild(this.entitiesContainer);
    document.body.appendChild(this.Application.view as any);

    // assign info to global context vars for pixi chrome devtool extention
    globalThis.__PIXI_STAGE__ = this.Application.stage;
    globalThis.__PIXI_RENDERER__ = this.Application.renderer;

    this.Application.ticker.add((delta: number) => {
      this.dataService.fpsCount$.next(Number(this.Application.ticker.FPS.toFixed(2)));
      this.IOService.listen();
    });


    new Soldier(this.map, this.IOService, this.entitiesContainer);



    // const description = new Text(`${this.Application.ticker.FPS}`, {fill: '#ff0000'});
    //   description.position = new Point(0,0)



    // const fpsContainer = new Container();


    // fpsContainer.addChild(description);
    // this.Application.stage.addChild(fpsContainer)

    
  }
}
