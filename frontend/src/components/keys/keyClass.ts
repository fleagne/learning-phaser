import { Scene } from "phaser";

export default class KeyClass extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, 64 * x + 32, 64 * y + 32, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
