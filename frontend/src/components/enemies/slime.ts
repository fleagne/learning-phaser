import { Constants } from "../constants";
import Player from "../player/player";
import EnemyClass from "./enemyClass";

export default class SlimeSprite extends EnemyClass {
  MOVING_DIRECTION = "right";
  public hp: number = 2;
  public mp: number = 0;
  public maxHp: number = 2;
  public maxMp: number = 0;
  private hpText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "slime");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 衝突サイズの調整
    // 敵キャラのサイズ変更
    this.setDisplaySize(Constants.TILE_SIZE, Constants.TILE_SIZE);

    // 敵キャラのフレームを指定
    this.setFrame(0);

    // 敵キャラの衝突時のバウンス設定
    this.body.setBounce(0);

    // 敵キャラがゲームワールドの外に出ないように衝突させる
    this.body.setCollideWorldBounds(true);

    // HPを表示
    this.hpText = scene.add.text(
      this.x - 32,
      this.y - 32,
      `HP: ${this.hp}/${this.maxHp}`,
      {
        fontSize: "16px",
        color: "#FFFFFF",
      }
    );

    this.anims.create({
      key: "crawl",
      frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 4 }),
      frameRate: 2,
      yoyo: true,
      repeat: -1,
    });
    this.anims.play("crawl");
  }

  action(groundLayer: Phaser.Tilemaps.TilemapLayer) {
    const tile = groundLayer.getTileAtWorldXY(
      this.MOVING_DIRECTION === "right"
        ? this.x + Constants.TILE_SIZE
        : this.x - Constants.TILE_SIZE,
      this.y,
      true
    );
    if (Constants.EXCLUDE_COLLIDE_INDEXES.includes(tile?.index as number)) {
      if (this.MOVING_DIRECTION === "right") {
        this.x += Constants.TILE_SIZE;
        this.hpText.x += Constants.TILE_SIZE;
      } else {
        this.x -= Constants.TILE_SIZE;
        this.hpText.x -= Constants.TILE_SIZE;
      }
    } else {
      this.MOVING_DIRECTION === "right"
        ? (this.MOVING_DIRECTION = "left")
        : (this.MOVING_DIRECTION = "right");
      if (this.MOVING_DIRECTION === "right") {
        this.x += Constants.TILE_SIZE;
        this.hpText.x += Constants.TILE_SIZE;
      } else {
        this.x -= Constants.TILE_SIZE;
        this.hpText.x -= Constants.TILE_SIZE;
      }
    }
  }

  kill() {
    if (this.dead) return;
    this.setFrame(5);
    this.removeEnemy();
    this.removeHpText();
  }

  removeHpText() {
    this.scene.tweens.add({
      targets: this.hpText,
      delay: 2000,
      duration: 600,
      alpha: 0,
      onComplete: () => {
        this.hpText.destroy();
      },
    });
  }

  hit(point: number) {
    this.hp -= point;
    this.hpText.setText(`HP: ${this.hp}/${this.maxHp}`);
    if (this.hp <= 0) {
      this.kill();
    }
  }

  isInAttackRange(player: Player) {
    // 上下左右の隣接する位置にプレイヤーがいるかを確認
    const isLeft =
      player.x === this.x - Constants.TILE_SIZE && player.y === this.y; // プレイヤーが左にいる
    const isRight =
      player.x === this.x + Constants.TILE_SIZE && player.y === this.y; // プレイヤーが右にいる
    const isAbove =
      player.x === this.x && player.y === this.y - Constants.TILE_SIZE; // プレイヤーが上にいる
    const isBelow =
      player.x === this.x && player.y === this.y + Constants.TILE_SIZE; // プレイヤーが下にいる

    // どれか一方向でも一致するなら true を返す
    return isLeft || isRight || isAbove || isBelow;
  }

  attack(player: Player) {
    const originalX = this.x;
    const originalY = this.y;
    let moveX = this.x;
    let moveY = this.y;

    const isLeft =
      player.x === this.x - Constants.TILE_SIZE && player.y === this.y; // プレイヤーが左にいる
    const isRight =
      player.x === this.x + Constants.TILE_SIZE && player.y === this.y; // プレイヤーが右にいる
    const isAbove =
      player.x === this.x && player.y === this.y - Constants.TILE_SIZE; // プレイヤーが上にいる
    const isBelow =
      player.x === this.x && player.y === this.y + Constants.TILE_SIZE; // プレイヤーが下にいる
    if (isLeft) moveX -= 32;
    if (isRight) moveX += 32;
    if (isAbove) moveY -= 32;
    if (isBelow) moveY += 32;

    this.scene.tweens.add({
      targets: this,
      x: moveX,
      y: moveY,
      duration: 100, // 100ミリ秒で前進
      onComplete: () => {
        // プレイヤーに攻撃する
        player.hit(1);

        // 攻撃後、元の位置に戻る
        this.scene.tweens.add({
          targets: this,
          x: originalX,
          y: originalY,
          duration: 100, // 100ミリ秒で元の位置に戻る
        });
      },
    });
  }
}
