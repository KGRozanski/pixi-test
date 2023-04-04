import { Injectable } from '@angular/core';
import { Point } from 'pixi.js';
import { BehaviorSubject } from 'rxjs';
import { Key, keyFactory } from '../functions/keyFactory.function';

@Injectable({providedIn: 'root'})
export class IOService {
    public displacementVector$ = new BehaviorSubject<Point>(new Point(0, 0));

    private _top!: Key;
    private _down!: Key;
    private _left!: Key;
    private _right!: Key;

    constructor() {
        this.registerKeyMap();
    }


    listen(): void {
        let x = 0, y = 0;
    
        if(this._top.isDown) {
            y += 5;
        }
        
        if(this._down.isDown) {
            y -= 5;
        }
        
        if(this._left.isDown) {
            x += 5;
        }
        
        if(this._right.isDown) {
            x -= 5;
        }

        this.displacementVector$.next(new Point(x,y));
    }
    

    registerKeyMap(): void {
        this._top = keyFactory('w');
        this._down = keyFactory('s');
        this._left = keyFactory('a');
        this._right = keyFactory('d');

    }
    
}