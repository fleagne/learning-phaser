import { Scene, GameObjects } from "phaser";
import Controls from "../components/controls/controls";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  keyEnter: Phaser.Input.Keyboard.Key;
  controls?: Controls;
  private buttons: Phaser.GameObjects.Text[] = [];
  private selectedButtonIndex = 0;
  private buttonSelector: Phaser.GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  init() {}

  create() {
    this.background = this.add.image(352, 228, "background");

    this.logo = this.add.image(352, 228, "logo");

    // キーボードによる入力を受け付けられるようにする
    this.cursors = this.input.keyboard?.createCursorKeys();

    // コントローラーによる入力を受け付けられるようにする
    this.controls = new Controls(this);

    const { width, height } = this.scale;

    const newGameButton = this.add
      .text(width * 0.5, height * 0.6, "New Game", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const continueButton = this.add
      .text(
        newGameButton.x,
        newGameButton.y + newGameButton.displayHeight + 10,
        "Continue",
        {
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        }
      )
      .setOrigin(0.5);

    const rankingButton = this.add
      .text(
        continueButton.x,
        continueButton.y + continueButton.displayHeight + 10,
        "Ranking",
        {
          fontFamily: "Arial Black",
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        }
      )
      .setOrigin(0.5);

    this.buttons.push(newGameButton);
    this.buttons.push(continueButton);
    this.buttons.push(rankingButton);
    this.buttonSelector = this.add.text(0, 0, "☚", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });

    this.selectButton(0);

    newGameButton.on("selected", () => {
      this.scene.start("Game");
    });

    continueButton.on("selected", () => {
      this.add.text(0, 0, "実装中です...", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      });
    });

    rankingButton.on("selected", () => {
      this.add.text(0, 0, "実装中です...", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      });
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      newGameButton.off("selected");
    });
  }

  update() {
    if (!this.cursors || !this.controls) return;

    if (this.cursors.up.isDown || this.controls.upIsDown) {
      this.selectNextButton(-1);
    } else if (this.cursors.down.isDown || this.controls.downIsDown) {
      this.selectNextButton(1);
    } else if (this.controls.aIsDown) {
      this.confirmSelection();
    }

    // キーボードの初期化処理
    this.cursors.up.isDown = false;
    this.cursors.down.isDown = false;

    // コントローラーの初期化処理
    this.controls.update();
  }

  selectButton(index: number) {
    const currentButton = this.buttons[this.selectedButtonIndex];
    currentButton.setTint(0xffffff);
    const button = this.buttons[index];
    button.setTint(0x66ff7f);
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
    this.buttonSelector.y = button.y - 20;
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }
    this.selectButton(index);
  }

  confirmSelection() {
    const button = this.buttons[this.selectedButtonIndex];
    button.emit("selected");
  }
}
