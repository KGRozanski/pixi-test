import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

import * as PIXI from 'pixi.js';
import { MapService } from './core/services/map.service';

import '@pixi/math-extras';
import '@pixi/events';
import { Application, Container, IApplicationOptions, Point, Text } from 'pixi.js';
import { DataService } from './core/services/data.service';
import { IOService } from './core/services/io.service';

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
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true
    });
    dataService.application$.next(this.Application);
    this.Application.stage.addChild(this.map.container);
    document.body.appendChild(this.Application.view as any);

    this.Application.ticker.add((delta: number) => {
      this.dataService.fpsCount$.next(Number(this.Application.ticker.FPS.toFixed(2)));
      this.IOService.listen();
    });






    // const description = new Text(`${this.Application.ticker.FPS}`, {fill: '#ff0000'});
    //   description.position = new Point(0,0)



    // const fpsContainer = new Container();


    // fpsContainer.addChild(description);
    // this.Application.stage.addChild(fpsContainer)

    
  }
}
