export default class Goal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tile");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
