import { Component, HostListener } from '@angular/core';
import Entites from '../../data/entities.json';
import { DataService } from '../../services/data.service';
import { EntityClassName } from '../../types/Entity.type';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  public entites = Entites;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
      let target: EventTarget & {title: string} = event.target as any;

      if(target.title) {
        this.dataService.buildEntity$.next(target.title + "Entity" as EntityClassName);
      }
  }

  constructor(private dataService: DataService) {}

  public getEntityBtnSrc(name: string): string {
    return name.toLocaleLowerCase();
  }
}
