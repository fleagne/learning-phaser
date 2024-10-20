import PickaxeClass from "./pickaxeClass";

export default class PickaxeSprite extends PickaxeClass {
  public collecting: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "pickaxe");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);

    this.setDisplaySize(64, 64);
  }

  collect() {
    if (this.collecting) return;
    this.collecting = true;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y - 100,
      duration: 500,
      ease: "Power2",
      onComplete: () => this.destroy(),
    });
  }
}
