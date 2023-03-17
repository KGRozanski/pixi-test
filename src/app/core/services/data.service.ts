import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EntityClassName } from '../types/Entity.type';

@Injectable({providedIn: 'root'})
export class DataService {
    public buildEntity$ = new Subject<EntityClassName>();

    constructor() { }
    
}