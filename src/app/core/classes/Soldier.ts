import { Assets, Container, Point, Sprite, Spritesheet, Texture } from "pixi.js";
import { MapService } from "../services/map.service";
import { AnimatedSprite, SCALE_MODES } from "pixi.js";
import { IOService } from "../services/io.service";
import { debounce, distinct, distinctUntilChanged, interval } from "rxjs";
import { getScreenCenter } from "../utils/getScreenCenter.function";

enum Direction {
    '0,-5' = 'walk_down',
    '5,0' = 'walk_left',
    '5,5' = 'walk_up_left',
    '0,5' = 'walk_up',
    '-5,0' = 'walk_right',
    '-5,5' = 'walk_up_right',
    '5,-5' = 'walk_down_left',
    '-5,-5' = 'walk_down_right'
}

export class Soldier {
  private _sprite!: Spritesheet;

  constructor(private map: MapService, private IOService: IOService, public entitiesContainer: Container) {
    this.loadSprite().then(() => {
      let anim = new AnimatedSprite(this._sprite.animations["walk_up"]);
      // anim.eventMode = 'static';
      anim.on("click", ($event) => {
        anim.currentFrame = 0;
        anim.stop();
      });
      anim.position = getScreenCenter();
      anim.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      anim.scale.set(3);
      anim.animationSpeed = 0.16;
      // this._sprite.parse();
      anim.play();

      this.entitiesContainer.addChild(anim);

      this.IOService.displacementVector$
        .pipe(
            distinctUntilChanged((prev, cur) => {
                return JSON.stringify(prev) == JSON.stringify(cur);
            })
        )
        .subscribe((val) => {
            console.log(JSON.stringify(val))
            const dirKey: keyof typeof Direction = val.x + "," + val.y as any;

            if(dirKey as any == '0,0') {
                anim.currentFrame = 0;
                anim.stop();
            } else {
                anim.textures = this._sprite.animations[Direction[dirKey]];
                anim.play()
            }
        
        });
    });
  }

  private async loadSprite(): Promise<void> {
    this._sprite = await Assets.load("assets/img/hero/Character/character.json");
  }
}
