import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
const _package = require('package.json');

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  public debugFlag$ = this.dataService.toggleDebugInfo$;
  public fps: string | null = null;
  public package = _package;

  constructor(private dataService: DataService) {
    this.dataService.application$.subscribe((application) => {
      application.ticker.add((delta: number) => {
        this.fps = application.ticker.FPS.toFixed(2);
      });
    });


  }

}
