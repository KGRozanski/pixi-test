import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

import * as PIXI from 'pixi.js';
import { Map } from './core/classes/Map';
import { Toolbar } from './core/classes/Toolbar';

import '@pixi/math-extras';
import '@pixi/events';
import { Application, IApplicationOptions } from 'pixi.js';
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

  
  
  constructor(@Inject(DOCUMENT) private document: Document, private dataServce: DataService) {
    this.Application = new PIXI.Application({
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
      sharedTicker: true
    });

    document.body.appendChild(this.Application.view as any);
    const map = new Map(this.Application, this.dataServce);
    this.Application.stage.addChild(map.container)
  }
}
