import { Application, Graphics, Sprite, Point } from "pixi.js";

export class Toolbar {
  public container = new Graphics();
  private _height = 148;
  private _origin = new Point(0, window.innerHeight - this._height);

  constructor(private app: Application) {
    this.container.beginFill(0x3f4247);
    this.container.drawRect(this._origin.x, this._origin.y, window.innerWidth, this._height);

    const tavernBtn = Sprite.from("assets/img/others/buttons0011.png");
    const BTN_POS = this.getButtonPosOrigin();
    tavernBtn.position.set(BTN_POS.x, BTN_POS.y);
    tavernBtn.eventMode = "static";

    // tavernBtn.on('click', (event) => {
    //     console.log('event', event)
    //     tavernBtn.position
    // });

    this.container.addChild(tavernBtn);
    this.renderHoveringObject();
  }

  private getButtonPosOrigin(): Point {
    return new Point(10, 10).add(this._origin);
  }

  private renderHoveringObject(): void {
    const tavern = Sprite.from("assets/img/others/tavern.png");

    this.app.stage.onmousemove = (event) => {
    //   tavern.position.set(this.app.map.targetedTile.position.x, this.app.map.targetedTile.position.y);
    };
    // window.document.onmousemove = (event) => {
    //     console.log(event)
    // };

    this.container.addChild(tavern);
  }
}
