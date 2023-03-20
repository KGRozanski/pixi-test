import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

import * as PIXI from 'pixi.js';
import { Map } from './core/classes/Map';

import '@pixi/math-extras';
import '@pixi/events';
import { Application, Container, IApplicationOptions, Point, Text } from 'pixi.js';
import { DataService } from './core/services/data.service';

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

  
  
  constructor(@Inject(DOCUMENT) private document: Document, private dataService: DataService) {
    this.Application = new PIXI.Application({
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true
    });

    document.body.appendChild(this.Application.view as any);
    const map = new Map(this.Application, this.dataService);
    this.Application.stage.addChild(map.container);

    dataService.application$.next(this.Application);


    // const description = new Text(`${this.Application.ticker.FPS}`, {fill: '#ff0000'});
    //   description.position = new Point(0,0)



    // const fpsContainer = new Container();


    // fpsContainer.addChild(description);
    // this.Application.stage.addChild(fpsContainer)

    
  }
}
