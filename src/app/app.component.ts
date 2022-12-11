import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import * as PIXI from 'pixi.js';
import { Point } from 'pixi.js';
import { Map } from './core/classes/Map';

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
  private Application: any;
  

  private graphics: any = new PIXI.Graphics();
  
  
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.Application = new PIXI.Application({
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });
  }

  async ngOnInit() {
    document.body.appendChild(this.Application.view);
    const map = new Map(this.Application, this.graphics);




    // this.Application.stage.addChild(this.graphics);
  }


}
