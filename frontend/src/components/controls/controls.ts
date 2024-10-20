export default class Controls {
  leftIsDown: boolean = false;
  rightIsDown: boolean = false;
  upIsDown: boolean = false;
  downIsDown: boolean = false;
  aIsDown: boolean = false;
  bIsDown: boolean = false;
  xIsDown: boolean = false;
  yIsDown: boolean = false;
  keyA: Phaser.Input.Keyboard.Key;
  keyB: Phaser.Input.Keyboard.Key;
  keyX: Phaser.Input.Keyboard.Key;
  keyY: Phaser.Input.Keyboard.Key;

  private _leftButton: HTMLElement | null;
  private _rightButton: HTMLElement | null;
  private _upButton: HTMLElement | null;
  private _downButton: HTMLElement | null;
  private _aButton: HTMLElement | null;
  private _bButton: HTMLElement | null;
  private _xButton: HTMLElement | null;
  private _yButton: HTMLElement | null;

  constructor(scene: Phaser.Scene) {
    // コントローラーの操作
    this._leftButton = document.getElementById("left-button");
    this._rightButton = document.getElementById("right-button");
    this._upButton = document.getElementById("up-button");
    this._downButton = document.getElementById("down-button");
    this._aButton = document.getElementById("a-button");
    this._bButton = document.getElementById("b-button");
    this._xButton = document.getElementById("x-button");
    this._yButton = document.getElementById("y-button");

    this._leftButton?.addEventListener("click", () => {
      this.leftIsDown = true;
    });
    this._rightButton?.addEventListener("click", () => {
      this.rightIsDown = true;
    });
    this._upButton?.addEventListener("click", () => {
      this.upIsDown = true;
    });
    this._downButton?.addEventListener("click", () => {
      this.downIsDown = true;
    });
    this._aButton?.addEventListener("click", () => {
      this.aIsDown = true;
    });
    this._bButton?.addEventListener("click", () => {
      this.bIsDown = true;
    });
    this._xButton?.addEventListener("click", () => {
      this.xIsDown = true;
    });
    this._yButton?.addEventListener("click", () => {
      this.yIsDown = true;
    });

    // キーボード操作
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyB = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.keyX = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyY = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
  }

  update() {
    this.leftIsDown = false;
    this.rightIsDown = false;
    this.upIsDown = false;
    this.downIsDown = false;
    this.aIsDown = false;

    // キーボード操作
    if (this.keyA.isDown) {
      this.aIsDown = true;
    }
    if (this.keyB.isDown) {
      this.bIsDown = true;
    }
    if (this.keyX.isDown) {
      this.xIsDown = true;
    }
    if (this.keyY.isDown) {
      this.yIsDown = true;
    }
  }

  cancel() {
    this.aIsDown = false;
    this.bIsDown = false;
    this.xIsDown = false;
    this.yIsDown = false;
  }
}
