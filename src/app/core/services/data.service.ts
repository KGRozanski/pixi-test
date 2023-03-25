import { Injectable } from '@angular/core';
import { Application } from 'pixi.js';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { EntityClassName } from '../types/Entity.type';

@Injectable({providedIn: 'root'})
export class DataService {
    public application$: ReplaySubject<Application> = new ReplaySubject(1);
    public buildEntity$ = new Subject<EntityClassName>();
    public toggleDebugInfo$ = new BehaviorSubject<boolean>(true);

    constructor() { }
    
}