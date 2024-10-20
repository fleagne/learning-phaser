import { Scene } from "phaser";
import { Constants } from "../constants";

export default class GoalClass extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(
      scene,
      Constants.TILE_SIZE * x + 32,
      Constants.TILE_SIZE * y + 32,
      texture
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
