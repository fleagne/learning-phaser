export default class Controls {
  leftIsDown: boolean;
  rightIsDown: boolean;
  upIsDown: boolean;
  downIsDown: boolean;
  aIsDown: boolean;
  bIsDown: boolean;
  xIsDown: boolean;
  yIsDown: boolean;

  private _leftButton: HTMLElement | null;
  private _rightButton: HTMLElement | null;
  private _upButton: HTMLElement | null;
  private _downButton: HTMLElement | null;
  private _aButton: HTMLElement | null;
  private _bButton: HTMLElement | null;
  private _xButton: HTMLElement | null;
  private _yButton: HTMLElement | null;

  constructor() {
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
  }

  update() {
    this.leftIsDown = false;
    this.rightIsDown = false;
    this.upIsDown = false;
    this.downIsDown = false;
  }

  cancel() {
    this.aIsDown = false;
    this.bIsDown = false;
    this.xIsDown = false;
    this.yIsDown = false;
  }
}
