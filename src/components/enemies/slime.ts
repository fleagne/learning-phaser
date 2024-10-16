import { Constants } from "../constants";
import EnemyClass from "./enemyClass";
export default class SlimeSprite extends EnemyClass {
  MOVING_DIRECTION = "right";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    groundLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    super(scene, x, y, "slime");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 衝突サイズの調整
    // 敵キャラのサイズ変更
    this.setDisplaySize(64, 64);

    // 敵キャラのフレームを指定
    this.setFrame(0);

    // 敵キャラの衝突時のバウンス設定
    this.body.setBounce(0);

    // 敵キャラがゲームワールドの外に出ないように衝突させる
    this.body.setCollideWorldBounds(true);

    this.anims.create({
      key: "crawl",
      frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 4 }),
      frameRate: 2,
      yoyo: true,
      repeat: -1,
    });
    this.anims.play("crawl");

    scene.time.addEvent({
      delay: 1000,
      callback: () => {
        const tile = groundLayer.getTileAtWorldXY(
          this.MOVING_DIRECTION === "right"
            ? this.x + Constants.TILE_SIZE
            : this.x - Constants.TILE_SIZE,
          this.y,
          true
        );
        if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
          this.MOVING_DIRECTION === "right"
            ? (this.x += Constants.TILE_SIZE)
            : (this.x -= Constants.TILE_SIZE);
        } else {
          this.MOVING_DIRECTION === "right"
            ? (this.MOVING_DIRECTION = "left")
            : (this.MOVING_DIRECTION = "right");
          this.MOVING_DIRECTION === "right"
            ? (this.x += Constants.TILE_SIZE)
            : (this.x -= Constants.TILE_SIZE);
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
}
