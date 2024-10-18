import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(384, 384, "background");

    this.logo = this.add.image(384, 300, "logo");

    this.title = this.add
      .text(384, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // "pointerdown" すなわちクリックされたら、"Game" に移動する
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}