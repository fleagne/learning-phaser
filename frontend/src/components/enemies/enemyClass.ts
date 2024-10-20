import { Scene } from "phaser";

export default class EnemyClass extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  protected _dead: boolean = false;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, 64 * x + 32, 64 * y + 32, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  get dead() {
    return this._dead;
  }

  set dead(dead: boolean) {
    this._dead = dead;
  }

  protected removeEnemy() {
    this.dead = true;

    this.anims.stop();
    this.body.setVelocityX(0);

    this.scene.tweens.add({
      targets: this,
      delay: 2000,
      duration: 600,
      alpha: 0,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
